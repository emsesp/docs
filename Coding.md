## Basic Design Principles

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
  <MenuItem value="xy">NewLangusage (XY)</MenuItem>
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

### Standalone Testing

You can also mimic the ESP32 running EMS-ESP in what we call the 'standalone' mode. This will give you the Telnet console and simulate the EMS bus, MQTT and API.

It works by compiling the code natively (without using PlatformIO) to create a binary executable. However it uses GNUMake's `make` so currently not compatible with Windows10 which uses CCMake. You'll need to use a Linux distribution, or run Windows WSL (Linux sub-system) or Apple's OSX.

To install make use `sudo apt install build-essential make`

From the root directory command line type `make run` to build and run the EMS-ESP exectutable. `make clean` will remove old object files.

Then from the EMS-ESP Console prompt use `test <test>` to run the simulations, eg. mixer, thermostat, general etc. See `test.cpp` for examples of the tests and what data is injected.

## Keeping the Web libraries up to date

Use an update like `ncu` to keep the package.\* web libraries up to date. You can install using `npm install -g npm-check-updates`. See https://www.npmjs.com/package/npm-check-updates.

```bash
ncu -u
```

## Keeping the code tidy

The web code uses `prettier`. To auto format run `npm run format` from the `interface` folder.

The C++ code use clang. The easiest way to auto format the code is using the `Format Files` extension in VScode (https://marketplace.visualstudio.com/items?itemName=jbockle.jbockle-format-files). Then run the command `Start Format Files: From Glob` and select `src/**` as the glob pattern.
