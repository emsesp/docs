#!/usr/bin/env node

/**
 * Automated Translation Script for Docusaurus Documentation
 * 
 * Translates English markdown files to German (de) and Dutch (nl)
 * using DeepL API or OpenAI GPT API.
 * 
 * Usage:
 *   node scripts/translate.js [options]
 * 
 * Options:
 *   --provider <deepl|openai>  Translation provider (default: deepl)
 *   --file <path>              Translate a specific file
 *   --locale <de|nl>           Translate to specific locale only
 *   --dry-run                  Preview without writing files
 *   --force                    Overwrite existing translations
 */

const fs = require('fs').promises;
const path = require('path');
const { existsSync } = require('fs');

// Load configuration
const userConfig = require('./translate-config.js');

// Configuration
const CONFIG = {
  sourceDir: path.join(__dirname, '..', userConfig.sourceDir),
  targetLocales: userConfig.targetLocales,
  localeNames: userConfig.localeNames,
  skipFiles: userConfig.skipFiles,
  skipDirectories: userConfig.skipDirectories || [],
  preserveTerms: userConfig.preserveTerms,
  translationInstructions: userConfig.translationInstructions || {},
  preserveMarkdown: userConfig.preserveMarkdown || {},
  preservePatterns: userConfig.preservePatterns || [],
  deepl: userConfig.deepl || {},
  openai: userConfig.openai || {},
  delayBetweenCalls: userConfig.delayBetweenCalls || 500,
  delayBetweenFiles: userConfig.delayBetweenFiles || 1000,
};

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  provider: 'deepl',
  file: null,
  locale: null,
  dryRun: false,
  force: false,
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--provider' && args[i + 1]) {
    options.provider = args[++i];
  } else if (args[i] === '--file' && args[i + 1]) {
    options.file = args[++i];
  } else if (args[i] === '--locale' && args[i + 1]) {
    options.locale = args[++i];
  } else if (args[i] === '--dry-run') {
    options.dryRun = true;
  } else if (args[i] === '--force') {
    options.force = true;
  }
}

// Get API keys from environment
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * DeepL API Translation
 */
