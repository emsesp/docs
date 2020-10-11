<img style="margin: 10px 10px; float:right; width:20%" src="_media/logo/boiler.svg" alt="EMS-ESP Logo"></img>

**EMS-ESP** is an open-source firmware for the Espressif ESP8266 and ESP32 microcontroller that communicates with **EMS** (Energy Management System) based equipment from manufacturers like Bosch, Buderus, Nefit, Junkers, Worcester and Sieger.

[![version](https://img.shields.io/github/release/proddy/EMS-ESP.svg?label=Latest%20Release)](https://github.com/proddy/EMS-ESP/blob/master/CHANGELOG.md)
[![release-date](https://img.shields.io/github/release-date/proddy/EMS-ESP.svg?label=Released)](https://github.com/proddy/EMS-ESP/commits/master)
[![license](https://img.shields.io/github/license/proddy/EMS-ESP.svg)](LICENSE)
[![travis](https://travis-ci.com/proddy/EMS-ESP.svg?branch=dev)](https://travis-ci.com/proddy/EMS-ESP)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b8880625bdf841d4adb2829732030887)](https://app.codacy.com/app/proddy/EMS-ESP?utm_source=github.com&utm_medium=referral&utm_content=proddy/EMS-ESP&utm_campaign=Badge_Grade_Settings)
[![downloads](https://img.shields.io/github/downloads/proddy/EMS-ESP/total.svg)](https://github.com/proddy/EMS-ESP/releases)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/proddy/EMS-ESP.svg)](http://isitmaintained.com/project/proddy/EMS-ESP "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/proddy/EMS-ESP.svg)](http://isitmaintained.com/project/proddy/EMS-ESP "Percentage of issues still open")
<br/>
[![gitter](https://img.shields.io/gitter/room/EMS-ESP/EMS-ESP.svg)](https://gitter.im/EMS-ESP/community)

If you like **EMS-ESP**, please give it a star, or fork it and contribute!

[![GitHub stars](https://img.shields.io/github/stars/proddy/EMS-ESP.svg?style=social&label=Star)](https://github.com/proddy/EMS-ESP/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/proddy/EMS-ESP.svg?style=social&label=Fork)](https://github.com/proddy/EMS-ESP/network)
[![donate](https://img.shields.io/badge/donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/prderbyshire/2)


<!-- tabs:start -->

#### **Version 2.1 (LATEST)**
**October 2020**

Version 2.1 is the first major update on 2.0 with the following new features:

- all device values shown in the Web UI, MQTT and Console
- a new RESTful API for receiving and sending commands via HTTP
- extended Home Assistant integration covering all devices and their values
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
- Supporting over 70 EMS devices (boilers, thermostats, solar modules, mixing modules, heat pumps, gateways)

Thanks to all the contributors and testers for providing feedback.

#### **Version 1.9.5**

Version 1.9 is no longer being maintained. It's recommended that users upgrade to version 2 to get the latest support.
 
<!-- tabs:end -->

## DISCLAIMER

!> This code and libraries were developed from information gathered on the internet and many hours of reverse engineering the communications between the EMS bus and thermostats. It is **not** based on any official documentation or supported libraries from Buderus/Junkers/Nefit (and associated companies) and therefore there are no guarantees whatsoever regarding the safety of your devices and/or their settings, or the accuracy of the information provided.
