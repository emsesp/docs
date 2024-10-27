---
title: EMS-ESP Documentation
description: Open-source firmware for the Espressif ESP32 microcontroller that communicates with EMS (Energy Management System) based equipment
hide:
  - toc
---

# Open-source firmware to communicate with EMS heating appliances

<img style="margin: 10px 10px; float:right; width:10%" src="_media/logo/boiler.svg" alt="EMS-ESP Logo"></img>
**EMS-ESP** is an open-source firmware for the Espressif ESP32 microcontroller to communicate with **EMS** (Energy Management System) compatible equipment from manufacturers such as Bosch, Buderus, Nefit, Junkers, Worcester, Sieger, elm.leblanc and iVT.

[![version](https://img.shields.io/github/release/emsesp/EMS-ESP32.svg?label=Latest%20Release)](https://github.com/emsesp/EMS-ESP32/blob/main/CHANGELOG.md)
[![release-date](https://img.shields.io/github/release-date/emsesp/EMS-ESP32.svg?label=Released)](https://github.com/emsesp/EMS-ESP32/commits/main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=emsesp_EMS-ESP32&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=emsesp_EMS-ESP32)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/9441142f49424ef891e8f5251866ee6b)](https://www.codacy.com/gh/emsesp/EMS-ESP32/dashboard?utm_source=github.com&utm_medium=referral&utm_content=emsesp/EMS-ESP32&utm_campaign=Badge_Grade)
[![downloads](https://img.shields.io/github/downloads/emsesp/EMS-ESP32/total.svg)](https://github.com/emsesp/EMS-ESP32/releases)
[![chat](https://img.shields.io/discord/816637840644505620.svg?style=flat-square&color=blueviolet)](https://discord.gg/3J3GgnzpyT)

[![donate](https://img.shields.io/badge/donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/prderbyshire/2)

<span style="font-size: 1.5rem">Latest Releases</span>
<span style="font-size: 1.0rem">
<BR>Stable - <a href="https://github.com/emsesp/EMS-ESP32/releases/tag/v3.7.0">version 3.7.0</a>
<BR>Development - <a href="https://github.com/emsesp/EMS-ESP32/releases/tag/latest">version 3.7.1</a>
</span>

## Key Features

- Compatible with EMS, EMS+, EMS2, EMS Plus, Logamatic EMS, Junkers 2-wire, Heatronic 3 and 4
- Supporting over 120 different EMS compatible devices such as thermostats, boilers, heat pumps, mixing units, solar modules, connect modules, ventilation units, switches and more
- Easy to add external Temperature and Analog sensors that are attached to GPIO pins on the ESP32 board
- A multi-user, multi-language web interface to change settings and monitor incoming data
- A simple to use console, accessible via Serial/USB or Telnet for advanced operations and detailed monitoring
- Native integration with Home Assistant, Domoticz, openHAB and Modbus
- Easy setup and install with automatic updates
- Simulation of remote thermostats
- Localized in 11 languages, and customizable to rename any device or sensor
- Extendable by adding own custom EMS entities
- Expandable via adding user-built external modules
- A powerful Scheduler to automate tasks and trigger events based data changes
- A Notification service to alert you of important events

For a full list of features read the [change log](Version-Release-History).

See a [live demo](https://demo.emsesp.org) at `https://demo.emsesp.org`. Select your language on the sign-on page and log in with any username and password.

<img style="width:75%" src="../_media/screenshot/main-screen.png"></img>

## Installing

Head over to the [Getting Started](Getting-Started) guide to see what hardware you need and how to install the firmware.

## Support

See the support page for [reporting issues](Support) and requesting new features.

## Join Our Community

For feedback, questions, live troubleshooting or just general chat hop on to our Discord channel:

<a href="https://discord.gg/3J3GgnzpyT"><img src="https://discordapp.com/api/guilds/816637840644505620/widget.png?style=banner2"></a>

## Contact us

For general questions about this project please use the [contact form](Contact).
