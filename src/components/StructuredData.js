import React from 'react'
import Head from '@docusaurus/Head'

export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://emsesp.org/#organization',
        name: 'EMS-ESP',
        url: 'https://emsesp.org',
        logo: {
          '@type': 'ImageObject',
          url: 'https://emsesp.org/img/boiler.svg',
          width: 200,
          height: 200,
        },
        sameAs: [
          'https://github.com/emsesp/EMS-ESP32',
          'https://discord.gg/3J3GgnzpyT',
        ],
        description:
          'Open-source firmware for ESP32 to communicate with EMS heating appliances',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://emsesp.org/#website',
        url: 'https://emsesp.org',
        name: 'EMS-ESP Documentation',
        description:
          'EMS-ESP is an open-source firmware for ESP32 to communicate with EMS (Energy Management System) heating appliances from Bosch, Buderus, Nefit, Junkers, and Worcester.',
        publisher: {
          '@id': 'https://emsesp.org/#organization',
        },
        inLanguage: ['en', 'de', 'nl'],
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://emsesp.org/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://emsesp.org/#software',
        name: 'EMS-ESP',
        applicationCategory: 'Firmware',
        operatingSystem: 'ESP32',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'Open-source firmware for the Espressif ESP32 microcontroller that communicates with EMS (Energy Management System) based heating equipment from Bosch, Buderus, Nefit, Junkers, Worcester, Sieger, and iVT.',
        downloadUrl: 'https://github.com/emsesp/EMS-ESP32/releases',
        softwareVersion: 'v3.8.1',
        author: {
          '@id': 'https://emsesp.org/#organization',
        },
        featureList: [
          'Compatible with 130+ EMS devices',
          'Multi-language web interface',
          'MQTT and RESTful API support',
          'Home Assistant integration',
          'Domoticz integration',
          'openHAB integration',
          'Modbus support',
          'Prometheus monitoring',
          'Thermostat simulation',
          'Custom entity support',
          'Scheduler functionality',
          'Notification service',
        ],
        license: 'https://opensource.org/licenses/MIT',
        screenshot: 'https://emsesp.org/media/screenshot/main-screen.png',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://emsesp.org/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://emsesp.org',
          },
        ],
      },
    ],
  }

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  )
}
