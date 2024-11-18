
### Prerequisites

It is assumed you have a basic understanding of coding and building software for microcontrollers using git and using PlatformIO.

To start, you will need the following software packages installed:

- [PlatformIO](https://platformio.org/)
- [Node.js](https://nodejs.org)
- [yarn](https://yarnpkg.com/getting-started/install)

Visual Studio Code is recommended as the IDE to use with PlatformIO.

Special notes for Windows users:

- on Windows 10 you will need to enable UTF-8 from the Regional Settings, for compiling the Slovakian translations.
- on some Windows system you may also need to run `corepack enable` before installing `yarn`. Seen the link above.

PlatformIO's default targets are used specifically by the GitHub CI (Continuous Integration) process to to build firmware binaries for various ESP32 boards. These targets start with 'ci_' as seen in the `platformio.ini` file and should not be used. If you see the error "fatal error: WWWData.h: No such file or directory" then you are using the wrong target. For local builds create a `pio_local.ini` file (an example file is provided) and choose the target board you want to build for. You can also set additional flags here such as DEBUG for additional debug information or TEST to load the unit tests. You can also choose how to upload the firmware, via USB or OTA.

## Testing locally

### WebUI

The WebUI can be developed and tested in real-time using mock dummy data. This is useful when making changes to the Web UI, testing translations or watching the behaviour when test data changes.

Build the mock API data service:

```sh
% cd mock-api
% yarn
```

and then from the `interface` folder run:

```sh
% yarn standalone
```

Make sure you have the latest version of node installed. You need at least 18.20 and can check with `node -v`. An easy way to switch between different node versions is to use [nvm](https://github.com/nvm-sh/nvm).

This will open a browser window with URL `http://localhost:3000`.

The mock data used is all hardcoded in the file `/mock-api/rest_server.js`.

### Simulating offline, without an ESP32 microcontroller

You can also run EMS-ESP without an ESP32 (which we call 'standalone'). The PlatformIO environment has two `native` environments that will build `emsesp` executables compatible with Linux, Windows and Max OSX.

On **Linux/OSX** (including Windows' `WSL2`) simply run: `pio run -e native -t exec`

On **Windows**, it's a little trickier because of the EMS-ESP console needs Winsock for the key input, the easiest way is to install [Msys2](https://www.msys2.org) onto your windows machine, followed by installing the GNU g++ compiler straight after with `run pacman -S mingw-w64-ucrt-x86_64-gcc`. This is only needed once. From then on, you can run the `pio` command to build the Windows .exe executabled with `pio run -e native` and launch it in a Msys terminal, like:

`C:/msys64/msys2_shell.cmd -defterm -here -no-start -ucrt64 -c <source location>/.pio/build/native/program.exe`

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
- `yarn set version stable` in both `interface` and `mock-api` folders to get the latest Yarn version. Also here, do a `yarn config set --home enableTelemetry 0` to stop yarn spying on you.

To usb USB install <https://github.com/dorssel/usbipd-win/releases> from an DOS Admin command window. In that window you can use `usbipd list` to find the COM port and then for example `usbipd bind -b 1-6` and `usbipd attach -w -b 1-6` to attach it to the WSL instance. This will give you a `/dev/ttyUSB0` or `/dev/ttyACM0` device.

Run Visual Studio Code on your Windows environment and click "Connect to WSL" to connect to the WSL instance. You can then use the WSL terminal to build the firmware. You'll find building and compiling EMS-ESP will be 2-3 times faster than on Windows.
