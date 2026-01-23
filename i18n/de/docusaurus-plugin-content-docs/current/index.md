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
sidebar_class_name: hidden
image: /media/screenshot/main-screen.png
---

<div style={{display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap'}}>

<div style={{flex: '0 0 auto'}}> <img src="/media/logo/boiler.svg" alt="EMS-ESP Logo" width="200" /> </div>

<div style={{flex: '1 1 400px'}}>

EMS-ESP ist eine Open-Source-Firmware für den Espressif-ESP32-Mikrocontroller zur Kommunikation mit EMS-kompatiblen Geräten (Energy Management System) von Herstellern wie Bosch, Buderus, Nefit, Junkers, Worcester, Sieger, elm.leblanc und iVT.

EMS-ESP benötigt eine kleine zusätzliche Schaltung als Schnittstelle zwischen der EMS-Busleitung und dem Mikrocontroller. Diese Schaltung ist als vorgefertigtes Modul von BBQKees Electronics erhältlich.

</div>

</div>

## 🚀 Hauptmerkmale

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', margin: '2rem 0'}}>

<div style={{padding: '1.5rem', borderRadius: '8px', background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-300)'}}>

### 🔌 Gerätekompatibilität

Kompatibel mit EMS, EMS+, EMS2, EMS Plus, Logamatic EMS, Junkers 2-wire und Heatronic 3 und 4.

Unterstützung von über 130 EMS-kompatiblen Geräten wie Thermostaten, Heizkesseln, Wärmepumpen, Mischern, Solarmodulen, Connect-Modulen, Lüftungsgeräten und Schaltern von Marken wie Buderus, Nefit, Sieger, Junkers, Bosch, Worcester, elm.leblanc und iVT.

Anbringen von Temperatursensoren oder jeder Art von Analogsensoren und deren Verwaltung im EMS-ESP.

</div>

<div style={{padding: '1.5rem', borderRadius: '8px', background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-300)'}}>

### 🌐 Benutzeroberfläche

Eine vielseitige Webschnittstelle zur Konfiguration und Verwaltung Ihrer EMS-Geräte, mit Übersetzungen in 10 Sprachen.

Eine einfach zu bedienende Konsole, auf die über Serial/USB oder Telnet zugegriffen werden kann, ermöglicht erweiterte Funktionen und eine detaillierte Überwachung.

</div>

<div style={{padding: '1.5rem', borderRadius: '8px', background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-300)'}}>

### 🔧 Integrationen

Native Integration in gängige Hausautomationssysteme wie Home Assistant, Domoticz, IOBroker, Loxone und openHAB.

Unterstützung für Modbus und Prometheus.

MQTT und RESTful APIs für tiefere Integrationen mit anderen Systemen.

</div>

<div style={{padding: '1.5rem', borderRadius: '8px', background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-300)'}}>

### ⚡ Erweiterte Funktionen

Simulation von Fernthermostaten für die Geräte RC100H, RC200 und FB10.

Erstellen Sie Ihre eigenen benutzerdefinierten EMS-Entitäten für jedes Gerät oder jeden Sensor.

Nutzen Sie den leistungsstarken Planer, um Aktionen zu automatisieren.

Verwenden Sie den Benachrichtigungsdienst, um Alarme und Warnungen zu versenden.

</div>

</div>

<div style={{flex: '0 0 auto'}}> <img src="/media/screenshot/main-screen.png" alt="EMS-ESP Main Screen" width="700" /> </div>

## 📦 Neueste Veröffentlichungen

[![version](https://img.shields.io/github/release/emsesp/EMS-ESP32.svg?label=Latest%20Release)](https://github.com/emsesp/EMS-ESP32/blob/main/CHANGELOG.md) [![release-date](https://img.shields.io/github/release-date/emsesp/EMS-ESP32.svg?label=Released)](https://github.com/emsesp/EMS-ESP32/commits/main) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=emsesp_EMS-ESP32&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=emsesp_EMS-ESP32) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/9441142f49424ef891e8f5251866ee6b)](https://www.codacy.com/gh/emsesp/EMS-ESP32/dashboard?utm_source=github.com&utm_medium=referral&utm_content=emsesp/EMS-ESP32&utm_campaign=Badge_Grade) [![downloads](https://img.shields.io/github/downloads/emsesp/EMS-ESP32/total.svg)](https://github.com/emsesp/EMS-ESP32/releases) [![chat](https://img.shields.io/discord/816637840644505620.svg?style=flat-square&color=blueviolet)](https://discord.gg/3J3GgnzpyT) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/emsesp/EMS-ESP32)

[![donate](https://img.shields.io/badge/donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/prderbyshire/2)

- **Stabil:** [v3.8.1](https://github.com/emsesp/EMS-ESP32/releases/tag/v3.8.1)
- **Entwicklung:** [v3.8.2](https://github.com/emsesp/EMS-ESP32/releases/tag/latest)

## 📱 Live-Demo

Testen Sie die Live-Demo unter [demo.emsesp.org](https://demo.emsesp.org). (_Wählen Sie Ihre Sprache auf der Anmeldeseite und melden Sie sich mit einem beliebigen Benutzernamen und Passwort an_)

## 📦 Los geht's

Sind Sie bereit, EMS-ESP zu installieren? Sehen Sie sich unser [Get Started guide](Getting-Started) an.

## 🆘 Brauchen Sie Hilfe?

Haben Sie Probleme oder brauchen Sie Unterstützung? Besuchen Sie unseren [Support page](Support).

## 💬 Werden Sie Mitglied unserer Gemeinschaft

Tauschen Sie sich mit anderen Nutzern aus, erhalten Sie Hilfe und teilen Sie Ihre Erfahrungen.

[![Discord Server](https://discordapp.com/api/guilds/816637840644505620/widget.png?style=banner2)](https://discord.gg/3J3GgnzpyT)
