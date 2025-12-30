#!/usr/bin/env node

/**
 * Translate Docusaurus UI elements (navbar, footer, sidebars)
 * 
 * This script translates the UI element labels in the i18n JSON files
 * using DeepL or OpenAI API.
 * 
 * Usage:
 *   node scripts/translate-ui.js [options]
 * 
 * Options:
 *   --provider <deepl|openai>  Translation provider (default: deepl)
 *   --locale <de|nl>           Translate specific locale only
 *   --dry-run                  Preview without writing files
 */

const fs = require('fs').promises;
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  provider: 'deepl',
  locale: null,
  dryRun: false,
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--provider' && args[i + 1]) {
    options.provider = args[++i];
  } else if (args[i] === '--locale' && args[i + 1]) {
    options.locale = args[++i];
  } else if (args[i] === '--dry-run') {
    options.dryRun = true;
  }
}

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const localeNames = {
  de: 'German',
  nl: 'Dutch',
};

/**
 * Translate using DeepL
 */
async function translateWithDeepL(text, targetLang) {
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
    }),
  });

  const data = await response.json();
  return data.translations[0].text;
}

/**
 * Translate using OpenAI
 */
async function translateWithOpenAI(text, targetLang) {
  const langName = localeNames[targetLang];
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are translating UI labels for a technical documentation website. Translate to ${langName}. Keep it concise and preserve technical terms.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

/**
 * Translate text
 */
async function translate(text, targetLang) {
  if (options.provider === 'deepl') {
    return await translateWithDeepL(text, targetLang);
  } else {
    return await translateWithOpenAI(text, targetLang);
  }
}

/**
 * Translate JSON file
 */
async function translateJsonFile(filePath, targetLang) {
  const content = await fs.readFile(filePath, 'utf-8');
  const json = JSON.parse(content);

  const translatedJson = {};

  for (const [key, value] of Object.entries(json)) {
    if (typeof value === 'object' && value.message) {
      console.log(`  Translating: "${value.message}"`);
      const translated = await translate(value.message, targetLang);
      console.log(`  → "${translated}"`);
      
      translatedJson[key] = {
        ...value,
        message: translated,
      };

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    } else {
      translatedJson[key] = value;
    }
  }

  return translatedJson;
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 EMS-ESP UI Translation Tool\n');
  console.log(`Provider: ${options.provider.toUpperCase()}`);
  console.log(`Mode: ${options.dryRun ? 'DRY RUN' : 'LIVE'}\n`);

  // Validate API key
  if (options.provider === 'deepl' && !DEEPL_API_KEY) {
    console.error('❌ Error: DEEPL_API_KEY environment variable not set');
    process.exit(1);
  }

  if (options.provider === 'openai' && !OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable not set');
    process.exit(1);
  }

  const locales = options.locale ? [options.locale] : ['de', 'nl'];
  const i18nDir = path.join(__dirname, '..', 'i18n');

  for (const locale of locales) {
    console.log(`\n🌍 Translating to ${localeNames[locale]} (${locale})\n`);

    // Translate navbar
    const navbarPath = path.join(i18nDir, locale, 'docusaurus-theme-classic', 'navbar.json');
    console.log('📝 Navbar translations:');
    const navbarTranslations = await translateJsonFile(navbarPath, locale);
    
    if (!options.dryRun) {
      await fs.writeFile(navbarPath, JSON.stringify(navbarTranslations, null, 2) + '\n', 'utf-8');
      console.log('✅ Saved navbar.json\n');
    }

    // Translate footer
    const footerPath = path.join(i18nDir, locale, 'docusaurus-theme-classic', 'footer.json');
    console.log('📝 Footer translations:');
    const footerTranslations = await translateJsonFile(footerPath, locale);
    
    if (!options.dryRun) {
      await fs.writeFile(footerPath, JSON.stringify(footerTranslations, null, 2) + '\n', 'utf-8');
      console.log('✅ Saved footer.json\n');
    }

    // Translate sidebar
    const sidebarPath = path.join(i18nDir, locale, 'docusaurus-plugin-content-docs', 'current.json');
    console.log('📝 Sidebar translations:');
    const sidebarTranslations = await translateJsonFile(sidebarPath, locale);
    
    if (!options.dryRun) {
      await fs.writeFile(sidebarPath, JSON.stringify(sidebarTranslations, null, 2) + '\n', 'utf-8');
      console.log('✅ Saved current.json\n');
    }
  }

  console.log('\n✨ UI translation complete!');
  
  if (options.dryRun) {
    console.log('💡 This was a dry run. Use without --dry-run to save files.');
  }
}

main().catch(console.error);

