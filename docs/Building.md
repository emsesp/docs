### Prerequisites

You will need the following installed before you can get started:

- [PlatformIO](https://platformio.org/) - For building the firmware
- [Node.js](https://nodejs.org) - For building the web interface
- The `yarn` package installed via `npm install -g yarn`

It is assumed you are familiar with coding, git and using platformio to build firmware binaries.

The included `platformio.ini` file will build the firmware for an 4M ESP32 board as its default target, including the Web frontend. If you want to customize the build create a `pio_local.ini` file (there is an example file included). This is useful if you want to upload to a specific port or compile the code with DEBUG flags or change to a different ESP32 platform like an S3.

We recommend using Visual Studio Code to build the firmware with the PlatformIO extension installed.

## Testing locally

### WebUI

The WebUI can be developed and tested in real-time using mock dummy data. This is useful when making changes to the web content files or translation files. To install the packages it only needs do be done once using:

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

to build the web interface and launch a browser window with URL `localhost:3000`

The test data is hardcoded and can be changed in `/mock-api/server.js`

### Simulating without an ESP32

You can also run EMS-ESP without an ESP32 using what is called the 'standalone' mode by building an OS-native executable which when run will enter into the Console where you use the `test` commands to simulate EMS traffic and watch the MQTT and API commands work.

To compile and build the executable there are two ways which are described in detail below

1. Using PlatformIO with `pio run -e standalone -t exec` (recommended)
2. Using GNUMake's `make` with `make run`

When you're all setup simply run the executable which take you to the EMS-ESP console and from here you can try out the different test commands such as `test general` which will load in a single boiler and a thermostat with a few generic entities. This is great way for trying out new code logic without uploading firmware to an ESP32.

All the tests are coded in the file `test.cpp`.

#### Using PlatformIO

Simply from Visual Studio Code with PlatformIO installed select `standalone->General->Build` from the extension menu. You can also choose to run it within the pio environment by first going into the `PlatformIO Core CLI` and typing `pio run -e standalone -t exec`.

For debugging you can also run the task via `Terminal->Run Task...->PlatformIO: Execute EMS-ESP (standalone)` and step through and debug the code in real-time by placing breakpoints.

#### Building natively using gcc

EMS-ESP comes with GNU Makefile. You will need the GNU tools like gcc and GNUMake for these. First make sure you have `gcc` in your system path. You can check by typing `gcc`. If you have PlatformIO then you'll already have the complete GCC toolchain installed via the `PlatformIO Core CLI`. If not you will need to download the GCC toolchain manually using:

- **Windows** - follow the [MSYS2](https://www.msys2.org/) installation guide and add the following paths to the PATH system environment variable:

  ```bat
  C:\msys64\mingw64\bin
  C:\msys64\ucrt64\bin
  C:\msys64\usr\bin
  ```

- **Linux** - open the system terminal and run the following commands:

  ```sh
  sudo apt install build-essential
  ```

- **macOS** - open the system terminal and install Xcode Command Line Tools

  ```sh
  xcode-select --install
  ```
