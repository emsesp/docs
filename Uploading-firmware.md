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
