---
id: index
title: EMS-ESP - ESP32 Firmware for EMS Heating Systems
description: Open-source firmware for the Espressif ESP32 microcontroller that communicates with EMS (Energy Management System) based heating equipment from Bosch, Buderus, Nefit, Junkers, Worcester and more. Control your heating system with Home Assistant, MQTT, and Modbus.
keywords: 
  - EMS-ESP
  - ESP32 heating control
  - Bosch EMS
  - Buderus integration
  - Nefit thermostat
  - Junkers heating
  - Worcester boiler
  - Home Assistant heating
  - MQTT thermostat
  - smart heating
  - home automation
  - IoT heating
hide_table_of_contents: true
hide_title: true
image: /media/screenshot/main-screen.png
---

<div style={{display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap'}}>

<div style={{flex: '0 0 auto'}}>
<img src="/media/logo/boiler.svg" alt="EMS-ESP Logo" width="200" />
</div>

<div style={{flex: '1 1 400px'}}>

EMS-ESP is an open-source firmware for the Espressif ESP32 microcontroller to communicate with EMS (Energy Management System) compatible equipment from manufacturers such as Bosch, Buderus, Nefit, Junkers, Worcester, Sieger, elm.leblanc and iVT.

EMS-ESP requires a small additional circuit to interface between the EMS bus line an the microcontroller. This circuit is available as a pre-built module from BBQKees Electronics, or can be built from a schematic provided in the documentation.

</div>

</div>

## 🚀 Key Features

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', margin: '2rem 0'}}>

<div style={{padding: '1.5rem', borderRadius: '8px', background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-300)'}}>

### 🔌 Device Compatibility

Compatible with EMS, EMS+, EMS2, EMS Plus, Logamatic EMS, Junkers 2-wire and Heatronic 3 and 4.

Supporting over 130 EMS compatible devices from thermostats, boilers, heat pumps, mixing units, solar modules, connect modules, ventilation units, switches from brands like Buderus, Nefit, Sieger, Junkers, Bosch, Worcester, elm.leblanc and iVT.

Attach Temperature sensors or any type of Analog sensor and manage it within EMS-ESP.

</div>

<div style={{padding: '1.5rem', borderRadius: '8px', background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-300)'}}>

### 🌐 User Interface

A versatile web interface to configure and manage your EMS devices, with translations to 10 languages.

A simple to use console, accessible via Serial/USB or Telnet for advanced operations and detailed monitoring.

</div>

<div style={{padding: '1.5rem', borderRadius: '8px', background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-300)'}}>

### 🔧 Integrations

Native integration with popular home automation systems such as Home Assistant, Domoticz, IOBroker, Loxone and openHAB.

Support for Modbus and Prometheus.

MQTT and RESTful APIs for deeper integrations with other systems.

</div>

<div style={{padding: '1.5rem', borderRadius: '8px', background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-300)'}}>

### ⚡ Advanced Features

Simulation of remote thermostats for RC100H, RC200 and FB10 devices.

Create your own custom EMS entities for any device or sensor.

Use the powerful scheduler to automate actions.

Use the notification service to send alerts and warnings.

</div>

</div>

<div style={{flex: '0 0 auto'}}>
<img src="/media/screenshot/main-screen.png" alt="EMS-ESP Main Screen" width="700" />
</div>

## 📦 Latest Releases

[![version](https://img.shields.io/github/release/emsesp/EMS-ESP32.svg?label=Latest%20Release)](https://github.com/emsesp/EMS-ESP32/blob/main/CHANGELOG.md)
[![release-date](https://img.shields.io/github/release-date/emsesp/EMS-ESP32.svg?label=Released)](https://github.com/emsesp/EMS-ESP32/commits/main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=emsesp_EMS-ESP32&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=emsesp_EMS-ESP32)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/9441142f49424ef891e8f5251866ee6b)](https://www.codacy.com/gh/emsesp/EMS-ESP32/dashboard?utm_source=github.com&utm_medium=referral&utm_content=emsesp/EMS-ESP32&utm_campaign=Badge_Grade)
[![downloads](https://img.shields.io/github/downloads/emsesp/EMS-ESP32/total.svg)](https://github.com/emsesp/EMS-ESP32/releases)
[![chat](https://img.shields.io/discord/816637840644505620.svg?style=flat-square&color=blueviolet)](https://discord.gg/3J3GgnzpyT)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/emsesp/EMS-ESP32)

[![donate](https://img.shields.io/badge/donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/prderbyshire/2)

- **Stable:** [v3.8.0](https://github.com/emsesp/EMS-ESP32/releases/tag/v3.8.0)
- **Development:** [v3.8.1](https://github.com/emsesp/EMS-ESP32/releases/tag/latest)

## 📱 Live Demo

Try out the live demo at [demo.emsesp.org](https://demo.emsesp.org). (_select your language on the sign-on page and log in with any username and password_)

## 📦 Get Started

Ready to install EMS-ESP? Check out our [Get Started guide](Getting-Started).

## 🆘 Need Help?

Having issues or need support? Check out our [Support page](Support).

## 💬 Join our Community

Connect with other users, get help, and share your experiences.

[![Discord Server](https://discordapp.com/api/guilds/816637840644505620/widget.png?style=banner2)](https://discord.gg/3J3GgnzpyT)
