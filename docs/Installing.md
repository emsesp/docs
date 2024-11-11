description: Getting started with EMS-ESP. What you need, how to install and do initial configuration.

## Required Hardware

### 1. An ESP32 development board

The EMS-ESP firmware runs on an ESP32 module from [Espressif](https://www.espressif.com/en/products/socs). The chipsets ESP32-S, ESP32-S2, ESP32-S3 and ESP32-C3 are suppoted. See the post [here](https://github.com/emsesp/EMS-ESP32/discussions/839#discussioncomment-4493156) on which development boards we have tested against.

<img style="width:500px" src="../_media/images/esp32-dev-boards.jpg"></img>

### 2. An EMS Interface board

<img style="float:right;width:150px" src="../_media/images/EMS-Gateway-S3.png"></img>
<img style="float:right;width:150px" src="../_media/images/EMS-Gateway-E32-V2.png"></img>
EMS-ESP also requires a separate circuit to read and write to the EMS bus. You can either [build your own](EMS-Circuit) or purchase a EMS Gateway board direftly from BBQKees Electronics at [www.bbqkees-electronics.nl](https://bbqkees-electronics.nl).

## Installing EMS-ESP

Click the link below to go to the download page ans see multiple methods to install the firmware on your ESP32 board.

[Install Firmware](https://download.emsesp.org){ .md-button .md-button--primary }

!!! warning "Pay attention to the [Change Log](Version-Release-History) before upgrading so you are aware of any breaking changes"

!!! note "If you are upgrading from a previous release it's recommended you make a backup copy of any settings and configurations before performing the installation. This can be done from the WebUI Settings page 'Download/Upload'."

## After Installing

When EMS-ESP starts-up and is running, the onboard LED will show the system status.

### During the power-on boot sequence

* 1 flash indicates the EMS bus is not yet connected. If this takes more than a few seconds check the EMS Tx Mode and the physical connection to the EMS bus.

* 2 flashes indicates the network (WiFi or Ethernet) is connecting. If this persists check the EMS-ESP Network settings. EMS-ESP uses 2.4GHz/WPA2 only.

* 3 flashes indicates that both the EMS bus and Network are still trying to connect. This could be due to an incorrect EMS-ESP Board Profile setting.

### During normal operation

Unless the LED has been disabled in the settings, the LED will show the system status.

* A steady solid light indicates a good connection and EMS data is flowing in.

* A slow pulse can mean either the WiFi or the EMS bus are still connecting.

* A very fast pulse is when the system is booting up and configuring itself.
