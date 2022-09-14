## Basic Design Principles

- The core services like telnet, logging and shell are based off the libraries from @nomis. I also adopted his general design pattens such as making everything as asynchronous as possible so that no one operation should starve another operation of it's time to execute (<https://isocpp.org/wiki/faq/ctors#static-init-order>).
- All EMS devices (e.g. boiler, thermostat, solar modules, mixer units etc) are derived from a factory base class and each class handles its own registering of telegram and mqtt handlers. This makes the EMS device code easier to manage and we can extend with new telegrams types and features.

## Adding a new language

### Add language XY to web:

- Download flag from https://gitlab.com/catamphetamine/country-flag-icons/-/tree/master/3x2 and put in `interface/src/i18n`
- Create folder XY in `interface/src/i18n`
- Copy `interface/src/i18n/en/index.ts` to `interface/src/i18n/XY/index.ts`
- Edit `interface/src/i18n/XY/index.ts` and replace the english texts by your language.
- Edit `interface/src/components/layout/LayoutAuthMenu.tsx` and add:
```
import { ReactComponent as XYflag } from '../../i18n/XY.svg';
...
        <MenuItem key="xy" value="xy">
          <XYflag style={{ width: 16, verticalAlign: 'middle' }} />
          &nbsp;XY
        </MenuItem>
```
- open commandline in `interface` folder and type `npm run standalone` or `npm run typesafe-i18n`

### Add language XY to entities:
- Edit `interface/src/project/SettingsApplication.tsx` and insert in selection box (~ line 345):
`            <MenuItem value="xy">NewLangusage (XY)</MenuItem>`
- Edit `src/system.cpp` line 45 and append `EMSESP_LOCALE_XY` to languages[] 
- Edit `src/local_translations.h` and append the defines by  
`#define EMSESP_LOCALE_XY "xy"`
- add your translation as `, F("your text")` at the end of each `MAKE_PSTR_LIST()` inside the bracket it should look like this:
`MAKE_PSTR_LIST(tag, F("en"), F("de"), F("nl"), F("se"), F("pl"), F("xy"))`
- Compile, flash


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

### Standalone testing

You can also mimic the ESP32 running EMS-ESP in what we call the 'standalone' mode. This will give you the Telnet console and simulate the EMS bus, MQTT and API.

It works by compiling the code natively (without using PlatformIO) to create a binary executable. However it uses GNUMake's `make` so currently not compatible with Windows10 which uses CCMake. You'll need to use a Linux distribution, or run Windows WSL (Linux sub-system) or Apple's OSX.

From the root directory run:

```sh
make run
```

Then from the EMS-ESP Console prompt use `test <test>` to run the simulations, eg. mixer, thermostat, general etc. See `test.cpp` for examples of the tests and what data is injected.
