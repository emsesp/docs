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
  
  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      text: text,
      target_lang: langCode,
      source_lang: 'EN',
      preserve_formatting: CONFIG.deepl.preserveFormatting !== false ? '1' : '0',
      formality: CONFIG.deepl.formality || 'default',
      split_sentences: CONFIG.deepl.splitSentences || 'nonewlines',
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

  // Protect HTML comments (<!-- comment -->)
  protectedText = protectedText.replace(/<!--[\s\S]*?-->/g, (match) => {
    const placeholder = `__HTML_COMMENT_${protectedItems.length}__`;
    protectedItems.push({ original: match });
    return placeholder;
  });

  // Protect HTML tags (including self-closing and with attributes)
  // This handles: <tag>, </tag>, <tag attr="value">, <tag attr="value" />
  protectedText = protectedText.replace(/<\/?[a-zA-Z][^>]*\/?>/g, (match) => {
    const placeholder = `__HTML_TAG_${protectedItems.length}__`;
    protectedItems.push({ original: match });
    return placeholder;
  });

  // Protect markdown links - preserve the entire link structure
  protectedText = protectedText.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (match, linkText, url) => {
    const placeholder = `__LINK_${protectedItems.length}__`;
    protectedItems.push({ original: match, linkText, url, isLink: true });
    return placeholder;
  });

  // Protect inline code (backticks)
  protectedText = protectedText.replace(/`[^`]+`/g, (match) => {
    const placeholder = `__CODE_${protectedItems.length}__`;
    protectedItems.push({ original: match });
    return placeholder;
  });

  // Protect custom patterns from config
  CONFIG.preservePatterns.forEach((pattern, patternIndex) => {
    protectedText = protectedText.replace(pattern, (match) => {
      const placeholder = `__PATTERN_${patternIndex}_${protectedItems.length}__`;
      protectedItems.push({ original: match });
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

  // Restore links with translated link text but preserved URLs
  protectedItems.forEach((item, index) => {
    if (item.isLink) {
      const placeholder = `__LINK_${index}__`;
      // The link text might have been partially in the placeholder
      // We need to find if the translated text has any translation around the placeholder
      const regex = new RegExp(`([^\\[]*)?${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
      restoredText = restoredText.replace(regex, (match, before) => {
        // Try to extract translated link text if the AI translated around the placeholder
        if (before && before.trim()) {
          return `[${before.trim()}](${item.url})`;
        }
        // Otherwise use original
        return item.original;
      });
    }
  });

  // Restore all placeholders with original content
  protectedItems.forEach((item, index) => {
    const htmlCommentPlaceholder = `__HTML_COMMENT_${index}__`;
    const htmlTagPlaceholder = `__HTML_TAG_${index}__`;
    const linkPlaceholder = `__LINK_${index}__`;
    const codePlaceholder = `__CODE_${index}__`;
    
    restoredText = restoredText.replace(htmlCommentPlaceholder, item.original);
    restoredText = restoredText.replace(htmlTagPlaceholder, item.original);
    restoredText = restoredText.replace(linkPlaceholder, item.original);
    restoredText = restoredText.replace(codePlaceholder, item.original);
    
    // Restore pattern placeholders
    CONFIG.preservePatterns.forEach((pattern, patternIndex) => {
      const patternPlaceholder = `__PATTERN_${patternIndex}_${index}__`;
      restoredText = restoredText.replace(patternPlaceholder, item.original);
    });
  });

  return restoredText;
}

/**
 * Split content into translatable chunks (avoiding code blocks)
 */
function splitIntoChunks(content) {
  const chunks = [];
  const codeBlockRegex = /```[\s\S]*?```/g;
  let lastIndex = 0;
  let match;

  // Find all code blocks
  const codeBlocks = [];
  while ((match = codeBlockRegex.exec(content)) !== null) {
    codeBlocks.push({
      start: match.index,
      end: match.index + match[0].length,
      content: match[0],
    });
  }

  // Split content around code blocks
  codeBlocks.forEach((block, index) => {
    // Add text before code block
    if (lastIndex < block.start) {
      const text = content.substring(lastIndex, block.start).trim();
      if (text) {
        chunks.push({ type: 'text', content: text });
      }
    }
    // Add code block (don't translate)
    chunks.push({ type: 'code', content: block.content });
    lastIndex = block.end;
  });

  // Add remaining text
  if (lastIndex < content.length) {
    const text = content.substring(lastIndex).trim();
    if (text) {
      chunks.push({ type: 'text', content: text });
    }
  }

  // If no code blocks, return entire content as one chunk
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

  // Split content into chunks
  const chunks = splitIntoChunks(markdownContent);

  // Translate text chunks only
  const translatedChunks = [];
  for (const chunk of chunks) {
    if (chunk.type === 'code') {
      translatedChunks.push(chunk.content);
    } else {
      try {
        // Protect patterns before translation
        const { protectedText, protectedItems } = protectPatterns(chunk.content);
        
        // Translate the protected text
        const translated = await translate(protectedText, targetLang);
        
        // Restore protected patterns
        const restoredTranslation = restorePatterns(translated, protectedItems);
        
        translatedChunks.push(restoredTranslation);
      } catch (error) {
        console.error(`    Error translating chunk: ${error.message}`);
        throw error;
      }
    }
  }

  // Reconstruct the file
  let translatedContent = translatedChunks.join('\n\n');

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
      const targetPath = path.join(CONFIG.sourceDir, locale, file);
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