async function translateWithDeepL(text, targetLang) {
  if (!DEEPL_API_KEY) {
    throw new Error('DEEPL_API_KEY environment variable is not set');
  }

  const langCode = targetLang === 'de' ? 'DE' : 'NL';
  
  const response = await fetch('https://api.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      text: text,
      target_lang: langCode,
      source_lang: 'EN',
      preserve_formatting: '1',
      formality: CONFIG.deepl.formality || 'default',
      split_sentences: 'nonewlines',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepL API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.translations[0].text;
}

/**
 * OpenAI GPT Translation
 */
async function translateWithOpenAI(text, targetLang) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const langName = CONFIG.localeNames[targetLang];
  
  const additionalInstructions = CONFIG.translationInstructions[targetLang] || '';
  
  const prompt = `You are a technical translator specializing in software documentation. 
Translate the following English text to ${langName}.

IMPORTANT RULES:
1. Preserve ALL markdown formatting (headers, links, code blocks, tables, etc.)
2. Do NOT translate technical terms like: ${CONFIG.preserveTerms.join(', ')}
3. Keep code blocks, URLs, and file paths unchanged
4. Maintain the same tone and technical accuracy
5. Preserve frontmatter (YAML between ---) without translation
6. Keep HTML tags and attributes unchanged
${additionalInstructions}

Text to translate:

${text}

Translated text:`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CONFIG.openai.model || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional technical translator. Preserve all markdown formatting and technical terms.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: CONFIG.openai.temperature || 0.3,
      max_tokens: CONFIG.openai.maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

/**
 * Translate text using selected provider
 */
async function translate(text, targetLang) {
  if (options.provider === 'deepl') {
    return await translateWithDeepL(text, targetLang);
  } else if (options.provider === 'openai') {
    return await translateWithOpenAI(text, targetLang);
  } else {
    throw new Error(`Unknown provider: ${options.provider}`);
  }
}

/**
 * Parse markdown to separate frontmatter and content
 */
function parseMarkdown(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (match) {
    return {
      frontmatter: match[1],
      content: match[2],
    };
  }

  return {
    frontmatter: null,
    content: content,
  };
}

/**
 * Protect patterns from translation by replacing with placeholders
 */
function protectPatterns(text) {
  const protectedItems = [];
  let protectedText = text;

  // Protect inline code (backticks) FIRST - this is critical to preserve code
  // Use XML-like tags that translation APIs preserve
  protectedText = protectedText.replace(/`[^`]+`/g, (match) => {
    const placeholder = `<XCODE${protectedItems.length}X>`;
    protectedItems.push({ original: match, type: 'code' });
    return placeholder;
  });

  // Protect markdown images ![alt](url)
  protectedText = protectedText.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, (match) => {
    const placeholder = `<XIMAGE${protectedItems.length}X>`;
    protectedItems.push({ original: match, type: 'image' });
    return placeholder;
  });

  // Protect Docusaurus admonitions - opening tags only (not the title)
  // Example: ":::warning Important Disclaimer" -> "<XADMO0X> Important Disclaimer"
  // After translation: "<XADMO0X> Wichtiger Haftungsausschluss" 
  // After restoration: ":::warning Wichtiger Haftungsausschluss" ✓
  // This allows titles to be translated while keeping the syntax intact
  protectedText = protectedText.replace(/^:::(note|warning|tip|info|caution|danger)(?=\s|$)/gmi, (match) => {
    const placeholder = `<XADMO${protectedItems.length}X>`;
    protectedItems.push({ original: match, type: 'admonition_open' });
    return placeholder;
  });

  // Protect Docusaurus admonitions - closing tags (standalone ::: on a line)
  protectedText = protectedText.replace(/^:::$/gm, (match) => {
    const placeholder = `<XADMC${protectedItems.length}X>`;
    protectedItems.push({ original: match, type: 'admonition_close' });
    return placeholder;
  });

  // Protect HTML comments (<!-- comment -->)
  protectedText = protectedText.replace(/<!--[\s\S]*?-->/g, (match) => {
    const placeholder = `<XCOMMENT${protectedItems.length}X>`;
    protectedItems.push({ original: match, type: 'comment' });
    return placeholder;
  });

  // Protect HTML tags (including self-closing and with attributes)
  // This handles: <tag>, </tag>, <tag attr="value">, <tag attr="value" />
  protectedText = protectedText.replace(/<\/?[a-zA-Z][^>]*\/?>/g, (match) => {
    const placeholder = `<XHTML${protectedItems.length}X>`;
    protectedItems.push({ original: match, type: 'html' });
    return placeholder;
  });

  // Protect markdown links - preserve the entire link structure  
  protectedText = protectedText.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (match, linkText, url) => {
    const placeholder = `<XLINK${protectedItems.length}X>`;
    protectedItems.push({ original: match, linkText, url, type: 'link' });
    return placeholder;
  });

  // Protect markdown emphasis with underscores - preserve _(text)_ patterns
  // This prevents translation APIs from converting underscores to curly brackets
  protectedText = protectedText.replace(/_\s*\(([^)]+)\)\s*_/g, (match, text) => {
    const placeholder = `<XEMPH${protectedItems.length}X>`;
    protectedItems.push({ original: match, text, type: 'emphasis' });
    return placeholder;
  });

  // Protect custom patterns from config
  CONFIG.preservePatterns.forEach((pattern, patternIndex) => {
    protectedText = protectedText.replace(pattern, (match) => {
      const placeholder = `<XPATTERN${patternIndex}N${protectedItems.length}X>`;
      protectedItems.push({ original: match, type: 'pattern', patternIndex });
      return placeholder;
    });
  });

  return { protectedText, protectedItems };
}

/**
 * Restore protected patterns after translation
 */
function restorePatterns(translatedText, protectedItems) {
  let restoredText = translatedText;

  // Restore all placeholders - using XML-like tags
  // Go in reverse order to avoid conflicts with indices
  for (let index = protectedItems.length - 1; index >= 0; index--) {
    const item = protectedItems[index];
    const escapePlaceholder = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create placeholders based on type
    let placeholder;
    if (item.type === 'code') {
      placeholder = `<XCODE${index}X>`;
    } else if (item.type === 'image') {
      placeholder = `<XIMAGE${index}X>`;
    } else if (item.type === 'admonition_open') {
      placeholder = `<XADMO${index}X>`;
    } else if (item.type === 'admonition_close') {
      placeholder = `<XADMC${index}X>`;
    } else if (item.type === 'comment') {
      placeholder = `<XCOMMENT${index}X>`;
    } else if (item.type === 'html') {
      placeholder = `<XHTML${index}X>`;
    } else if (item.type === 'link') {
      placeholder = `<XLINK${index}X>`;
    } else if (item.type === 'emphasis') {
      placeholder = `<XEMPH${index}X>`;
    } else if (item.type === 'pattern' && item.patternIndex !== undefined) {
      placeholder = `<XPATTERN${item.patternIndex}N${index}X>`;
    }
    
    if (placeholder) {
      // Try multiple restoration strategies to handle translation API modifications
      
      // 1. Exact match (case-insensitive)
      const regexExact = new RegExp(escapePlaceholder(placeholder), 'gi');
      restoredText = restoredText.replace(regexExact, item.original);
      
      // 2. Match with possible whitespace around placeholder
      const regexWithSpaces = new RegExp(`\\s*${escapePlaceholder(placeholder)}\\s*`, 'gi');
      if (restoredText.includes(`<X`)) {
        restoredText = restoredText.replace(regexWithSpaces, item.original);
      }
      
      // 3. Handle cases where translation API added spaces within placeholder
      // e.g., "< XADMO0X >" or "<XADMO 0X>"
      const placeholderWithSpaces = placeholder.replace(/([A-Z]+)(\d+)([A-Z])/g, '< ?$1 ?$2 ?$3');
      const regexFlexible = new RegExp(placeholderWithSpaces, 'gi');
      restoredText = restoredText.replace(regexFlexible, item.original);
    }
  }
  
  // Final safety check: if any placeholders remain, log a warning
  const remainingPlaceholders = restoredText.match(/<X[A-Z]+\d+X>/gi);
  if (remainingPlaceholders) {
    console.warn(`  ⚠️  Warning: Some placeholders were not restored: ${remainingPlaceholders.join(', ')}`);
    console.warn(`  This may cause formatting issues. Please review the output.`);
  }

  // Fix any curly brackets that were incorrectly used instead of underscores
  // This handles cases where translation APIs converted _(text)_ to {(text)}
  restoredText = restoredText.replace(/\{\s*\(([^)]+)\)\s*\}/g, '_($1)_');

  return restoredText;
}

/**
 * Generate Docusaurus anchor ID from a heading text
 * Docusaurus uses github-slugger which:
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Preserves umlauts (ü, ö, ä, ß) - does NOT convert them
 * - Removes special characters but keeps Unicode letters
 * 
 * Note: Docusaurus preserves umlauts in anchor IDs, so we must match that behavior
 */
function generateAnchorId(text) {
  return text
    .toLowerCase()
    // Docusaurus preserves umlauts, so we don't convert them
    // Only remove characters that aren't word characters, spaces, or hyphens
    // This preserves ü, ö, ä, ß and other Unicode letters
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Remove special chars but keep Unicode letters/numbers
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Extract all headings from markdown content
 * Returns an array of { level, text, anchorId }
 */
function extractHeadings(content) {
  const headings = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const anchorId = generateAnchorId(text);
    headings.push({ level, text, anchorId });
  }

  return headings;
}

/**
 * Build a mapping of source anchor IDs to translated anchor IDs
 * by matching headings by their position and level
 */
function buildAnchorMapping(sourceHeadings, translatedHeadings) {
  const mapping = new Map();

  // Match headings by position and level (assuming same structure)
  const minLength = Math.min(sourceHeadings.length, translatedHeadings.length);
  
  for (let i = 0; i < minLength; i++) {
    const source = sourceHeadings[i];
    const translated = translatedHeadings[i];
    
    // Only map if levels match (same heading hierarchy)
    if (source.level === translated.level) {
      mapping.set(source.anchorId, translated.anchorId);
    }
  }

  // Also try to match by text similarity for headings that might be out of order
  // This is a fallback for cases where structure might differ slightly
  for (const source of sourceHeadings) {
    if (!mapping.has(source.anchorId)) {
      // Try to find a translated heading with similar text
      const similar = translatedHeadings.find(t => 
        t.level === source.level && 
        t.text.toLowerCase().includes(source.text.toLowerCase().substring(0, 10)) ||
        source.text.toLowerCase().includes(t.text.toLowerCase().substring(0, 10))
      );
      if (similar) {
        mapping.set(source.anchorId, similar.anchorId);
      }
    }
  }

  return mapping;
}

/**
 * Detect external links (should never be anchor-rewritten)
 */
function isExternalLinkTarget(target) {
  if (!target) return false;
  const t = target.trim().toLowerCase();
  return (
    t.startsWith('http://') ||
    t.startsWith('https://') ||
    t.startsWith('mailto:') ||
    t.startsWith('tel:') ||
    t.startsWith('ftp://')
  );
}

/**
 * Get anchor mapping for a referenced page
 * This is used for cross-page anchor links
 */
async function getPageAnchorMapping(pageRef, sourceDir, targetLang, rootDir) {
  // External links should never be processed as doc refs
  if (isExternalLinkTarget(pageRef)) {
    return new Map();
  }

  // Try to find the referenced page in the source directory
  // Page references in Docusaurus can be:
  // - Just the document ID (e.g., "Console", "tips-and-tricks")
  // - Filename without extension (e.g., "Console.md" -> "Console")
  // - Relative path (e.g., "docs/Console")
  
  // Normalize page reference (remove .md extension, handle relative paths)
  let normalizedRef = pageRef.replace(/\.md$/, '').trim();
  
  // Ensure sourceDir is absolute
  const absSourceDir = path.isAbsolute(sourceDir) ? sourceDir : path.resolve(sourceDir);
  
  // Try different path combinations
  const possiblePaths = [
    path.join(absSourceDir, `${normalizedRef}.md`),
    path.join(absSourceDir, normalizedRef, 'index.md'),
    path.join(absSourceDir, normalizedRef),
  ];

  for (const sourcePath of possiblePaths) {
    try {
      if (existsSync(sourcePath)) {
        const stat = await fs.stat(sourcePath);
        if (stat.isFile()) {
          const content = await fs.readFile(sourcePath, 'utf-8');
          const { content: markdownContent } = parseMarkdown(content);
          const sourceHeadings = extractHeadings(markdownContent);
          
          if (sourceHeadings.length === 0) {
            continue; // No headings found, try next path
          }
          
          // Now get the translated version
          const fileName = path.basename(sourcePath);
          
          // Build target path: rootDir/i18n/targetLang/docusaurus-plugin-content-docs/current/filename
          // Ensure rootDir is absolute
          const absRootDir = rootDir ? (path.isAbsolute(rootDir) ? rootDir : path.resolve(rootDir)) : path.dirname(absSourceDir);
          const targetPath = path.join(
            absRootDir,
            'i18n',
            targetLang,
            'docusaurus-plugin-content-docs',
            'current',
            fileName
          );
          
          if (existsSync(targetPath)) {
            const translatedContent = await fs.readFile(targetPath, 'utf-8');
            const { content: translatedMarkdown } = parseMarkdown(translatedContent);
            const translatedHeadings = extractHeadings(translatedMarkdown);
            
            if (translatedHeadings.length > 0) {
              const mapping = buildAnchorMapping(sourceHeadings, translatedHeadings);
              if (mapping.size > 0) {
                console.log(`    🔗 Found cross-page anchor mapping for ${normalizedRef}: ${mapping.size} anchors`);
                return mapping;
              }
            }
          } else {
            console.log(`    ⚠️  Translated file not found: ${targetPath}`);
          }
        }
      }
    } catch (error) {
      // Continue to next possibility
      continue;
    }
  }
  
  // No mapping found - the referenced page might not be translated yet
  console.log(`    ⚠️  No anchor mapping found for page: ${normalizedRef}`);
  return new Map();
}

/**
 * Replace anchor links in translated content
 * Handles both same-page anchors (#anchor) and cross-page anchors (Page#anchor)
 */
async function replaceAnchorLinks(content, anchorMapping, sourceFileName, sourceDir, targetLang, rootDir) {
  let updatedContent = content;

  // Pattern 1: Same-page anchors like [text](#anchor) or [text](#anchor-id)
  // Pattern 2: Cross-page anchors like [text](Page#anchor) or [text](Page.md#anchor)
  const anchorLinkRegex = /\[([^\]]+)\]\(([^#)]+)?#([^)]+)\)/g;

  // Collect all matches first to avoid issues with async operations in replace
  const matches = [];
  let match;
  while ((match = anchorLinkRegex.exec(content)) !== null) {
    matches.push({
      fullMatch: match[0],
      linkText: match[1],
      pageRef: match[2] || '',
      anchorId: match[3],
      index: match.index,
    });
  }

  // Process matches in reverse order to maintain indices
  for (let i = matches.length - 1; i >= 0; i--) {
    const { fullMatch, linkText, pageRef, anchorId } = matches[i];
    let newAnchorId = null;

    if (!pageRef || pageRef.trim() === '') {
      // Same-page anchor - use current page mapping
      if (anchorMapping.has(anchorId)) {
        newAnchorId = anchorMapping.get(anchorId);
      }
    } else {
      // Never rewrite anchors for external URLs like https://example.com/page#section
      if (isExternalLinkTarget(pageRef)) {
        continue;
      }

      // Cross-page anchor - get mapping from referenced page
      const cleanPageRef = pageRef.replace(/\.md$/, '').trim();
      const pageMapping = await getPageAnchorMapping(cleanPageRef, sourceDir, targetLang, rootDir);
      
      if (pageMapping.has(anchorId)) {
        newAnchorId = pageMapping.get(anchorId);
      } else {
        // Log for debugging
        console.log(`    ⚠️  Cross-page anchor not found: ${cleanPageRef}#${anchorId}`);
      }
    }

    if (newAnchorId && newAnchorId !== anchorId) {
      const replacement = pageRef 
        ? `[${linkText}](${pageRef.replace(/\.md$/, '')}#${newAnchorId})`
        : `[${linkText}](#${newAnchorId})`;
      
      // Replace from the end to maintain correct indices
      const beforeMatch = updatedContent.substring(0, matches[i].index);
      const afterMatch = updatedContent.substring(matches[i].index + fullMatch.length);
      updatedContent = beforeMatch + replacement + afterMatch;
    }
  }

  return updatedContent;
}

