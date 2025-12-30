---
id: Building
---
# Building the firmware

### Prerequisites

It is assumed you have a basic understanding of coding and building software for microcontrollers using git and using PlatformIO.

To start, you will need the following software packages installed. Alternatively you can use a [Devcontainer](https://containers.dev/) (see below):

- [PlatformIO](https://platformio.org/)
- [Node.js](https://nodejs.org)
- pnpm (`corepack use pnpm@latest-10` on linux or `winget install -e --id pnpm.pnpm` on windows). See [pnpm installation](https://pnpm.io/installation)

Visual Studio Code is recommended as the IDE to use with PlatformIO.

Special notes for Windows users:

- on Windows 10 you will need to enable UTF-8 from the Regional Settings, for compiling the Slovakian translations.

PlatformIO's default targets are used specifically by the GitHub CI (Continuous Integration) process to to build firmware binaries for various ESP32 boards. These targets start with 'ci\_' as seen in the `platformio.ini` file and should not be used. If you see the error "fatal error: WWWData.h: No such file or directory" then you are using the wrong target. For local builds create a `pio_local.ini` file (an example file is provided) and choose the target board you want to build for. You can also set additional flags here such as DEBUG for additional debug information or TEST to load the unit tests. You can also choose how to upload the firmware, via USB or OTA.

## Testing locally

### WebUI

The WebUI can be developed and tested in real-time using mock dummy data. This is useful when making changes to the Web UI, testing translations or watching the behaviour when test data changes.

Build the mock API data service:

```sh
% cd mock-api
% pnpm install
```

and then from the `interface` folder run:

```sh
% pnpm standalone
```

Make sure you have the latest version of node installed. You need at least 18.20 and can check with `node -v`. An easy way to switch between different node versions is to use [nvm](https://github.com/nvm-sh/nvm).

This will open a browser window with URL `http://localhost:3000`.

The mock data used is all hardcoded in the file `/mock-api/restServer.ts`.

### Simulating offline, without an ESP32 microcontroller

You can also run EMS-ESP without an ESP32 (which we call 'standalone'). The PlatformIO environment has two `native` type environments that will build `emsesp` executables compatible with Linux, Windows and Max OSX.

On **Linux/OSX** (including Windows' `WSL2`) simply run: `pio run -e standalone -t exec`

On **Windows**, it's a little trickier because of the EMS-ESP console needs Winsock for the key input, the easiest way is to install [Msys2](https://www.msys2.org) onto your windows machine, followed by installing the GNU g++ compiler straight after with `run pacman -S mingw-w64-ucrt-x86_64-gcc`. This is only needed once. From then on, you can run the `pio` command to build the Windows .exe executabled with `pio run -e standalone` and launch it in a Msys terminal, like:

`C:/msys64/msys2_shell.cmd -defterm -here -no-start -ucrt64 -c <source location>/.pio/build/standalone/program.exe`

Use the `test` command to run tests. `test general` is a generic test that will setup a standard boiler and thermostat with all its default entities.

All the tests are hardcoded in the file `test/test.cpp` and can be easily adapted.

There are also a set of Unit Tests which can be run from the pio environment as well with `pio run -e native-test -t exec`. This works natively on every platform and doesn't require any additional setup.

### Debugging

To debug from Visual Studio Code and step through the code, peek at variables, put in breakpoints etc. First build the executable using the `make` method above which will place the .o object files in a `build` folder, and then invoke the debugger (F5 on Windows).

You can also create a VSC's task in `launch.json` file to automate this for you, like adding:

```json
    ...
    {
      "name": "Debug ems-esp standalone",
      "type": "cppdbg",
      "request": "launch",
      "program": "${workspaceFolder}/emsesp",
      "cwd": "${workspaceFolder}",
      "environment": [],
      "miDebuggerPath": "/usr/bin/gdb",
      "MIMode": "gdb",
      "launchCompleteCommand": "exec-run",
      ]
    }
    ...
```

### WSL (building a Linux environment on Windows)

I recently had to rebuild my Linux WSL on Windows from scratch to build EMS-ESP I thought I'd share the steps I took to get it working.

Create a new WSL2 environment. Note a WSL2 instance can take up to 8GB RAM so first make sure your PC can handle it.

- `wsl.exe -l -v` to view any current installations.
- `wsl.exe --list --online` to view available installations.
- `wsl.exe -d <dist>` to start the distro. If in doubt use `Ubuntu-24.04` as it is the latest LTS.
- `lsb_release -a` after it's installed to check the version.
- `do-release-upgrade` (optional) to upgrade to the latest version. I upgraded to 24.10. You may need to set "Prompt=normal" in the `/etc/update-manager/release-upgrades` file.
- `wsl.exe --setdefault <dist name>` to make this installation the default one. You can use `wsl.exe --terminate <dist name>` to remove any old ones.

Go into the WSL instance (`wsl`) and setup the following:

- `sudo apt install unzip make g++ python3-venv nodejs curl zsh`
- `sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"` (optional) to install zsh
- `npm install -g npm-check-updates` for the ncu command
- `curl -fsSL https://bun.sh/install | bash` for the mock-api

To usb USB install [usbipd](https://github.com/dorssel/usbipd-win/releases) from an DOS Admin command window. In that window you can use `usbipd list` to find the COM port and then for example `usbipd bind -b 1-6` and `usbipd attach -w -b 1-6` to attach it to the WSL instance. This will give you a `/dev/ttyUSB0` or `/dev/ttyACM0` device.

Run Visual Studio Code on your Windows environment and click "Connect to WSL" to connect to the WSL instance. You can then use the WSL terminal to build the firmware. You'll find building and compiling EMS-ESP will be 2-3 times faster than on Windows.

### Using a devcontainer for development

You can use the devcontainer locally or spin up a codespace on github.

When using the devcontainer and running the standalone UI you have to run the standalone-devcontainer script instead of the default standalone one. Otherwise your vite port wont be accessible from your machine.

```sh
% pnpm standalone-devcontainer
```

#### Codespace

Click "Code" and the "Create codespace on dev" to start a codespace that you can use for developing without having to install anything locally.

![Codespace start](/media/screenshot/codespace_start.jpg)

### The partition structure

| Name       | Type       | SubType  | Offset        | Size               | Notes                           | File                            |
|------------|------------|----------|---------------|--------------------|---------------------------------|---------------------------------|
| bootloader |            |          | 0x0000/0x1000 | 0x8000   (32 KB)   | ESP32-S3=0x1000, ESP32=0x1000   | bootloader*.bin                 |
| partitions |            |          | 0x8000        | 0x1000   (4 KB)    | same for each board             | partitions*.bin                 |
| -          |            |          |               |                    |                                 |                                 |
| nvs        | data       | nvs      | 0x9000        | 0x5000   (20 KB)   | reserved for ESP32              |                                 |
| otadata    | data       | ota      | 0xE000        | 0x2000   (8 KB)    | same for each board             | boot_app0*.bin                  |
| boot       | app        | factory  | 0x10000       | 0x480000 (4.5 MB)  | default boot partition          | EMS-ESP firmware *.bin/loader   |
| app0       | app        | ota_0    | 0x290000      | 0x490000 (4.56 MB) | OTA cycle 1                     | EMS-ESP firmware *.bin          |
| app1       | app        | ota_1    | 0x510000      | 0x490000 (4.56 MB) | OTA cycle 2                     | EMS-ESP firmware *.bin          |
| nvs1       | data       | nvs      | 0xAA0000      | 0x040000 (256 KB)  | custom for EMS-ESP              | (generated by script)           |
| spiffs     | data       | spiffs   | 0xAA0000      | 0x200000 (2 MB)    | for LittleFS/EMS-ESP filesystem | (not used)                      |
| coredump   | data       | coredump | 0xCE0000      | 0x010000 (64 KB)   |                                 |                                 |

- Reference: [ESP-IDF Partition Tables](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/partition-tables.html)
- There are 3 places where the EMS-ESP firmware is stored:
  - `boot` is the default used on fresh installs.
  - `app0` and `app1` are the firmware partitions used during OTA updates, and cycles between the two. The firmware is loaded into one of these non-active partitions, and then the device is rebooted.
- The bootloader (called second stage) is the `bootloader_dio_80m.bin` executable and is used to read the partition table at offset 0x8000 and determine which partitions are available. Note the bootloader's offset is different per chip type. ESP32 is [0x1000](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-guides/bootloader.html#bootloader) and ESP32-S3 is [0x0000](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/bootloader.html#bootloader). This is handled in our script `upload.sh` for each Model type in the parameter `bootloader_address`.
- The partition `otadata` is used to hold a small application used to determine which partition (boot, app0, app1) to use. It will query the data stored in `partitions` block.
- EMS-ESP can be restarted to other partitions using the command `restart <boot|app0|app1>`.
- The EMS-ESP Console/API command `show system` will show the current partition and the partition that will be booted after a restart.
- With all the board/chip types, the `boot_app0.bin` and `partitions.bin` are the same file for each board. Only the `bootloader.bin` is different. But we keep local copies to keep things tidy in a single folder.
