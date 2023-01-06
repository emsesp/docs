## Basic design principles

- The core services like telnet, logging and shell are based off the libraries from @nomis. I also adopted his general design pattens such as making everything as asynchronous as possible so that no one operation should starve another operation of it's time to execute (<https://isocpp.org/wiki/faq/ctors#static-init-order>).
- All EMS devices (e.g. boiler, thermostat, solar modules, mixer units etc) are derived from a factory base class and each class handles its own registering of telegram and mqtt handlers. This makes the EMS device code easier to manage and we can extend with new telegrams types and features.

## Adding a new language

### Add language XY to WebUI:

- Download the SVG flag from [here](https://gitlab.com/catamphetamine/country-flag-icons/-/tree/master/3x2) and place in `interface/src/i18n`
- Create the folder XY in `interface/src/i18n`
- Copy `interface/src/i18n/en/index.ts` to `interface/src/i18n/XY/index.ts`
- Change in the first and last line `en` to your language and in the first lines `BaseTranslation` to `Translation`
- Edit `interface/src/i18n/XY/index.ts` and replace the English texts by your language
- Edit `interface/src/components/layout/LayoutAuthMenu.tsx` and add the following:

```
import { ReactComponent as XYflag } from '../../i18n/XY.svg';
...
        <MenuItem key="xy" value="xy">
          <XYflag style={{ width: 16, verticalAlign: 'middle' }} />
          &nbsp;XY
        </MenuItem>
```

- Edit `interface/src/SignIn.tsx` and add a button:

```
import { ReactComponent as XYflag } from './i18n/XY.svg';
...
      <Button size="small" variant={locale === 'XY' ? 'contained' : 'outlined'} onClick={() => selectLocale('XY')}>
        <XYflag style={{ width: 24 }} />
        &nbsp;XY
      </Button>
```

- Navigate to the `interface` folder and type `npm run standalone` or `npm run typesafe-i18n` and test the WebUI

### Add language XY to device entities:

- Edit `interface/src/project/SettingsApplication.tsx` and insert in selection box (~ line 345):
  ```ts
  <MenuItem value="xy">NewLanguage (XY)</MenuItem>
  ```
- Edit `src/system.cpp` line 45 and append `EMSESP_LOCALE_XY` to the `languages[]` array
- Edit `src/local_translations.h` and append the defines by adding  
  `#define EMSESP_LOCALE_XY "xy"`
- add your translation as `, "your text"` at the end of each `MAKE_PSTR_LIST()` inside the bracket it should look like this:
  `MAKE_PSTR_LIST(tag, "en", "de", "nl", "se", "pl", "xy")`
- Compile, flash, test

## Testing

### WebUI

The WebUI can be developed and tested in real-time using mock dummy data. This is useful when making changes to the ReactJS files or translation files. First install the libraries in both the `interface` and `mock-api` folders using:

```sh
% cd interface
% npm install
% cd mock-api
% npm install
```

and from the `interface` folder do

```sh
% npm run standalone
```

The URL is `localhost:3000`

The test data is hardcoded in `/mock-api/server.js`

## Core standalone Testing

You can also run EMS-ESP without an ESP32 using what is called the 'standalone' mode by building an OS-native executable which when run will enter into the Console where you use the `test` commands to simulate EMS traffic and watch the MQTT and API commands work.

To build this executable, first make sure you have `gcc` in your system path. You can check by typing `gcc`. If you have PlatformIO then you'll already have the complete GCC toolchain installed via the `PlatformIO Core CLI`. If not you will need to download the GCC toolchain manually using:

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

To compile and build the executable there are two ways

1. Using PlatformIO with `pio run -e standalone -t exec` (recommended)
1. Using GNUMake's `make` with `make run`

You can also build and run directly from Visual Studio Code by `Terminal->Run Task...->PlatformIO: Execute EMS-ESP (standalone)`, and even step through and debug the code in real-time by placing breakpoints.

When inside the Console you can try out the different test commands (coded in `test.cpp`) such as `test general` which will load in a single boiler and a thermostat with a few generic entities. This is great way for trying out new code logic without uploading firmware to an ESP32.

## Keeping the Web libraries up to date

Use an update like `ncu` to keep the package.\* web libraries up to date. You can install using `npm install -g npm-check-updates`. See https://www.npmjs.com/package/npm-check-updates.

```bash
ncu -u
```

## Keeping the code tidy

The web code uses `prettier`. To auto format run `npm run format` from the `interface` folder.

The C++ code use clang. The easiest way to auto format the code is using the VSCode [Format Files](https://marketplace.visualstudio.com/items?itemName=jbockle.jbockle-format-files) extension. Then run the command `Start Format Files: From Glob` and select `src/**` as the glob pattern.
