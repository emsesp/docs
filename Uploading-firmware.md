Firmware binaries are available on
 * Latest Stable Release (https://github.com/proddy/EMS-ESP/releases/latest)
 * Latest Development Release (https://github.com/proddy/EMS-ESP/tree/firmware)

Here we'll use the command-line. You'll need [Python]( https://www.python.org/downloads/) (version 3) installed and these 2 scripts:

- `esptool.py`. Install using `pip install esptool`.
- `espota.py` downloaded from https://github.com/esp8266/Arduino/blob/master/tools/espota.py

Both these tools are also in the repo in the `scripts` directory.

Next step is to fetch the latest firmware binary from https://github.com/proddy/EMS-ESP/releases, and if you're using USB with an ESP8266:

  `esptool.py -p <COM PORT> -b 921600 write_flash 0x00000 <firmware.bin>` 
  
and for OTA:
  
  `espota.py --debug --progress --port 8266 --auth ems-esp-neo -i <IP address> -f <firmware.bin>`

## **Updating from version 1.9**

EMS-ESP will attempt to automatically migrate the 1.9 settings, however there are some noticeable differences to be aware of in version 2:

### MQTT:
   - MQTT base has been removed. All MQTT topics are prefixed with only the hostname, for example `ems-esp/status` as opposed to `home/ems-esp/status`.
   - Subscribe topic have been renamed and the trailing `_cmd` removed. e.g. `boiler` instead of `boiler_cmd`
   - `heatPmp` renamed to `heatPump`
   - `ServiceCodeNumber` renamed to `serviceCodeNumber`
   - Firmware version has been moved to the `start` topic
   - `desinfection` renamed to `disinfection`

### General:
  - There is no "serial mode" anymore like with version 1.9. When the Wifi cannot connect to the SSID it will automatically enter a "safe" mode where the Serial console is activated (note Serial is always available on the ESP32 because it has multiple UARTs). The EMS-ESP's LED will blink fast when in Serial mode. When this happens connect via a USB using baud 115200.

If you run into issues try first erasing the ESP8266 with `esptool.py erase_flash` and uploading the new firmware manually.

BBQKees also has a good write-up at https://bbqkees-electronics.nl/wiki/gateway/firmware-update-to-v2.html.
