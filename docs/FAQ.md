# FAQ

## How to Factory Reset EMS-ESP?

If you have a GPIO Button configured (enabled by default on all BBQKees boards) pressing this for 10 seconds and releasing will perform a factory reset. EMS-ESP will restart in Access Point mode.

## What is an EMS Telegrams?

_Written by @MichaelDvP in [this article](https://github.com/emsesp/EMS-ESP32/discussions/1612#discussioncomment-8408868):_

Best overview of known telegrams is from [Norberts1](https://github.com/norberts1/hometop_HT3/blob/master/HT3/docu/HT_EMS_Bus_messages.pdf) and the [EMS-Wiki](https://emswiki.thefischer.net/doku.php). In general we can say:

- measurement values are broadcasted periodical 10 sec / 1 min
- settings are only broadcasted after a change
- changing a setting of a device via the UI of thermostat results in a message thermostat -w-> device with only this value
- some devices broadcast fast changing values as single values
- measured temperatures are normally 2 bytes (SHORT) with factor 0.1 (e.g. 01 23 -> 0x0123 -> dez 291 -> 29.1°C)
- air temperature settings are often factor 0.5 as single byte (INT) (e.g. 0x2D -> dez 45 -> 22.5°C)
- water temperature settings are typically single byte (UINT) (e.g. 0x3C -> 60°C), differential values (hysteresis in Kelvin) are signed (INT)
- percent settings are single byte (UINT) (0x64 -> 100%)
- on/off states or settings can be single byte with on/off 0xFF/0x00, or 0x01/0x00 or a single bit in a byte together with 7 other states
- times and energy is typically 3 or 4 bytes with or without factor

For different brands/devices Bosch sometimes use different expressions for the same value, Maybe changing developers or they like to make reverse engineering difficult!

If you search a setting, log the telegrams for the device (log all or watch &lt;device-id&gt;) and change the setting on the thermostat to different states/values. Then search for these values in the log. If you search for a measurement, log the device and view the value on the thermostat and wait for changes, note old/new values and time. Then check the log for this time stamp (or 10 sec / 1 min later) and the value within a telegram. Best to have more changes/values to be sure.

## Can EMS-ESP simulate a Thermostat?

Partially. As the folks over at [OpenTherm Gateway (OTGW)](https://otgw.tclcode.com/standalone.html#intro) nicely put it:

:::quote Why use a Thermostat?

    - The thermostat manufacturers have spent years of research to work out the heating characteristics for the most efficient and comfortable way to heat a house.
    - The thermostat provides a control interface that people are familiar with, so other members of the household are still able to adjust the setpoint.
    - It provides convenient housing for the room temperature sensor, which is needed unless you use a heating curve based solely on the outside temperature.

:::

As **MichaelDvP** points out _"a thermostat is a clever electronic device. You can put in the desired room temperature and it calculates from some parameters and measurements the required flowtemp for this room temperature and sends it to the boiler. This happens in a control loop and is updated often."_

And **mtc716** said _"A thermostat creates a heat curve that is constantly adapted to the surrounding temperatures and used to estimate which water temperature is necessary in order to bring the room temperature up. There are some good articles in the net about how to setup the heat curve correctly. The main parameters you need are "design temp" which is the heating water temp at minimal outside temp. Furthermore you need the "comfort temp" like explained before and the "temp offset" which causes a parallel shift in the heating curve."_

Additionally, As **MichaelDvP** says "If you want to build a software controlled thermostat, you can use different methods:"

- outdoortemperature controlled:
  define a heatingcurve for your building. This is a linear interpolation between a minimum outdoortemp for your region (typical-11°C for middle europe) with max flowtemp (designtemp ~76°C for radiators, 40°C for floor) and the actual room setpoint (e.g. 21°C) for outdoor and flowtemp. You can add an offset.
  selflowtemp = offset + setpoint + (designtemp- setpoint) \* (setpoint - outdoortemp) / (setpoint - minoutdoor)
- room controlled, switched:
  measure the roomtemperature and switch the boiler with heatingoff enabled for roomtemp > setpoint. To avoid many switching add a hysteresis
- room controlled, dynamic
  Here you need to calculate a PID control. A bit out of scope for the ems-esp scheduler. But maybe possible. With HA you can check Implementing a smart thermostat (using SAT). See [#2103](https://github.com/emsesp/EMS-ESP32/issues/2103)
- controlled by smart TRVs:
  If you can read the opening of the TRVs make a simple I-Control. If a TRV is fully open: increase flowtemp, if the most open TRV is below 90% opening: decrease flowtemp. Heating is a slow process, so increase/decrease carefully.

For further reading, check out these discussions:

- [Smart control a heating system with HA?](https://github.com/emsesp/EMS-ESP32/discussions/965)
- [Thermostat emulation](https://github.com/emsesp/EMS-ESP32/issues/151)
- [Changing the boiler heating directly](tips-and-tricks#controlling-the-boiler-heating)
- [Implementing a smart thermostat (using SAT)](https://github.com/emsesp/EMS-ESP32/issues/2103)

## What are Bus protocols and Tx modes?

Protocol and timing are different things, you pick the tx-mode that works best.

HT3 is the Junkers electronic and HT3 protocol is the same as EMS, only in first byte (sender) the highest bit is set. Each telegram we send starts with 0B in a Buderus system, but with 8B in Junkers. This makes the devices of the different brands incompatible. EMS-ESP checks the bus on start and select the right protocol automatically. Also Junkers uses different telegram numbers/orders. Bosch labeled modules uses the same telegram numbers as Buderus, but addressing like Junkers, so also incompatible. You can't connect Junkers or Buderus modules to a Bosch heating system.

Tx-mode is the send timing: The client devices send by current modulation, the master by voltage modulation. This allows full duplex (Hardware mode), but depending on line impedance drawing current also influences the voltage. When sending, the master repeats every byte sent by the device to publish it to the other devices. With a Tx-mode of "EMS" we wait for the master byte before sending the next. The older Junkers seems to have a lower timeout so we need to start the next byte before the master echo is completed ("HT3"). "EMS+" is less critical and we can wait a bit longer than one byte to allow voltage to be stabilized after the sending.

## Can you run multiple instances of EMS-ESP?

Yes you can. Keep in mind the following settings:

- (Settings->MQTT Settings) MQTT `Entity ID format` is set to "Multiple instances, short name"
- (Settings->MQTT Settings) MQTT `Client ID` must be unique to avoid conflicts in the MQTT broker
- (Settings->MQTT Settings) MQTT `Base` is unique (just be sure). Usually set this to the hostname.
- (Settings->Network Settings) `Hostname` is unique, to avoid network conflicts
- (Settings->Application Settings) `EMS BUS ID` are different (not both 0x0B)

## Why do EMS telegram's in `raw watch` mode have a type 0x100 higher then in `raw` mode?

See [this discussion](https://github.com/emsesp/EMS-ESP32/discussions/2025)