/**
 * Split content into translatable chunks (line-by-line for lists, paragraph for prose)
 * Each list item, blank line, or paragraph creates a chunk, code blocks are kept separate
 */
function splitIntoChunks(content) {
  const lines = content.split('\n');
  const chunks = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let currentParagraph = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Check for code block delimiters
    if (trimmedLine.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        codeBlockContent.push(line);
        chunks.push({ type: 'code', content: codeBlockContent.join('\n') });
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        // Start of code block - flush any accumulated paragraph first
        if (currentParagraph.length > 0) {
          chunks.push({ type: 'text', content: currentParagraph.join('\n') });
          currentParagraph = [];
        }
        codeBlockContent.push(line);
        inCodeBlock = true;
        inList = false;
      }
    } else if (inCodeBlock) {
      // Inside code block
      codeBlockContent.push(line);
    } else if (trimmedLine === ':::') {
      // Standalone closing ::: - flush paragraph and add as separate line
      if (currentParagraph.length > 0) {
        chunks.push({ type: 'text', content: currentParagraph.join('\n') });
        currentParagraph = [];
      }
      chunks.push({ type: 'text', content: line });
      inList = false;
    } else if (trimmedLine === '') {
      // Empty line - marks end of paragraph or list
      if (currentParagraph.length > 0) {
        chunks.push({ type: 'text', content: currentParagraph.join('\n') });
        currentParagraph = [];
      }
      // Add empty line as separate chunk to preserve spacing
      chunks.push({ type: 'empty', content: '' });
      inList = false;
    } else if (trimmedLine.startsWith('- ') || trimmedLine.match(/^\d+\. /) || trimmedLine.startsWith('| ')) {
      // List item or table row - treat each one as a separate chunk
      if (currentParagraph.length > 0) {
        chunks.push({ type: 'text', content: currentParagraph.join('\n') });
        currentParagraph = [];
      }
      chunks.push({ type: 'text', content: line });
      inList = trimmedLine.startsWith('| ') ? false : true;
    } else if (inList && (line.startsWith('  ') || line.startsWith('\t'))) {
      // Continuation of list item (indented)
      // Append to the last chunk if it's text
      if (chunks.length > 0 && chunks[chunks.length - 1].type === 'text') {
        chunks[chunks.length - 1].content += '\n' + line;
      } else {
        currentParagraph.push(line);
      }
    } else {
      // Regular paragraph line
      currentParagraph.push(line);
      inList = false;
    }
  }

  // Flush any remaining content
  if (currentParagraph.length > 0) {
    chunks.push({ type: 'text', content: currentParagraph.join('\n') });
  }
  if (codeBlockContent.length > 0) {
    chunks.push({ type: 'code', content: codeBlockContent.join('\n') });
  }

  // If no chunks, return entire content as one chunk
  if (chunks.length === 0) {
    chunks.push({ type: 'text', content: content });
  }

  return chunks;
}

