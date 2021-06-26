<img style="margin: 10px 10px; float:right; width:20%" src="_media/logo/boiler.svg" alt="EMS-ESP Logo"></img>

**EMS-ESP** is an open-source firmware for the Espressif ESP8266 and ESP32 microcontroller that communicates with **EMS** (Energy Management System) based equipment from manufacturers like Bosch, Buderus, Nefit, Junkers, Worcester and Sieger.

[![license](https://img.shields.io/github/license/emsesp/EMS-ESP.svg)](LICENSE)
[![donate](https://img.shields.io/badge/donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/prderbyshire/2)
[![chat](https://img.shields.io/discord/816637840644505620.svg?style=flat-square&color=blueviolet)](https://discord.gg/3J3GgnzpyT)

# Versions

<!-- tabs:start -->

#### **Version 3 for the ESP32**

**February 2021**

It looks like EMS-ESP has hit the physical limits of the ESP8266 in terms of CPU power and memory. To that end version 3 was created specifically using the ESP32 microcontroller architecture and will continue on as the main stream for all future developments. The ESP8266 can be easily swapped out for an ESP32 and compatible dev boards can be found for less than 5 euros.

The good news is that with the dual CPU support and extended memory I was able to pack in many new features. Check out the [GitHub project page](https://github.com/emsesp/EMS-ESP32/blob/main/README.md) for a full list and grab the build from [here](https://github.com/emsesp/EMS-ESP32/releases/tag/latest).

#### **Version 2.2 for the ESP8266**

**December 2020**

More features, more fixes, more support for devices. Check out the full release notes at https://github.com/emsesp/EMS-ESP/releases

#### **Version 2.1 **

**October 2020**

Version 2.1 is the first major update on 2.0 with the following new features:

- all available device values are shown in across the Web UI, MQTT and Console
- a new RESTful API for receiving and sending commands via HTTP
- extended Home Assistant integration now covering all device types and exposing their values as entities
- many bug fixes and usability improvements in the web UI

#### **Version 2.0 **

**September 2020**

Version 2 is out with many new cool things and improvements:

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

#### **Version 1.9.5**

Version 1.9 is no longer being maintained. It's recommended that users upgrade to version 2 to get the latest support.

<!-- tabs:end -->

> [!WARNING|style:flat|label:DISCLAIMER]
> This code and libraries were developed from information gathered on the internet and many hours of reverse engineering the communications between the EMS bus and real live devices. It is _not_ based on any official documentation or supported libraries from Bosch/Buderus/Junkers/Nefit (and associated companies) and therefore there are no guarantees whatsoever regarding the safety of your devices and/or their settings, or the accuracy of the information provided.
