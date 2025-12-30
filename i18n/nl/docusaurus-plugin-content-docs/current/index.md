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

EMS-ESP is een open-source firmware voor de Espressif ESP32 microcontroller om te communiceren met EMS (Energy Management System) compatibele apparatuur van fabrikanten zoals Bosch, Buderus, Nefit, Junkers, Worcester, Sieger, elm.leblanc en iVT.

Voor EMS-ESP is een klein extra circuit nodig voor de interface tussen de EMS-buslijn en de microcontroller. Deze schakeling is verkrijgbaar als kant-en-klare module van BBQKees Electronics, of kan worden gebouwd aan de hand van het schema in de documentatie.

</div>

</div>

## Belangrijkste kenmerken

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', margin: '2rem 0'}}>

<div style={{padding: '1.5rem', borderRadius: '8px', background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-300)'}}>

### Compatibiliteit van apparaten

Compatibel met EMS, EMS+, EMS2, EMS Plus, Logamatic EMS, Junkers 2-draads en Heatronic 3 en 4.

Ondersteunt meer dan 130 EMS-compatibele apparaten van thermostaten, boilers, warmtepompen, mengeenheden, zonnemodules, connect modules, ventilatie-units, schakelaars van merken zoals Buderus, Nefit, Sieger, Junkers, Bosch, Worcester, elm.leblanc en iVT.

Sluit temperatuursensoren of elk type analoge sensor aan en beheer deze binnen EMS-ESP.

</div>

<div style={{padding: '1.5rem', borderRadius: '8px', background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-300)'}}>

### Gebruikersinterface

Een veelzijdige webinterface om je EMS-apparaten te configureren en beheren, met vertalingen naar 10 talen.

Een eenvoudig te gebruiken console, toegankelijk via Serial/USB of Telnet voor geavanceerde bewerkingen en gedetailleerde monitoring.

</div>

<div style={{padding: '1.5rem', borderRadius: '8px', background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-300)'}}>

### Integraties

Native integratie met populaire domoticasystemen zoals Home Assistant, Domoticz, IOBroker, Loxone en openHAB.

Ondersteuning voor Modbus en Prometheus.

MQTT en RESTful API's voor diepere integraties met andere systemen.

</div>

<div style={{padding: '1.5rem', borderRadius: '8px', background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-300)'}}>

### Geavanceerde functies

Simulatie van thermostaten op afstand voor RC100H, RC200 en FB10 apparaten.

Maak je eigen aangepaste EMS-entiteiten voor elk apparaat of sensor.

Gebruik de krachtige planner om acties te automatiseren.

Gebruik de notificatieservice om waarschuwingen en meldingen te versturen.

</div>

</div>

<div style={{flex: '0 0 auto'}}> <img src="/media/screenshot/main-screen.png" alt="EMS-ESP Main Screen" width="700" /> </div>

## Nieuwste releases

[![version](https://img.shields.io/github/release/emsesp/EMS-ESP32.svg?label=Latest%20Release)](https://github.com/emsesp/EMS-ESP32/blob/main/CHANGELOG.md)
[![release-date](https://img.shields.io/github/release-date/emsesp/EMS-ESP32.svg?label=Released)](https://github.com/emsesp/EMS-ESP32/commits/main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=emsesp_EMS-ESP32&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=emsesp_EMS-ESP32)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/9441142f49424ef891e8f5251866ee6b)](https://www.codacy.com/gh/emsesp/EMS-ESP32/dashboard?utm_source=github.com&utm_medium=referral&utm_content=emsesp/EMS-ESP32&utm_campaign=Badge_Grade)
[![downloads](https://img.shields.io/github/downloads/emsesp/EMS-ESP32/total.svg)](https://github.com/emsesp/EMS-ESP32/releases)
[![chat](https://img.shields.io/discord/816637840644505620.svg?style=flat-square&color=blueviolet)](https://discord.gg/3J3GgnzpyT)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/emsesp/EMS-ESP32)

[![donate](https://img.shields.io/badge/donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/prderbyshire/2)

- **Stabiel:** [v3.8.0](https://github.com/emsesp/EMS-ESP32/releases/tag/v3.8.0)
- **Ontwikkeling:** [v3.8.1](https://github.com/emsesp/EMS-ESP32/releases/tag/latest)

## Live demo

Probeer de live demo uit op [demo.emsesp.org](https://demo.emsesp.org). (_selecteer je taal op de aanmeldpagina en log in met een gebruikersnaam en wachtwoord_)

## Aan de slag

Klaar om EMS-ESP te installeren? Bekijk onze [Get Started guide](Getting-Started).

## Hulp nodig?

Problemen of ondersteuning nodig? Bekijk onze [Support page](Support).

## Word lid van onze community

Maak contact met andere gebruikers, krijg hulp en deel je ervaringen.

[![Discord Server](https://discordapp.com/api/guilds/816637840644505620/widget.png?style=banner2)](https://discord.gg/3J3GgnzpyT)
