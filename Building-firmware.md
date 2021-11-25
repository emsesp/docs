These steps below show how to build the firmware using PlatformIO.

1. Install [PlatformIO](https://platformio.org/install) and [NodeJS](https://nodejs.org/en/).
2. Make sure PlatformIO is updated to the latest
   ```sh
      pio upgrade
      pio update
   ```
3. Download the EMS-ESP source code
   ```sh
   git clone  https://github.com/emsesp/EMS-ESP32
   cd EMS-ESP32
   ```
4. Optional: If you want to use the latest development version use
   ```sh
     git checkout dev
   ```
5. Decide how you want to upload the firmware, via USB or OTA (Over The Air). OTA requires that a version of EMS-ESP is already running.
6. Create a new file called `pio_local.ini` and add these lines for USB replacing with the COM port you're using:

   ```yaml
   [env]
   upload_protocol = esptool
   upload_port = <COM PORT>
   ```

   or these for OTA:

   ```yaml
   [env]
   upload_protocol = espota
   upload_flags =
    --port=8266
    --auth=ems-esp-neo
   upload_port = ems-esp.local
   ```

7. Now build and upload the firmware with
   ```sh
   pio run -t upload
   ```
