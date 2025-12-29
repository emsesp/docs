# Configuring

## First time setup

The default 'factory' configuration will start an WiFi Access Point called `ems-esp`. Connect to this using the WPA password `ems-esp-neo`. When prompted with a login screen (captive portal) sign-in with the username `admin` and password `admin`. These can be modified later. If you have an Ethernet board then you can connect directly to it's IP address or via `http://ems-esp` or `http://ems-esp.local`.

Now you're ready to further configure the settings. If not connected to your WiFi network, do this first from the Settings->Network page. You can also do this via the the Console when connected to a Serial/USB port and using the commands `set wifi ssid` and `set wifi password`.

If you're seeing warnings that it failed to connect to the EMS bus, or there are Tx or Rx errors then follow the [troubleshooting](Troubleshooting) guide.

:::note If you see 'Rx incomplete telegrams' reported in the log, don't panic. Some telegrams can be missed and this is usually caused by noise interference on the line.
:::

This next section describes some of key settings that can be adjusted via the WebUI, found under the Settings section. Most are self-explanatory so only the important ones are described here.

## Application Settings

### Services

- **Bypass Access Token authorization on API calls**. For RESTful write commands via HTTP POST the access token is required. This is for security reasons to prevent anyone changing device settings. Setting this flag makes the API open. Not recommended!
- **Enable Telnet Console**. This is on by default and allows users to connect to the in-secure Telnet server on port 23.
- **Enable Modbus**. This is off by default and allows users to connect to the Modbus TCP server (default port 502). Due to memory constraints this feature is only available on boards with additional PSRAM.
- **Enable Syslog**:
  - **IP** is the IP address of a syslog server for capturing remote logs. Leave blank is not using SysLog. Note EMS-ESP uses the standard [RFC5424](https://datatracker.ietf.org/doc/html/rfc5424) protocol so make sure your syslog server is setup to process these messages and not for example RFC3164 (BSD Syslog).
  - **Port** if using an alternate port number. The default is 514. And it uses UDP (not TCP).
  - **Log Level** sets the maximum log level for reported messages. The highest level is DEBUG which will send a lot of log data so use with caution.
  - **Mark Interval** will send out a special `mark` message to the SysLog. This is useful for timing events.

### Sensors

- **Enable Analog Sensors**. This enables any GPIO to collect signals, whether it's a digital I/O, a pulse counter or ADC measuring mv. There are many more options available too. Note the `Factor` is a divider.
- **Enable 1-Wire Parasite-Power**. Select this option when using (Dallas) temperature sensors with parasitic power.

### Formatting Options

- **Language**. This sets the language to be used for the EMS Device Entity names, as shown in the WebUI Devices and Dashboard, and also for MQTT Discovery. The default is English. When using Home Assistant, and switching the language you may need to remove the previous EMS-ESP MQTT entries (from HA's Settings->Devices & Services->MQTT) and restart EMS-ESP just to be sure.
- **Boolean Format Dashboard**. This is how boolean values are displayed in the WebUI and MQTT payloads.
- **Boolean Format API/MQTT**. This is how boolean values are written in the MQTT payloads and API JSON output.
- **Enum Format API/MQTT**. This is how list values are presented in the MQTT payloads and API JSON, either by it's value or the index position within the list. Not if using Home Assitant you will not see the values but integer numbers for some entities, e.g. instead of `off, hot, cold` it will display `0, 1, 2`.
- **Convert temperature values to Fahrenheit**. For our US friends.
- **Log EMS telegrams in hexadecimal** will write the telegrams in raw format as hexadecimal values everywhere.

### Hardware Settings

- **Board Profile**. Board Profiles are pre-configured GPIO settings for a set of common ESP32 development boards and EMS Gateway circuits. The following profiles are available:

| profile name | based on board         | led | dallas | rx  | tx  | button | phy_type | eth_power | eth_phy_addr | eth_clock_mode               |
| ------------ | ---------------------- | --- | ------ | --- | --- | ------ | -------- | --------- | ------------ | ---------------------------- |
| S32          | BBQKees Gateway S32    | 2   | 18     | 23  | 5   | 0      |          |           |              |                              |
| E32          | BBQKees Gateway E32    | 2   | 4      | 5   | 17  | 33     | LAN8720  | 16        | 1            | input to GPIO0               |
| E32V2        | BBQKees Gateway E32 V2 | 2   | 14     | 4   | 5   | 34     | LAN8720  | 15        | 0            | output from GPIO0            |
| S32S3        | BBQKees Gateway S3     | 2   | 18     | 5   | 17  | 0      |          |           |              |                              |
| MH-ET        | MH-ET Live D1 Mini     | 2   | 18     | 23  | 5   | 0      |          |           |              |                              |
| NODEMCU      | NodeMCU 32S            | 2   | 18     | 23  | 5   | 0      |          |           |              |                              |
| LOLIN        | Lolin D32              | 2   | 18     | 17  | 16  | 0      |          |           |              |                              |
| OLIMEX       | Olimex ESP32-EVB       | 0   | 0      | 36  | 4   | 34     | LAN8720  | -1        | 0            | input to GPIO0               |
| OLIMEXPOE    | Olimex ESP32-POE       | 0   | 0      | 36  | 4   | 34     | LAN8720  | 12        | 0            | output from GPIO17, inverted |
| C3MINI       | Lolin C3 Mini          | 7   | 1      | 4   | 5   | 9      |          |           |              |                              |
| S2MINI       | Lolin S2 Mini          | 15  | 7      | 11  | 12  | 0      |          |           |              |                              |
| S3MINI       | Liligo S3              | 17  | 18     | 8   | 5   | 0      |          |           |              |                              |

Choosing `Custom` will show the following additional settings to manually configure the GPIOs to match your own board. You can also select `Custom` at any time to display the current board profile settings, without saving.

> **Custom board Settings:**
>
> - **Rx GPIO**. This is the GPIO pin the Rx signal is assigned to. By default this is GPIO 23 but it can be almost any free pin. Connect this GPIO pin to the RX port on the EMS interface board.
> - **Tx GPIO**. This is the GPIO pin the Tx signal is assigned to. By default this is GPIO 5 but it can be almost any free pin. Connect this GPIO pin to the TX port on the EMS interface board.
> - **Button GPIO**. This is the GPIO pin the button is assigned to. It's a pull-up. The button is used for different functions. A single-click does nothing, a double-click will do a WiFi reset and reconnect to the AP, a long-press for 10 seconds and release will perform a factory reset and a very long press for at least 20 seconds without a release will reboot the EMS-ESP to the initial boot partition.
> - **Temperature GPIO**. This is the pin where any external temperature sensors are attached. The Dallas chips DS1822, DS18S20, DS18B20, DS1825 are supported including their parasite varieties and can also be daisy-chained onto a single line, up to 100 sensors.
> - **LED GPIO**. This is the pin for the LED, defaulted to the onboard LED on the ESP dev board.
> - **Eth PHY Type**. This is type of Ethernet chip used.

:::note On ESP32 development boards there are often also pins marked RX and TX. However, these are usually connected to the USB chip and cannot be used for the EMS interface circuit.
:::

- **EMS Tx Mode**. Tx Mode is the mode in which EMS-ESP sends telegrams on the EMS bus. Choose the mode that works best for your system and watch for Tx errors in the Web Dashboard and `show ems` in the Console. Changing the value has immediate effect.
  - `EMS` is the default for EMS1.0 systems but also compatible with most other bus protocols.
  - `EMS+` is designed to work better for EMS2.0/EMS+ systems.
  - `HT3` for Heatronics3 used primarily by Junkers.
  - `Hardware` uses the internal ESP's hardware to send out the telegram. Telegrams are sent immediately. It is the fastest and most efficient method but works only on some systems.
- **EMS Bus ID**. The EMS-ESP can simulate multiple devices. Keep to the default `Service Key (0x0B)` unless using more than one EMS gateways/interface board. It's important to note the Service Key will also be used by certified service/maintenance engineers when servicing your heating systems so make sure you power-down EMS-ESP before they arrive or they will not be able to connect to the EMS bus.
- **Enable Read only mode**. This disables any outgoing Tx write commands to the EMS bus, essentially putting EMS-ESP into listening mode. However Tx is needed to detect EMS devices (as it sends out a Version command). If you want to explicitly put EMS-ESP into a read-only/sniffer mode use `set tx_mode 0` from the console.
- **Hide LED**. Turns off the LED when in normal operating mode. The LED is still shown when booting or when there are connection issues.
- **Underclock CPU speed**. Under-clocks the ESP to 160Mhz, saving on power, heat and prolonging the lifespan of the chip at the cost of performance and response time. A reboot of EMS-ESP is required.

### Special Functions

- **Developer Mode** will enable advanced features in the WebUI, like the Read command from the System Log.
- **Start boiler with forced heating off**.
- **Disable remote on missing room temperature**. This is a safety feature to prevent the boiler from starting when the simulated room temperature sensor is missing or not working.
- **Enable Shower Timer**. Enable to time how long the hot water runs for and it will send out an MQTT message with the duration. The timer starts after a minimal of 2 minutes running time.
- **Enable Shower Alert**. This is somewhat experimental and may not work on all boilers. After 7 minutes (configurable) running the hot water it will send out a warning by sending cold water for 10 seconds (also configurable). The boiler goes into test mode to perform this operation so use with caution!

## Network Setup

The Network page allows you to connect EMS-ESP to your home network. You can choose between WiFi and Ethernet if the hardware board support this. Note WiFi must be 2.4GHz/WPA2. It will not connect to a 5GHz WifFi access point.

### CORS (Cross-Origin Resource Sharing)

CORS, when enabled adds new HTTP headers to each Web request to allow the Web API to make `fetch` and `XMLHttpRequest` requests across different domains. It disables the pre-flight check which follows the same-origin policy by default. See [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) for more details. There is also a "CORS unblock" browser addon that works the same way.

Enable this function when running in VPNs or you have other servers (like Grafana) running on other domains that are making calls to EMS-ESP's API.

## MQTT Setup

- **Broker Address**. Use the IP address, not a FQDN.
- **Port**. The default is 1883 and 8883 for SSL.
- **Base**. All topics are prefixed with the `Base` so this is important. Make sure this is unique when using more than one EMS-ESP with the same broker.
- **Client ID**. This is used internally to identify EMS-ESP with the broker and is optional. Note MQTT topics will be postfixed with the hostname (default `ems-esp`) and not the client ID. Use when having multiple devices.
- **Username** and **Password** are optional but recommended for security. By default Mosquitto MQTT broker requires a username/password so pay attention if using the Home Assistant Add-On here.
- **Set Clean Session**. Creates a non-persistent session when enabled. Default and recommended setting is disabled to keep it disabled when using home automation systems.
- **QoS**. Quality of Service, 0, 1 or 2. 0 is the default and suitable for more scenarios. A value of 1 will give a guarantee that the message has been sent, but will create slightly more network traffic and overhead.
- **Always set Retain Flag**. Enable if you want to persist all the messages on the MQTT broker. Default is disabled.
- **Formatting**. The `Nested` option will group all the device data into a single MQTT topic by using embedded JSON objects such as `dhw` in `boiler_data`, `hc1` in `thermostat_data` etc. `As individual topics` will split this into separate MQTT topics without grouping, so MQTT topics will become `boiler_data` and `boiler_data_dhw`, `thermostat_data` and `thermostat_data_hc1` and so on. The same applies to the Analog and Temperature sensors. The default is nested.
- **Publish command output to a 'response' topic'**. This takes the output from an API command and publishes the result in a topic called `response`.
- **Publish single value topics on change**. This option will immediately publish the topic and payload for each operation and only available when MQTT Discovery is disabled.
- **Enable MQTT Discovery** enables the integration using MQTT Discovery, fully supported with Home Assistant and partially with Domoticz.
  - **Discovery type**. Choose between "Home Assistant" and two protocols for "Domoticz". `Domoticz (latest)` will use Numbers, Switches, Select and other modern types, while `Domoticz` will just use Sensors for everything and also remove any templating conditions.
  - **Entity ID format**: There are 3 options. The first `single instance, long names` uses the older < v3.5 format. The default and recommended setting for all new installs is the 2nd option called `Single instance, short name` which uses the EMS-ESP device entity name, which is fixed and can be seen in the `Settings->Customization` page. The last option must be used when running more than one version of the EMS-ESP firmware as it makes each unique by prefixing all MQTT topics with the base name.
- **Publish Intervals**. This section is per device and sets how frequent an MQTT message is sent. When set to 0 EMS-ESP will send data automatically when there is a noticeable change, which could be within a few seconds.

## NTP Setup

- The default **NTP Server** is `time.google.com`. This can be changed to a local NTP server or a specific one, such as `pool.ntp.org`.
- The default **Time Zone** is "Europe/Amsterdam". This can be changed to any of the [IANA Time Zone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) time zones.

## Managing Users and Roles

The Security page allows you to change the default password for the captive portal and Telnet CLI. It also allows you to enable HTTPS for the captive portal and MQTT broker.

The Users page allows you to create additional users for the captive portal and Telnet CLI. The default user is `admin` with password `admin`.

Each user has an unique Access Token (viewable by clicking on the key icon) which is used for RESTful write commands via HTTP POST. This is for security reasons to prevent anyone changing device settings.

![Web](/_media/screenshot/web_users.png)

## Adding Analog and Temperature Sensors

External sensors, like temperature and analog sensors can be attached to a range of GPIO pins on the ESP32 chip. If using a BBQKees Gateway board it already has an external plug for Dallas temperature sensors which will be visible in the WebUI without any additional configuration.

To add analog sensors click on `Add` and choose between a normal Digital in/out, a Counter (counting on/off pulses), ADC for measuring voltages, Timer, Rate and PWM 0-2. Note, the counter value is persisted and not reset on reboot.

![Web](/_media/screenshot/web_sensor.png)

:::warning
Be careful when picking a GPIO so it doesn't clash with the other used GPIOs (you can select CUSTOM board profile to view your current configuration).

    EMS-ESP is connected to the low voltage bus of your heating and any over-voltage can damage the EMS-ESP board and possible your heating devices. Never power external equipment from the EMS-ESP board directly.

    ESP32 development boards vary in their available pin configuration. Typically you can't use 1, 6-11, 12, 14, 15, 20, 24, 28-31 and 40+. See these links [here](https://diyprojects.io/esp32-how-to-use-gpio-digital-io-arduino-code/#.YFpVEq9KhjG) and [here](https://nodemcu.readthedocs.io/en/dev-esp32/modules/gpio/).

:::

The following GPIOs are recommended:

- digital output: `13, 19, 21, 22, 27, 33, 37, 38`
- digital input/counter/timer/rate: `13, 19, 21, 22, 25, 26, 27, 33, 35, 37, 38, 39 (note no pullup on 35 & 39)`
- ADC input: `13, 19, 21, 22, 25, 26, 27, 33, 35, 37, 38, 39`
- DAC output: `25, 26`
- PWM output: `13, 19, 21, 22, 25, 26, 27, 33, 37, 38`

Limits:

- ADC: max. input 3.3V, reads as milliVolts
- DAC 8bit, value range 0..255 for 0V-3.3V output, Configure as `Digital out` on gpio 25 or 26 (ESP32), 17, 18 (ESP32S2), not available for ESP32S3, ESP32C3
- PWM 0-2: max frequency 5000Hz, resolution 13bits. Each channel can only be used for one gpio.
- Pulse is a digital output for a single pulse with setable length. Setting to `on` by command, the sensor goes to `off` after the pulse is completed.
- Counter/timer/rate trigger: `high->low edge with 15 ms debounce. Only for low pulse rates < 30Hz.`
- Counter 0-2, Frequ 0-2: high speed inputs for 1 Hz to 100kHz signals, no debounce, use RC-filter for noisy signals. Interrupt driven, each channel can only be used for one gpio.

Counters are stored on reboot/update and every hour to nvs. I case of crashes, power cuts, the value may be lower after.

### Controlling Relay's

A common use case is to control a relay to switch on/off a device. This can be done by adding a digital output sensor and then creating a command to control it. The command can be added to the dashboard and scheduled to turn on/off at specific times.

Create an Analog Sensor with type 'Digital Out'.

The professional way is to use a separate relay board with opto-isolation and a flyback diode. The relay board is then powered by a separate power supply and the relay is connected to the digital output of the EMS-ESP as described above. The relay board is then connected to the device you want to control. This way the device is completely isolated from the EMS-ESP and the relay board can handle the higher voltage and current.

## Customizing Entities

The Customization page shows all registered entities and allows to exclude commands and values from publishing via MQTT/API or remove them from WebUI pages. The Devices and Dashboard only show entities with value while the Customization module will show all of them. If an entity has no value then it is supported by EMS-ESP, but not by your boiler/thermostat/etc and will not be published or visible to any integrations like Home Assistant.

![Web](/_media/screenshot/web_customizations.png)

## Scheduling Actions

Use the scheduler to call commands at specific intervals. A few examples:

- set the hot water temperature to a higher value in the morning and evening
- do a periodic system restart each week (although you shouldn't need to!) using `system/restart` in the Command field
- send a message to the log and mqtt using the Command `system/message`
- use in combination with a custom 'ram' entity to fetch data via another API like `{"url":"http://server.tld/path/file", "key":"nameofkey"}` and using this as a condition in the scheduler
- send data to an external API, via a RESTful HTTP POST command, for example `{"url":"http://192.168.0.100/cm?cmnd=power"} == {"power":"off"}`
- use to call a Home Assistant script or service when a condition is triggered, e.g. `{ "url":"http://<ha ip>/api/services/script/my_script", "header":{"authorization":"Bearer <ha key>", "Content-Type":"application/json"} }`

:::warning Using HTTPS in scheduler commands
HTTPS is only supported on the ESP32 and ESP32-S3 variants with PSRAM when using with `url` to an external endpoint. The https will fall back to using http and may report an error.
:::

When creating a scheduler entry, the `name` is optional but it's useful to assign a name and then you can control it via a command (enable/disable) and see the status in the MQTT topic `scheduler_data`.

![Web](/_media/screenshot/web_scheduler.png)

The scheduler can also be used to periodically set values based on another entity value, or even a user-defined custom entity (variable). For example to set the flow temperature of the boiler every minute based on a user managed entity which is controlled externally (e.g. in Home Assistant) it would look like:

![Web](/_media/screenshot/web_scheduler_custom.png)
![Web](/_media/screenshot/web_scheduler_flowtemp.png)

### Conditions

Introduced in **version 3.7**, the Scheduler has been extended to support conditional statements and formulas that can be used in the `Command` and/or `Value` fields for Timer, On Change and Condition types.

Conditions have a strict syntax (see below) and are evaluated every 10 seconds. The condition is only executed when the condition changes from false to true. This is powerful new feature and allows, for example, to set a schedule based on a condition or set a value based on a condition.

Pay attention to the following rules:

- a condition has to be a logic value `0` or `1`, the condition is `true` only for `1`, an arithmetic result `1` is also interpreted as `true`
  schedule command executed for `3 > 2, 3 - 2`
  schedule command not executed for `3 < 2`, `3 + 2`
- spaces are not needed, but makes the formula more readable
- EMS-ESP values are accessed `<device>/<entity>` or `<device>/<entity>/value`. The `<entity>` may contain additional prefixes like `<hc2>`.
- The user's Boolean Format (`0/1`, `off/on`, `OFF/ON`, or `false/true`) and Enum Format (value/index) Settings are used when evaluating bool and enums. Check the right value before setting a schedule by querying the API directly. For example go to `http://ems-esp.local/api/thermostat` to see if building is "medium", then create the rule with `thermostat/building == medium`.
- strings containing special characters have to be quoted. e.g. `boiler/pumpmode == "delta-P2"`, to avoid a calculation error on delta minus P2.
- all strings are converted to lowercase (before v3.7.2)
- commands followed by a divider (`/`) have to be set in parenthesis e.g. `(boiler/seltemp)/2`
- condition command is only executed on a change of the condition from `false` to `true`. If the condition stays true, the command is not repeated
- a command Value can also be a formula
- allowed operations:
  - arithmetic: `+` `-` `*` `/` `%`
  - functions: `round` `abs` `int` `exp` `log` `sqrt` `pow`, `hex`
  - logic: `==` `!=` `<=` `>=` `<` `>` `&&` `||`
  - prefix: `!` (not) and `-` (negation)
  - conditional operations: `<cond1> ? <expr1> : <expr2>` Examples:
    - (allowed before v3.7.2) `<cond> ? 5 + <expr1> : 5 + <expr2>`
    - (allowed since v3.7.2) `5 + (<cond> ? <expr1> : <expr2>)` and cascaded conditions `<cond1> ? <cond2> ? <expr1> : <expr2> : <cond3> ? <expr3> : <expr4>`

An On Change trigger is a list of entities using the format `<device>/<entity>`, for example `boiler/outdoortemp custom/setpoint`.
As entities never change at the same time using logical operations here like `&&` aren't useful. Note, using `system` as the `<device>` is not supported.

![Web](/_media/screenshot/web_conditions_1.png)

![Web](/_media/screenshot/web_conditions_2.png)

### Web Commands

Sending or getting data via web request can be used in a json command:

- GET a value from webserver:
  `{"url":"http://server.tld/path/file"}`
- GET a json value from webserver and select the key:
  `{"url":"http://server.tld/path/file", "key":"nameofkey"}`
- set a value with POST:
  Command: `{"url":"http://server.tld/path/file", "header":{"content-type":"text/plain", "token":"mytoken"}`
  Value: the post message, if it is a json the content-type header is set in header, no need to set it.

Examples:

- getting power state of a tasmota plug example:
  `{"url":"http://192.168.0.100/cm?cmnd=power", "key":"power"} == off`
  is identical to
  `{"url":"http://192.168.0.100/cm?cmnd=power"} == {"power":"off"}`
- setting a tasmoto plug:
  `{"url":"http://192.168.0.100/cm?cmnd=power%20on"}`

### Notification

With web commands a service like [pushover](https://pushover.net) can be used to send a push-message on events. To send different message create a custom entity in RAM named `message`, or what ever you like. Create a schedule On Change triggering the change of this message and sending the pushover message.

![grafik](https://github.com/user-attachments/assets/570576b5-b382-4ab2-bff3-4468291334a3)

Now you can create other schedules with the command `custom/message` and use individual text as data.

## Adding Custom Entities

Custom Entities is an advanced and powerful way to extend EMS-ESP by adding your own EMS entities that extracts data from a specific EMS telegram. This is useful when EMS-ESP doesn't yet support a specific entity, or when you want to extract data from a telegram that is not yet supported. Another common use case is for debugging or watching specific behavior when changing parameters on an EMS device.

For example, a modern Heat Pump may have new features that are not included in EMS-ESP. Here you would use the `watch` command to view the incoming EMS traffic in combination with manual adjusting specific parameters and when you have located the specific telegram and the offset, create a Custom Entity to fine-tune the type and verify the the value. Then request it to be included in the next EMS-ESP release update.

![Web](/_media/screenshot/web_customentities.png)
