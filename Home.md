<img style="margin: 10px 10px; float:right; width:20%" src="_media/logo/boiler.svg" alt="EMS-ESP Logo"></img>

**EMS-ESP** is an open-source firmware for the Espressif ESP32 microcontroller that communicates with **EMS** (Energy Management System) based equipment from manufacturers like Bosch, Buderus, Nefit, Junkers, Worcester and Sieger.

[![license](https://img.shields.io/github/license/emsesp/EMS-ESP.svg)](LICENSE)
[![donate](https://img.shields.io/badge/donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/prderbyshire/2)
[![chat](https://img.shields.io/discord/816637840644505620.svg?style=flat-square&color=blueviolet)](https://discord.gg/3J3GgnzpyT)

# News

<!-- tabs:start -->

#### **September 2022**

The next major release v3.5 is in development. One new enhancement is the multi language support and currently supporting German, Dutch and Swedish with Polish on it's way.

We are looking for volunteers to help translate to other languages so if you want to help please get in contact with us on Discord.

#### **May 2022**

Finally our next major release v3.4 is out. Funny thing is we could never stop adding improvements to this version which made it increasingly hard to draw the line and cut a build. The 3.4 is truly a major update from 3.3 which a more responsive Web UI and plenty of new features. And a big shout out to everyone who helped test the beta's (and there were many). We hope you enjoy it!

@proddy @MichaelDvP

#### **Dec 2021**

Version 3 is out and we're full-on adding new features. A few things on the enhancement list are:

- extended support for Heat Pumps
- Localized WebUI (NL, DE, US)
- Plugin architecture so custom code can easily be added
- Native integration into Home Assistant without using MQTT Discovery

#### **Feb 2021**

It looks like EMS-ESP has hit the physical limits of the ESP8266 in terms of CPU power and memory. To that end version 3 was created specifically using the ESP32 microcontroller architecture and will continue on as the main stream for all future developments. The ESP8266 can be easily swapped out for an ESP32 for a few euro's for those still on version 2.

#### **Dec 2020**

Version 2.2 will be the last release for the ESP8266.

#### **Oct 2020**

Version 2.1 is the first major update on 2.0 with the following new features:

- all available device values are shown in across the Web UI, MQTT and Console
- a new RESTful API for receiving and sending commands via HTTP
- extended Home Assistant integration now covering all device types and exposing their values as entities
- many bug fixes and usability improvements in the web UI

#### **Sep 2020**

Version 2.0 is out with many new cool things and improvements and a major step up from version 1.9.

- Support for both ESP8266 and ESP32 modules
- A new multi-user Web interface (based on React/TypeScript)
- A new Console, accessible via Serial and Telnet
- Simple RESTful API
- Tighter security in both Web and Console. Admin privileges required to access core settings and commands.
- Support for Home Assistant's MQTT Discovery
- Can be run standalone as an independent Access Point or join an existing WiFi network
- Easier first-time configuration via a web Captive Portal
- Supporting over 70 EMS devices (boilers, thermostats, solar modules, mixer modules, heat pumps, gateways)

Thanks to all the contributors and testers for providing feedback.

<!-- tabs:end -->

> [!WARNING|style:flat|label:DISCLAIMER]
> This code was developed based off information gathered on the internet and many hours of reverse engineering the communications between the EMS bus and real live devices. It is _not_ based on any official documentation or supported libraries from Bosch/Buderus/Junkers/Nefit (and associated companies) and therefore there are no guarantees whatsoever regarding the safety of your devices and/or their settings, or the accuracy of the information provided.
