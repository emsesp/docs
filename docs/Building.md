### Prerequisites

You will need the following installed before you can get started:

- [PlatformIO](https://platformio.org/)
- [Node.js](https://nodejs.org)
- [yarn](https://yarnpkg.com/getting-started/install)

Note: on Windows 10 you will need to enable UTF-8 from the Regional Settings, to compile the Slovakian translation.

Note: on some Windows system you may also need to run `corepack enable` for yarn, as mention in the link above.

It is assumed you are familiar with coding, git and using PlatformIO to build firmware binaries.

The included `platformio.ini` file will build the firmware for an 4M ESP32 board as its default target, including the Web frontend. If you want to customize the build create a `pio_local.ini` file (there is an example file included). This is useful if you want to upload to a specific port or compile the code with DEBUG flags or change to a different ESP32 platform like an S3.

We recommend using Visual Studio Code to build the firmware with the PlatformIO extension installed.

## Testing locally

### WebUI

The WebUI can be developed and tested in real-time using mock dummy data. This is useful when making changes to the web content files or translation files. To install or update the packages do:

```sh
% cd interface
% yarn
% cd mock-api
% yarn
```

and then from the `interface` folder run:

```sh
% yarn standalone
```

Make sure you have the latest version of node installed. You need at least 18.20 and can check with `node -v`. An easy way to switch between different node versions is to use [nvm](https://github.com/nvm-sh/nvm).

This will open a browser window with URL `localhost:3000`.

The mock data used is all hardcoded in `/mock-api/rest_server.js`.

### Simulating offline, without an ESP32 microcontroller

You can also run EMS-ESP without an ESP32 (which we call 'standalone'). The platformIO environment has two `native` environments that will build emsesp executables to support this for all Linux, Windows and Max OSX.

On **Linux** (including `WSL` in Windows), in VSCode start a "PlatformIO Core CLI" terminal and simply run: `pio run -e native -t exec
`

On **Windows**, because of the EMS-ESP console needs Winsock for the key input, the easiest way is to install [Msys2](https://www.msys2.org) onto your windows machine, followed by installing the GNU g++ compiler straight after with `run pacman -S mingw-w64-ucrt-x86_64-gcc`. This is only needed once. From then on, you can run the `pio` command to build the Windows .exe executabled with `pio run -e native` and launch it in a Msys terminal, like:

`C:/msys64/msys2_shell.cmd -defterm -here -no-start -ucrt64 -c <source location>/.pio/build/native/program.exe`

Use the `test` command to run tests. `test general` is a generic test that will setup a standard boiler and thermostat with default entities.

All the tests are hardcoded in the file `test.cpp` and can be easily adapted.

There are also a set of Unit Tests which can be run from the pio environment with `pio run -e native-test -t exec`. This works natively on every platform and doesn't require any additional setup.

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

#### WSL

if you need to remove any old ones use `wsl.exe --terminate <dist>`

```sh
wsl.exe --setdefault <new dist>
wsl -l -v
```

#### Setup Linux under WSL

```sh
sudo apt install unzip
sudo apt install make
sudo apt install g++
sudo apt install python3-venv
sudo apt install nodejs
sudo apt install curl
```

#### USB on WSL

This is so the USB port is available within VS code.

install <https://github.com/dorssel/usbipd-win/releases>

from Administrator Powershell:

```cmd
usbipd list (to find COM port)
usbipd bind -b 1-6
usbipd attach -w -b 1-6
```

in WSL:

you should see `/dev/ttyUSB0`

install PlatformIO rules following <https://docs.platformio.org/en/latest/core/installation/udev-rules.html> to stop the warnings when firmware uploading.

#### nvm (npm version manager)

```sh
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

yarn (disable report backs)
yarn config set --home enableTelemetry 0

ncu (to check for package updates)
npm install -g npm-check-updates
ncu -p yarn
```

#### bun

This is needed for standalone testing.

```sh
curl -fsSL https://bun.sh/install | bash
```

#### zsh

This is my preferred shell. I extend with Oh-My-zsh and the Powerlevel10k theme.

```sh
sudo apt install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

#### Visual Studio Code

Use vscode on Windows, connect to the `WSL`. First time install all extensions and restart. If you have the settings saved and sync'd it should be very quick.
