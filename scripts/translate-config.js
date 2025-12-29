/**
 * Translation Configuration
 * 
 * Customize this file to control what gets translated and what doesn't.
 */

module.exports = {
  // Source and target configuration
  sourceDir: 'docs',
  targetLocales: ['de', 'nl'],
  
  localeNames: {
    de: 'German',
    nl: 'Dutch',
  },

  // ======================================
  // FILES TO SKIP
  // ======================================
  // Files that should NOT be translated at all
  skipFiles: [
    // Data files
    'data/dump_entities.csv',
    'data/dump_telegrams.csv',
    
    // Technical/config files
    'CNAME',
    'robots.txt',
    
    // Add more files here as needed
    'Modbus-Entity-Registers.md',
    'ems-library.md'
  ],

  // Skip entire directories
  skipDirectories: [
    '_media',
    'data',
  ],

  // ======================================
  // TECHNICAL TERMS TO PRESERVE
  // ======================================
  // These terms will NOT be translated by the AI
  // They will be passed through as-is
  preserveTerms: [
    // Project names
    'EMS-ESP',
    'EMS-ESP32',
    
    // Protocols and technologies
    'MQTT',
    'Modbus',
    'WebUI',
    'GPIO',
    'I2C',
    'SPI',
    'UART',
    'WiFi',
    'ESP32',
    'ESP32-S3',
    
    // Integration platforms
    'Home Assistant',
    'ioBroker',
    'Domoticz',
    'openHAB',
    'Loxone',
    'Grafana',
    'Prometheus',
    
    // Brand names (heating equipment)
    'Bosch',
    'Buderus',
    'Nefit',
    'Worcester',
    'Junkers',
    'Sieger',
    
    // EMS-specific terms
    'EMS bus',
    'EMS Gateway',
    'Logamatic',
    
    // Technical terms
    'JSON',
    'API',
    'REST API',
    'HTTP',
    'HTTPS',
    'SSL',
    'TLS',
    'URL',
    'IP',
    'MAC',
    'DHCP',
    'DNS',

    // documentation terms
    ':::note',
    ':::warning',
    ':::info',
    ':::danger',
    ':::success',
    ':::error',
    ':::tip',
    ':::caution',
    ':::important',
    
    // Add your own terms here
  ],

  // ======================================
  // TRANSLATION HINTS
  // ======================================
  // Additional instructions for the AI translator
  // These are used with OpenAI provider only
  translationInstructions: {
    de: `
      - Keep all product names and brand names in English
      - Preserve technical abbreviations (MQTT, GPIO, etc.)
      - Use "du" form (informal) for user-facing instructions
      - Technical documentation should be precise and formal
    `,
    nl: `
      - Keep all product names and brand names in English
      - Preserve technical abbreviations (MQTT, GPIO, etc.)
      - Use "je" form (informal) for user-facing instructions
      - Technical documentation should be clear and accessible
    `,
  },

  // ======================================
  // CONTENT PRESERVATION RULES
  // ======================================
  
  // The following are AUTOMATICALLY protected by the script
  // You don't need to configure these - they just work!
  preserveMarkdown: {
    codeBlocks: true,          // ```code blocks``` stay as-is ✅
    inlineCode: true,           // `inline code` stays as-is ✅
    urls: true,                 // [text](url) - url stays as-is (link text CAN be translated) ✅
    fileNames: true,            // File names like Configuring.md stay as-is ✅
    frontmatter: true,          // YAML frontmatter stays as-is ✅
    htmlTags: true,             // <tag>, <div class="x">, <img src="..." /> stay as-is ✅
    htmlComments: true,         // <!-- comment --> stays as-is ✅
  },
  
  // Examples of what gets protected:
  // - <div class="highlight">text</div>  → tag stays, "text" gets translated
  // - <img src="photo.jpg" alt="text" /> → entire tag preserved
  // - <!-- TODO: translate -->           → entire comment preserved
  // - [Guide](Configuring.md)            → Configuring.md preserved, "Guide" translated
  // - docs/About.md                      → entire path preserved
  // - src/components/                    → folder name preserved
  // - /usr/local/bin/emsesp               → entire path preserved

  // ======================================
  // AUTOMATIC PATTERN PRESERVATION
  // ======================================
  // Regular expressions for patterns to preserve
  // These will NOT be translated
  // 
  // Example: [See the guide](Configuring.md)
  //   German: [Siehe die Anleitung](Configuring.md)  ✅ File name preserved!
  //   NOT:    [Siehe die Anleitung](Konfiguration.md) ❌ Wrong!
  //
  // Note: Links and inline code are handled separately
  preservePatterns: [
    // Markdown file names - NEVER TRANSLATE THESE
    // Matches: Configuring.md, About.md, Heat-Pumps.md, FAQ.md, etc.
    /[A-Z][a-zA-Z0-9\-_]*\.md\b/g,
    
    // Folder names with trailing slash - NEVER TRANSLATE
    // Matches: docs/, src/, components/, i18n/, node_modules/, etc.
    /[a-zA-Z][a-zA-Z0-9\-_]*\//g,
    
    // File paths (Unix/Linux/Mac) - NEVER TRANSLATE
    /\/[a-zA-Z0-9\/_\-\.]+/g,      // Absolute paths: /path/to/file, /usr/local/bin
    /\.\.[\/][a-zA-Z0-9\/_\-\.]+/g, // Relative parent: ../path/to/file, ../backup/
    /\.[\/][a-zA-Z0-9\/_\-\.]+/g,   // Relative current: ./path/to/file, ./scripts/
    
    // File paths (Windows) - NEVER TRANSLATE
    /[A-Z]:\\[^\s]+/g,             // Windows paths: C:\path\to\file, C:\Program Files\
    
    // Path-like structures - NEVER TRANSLATE
    // Matches: docs/About.md, src/components/Button.tsx, i18n/de/code.json
    /[a-z][a-z0-9\-_]*\/[a-zA-Z0-9\-_\/\.]+/g,
    
    // Version numbers
    /v?\d+\.\d+\.\d+/g,            // e.g., v3.6.5, 1.0.0
    
    // Hex values
    /0x[0-9A-Fa-f]+/g,             // e.g., 0xFF, 0x10
    
    // IP addresses
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
    
    // URLs (not in markdown links, those are handled separately)
    /(?<!\]\()https?:\/\/[^\s\)]+/g,
    
    // Add your custom patterns here
    // Example: /RC\d+/g,           // RC300, RC310, etc.
  ],

  // ======================================
  // TRANSLATION QUALITY SETTINGS
  // ======================================
  
  // DeepL specific settings
  deepl: {
    formality: 'default',         // 'default', 'more', or 'less'
    preserveFormatting: true,
    splitSentences: 'nonewlines', // 'on', 'off', 'nonewlines'
  },

  // ======================================
  // RATE LIMITING
  // ======================================
  
  // Delay between API calls (milliseconds)
  delayBetweenCalls: 500,         // 500ms = 0.5 seconds
  
  // Delay between files (milliseconds)
  delayBetweenFiles: 1000,        // 1 second
};

