These steps show how to build the firmware using PlatformIO.

1. Install [PlatformIO](https://platformio.org/install) and [NodeJS](https://nodejs.org/en/).
2. Make sure PlatformIO is updated (`pio upgrade`, `pio update`)
3. Decide how you want to upload the firmware, via USB or OTA (Over The Air). OTA requires that a version of EMS-ESP is already running.
4. Create a new file called `pio_local.ini` and add these two lines for USB:
```yaml
upload_protocol = esptool
upload_port = <COM>
```
or these 2 for OTA:
```yaml
upload_protocol = espota
upload_flags = 
   --port=8266
   --auth=ems-esp-neo
upload_port = ems-esp.local
```
3. Type `pio run -t upload` to build and upload the firmware
   