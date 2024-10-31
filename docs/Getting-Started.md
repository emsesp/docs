description: Getting started with EMS-ESP. What you need, how to install and do initial configuration.

## Prerequisites

### Needed Hardware

#### ESP32 development board

The EMS-ESP firmware runs on an ESP32 module from [Espressif](https://www.espressif.com/en/products/socs). Go to the GitHub discussion [here](https://github.com/emsesp/EMS-ESP32/discussions/839#discussioncomment-4493156) to see which ESP32 board are currently supported.

<img style="width:500px" src="../_media/images/esp32-dev-boards.jpg"></img>

#### EMS Interface boards

<img style="float:right;width:150px" src="../_media/images/EMS-Gateway-S3.png"></img>
<img style="float:right;width:150px" src="../_media/images/EMS-Gateway-E32-V2.png"></img>
EMS-ESP also requires a separate circuit to read and write to the EMS bus. You can either build your own or purchase an [interface board](https://bbqkees-electronics.nl/product/ems-interface-board-v3/) from BBQKees or what is highly recommended is to buy an all-in-one [EMS Gateway](https://bbqkees-electronics.nl/shop/) from BBQKees that comes pre-installed and tested with the latest version of EMS-ESP.

## Uploading the firmware

Go to [download.emsesp.org](https://download.emsesp.org) to get the latest firmware to match your hardware. There are multiple methods to install the firmware on your ESP32 board.

!!! warning "Pay attention to the [Change Log](Version-Release-History) before upgrading so you are aware of any breaking changes"

### Upgrading to a new major release

If you are upgrading from a previous release it's recommended you make a backup copy of any settings and configurations before performing the installation. This can be done from the WebUI Settings page 'Download/Upload'.

## What the onboard LED is telling you

!!! info

    During the power-on, you'll see a sequence of LED flashes:

    * 1 flash indicates the EMS bus is not yet connected. If this takes more than a few seconds check the EMS Tx Mode and the physical connection to the EMS bus.

    * 2 flashes indicates the network (WiFi or Ethernet) is connecting. If this persists check the EMS-ESP Network settings. EMS-ESP uses 2.4GHz/WPA2 only.

    * 3 flashes indicates that both the EMS bus and Network are still trying to connect. This could be due to an incorrect EMS-ESP Board Profile setting.

    During normal operation the LED displays the current status:

    * A steady solid light indicates a good connection and EMS data is flowing in.

    * A slow pulse can mean either the WiFi or the EMS bus are still connecting.

    * A very fast pulse is when the system is booting up and configuring itself.
