## **Basic Design Principles**

- The core services like telnet, logging and shell are based off the libraries from @nomis. I also adopted his general design pattens such as making everything as asynchronous as possible so that no one operation should starve another operation of it's time to execute (https://isocpp.org/wiki/faq/ctors#static-init-order).
- All EMS devices (e.g. boiler, thermostat, solar modules, mixing units etc) are derived from a factory base class and each class handles its own registering of telegram and mqtt handlers. This makes the EMS device code easier to manage and we can extend with new telegrams types and features.
- For debugging there is an offline mode where the code can be compiled and executed standalone without uploading to an ESP controller. Use `make` (based off GNUMakefile).

## Testing

The Web can developed and tested in real-time by commenting out the `-D ENABLE_CORS` in `platformio.ini` and then
```sh
cd interface
npm start
```

To test the core, standalone without an ESP use the makefile:

```sh
make run
```
