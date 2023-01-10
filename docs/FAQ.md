## How to Hardware Reset

If you have a GPIO Button configured (enabled by default on all BBQKees boards) pressing this has different actions:

- _single press_: does nothing
- _double press_: re-connects the WiFi
- _hold for 10 seconds_: performs a factory reset. EMS-ESP will restart in Access Point mode

## Can EMS-ESP simulate a Thermostat?

No, but in theory it could.

As **MichaelDvP** points out _"a thermostat is a clever electronic device. You can put in the desired room temperature and it calculates from some parameters and measurements the required flowtemp for this room temperature and sends it to the boiler. This happens in a control loop and is updated often."_

And **mtc716** said _"A thermostat creates a heat curve that is constantly adapted to the surrounding temperatures and used to estimate which water temperature is necessary in order to bring the room temperature up. There are some good articles in the net about how to setup the heat curve correctly. The main parameters you need are "design temp" which is the heating water temp at minimal outside temp. Furthermore you need the "comfort temp" like explained before and the "temp offset" which causes a parallel shift in the heating curve."_

See [Smart control a heating system with HA?](https://github.com/emsesp/EMS-ESP32/issues/144)
and [thermostat emulation](https://github.com/emsesp/EMS-ESP32/issues/151).