/**
 * Translate a markdown file
 */
async function translateFile(filePath, targetLang) {
  const content = await fs.readFile(filePath, 'utf-8');
  const { frontmatter, content: markdownContent } = parseMarkdown(content);

  console.log(`  Translating to ${CONFIG.localeNames[targetLang]}...`);

  // Extract headings from source content for anchor mapping
  const sourceHeadings = extractHeadings(markdownContent);

  // Split content into chunks
  const chunks = splitIntoChunks(markdownContent);

  // Translate text chunks only
  const translatedChunks = [];
  for (const chunk of chunks) {
    if (chunk.type === 'code') {
      // Keep code blocks as-is
      translatedChunks.push(chunk.content);
    } else if (chunk.type === 'empty') {
      // Keep empty lines as-is to preserve spacing
      translatedChunks.push('');
    } else if (chunk.type === 'text') {
      try {
        // Protect patterns before translation
        const { protectedText, protectedItems } = protectPatterns(chunk.content);
        
        // Translate the protected text
        const translated = await translate(protectedText, targetLang);
        
        // Restore protected patterns
        const restoredTranslation = restorePatterns(translated, protectedItems);
        
        translatedChunks.push(restoredTranslation);
        
        // Small delay between translations to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`    Error translating chunk: ${error.message}`);
        throw error;
      }
    }
  }

  // Reconstruct the file - join chunks with newline
  let translatedContent = translatedChunks.join('\n');

  // Extract headings from translated content
  const translatedHeadings = extractHeadings(translatedContent);

  // Build anchor mapping
  const anchorMapping = buildAnchorMapping(sourceHeadings, translatedHeadings);

  if (anchorMapping.size > 0 || sourceHeadings.length > 0) {
    console.log(`  🔗 Found ${anchorMapping.size} same-page anchor mappings`);
    
    // Get source directory and root directory for cross-page anchor resolution
    const sourceDir = path.dirname(filePath);
    // CONFIG.sourceDir is already resolved to absolute path (docs/)
    // Project root is parent of CONFIG.sourceDir
    const projectRoot = path.dirname(CONFIG.sourceDir);
    
    // Replace anchor links in translated content
    const beforeReplace = translatedContent;
    translatedContent = await replaceAnchorLinks(
      translatedContent, 
      anchorMapping, 
      path.basename(filePath, '.md'),
      sourceDir,
      targetLang,
      projectRoot
    );
    
    // Log if any changes were made
    if (beforeReplace !== translatedContent) {
      console.log(`  ✅ Updated anchor links in translated content`);
    }
  }

  // Add frontmatter back if it existed
  if (frontmatter) {
    translatedContent = `---\n${frontmatter}\n---\n\n${translatedContent}`;
  }

  return translatedContent;
}

