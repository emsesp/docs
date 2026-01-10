---
title: Installing
id: Installing
description: Getting started with EMS-ESP. What you need, how to install and do initial configuration.
---

# 📦 Installing

There are a number of ways to install the firmware on your ESP32 device:

1. Using the [EMS-ESP Flash Tool](https://github.com/emsesp/EMS-ESP-Flasher/releases). This is a native application for Windows, MacOS and Linux/Ubuntu. Your ESP32 device needs to be psychically connected to your computer via the USB or Serial port.
2. Using the [EMS-ESP Web Installer](https://install.emsesp.org/) which is an online installer supporting 16MB/PSRAM variants that requires the EMS-ESP device to be connected via the USB/Serial port.
3. Using EMS-ESP directly from the WebUI Settings page to automatically detect and install the latest version (v3.7 onwards).
4. Using a copy of the [EMS-ESP CLI Installer](https://github.com/emsesp/EMS-ESP-Flasher-CLI) command line tool. This is Unix based, so does not support Windows (unless using WSL2).
5. Building the firmware from the source code and uploading directly, using the guide at [Building](Building.md).

## Choosing the right firmware version

There are pre-built firmware binaries for the ESP32 and ESP32-S3 chips sets. There are variations of these based on the allocated flash size (4MB, 16MB) and whether the board has additional PSRAM present. For other chip sets, such as the ESP32-C3, the firmware can be manually built from the source using PlatformIO.

You can choose either to use the current _Stable_ or latest _Development_ version. The Stable versions are typically updated within a few months, or patched when a critical issue is found. The Development versions (with the word `dev` in the filename) are updated more frequently, but may contain bugs. This is recommended for advanced users who want to test out new features. You can switch from Stable to Development at any time via the EMS-ESP Web interface.

### Upgrading from versions prior to v3.7

It is always recommended to upgrade to the latest version of the firmware. If you are upgrading from a version prior to v3.7 (v3.6.4 or v3.6.5) then make a backup of your configuration settings first before upgrading in case the flash process fails. This can be done via the EMS-ESP web interface. If you run into any issues using one of the Flashing methods described above then 'flash erase' the EMS-ESP and start over with a fresh install, and then upload your saved settings. If you are upgrading from v3.7 or later, then you can safely upgrade without needing to backup your configuration settings.

### How the firmware binary files are named

The firmware filename format used is:

`EMS-ESP-<version>-<chipset>-<flashsize>[+].bin`

where `<chipset>` is `ESP32` or `ESP32S3` and `<flashsize>` either `4MB` or `16MB`. The `+` indicates that the firmware is built to use any additional RAM (called PSRAM) if available.

Determine the correct type of your ESP32 device and download the latest stable version of the firmware using the table below. If you're not sure which firmware to use contact us.

| `chipset`  | `flashsize` | `PSRAM` | `Firmware file`                                                                                                                   |
| -------- | --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| ESP32    | 16MB      | 8MB   | [EMS-ESP-3_8_1-ESP32-16MB+.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32-16MB+.bin)     |
| ESP32-S3 | 16MB      | 8MB   | [EMS-ESP-3_8_1-ESP32S3-16MB+.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32S3-16MB+.bin) |
| ESP32    | 4MB       |       | [EMS-ESP-3_8_1-ESP32-4MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32-4MB.bin)         |
| ESP32    | 16MB      |       | [EMS-ESP-3_8_1-ESP32-16MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32-16MB.bin)       |

If using a [BBQKees Electronics Gateway](https://bbqkees-electronics.nl) board, follow this guide to ensure you are select the correct firmware:

| `Model`                 | `Release Year`  | `Has PSRAM?` | `Firmware file`                                                                                                                  |
| --------------------- | ------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Gateway E32 V2        | >01-2024      | Yes        | [EMS-ESP-3_8_1-ESP32-16MB+.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32-16MB+.bin)          |
| Gateway S3(-LR)       | >09-2023      | Yes        | [EMS-ESP-3_8_1-ESP32S3-16MB+.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32S3-16MB+.bin)      |
| Gateway E32 V1.5      | >12-21 &lt;06-23 | No         | [EMS-ESP-3_8_1-ESP32-4MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32-4MB.bin)              |
| Gateway E32 V1.0/V1.4 | >04-21 &lt;12-21 | No         | [EMS-ESP-3_8_1-ESP32-4MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32-4MB.bin)              |
| Gateway S32 V2        | >02-22 &lt;01-23 | No         | [EMS-ESP-3_8_1-ESP32-16MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32-16MB.bin)            |
| Gateway S32 V1        | >02-21 &lt;02-22 | No         | [EMS-ESP-3_8_1-ESP32-4MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32-4MB.bin)              |

## Help needed?

- If you run into issues during the installation process, please refer to the [Troubleshooting](Troubleshooting.md).
- If you're using a BBQKees Electronics EMS gateway board and have connectivity questions, refer to the [EMS Gateway Wiki](https://bbqkees-electronics.nl/wiki/).
- Get in touch with the EMS-ESP community via our [Discord](https://discord.gg/3J3GgnzpyT) channel. This is a good place for asking general questions and chatting with other users. You have better chances to getting fast responses here.
- Search in existing open and closed [GitHub issues](https://github.com/emsesp/EMS-ESP32/issues) and [GitHub discussions](https://github.com/emsesp/EMS-ESP32/discussions) as your issue may already be addressed, perhaps in a later version.
- Create a [Problem Report/Change Request](https://github.com/emsesp/EMS-ESP32/issues/new?template=bug_report.md) on the EMS-ESP project. Do make sure you include the required Support Information so the issue can be addressed as quickly as possible.
- Go to the [Getting Support](Support.md) page for further information.
    