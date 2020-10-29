Firmware binaries are available on
 * Latest Stable Release (https://github.com/proddy/EMS-ESP/releases/latest)
 * Latest Development Release (https://github.com/proddy/EMS-ESP/releases/tag/dev)

Here we'll use the command-line. You'll need [Python]( https://www.python.org/downloads/) (version 3) installed and follow either of these methods depending on how you plan to upload the firmware:

### Via USB:
- attach a USB cable to the ESP. Make sure you have the correct Serial drivers installed. See https://docs.wemos.cc/en/latest/ch340_driver.html.
- Install `esptool` via `pip install esptool`.
- then: `esptool.py -p <COM PORT> -b 921600 write_flash 0x00000 <firmware.bin>` 

### Wirelessly over the air (OTA):
- Download `espota.py` from https://github.com/esp8266/Arduino/blob/master/tools/espota.py
- then: `espota.py --debug --progress --port 8266 --auth ems-esp-neo -i <IP address> -f <firmware.bin>`

Note, both these pyhton scripts are also available in the repo under the `scripts` directory.

## **Updating from version 1.9**

EMS-ESP will attempt to automatically migrate the 1.9 settings, however there are some noticeable differences to be aware of in version 2:

* MQTT: Many changes to the MQTT topics and payload structure. See the section on [MQTT](MQTT.md).
* General: There is no "serial mode" anymore like with version 1.9. When the Wifi cannot connect to the SSID it will automatically enter a "safe" mode where the Serial console is activated (note Serial is always available on the ESP32 because it has multiple UARTs). The EMS-ESP's LED will blink fast when in Serial mode. When this happens connect via a USB using baud 115200.

> [!TIP]
> BBQKees also has a good write-up at https://bbqkees-electronics.nl/wiki/gateway/firmware-update-to-v2.html.


