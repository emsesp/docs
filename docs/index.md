---
title: EMS-ESP Documentation
description: Open-source firmware for the Espressif ESP32 microcontroller that communicates with EMS (Energy Management System) based equipment from manufacturers like Bosch, Buderus, Nefit, Junkers, Worcester and Sieger.
hide:
  - toc
---

# Firmware for ESP32 devices to communicate with EMS heating controllers

<img style="margin: 10px 10px; float:right; width:25%" src="_media/logo/boiler.svg" alt="EMS-ESP Logo"></img>
**EMS-ESP** is an open-source firmware for the Espressif ESP32 microcontroller that communicates with **EMS** (Energy Management System) based equipment from manufacturers like Bosch, Buderus, Nefit, Junkers, Worcester and Sieger

![license](https://img.shields.io/github/license/emsesp/EMS-ESP.svg)
[![donate](https://img.shields.io/badge/donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/prderbyshire/2)
[![chat](https://img.shields.io/discord/816637840644505620.svg?style=flat-square&color=blueviolet)](https://discord.gg/3J3GgnzpyT)

<span style="font-size: 1.5rem">Current Releases<BR><a href="https://github.com/emsesp/EMS-ESP32/releases/tag/v3.4.4">v3.4.4 Stable</a>
<BR><a href="https://github.com/emsesp/EMS-ESP32/releases/tag/latest">v3.5.0 Development</a></span>

## New Features coming soon in v3.5

The next major release v3.5 is in development. One major new enhancement is the multi language support and we currently have translations for the WebUI and device entities in German, Dutch, French, Swedish, Polish and Norwegian. Check out the demo here.

You can also rename each entity directly from the Web customization page to your own liking, which removes the need to use 'friendly names' in Home Assistant for example.

We are looking for volunteers to help translate to other languages so if you want to help please get in contact with us on Discord.

See [change log](https://github.com/emsesp/EMS-ESP32/blob/dev/CHANGELOG_LATEST.md) for a complete list of new features, changes and bug fixes.

## Breaking Changes :warning:

!!! warning

    When upgrading to v3.5 for the first time from v3.4 on a BBQKees Gateway board you will need to use the [EMS-EPS Flasher](https://github.com/emsesp/EMS-ESP-Flasher/releases) to correctly re-partition the flash. Make sure you backup the settings and customizations from the WebUI (`System->Upload/Download`) and restore after the upgrade.

## Join Our Community

For feedback, questions, live troubleshooting or just general chat

<a href="https://discord.gg/Ks2Kzd4"><img src="https://discordapp.com/api/guilds/816637840644505620/widget.png?style=banner2"></a>

## Report bugs and suggest features

Open a new topic on [EMS-ESP discussions](https://github.com/emsesp/EMS-ESP32/discussions)

Report a bug in [EMS-ESP issues](https://github.com/emsesp/EMS-ESP32/issues)
