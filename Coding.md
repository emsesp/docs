## Basic Design Principles

- The core services like telnet, logging and shell are based off the libraries from @nomis. I also adopted his general design pattens such as making everything as asynchronous as possible so that no one operation should starve another operation of it's time to execute (https://isocpp.org/wiki/faq/ctors#static-init-order).
- All EMS devices (e.g. boiler, thermostat, solar modules, mixer units etc) are derived from a factory base class and each class handles its own registering of telegram and mqtt handlers. This makes the EMS device code easier to manage and we can extend with new telegrams types and features.

## Testing

The Web can developed and tested in real-time by commenting out the `-D ENABLE_CORS` in `platformio.ini` and then
```sh
cd interface
npm start
```

### Standalone testing

To test and simulate EMS-ESP locally on your PC you can build and run a 'standalone' version that doesn't need an ESP or connection to the EMS bus. Note however this needs GNUMake to work and currently doesn't build natively on Windows10 (unless you use a Windows Linux sub-system, WSL).

```sh
make run
```

Then from the console prompt use `test <test>` to run the simulations, eg. mixer, thermostat, general etc. See `test.cpp` for the scripts.
