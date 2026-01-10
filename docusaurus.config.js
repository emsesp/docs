// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github
const darkCodeTheme = require('prism-react-renderer').themes.dracula

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'EMS-ESP',
  tagline:
    'Open-source firmware for ESP32 to communicate with EMS heating appliances',
  favicon: 'img/favicon.ico',
  url: 'https://emsesp.org',
  baseUrl: '/',
  onBrokenLinks: 'warn',

  // GitHub pages deployment config.
  organizationName: 'emsesp',
  projectName: 'docs',

  // SEO headTags for meta tags
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content:
          'EMS-ESP is an open-source firmware for ESP32 to communicate with EMS (Energy Management System) heating appliances from Bosch, Buderus, Nefit, Junkers, and Worcester.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content:
          'EMS-ESP, ESP32, EMS bus, Bosch, Buderus, Nefit, Junkers, Worcester, heating control, home automation, MQTT, Home Assistant, IoT, thermostat, boiler',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'author',
        content: 'EMS-ESP Team',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'robots',
        content: 'index, follow',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'EMS-ESP Documentation',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:site',
        content: '@emsesp',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'canonical',
        href: 'https://emsesp.org',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'google-site-verification',
        content: 'l1IJyN1vRvB3giymp3ftu6JjyYFxP-A92WZE7BeBr5Y',
      },
    },
  ],

  // Enable faster builds and v4 future flags
  future: {
    experimental_faster: true,
    v4: true,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'nl'],
    localeConfigs: {
      en: {
        label: 'EN',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
      },
      de: {
        label: 'DE',
        direction: 'ltr',
        htmlLang: 'de-DE',
        calendar: 'gregory',
      },
      nl: {
        label: 'NL',
        direction: 'ltr',
        htmlLang: 'nl-NL',
        calendar: 'gregory',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          // SEO: Add edit URLs for better credibility
          editUrl: ({locale, docPath}) => {
            if (locale === 'en') {
              return `https://github.com/emsesp/docs/edit/main/docs/${docPath}`;
            }
            return `https://github.com/emsesp/docs/edit/main/i18n/${locale}/docusaurus-plugin-content-docs/current/${docPath}`;
          },
          // SEO: Breadcrumbs for better navigation
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/boiler.svg',
      algolia: {
        // The application ID provided by Algolia
        appId: '2T19VXVM2E',

        // Public API key: it is safe to commit it
        apiKey: '1beedae258b6f86b6d0905e319cb41ab',

        indexName: 'ems-esp doc',

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',

        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        // replaceSearchResultPathname: {
        //   from: '/docs/', // or as RegExp: /\/docs\//
        //   to: '/',
        // },

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
        insights: false,

        //... other Algolia params
      },
      navbar: {
        title: 'EMS-ESP',
        logo: {
          alt: 'EMS-ESP Logo',
          src: 'img/boiler.svg',
          srcDark: 'img/boiler.svg',
        },
        hideOnScroll: false,
        items: [
          {
            type: 'dropdown',
            label: 'Docs',
            position: 'left',
            items: [
              {
                label: 'Getting Started',
                to: 'Getting-Started',
              },
              {
                label: 'Installing',
                to: 'Installing',
              },
              {
                label: 'Configuring',
                to: 'Configuring',
              },
              {
                label: 'WebUI',
                to: 'WebUI',
              },
              {
                label: 'MQTT',
                to: 'MQTT',
              },
              {
                label: 'Commands',
                to: 'Commands',
              },
              {
                label: 'Console',
                to: 'Console',
              },
              {
                label: 'Special Functions',
                to: 'Special-Functions',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Devices',
            position: 'left',
            items: [
              {
                label: 'All Devices and Entities',
                to: 'All-Entities',
              },
              {
                label: 'Boilers',
                to: 'Boilers',
              },
              {
                label: 'Thermostats',
                to: 'Thermostats',
              },
              {
                label: 'Controller Modules',
                to: 'Controllers',
              },
              {
                label: 'Heat Pumps',
                to: 'Heat-Pumps',
              },
              {
                label: 'Alert Modules',
                to: 'Alert',
              },
              {
                label: 'Connect Modules',
                to: 'Connect',
              },
              {
                label: 'Extension Modules',
                to: 'Extension',
              },
              {
                label: 'Gateway Modules',
                to: 'Gateways',
              },
              {
                label: 'Mixer Modules',
                to: 'Mixer-Modules',
              },
              {
                label: 'Solar Modules',
                to: 'Solar-Modules',
              },
              {
                label: 'Switch Modules',
                to: 'Switches',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Integrations',
            position: 'left',
            items: [
              {
                label: 'Home Assistant',
                to: 'Home-Assistant',
              },
              {
                label: 'IOBroker',
                to: 'IOBroker',
              },
              {
                label: 'Domoticz',
                to: 'Domoticz',
              },
              {
                label: 'openHAB',
                to: 'openHAB',
              },
              {
                label: 'Loxone',
                to: 'Loxone',
              },
              {
                label: 'Grafana',
                to: 'Grafana',
              },
              {
                label: 'Prometheus',
                to: 'Prometheus',
              },
              {
                label: 'Modbus',
                to: 'Modbus',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Support',
            position: 'left',
            items: [
              {
                label: 'Getting Support',
                to: 'Support',
              },
              {
                label: 'Troubleshooting',
                to: 'Troubleshooting',
              },
              {
                label: 'FAQ',
                to: 'FAQ',
              },
              {
                label: 'Tips and Tricks',
                to: 'tips-and-tricks',
              },
              {
                label: 'About EMS-ESP',
                to: 'About',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Developers',
            position: 'left',
            items: [
              {
                label: 'Building the firmware',
                to: 'Building',
              },
              {
                label: 'Adding Languages',
                to: 'Adding-Languages',
              },
              {
                label: 'EMS Telegrams',
                to: 'EMS-Telegrams',
              },
              {
                label: 'The EMS bus explained',
                to: 'EMS-bus',
              },
              {
                label: 'EMS library',
                to: 'ems-library',
              },
              {
                label: 'Contributing',
                to: 'Contributing',
              },
              {
                label: 'Release History',
                to: 'Version-Release-History',
              },
            ],
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/emsesp/EMS-ESP32',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
          {
            href: 'https://discord.gg/3J3GgnzpyT',
            position: 'right',
            className: 'header-discord-link',
            'aria-label': 'Discord server',
          },
        ],
      },
      announcementBar: {
        id: 'support_us',
        content: `<span class="announcement">⭐️ If you like EMS-ESP, please give us a
        <a
          href="https://github.com/emsesp/EMS-ESP32"
          target="_blank">
          star on GitHub
        </a>  to show your support! ⭐️</span>`,
        backgroundColor: 'rgba(var(--ifm-color-primary-rgb), 0.05)',
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} EMS-ESP team`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),

  plugins: [
    [
      '@docusaurus/theme-mermaid',
      {
        mermaid: {
          theme: { light: 'default', dark: 'dark' },
        },
      },
    ],
    // Only enable Google Analytics in production
    ...(process.env.NODE_ENV === 'production'
      ? [
          [
            '@docusaurus/plugin-google-gtag',
            {
              trackingID: 'G-SVDSJ3QTVC',
              anonymizeIP: true,
            },
          ],
        ]
      : []),
  ],

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
}

module.exports = config
