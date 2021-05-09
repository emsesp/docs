## First-time configuration

- After powering up the ESP, watch the onboard blue LED. A solid light means good connection and EMS data is coming in. A slow pulse means either the WiFi or the EMS bus is not connected yet. A very fast pulse is when the system is booting up and configuring itself which typically takes 5 seconds.

- Connect to the Access Point called `ems-esp` using the WPA password `ems-esp-neo`. When you see the captive portal sign-in with username `admin` and password `admin`. Set the WiFi credentials and go back to <http://ems-esp>. Remember to change the passwords!

- First thing to check is if Tx is working and that you have a connection to the EMS bus. If Tx fails are shown in the Web interface try changing the Tx Mode from the settings page. There is no need to re-start the EMS-ESP.

- If Rx incomplete telegrams are reported in the Web interface, don't panic. Some telegrams can be missed and this is usually caused by noise interference on the line.

> [!TIP]
> If you have an EMS Gateway board also follow the instructions on [BBQKees' Wiki](https://bbqkees-electronics.nl/wiki/)

## Adding external temperature sensors

EMS-ESP supports auto-detection of Dallas type temperature sensors. The default GPIO pin used on the ESP8266 is D5 but this can be configured via the Web UI. The Dallas chips DS1822, DS18S20, DS18B20, DS1825 are supported including their parasite varieties and can also be daisy-chained onto a single line, up to 100 sensors.

## Settings

### System Settings

Use the Web UI (<http://ems-esp>) to further configure the settings. In the `Settings` section you'll find:

#### EMS Bus

- **Tx Mode**. Choose the mode that works best for your system and watch for Tx errors in the Web Dashboard and `show ems` in the Console. Changing the value has immediate effect.
  - `0 - Off` disables sending on ems-bus.
  - `1 - Default` is default for EMS1.0 systems but also compatible with most other protocols.
  - `2 - EMS+` is designed to work better for EMS2.0/EMS+ systems.
  - `3 - HT3` for Heatronics3 used by Junkers and Bosch.
  - `4 - Hardware` uses ESP hardware to send out the ems-telegram, the software do not have to wait for the telegram to be send out. It is the fastest and most efficient methode, but works only on some systems.
- **Bus ID**. The EMS-ESP can simulate one of 5 devices. Stick to the `Service Key (0x0B)` unless using multiple EMS gateways or interfaces.
- **Rx GPIO pin** - Which pin the Rx is assigned to. On an ESP8266 this has to be 3 or 13. The default is 13 (D7 on a Wemos). On an ESP32 it can be any pin.
- **Tx GPIO pin** - Which pin the Tx is assigned to. On an ESP8266 this has to be 1 (for rx:3) or 15 (for rx:13). The default is 15 (D8 on a Wemos). On an ESP32 it can be any pin.
- **Tx delayed start** - Setting 30-60 seconds avoids conflicts with KM200 web interface after boiler-power-on.

#### External Button

- **Button gpio pin**. (v3 only) Set a pin with pullup for emergency reset to factory settings. Default is pin 0 (boot-button on some esp32 boards). In v2 the pin is not configurable and fixed to gpio 0.

#### Dallas Sensor

- **Dallas GPIO pin**. This is the pin where any external temperature sensors are attached.
- **Dallas Parasite Mode**. Select this option when using sensors with parasitic power.

#### LED

- **LED GPIO pin**. This is the pin for the LED, defaulted to the onboard LED on the ESP dev board.
- **Invert/Hide LED**. Select this if you want to disable the LED during normal operation or if your ESP board has it's HIGH and LOW inverted.

#### Shower

- **Shower Timer**. Enable to time how long the hot water runs for and it will send out an MQTT message with the duration. The timer starts after a minimal of 2 minutes running time.
- **Shower Alert**. When enabled and the shower runs for longer than a set time (currently fixed at 6 minutes) it will send 3 short shots of cold water to notify the person. This feature is somewhat experimental.

#### Syslog

- **Syslog IP** is the IP address of a syslog server for capturing remote logs. Leave blank is not using SysLog.
- **Syslog Port** if using a alternate port (default 514)
- **Syslog Log Level** sets the maximum log level for reported messages. The highest level is DEBUG which will send a lot of log data so use with caution.
- **Syslog Mark Interval** will send out a special `mark` message to the SysLog, useful for timing events.

### MQTT Settings

These settings can be found in the `MQTT` tab on the Web UI.

- **Client ID**. This is used internally to identify EMS-ESP with the broker. Note MQTT topics will be postfixed with the hostname (default `ems-esp`), not this client ID.
- **Base**. All topics are prefixed with `Base`, which is defaulted to `ems-esp` and can be changed to an individual path.
- **Clean Session**. Creates a non-persistent session when enabled.
- **MQTT Format**. v2: The `Single` option will send all data as separate topics, `Nested` will group the data into one JSON payload string and `Home Assistant` will use MQTT Discovery (if available). v3: options are resorted with checkboxes for `Nested` and `Home Assistant`.
- **QoS**. Quality of Service, 0, 1 or 2. 0 is the default and suitable for more scenarios. 1 will give a guarantee that the message has been sent, but will create slightly more traffic and overhead.
- **Retain Flag**. Default is off. Enable if you want to persist all the messages on the broker.
- **Publish Intervals**. This section is per device and sets how frequent an MQTT message with the update data is to be sent. When set to 0 EMS-ESP will send data when there is a noticeable change.

### API

- **Enable Web API**. When set EMS-ESP will allow write commands via the RESTful api. When disabled only read operations are allowed (e.g. `ems-esp/api?device=boiler&cmd=info`).
- **Boolean Format**. Set's how booleans are rendered in MQTT and in the Console. Setting `1/0` also effects enumerated parameters, e.g. `off/on/auto` -`0/1/2`

### Analog Input

- **Enable ADC**. This enables analog GPIO (A0) on the ESP for attaching analog sensors, value is in mV and published in heartbeat every minute.
