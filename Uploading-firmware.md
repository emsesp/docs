Firmware binaries are available on
 * Latest Stable Release (https://github.com/proddy/EMS-ESP/releases/latest)
 * Latest Development Release (https://github.com/proddy/EMS-ESP/releases/tag/dev)

Here we'll use the command-line. You'll need [Python]( https://www.python.org/downloads/) (version 3) installed and follow either of these methods depending on how you plan to upload the firmware:

### Via a USB cable
- attach a USB cable to the ESP. Make sure you have the correct Serial drivers installed (see https://docs.wemos.cc/en/latest/ch340_driver.html for the ESP8266 that comes with an EMS Gateway device).
- Install `esptool` via `pip install esptool` or use the script provided in https://github.com/proddy/EMS-ESP/tree/dev/scripts.
#### ESP8266:
- `esptool.py -p <COM PORT> -b 921600 write_flash 0x00000 <firmware.bin>`

#### ESP32:
- `esptool.py --chip esp32 --port "COM3" --baud 921600 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 40m --flash_size detect 0x1000 bootloader_dio_40m.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x10000 <firmware.bin>`

Note, the `.bin` files can be found in https://github.com/proddy/EMS-ESP/tree/dev/scripts.

> [!TIP]
> BBQKees also has a good write-up at https://bbqkees-electronics.nl/wiki/gateway/firmware-update-to-v2.html.

### Wirelessly Over The Air (OTA):
#### ESP8266 and ESP32
- Download `espota.py` from https://github.com/esp8266/Arduino/blob/master/tools/espota.py or use the one from https://github.com/proddy/EMS-ESP/tree/dev/scripts.
- `espota.py --debug --progress --port 8266 --auth ems-esp-neo -i <IP address> -f <firmware.bin>`
## **Upgrading from previous versions

EMS-ESP will attempt to automatically migrate the settings from older versions. If this is from v1.9 make note of these important differences:

* MQTT: Many changes to the MQTT topics and payload structure. See the section on [MQTT](MQTT.md).
* General: There is no "serial mode" anymore like with version 1.9. When the Wifi cannot connect to the SSID it will automatically enter a "safe" mode where the Serial console is activated (note Serial is always available on the ESP32 because it has multiple UARTs). The EMS-ESP's LED will blink fast when in Serial mode. When this happens connect via a USB using baud 115200.




