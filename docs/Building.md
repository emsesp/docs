### Prerequisites

You will need the following installed before you can get started:

- [PlatformIO](https://platformio.org/)
- [Node.js](https://nodejs.org)
- [yarn](https://yarnpkg.com/getting-started/install)

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
% yarn run standalone
```

Make sure you have the latest version of node installed. You need at least 18.20 and can check with `node -v`. An easy way to switch between different node versions is to use [nvm](https://github.com/nvm-sh/nvm).

This will open a browser window with URL `localhost:3000`.

The mock data used is all hardcoded in `/mock-api/server.js`.

### Simulating without an ESP32

You can also run EMS-ESP without an ESP32 using what we call 'standalone'. This will create a native executable that can be run on Windows/Linux/Mac and simulates the EMS-ESP's console. This is ideal for quickly testing and debugging without constantly having to flash an ESP32.

Use the `test` command to run tests (e.g. MQTT or API) and simulate incoming EMS data.

There are two methods for building the executable, either via PlatformIO or using the associated makefile. In both case you will need the gcc compiler installed. Instructions for installing gcc can be found on <https://docs.platformio.org/en/latest/platforms/native.html>.

Note there are issues compiling the code on Windows so it's recommended to use WSL2 or a Linux VM.

Using the PlatformIO direct method, run this command:

```sh
% pio run -e standalone
```

This is the same as selecting `standalone->General->Build` from the Visual Studio PlatformIO menu.

If you prefer to use the Makefile run:

```sh
% make run
```

which will create an executable called `emsesp`.

The EMS-ESP console will show and from here you can try out the different `test` commands. `test general` which will load in a single boiler and a thermostat with a few generic entities.

All the tests are hardcoded in the file `test.cpp` and can be easily adapted.

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