/**
 * Get all markdown files to translate
 */
async function getMarkdownFiles(dir, baseDir = dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    // Skip locale directories
    if (entry.isDirectory() && ['de', 'nl', 'en'].includes(entry.name)) {
      continue;
    }

    // Skip configured directories
    if (entry.isDirectory() && CONFIG.skipDirectories.includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...(await getMarkdownFiles(fullPath, baseDir)));
    } else if (entry.name.endsWith('.md')) {
      // Skip files in skip list
      if (!CONFIG.skipFiles.includes(relativePath)) {
        files.push(relativePath);
      }
    }
  }

  return files;
}

/**
 * Main translation function
 */
async function main() {
  console.log('🌍 EMS-ESP Documentation Translation Tool\n');
  console.log(`Provider: ${options.provider.toUpperCase()}`);
  console.log(`Mode: ${options.dryRun ? 'DRY RUN' : 'LIVE'}\n`);

  // Validate API key
  if (options.provider === 'deepl' && !DEEPL_API_KEY) {
    console.error('❌ Error: DEEPL_API_KEY environment variable not set');
    console.error('Get your free API key at: https://www.deepl.com/pro-api');
    process.exit(1);
  }

  if (options.provider === 'openai' && !OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable not set');
    console.error('Get your API key at: https://platform.openai.com/api-keys');
    process.exit(1);
  }

  // Get files to translate
  let files = [];
  if (options.file) {
    // Translate specific file
    files = [options.file];
  } else {
    // Get all markdown files
    files = await getMarkdownFiles(CONFIG.sourceDir);
    console.log(`Found ${files.length} markdown files to translate\n`);
  }

  // Filter locales if specified
  const targetLocales = options.locale 
    ? [options.locale]
    : CONFIG.targetLocales;

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  // Translate each file
  for (const file of files) {
    console.log(`📄 ${file}`);
    const sourcePath = path.join(CONFIG.sourceDir, file);

    for (const locale of targetLocales) {
      // Put translated files in the correct Docusaurus i18n folder structure
      const targetPath = path.join(__dirname, '..', 'i18n', locale, 'docusaurus-plugin-content-docs', 'current', file);
      const targetDir = path.dirname(targetPath);

      // Check if translation already exists
      if (existsSync(targetPath) && !options.force) {
        console.log(`  ⏭️  ${locale}: Already exists (use --force to overwrite)`);
        skipCount++;
        continue;
      }

      try {
        // Translate the file
        const translatedContent = await translateFile(sourcePath, locale);

        if (!options.dryRun) {
          // Create directory if it doesn't exist
          await fs.mkdir(targetDir, { recursive: true });

          // Write translated file
          await fs.writeFile(targetPath, translatedContent, 'utf-8');
          console.log(`  ✅ ${locale}: Translation saved`);
        } else {
          console.log(`  ✅ ${locale}: Translation ready (dry run)`);
        }

        successCount++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenCalls));

      } catch (error) {
        console.error(`  ❌ ${locale}: Error - ${error.message}`);
        errorCount++;
      }
    }

    console.log('');
  }

  // Summary
  console.log('📊 Translation Summary');
  console.log('─────────────────────');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`⏭️  Skipped: ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}`);

  if (options.dryRun) {
    console.log('\n💡 This was a dry run. Use without --dry-run to save files.');
  }
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

