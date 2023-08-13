---
title: EMS-ESP Documentation
description: Open-source firmware for the Espressif ESP32 microcontroller that communicates with EMS (Energy Management System) based equipment from manufacturers like Bosch, Buderus, Nefit, Junkers, Worcester and Sieger.
hide:
  - toc
---

# ESP32 Firmware to communicate with EMS heating appliances

<img style="margin: 10px 10px; float:right; width:20%" src="_media/logo/boiler.svg" alt="EMS-ESP Logo"></img>
**EMS-ESP** is an open-source firmware for the Espressif ESP32 microcontroller that communicates with **EMS** (Energy Management System) based equipment from manufacturers like Bosch, Buderus, Nefit, Junkers, Worcester and Sieger

![license](https://img.shields.io/github/license/emsesp/EMS-ESP.svg)
[![donate](https://img.shields.io/badge/donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/prderbyshire/2)
[![chat](https://img.shields.io/discord/816637840644505620.svg?style=flat-square&color=blueviolet)](https://discord.gg/3J3GgnzpyT)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=emsesp_EMS-ESP32&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=emsesp_EMS-ESP32)

<span style="font-size: 1.5rem">Current Releases
<BR><a href="https://github.com/emsesp/EMS-ESP32/releases/tag/v3.6.0">v3.6.0 Stable</a>
<BR><a href="https://github.com/emsesp/EMS-ESP32/releases/tag/latest">v3.7.0 Development</a>
</span>

## New Features in v3.6.0

13 August 2023: The next major is released!

As well as bug fixes, memory and performance optimizations and more responsive Web layout, these are the other noticeable new features and enhancements:

- Added Italian and Turkish translations (Please do reach out on Discord if you want to help translate to other languages)
- Added support for ESP32 S2, C3 mini and S3
- Added 10 new EMS devices
- Added a Scheduler to allow setting of EMS parameters at specific times
- Custom Entity feature to extend entities directly from the telegram data

See a [live demo](https://ems-esp.derbyshire.nl/) and the full list of features in the [change log](Version-Release-History#350-current-development-version).

### :warning: Breaking Changes in v3.6.x :warning:

!!! warning

    The sensors have been renamed. dallassensor is now temperaturesensor in the MQTT topic and named ts in the Customizations file. Likewise analogs is now analogsensor in MQTT and called as in the Customizations file. If you have previous customizations you will need to manually update by downloading, changing the JSON file and uploading. It's also recommended cleaning up any old MQTT topics from your broker using an application like MQTTExplorer.

    When upgrading to v3.6 for the first time from v3.4 on a BBQKees Gateway board you will need to use the [EMS-EPS Flasher](https://github.com/emsesp/EMS-ESP-Flasher/releases) to correctly re-partition the flash. Make sure you backup the settings and customizations from the WebUI (`System->Upload/Download`) and restore after the upgrade.

## Join Our Community

For feedback, questions, live troubleshooting or just general chat

<a href="https://discord.gg/3J3GgnzpyT"><img src="https://discordapp.com/api/guilds/816637840644505620/widget.png?style=banner2"></a>

## Contribute

Everybody is welcome and invited to contribute to the EMS-ESP Project by:

- providing Pull Requests (Features, Proof of Concepts, Language files or Fixes)
- testing new released features and report issues
- donating to acquire hardware for testing and implementing or out of gratitude
- contributing missing [documentation](Contributing.md) for features and devices

## Report bugs and suggest features

Open a new topic on [EMS-ESP discussions](https://github.com/emsesp/EMS-ESP32/discussions)

Report a bug in [EMS-ESP issues](https://github.com/emsesp/EMS-ESP32/issues)
