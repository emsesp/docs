---
title: Getting Started
id: Getting-Started
sidebar_label: Getting Started
sidebar_position: 1
description: Getting started with EMS-ESP. What you need, how to install and do initial configuration.
hide_table_of_contents: true
---

# 📦 Getting Started

## 🔧 Required Hardware

### 🔌 ESP32 Development Board

The EMS-ESP firmware runs on an ESP32 module from [Espressif](https://www.espressif.com/en/products/socs). The chipsets ESP32-S, ESP32-S2, ESP32-S3 and ESP32-C3 are supported.

See the post [here](https://github.com/emsesp/EMS-ESP32/discussions/839#discussioncomment-4493156) on which development boards we have tested against.

![ESP32 Development Boards](/media/images/esp32-dev-boards.jpg)

### 🔗 EMS Interface Board

EMS-ESP also requires a separate circuit to read and write to the EMS bus. You can either [build your own](../EMS-Circuit) or purchase a EMS Gateway board directly from BBQKees Electronics.

![EMS Gateway S3](/media/images/EMS-Gateway-S3.png)
![EMS Gateway E32 V2](/media/images/EMS-Gateway-E32-V2.png)

[Visit BBQKees Electronics](https://bbqkees-electronics.nl)

## 💡 LED Status Indicators

When EMS-ESP starts-up and is running, the onboard LED will show the system status.

### 🔄 During Boot Sequence

**1 Flash (blue)**

EMS bus is not yet connected. If this takes more than a few seconds check the EMS Tx Mode and the physical connection to the EMS bus.

**2 Flashes (red)**

Network (WiFi or Ethernet) is connecting. If this persists check the EMS-ESP Network settings. EMS-ESP uses 2.4GHz/WPA2 only.

**3 Flashes (red,red,blue)**

Both the EMS bus and Network are still trying to connect. This could be due to an incorrect EMS-ESP Board Profile setting.

### ✨ During Normal Operation

Unless the LED has been disabled in the settings, the LED will show the system status.

**Steady Light**

Good connection and EMS data is flowing in.

**Slow Pulse**

Either the WiFi or the EMS bus are still connecting.

**Fast Pulse**

System is booting up and configuring itself.
