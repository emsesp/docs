/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Docs sidebar
  docsSidebar: [
    'Getting-Started',
    'Installing',
    'Configuring',
    'WebUI',
    'MQTT',
    'Commands',
    'Console',
    'Special-Functions',
  ],

  // Devices sidebar
  devicesSidebar: [
    'All-Entities',
    'Boilers',
    'Thermostats',
    'Controllers',
    'Heat-Pumps',
    'Alert',
    'Connect',
    'Extension',
    'Gateways',
    'Mixer-Modules',
    'Solar-Modules',
    'Switches',
  ],

  // Integrations sidebar
  integrationsSidebar: [
    'Home-Assistant',
    'IOBroker',
    'Domoticz',
    'openHAB',
    'Loxone',
    'Grafana',
    'Prometheus',
    'Modbus',
  ],

  // Modbus sidebar
  modbusSidebar: [
    'Modbus',
    'Modbus-Settings',
    'Modbus-Entity-Registers',
    'Modbus-Register-Blocks',
    'Modbus-Server-IDs',
    'Modbus-System-Server',
  ],

  // Help sidebar
  helpSidebar: [
    'Support',
    'Troubleshooting',
    'FAQ',
    'tips-and-tricks',
    'About',
  ],

  // Developers sidebar
  developersSidebar: [
    'Building',
    'Adding-Languages',
    'EMS-Telegrams',
    'EMS-bus',
    'ems-library',
    'EMS-Circuit',
    'Contributing',
    'Version-Release-History',
  ],
}

module.exports = sidebars
