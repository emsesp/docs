Firmware binaries can be downloaded from the GitHub page:

- [Download ESP32 Firmware](https://github.com/emsesp/EMS-ESP32/releases/latest)
- [Download ESP32 Latest Development Build](https://github.com/emsesp/EMS-ESP32/releases/tag/latest)

You can or use our own **EMS-ESP-Flasher** tool [here](https://github.com/MichaelDvP/EMS-ESP_Flasher/releases) which works on all platforms and has a GUI.
You need to connect the ESP/Gateway via USB in order to use this tool.

> [!TIP]
> BBQKees also has a good write-up at https://bbqkees-electronics.nl/wiki/gateway/firmware-update-and-downgrade.html.

Alternatively you can use the command-line. You'll need [Python v3](https://www.python.org/downloads/) installed and follow either of these methods below depending on how you plan to upload the firmware.

### Via a USB cable

- Attach a USB cable to the ESP. Make sure you have the correct Serial drivers installed.
- install `esptool` via `pip install esptool`.
- type:

```sh
esptool.py --chip esp32 --port "COM3" --baud 921600 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 40m --flash_size detect 0x1000 bootloader_dio_40m.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x10000 <firmware.bin>
```

> [!NOTE]
> The `.bin` files can be found in [here](https://github.com/emsesp/EMS-ESP32/tree/main/scripts).

> [!WARNING]
> Some USB drivers (like the CH340 on a Apple Mac OSX) works better at lower baud rates. Try 115200 instead of 921600 if you're getting errors during flashing.

### Wirelessly Over The Air (OTA)

- Download `espota.py` from [this location] or from EMS-ESP's own library [here](https://github.com/emsesp/EMS-ESP32/tree/main/scripts).
- type:

```sh
espota.py --debug --progress --port 8266 --auth ems-esp-neo -i <IP address> -f <firmware.bin>
```

## Upgrading from previous versions

EMS-ESP will attempt to automatically migrate the settings from older versions. Do pay careful attention to any breaking changes mention in the [Change Log](https://github.com/emsesp/EMS-ESP32/blob/main/CHANGELOG.md).
