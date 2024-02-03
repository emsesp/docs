Below are answers to some common problems.

## General

### Can't connect to the WiFi

The EMS-ESP is probably in Access Point mode. Look for a wifi SSID `ems-esp`, connect to this and open a browser to 'http://192.168.4.1'. If you have configured a WiFi client your router would have appointed an IP address via DHCP. You should be able to then connect via https://ems-esp or https://ems-esp.local.

On boards with Ethernet, Ethernet will be disabled if a WiFi SSID exists. If you want to use Ethernet, set this clear this setting.

### The LED is constantly flashing

A fast pulse of the LED means the system is booting or in installation mode. Connect via the WiFi to its Access Point (`ems-esp`) to complete the configuration.

A slow pulse means either there is no WiFi connection or EMS-ESP cannot read from the EMS bus. In this case go to the Web interface and try a different Tx Mode setting.

See the explanation on [what the LED shows](Configuring#what-the-onboard-led-is-showing-you).

### EMS-ESP often crashes and restarts

A healthy gateway/interface board running EMS-ESP should run happily for long periods without spontaneous restarts so, if yours is restarting by itself at random intervals, then something's not right.

Record how often it crashes and whether there is any relation to activity on the network (e.g. wifi or mqtt reconnecting) or something incoming/outgoing to one of the EMS devices. A good way to spot this is to use Home Assistant or simple MQTT Explorer to watch the system up time.

Things to check:

#### It may be power related

- Power down the gateway and check wiring connections are secure. Check that the ESP32, DC-DC converter and any jumpers on the gateway are securely seated onto their connectors.
- Try powering the gateway from the ESP32's USB socket (check the [wiki](https://bbqkees-electronics.nl/wiki/) for how to do this on your particular gateway model). If the restarts stop, then you've got a problem with the external power source (BUS or service jack) or the DC-DC converter inside the gateway.
- If on WiFi, try reducing the WiFi Tx Power to 10 dBm from the `Network Settings` page and see if that helps.

#### It may be memory related

The ESP32 has very limited RAM, split between run-time stack and the heap. The heap can quickly become fragmented reducing the maximum size of a buffer, and we use A LOT of buffers to prepare all that lovely JSON files for sending to MQTT and populating the Web pages. When the ESP32 runs out of available it'll simply crash and reboot. Things to check:

- If the WebUI is accessible, go to `System->System Status` and look at the Heap. If the Free memory is below 90KB or the Max allocation below 45KB then that may be an issue and you'll need to turn of services, try again and report this. Start by disabling mDNS, OTA and SysLog (if running) one by one and see if that helps.
- Make sure the System Log's Max Buffer Size at `System->System Log` is at its lowest.
- Each network protocol (Ethernet, Wifi, AP) consumes memory. If you're only using Ethernet (e.g. an BBQKees E32 Gateway) switch off WiFi and the Access Point (use a blank WiFI ssid).

#### It could be code related

- Go to `System->System Log` and set the `Log Level` to `INFO`. This will make sure you'll see the restart log at the top next time it restarts. It'll show something similar to `2022-12-30 11:58:02.000    INFO 0:      [emsesp]     Last system reset reason Core0: Software reset CPU, Core1: Software reset CPU`.
- And finally, if none of the above works then the problem is the core processing the incoming telegrams. Try and capture some logs just before it crashes (using SysLog is good for this) and post the information in a new GitHub issue.

### EMS-ESP freezes

If EMS-ESP becomes unresponsive, as in it appears to be active and hasn't restarted itself but accessing either the telnet console, the webUI or simply responding to ping fails then EMS-ESP has gone into a network loop. We have seen this behavior with Mesh'd WiFi Access Points and also unstable MQTT servers, and coded fail-safe's to avoid them. If you do encounter this annoying problem then first try setting a BSSID (only if using WiFi). Otherwise please report it on GitHub along with this additional information:

- the System Info (so we can see version, MQTT config and any errors)
- any signs of LEDs (on the board/gateway) or the Ethernet port if using an E32 Gateway
- description of your network (which vendor, WiFi or Ethernet, etc)
- any anomalies in the network (servers down, Access point roaming, channel switching etc)

## EMS Data and Connectivity

### Not all EMS devices are recognized

Experiment with changing the Tx Mode value in the Settings page. The default EMS works for older EMS1.0 systems, EMS2 or EMSPlus systems and HT3 for Junkers/Worcester using the Heatronics protocol.

If you have EMS devices that may not yet be supported by EMS-ESP then use `scan` or `scan deep` from the Console to find out their details and then post an enhancement issue on GitHub. Remember the `su` password is default `ems-esp-neo` unless this has been changed via the console (`passwd`) or in the WebUI (`Security->Security Settings`). For example:

```sh
ems-esp:$ su
Password:
000+00:01:38.291 N 0: [shell] Admin session opened on console
ems-esp:# scan
000+00:01:41.034 N 1: [emsesp] Unrecognized EMS device (device ID 0x08, product ID 123). Please report on GitHub.
ems-esp:#
```

If you want to see the EMS data streaming in, use the `watch` command. See [Console](Console.md?id=monitoring-the-ems-traffic).

### I'm missing certain data from an EMS device

If data is missing then this is where we need your help to expand our database. Try and locate which telegram could contain the data by making the change on the device (e.g. boiler or thermostat) with EMS-ESP running and looking at the System Log in Trace mode to spot which commands are being sent and what the new values are from incoming telegrams. When you have located the telegram, find the offset and use the `Custom Entities` page in the WebUI to create a new entity which you can test. Pay attention to the Unit of Measure. Then take a screenshot of this screen and post it to a new GitHub issue, along with a suitable 'long' name and a 'short' name which will allow us to quickly implement in.

Note that not all EMS devices allow their data to be published on the EMS bus, for example the smart thermostats like the Nefit Easy and Buderus Easy Control CT200 which only transmits the current room and setpoint temperatures as read-only attributes.

### Many Rx errors

It is quite usual to see a few warnings in the log about incomplete telegrams. This could be due to interference on the line. The warnings are usually harmless as EMS-ESP will either wait for the next broadcast or keep trying to fetch the telegram. If you're seeing an Rx or Tx quality less than 80% then try:

- powering: try to power ems-esp by USB or service-jack. We've seen examples where a noisy or failing DC supply can cause RX Fail or incomplete telegrams and trying USB power (check how to switch to USB powering in the [wiki](https://bbqkees-electronics.nl/wiki/)) can help track this down.
- disruptions on the bus (emc, reflections, etc): try to connect ems-esp to another device on the bus. In general a previously unconnected bus-out on a devices like MM100 is better than a split connection on an already used connector.

### Bus is not connecting

If you're using the EMS wires, on some systems the order is important. Try switching them!

A BBQKees Gateway is DCE, and the ESP32s are DTE so you have to connect TX(esp)-TX(gateway) and RX-RX. TX on the ESP32 is sending data, TX on gateway is the input for sending data to the ems-bus. Note a crossed (nullmodem) connection is only used for DTE-DTE connections.

The most common wiring mistake though is that when people connect the interface board to an ESP32 module, they connect it to the pins marked TX and RX on the ESP32 module. If you're unsure of which pins to use, go to EMS-ESP Settings, select the Interface Board Profile for your board and select 'Custom' to view the default assigned GPIOs.

### Changing a value on an EMS Device doesn't work

If you notice that setting/writing an EMS device value has no effect then from the WebUI set the System Log level to DEBUG and repeat the action, noticing any errors or warnings in the System Log. For a more thorough analysis use the Telnet Console, `su`, then `log debug` and then repeat the action using the `call` command. Post the output to a new GitHub issue as described in the [Support Section](Support).

Note on some systems with for example a gateway or controller attached, any change will be reset or overwritten. This is just the behavior of the other master controllers and not much we can do about it.

### Changing a value works at first, but is then reset to it's original value

It may occur in some scenarios that EMS changes will be overwritten or ignored by another connected EMS device. For example when using `heatingactivated` to turn off the heating. A solution here is to send 0 to `boiler/selflowtemp` every few seconds.

Certain boilers with manual temperature knobs/dials will override any EMS-ESP settings. To change a temperature value via EMS-ESP make sure the value you are sending is less than what the boiler is psychically set to via the dial. The boiler will reset itself to the dialed in value every 2 minutes so use EMS-ESP's Scheduler to reset the temperature value automatically every minute.

### Incorrect values are shown from a specific device

If you notice that certain values are displayed incorrectly, either in the WebUI, Console or MQTT then please help us correct this by logging a GitHub issue, along with the expected value. When asked to provide debug information, go the Telnet console and do

```sh
% su
% log trace
```

and then either a `read` or `watch`, e.g. `read 21 2D8` to show all the data from HC2 on a Mixing MM100.

## Dallas Sensors

### Unusual Dallas sensor readings

If you're seeing unusual Dallas sensor readings (crazy negative temperatures, sudden spikes in readings etc.) check...

- Wiring to the JST connector on the gateway.
- That you're in the right powering mode for your application : parasitic or non-parasitic
- Whether powering from USB fixes the issue (the [wiki](https://bbqkees-electronics.nl/wiki/) explains how to switch to/from USB power for your model of gateway). If it does, this might suggest a problem with power to the gateway from the BUS or service jack connectors.

## MQTT

### Messages are not always coming in via MQTT

If you're noticing that MQTT messages are failing to arrive at the broker try:

- Check the EMS-ESP logs for errors
- Check the broker for errors. You have incorrect credentials or duplicate Client IDs
- Set the log level to Debug (via Web or Console) and monitor the traffic
- Use Console to force a publish to see what happens. (`log debug`, `su` and `publish`).
- Increase the Publish Time. Perhaps there are too many messages and it is flooding the queue
- If all fails, run a local copy of the MQTT mosquitto broker, in verbose mode (-v) so you see if there are errors

  - download the latest version 2 of Mosquitto from `https://mosquitto.org/download/`
  - create a new `mosquitto.conf` file with:

  ```yaml
  listener 1883
  allow_anonymous true
  ```

  (or just edit the default `mosquitto.conf` and modify the `allow_anonymous` entry)

  - run with the -v flag so you see all the verbose messages, e.g. on Windows its:

  ```txt
  "C:\Program Files\mosquitto\mosquitto.exe" -v -c "C:\Program Files\mosquitto\mosquitto.conf"
  ```

### Commands sent via MQTT are not working

Use the Console to manually test the commands, with logging on. For example if changing the thermostat temperature is not working try:

```sh
ems-esp:$ su
ems-esp:# log debug
ems-esp:# call thermostat seltemp 15
```

You should see a log statement pop in the console like `[thermostat] Setting thermostat temperature to 15.0 for heating circuit 1, mode auto` followed by which telegrams are being sent. If you see log errors then create a GitHub issue (see [Support](Support)).

### Integration with Home Assistant breaks when MQTT broker restarts

The integration with Home Assistant uses MQTT Discovery which are 'retained' topics in the MQTT broker. If the MQTT service stops and restarts and the MQTT server is not saving the topics in a database then these messages will obviously be lost and the integration with Home Assistant removed. To solve this add persistance to your MQTT service. For example using Mosquitto a `.conf` file would look like:

```
listener 1883
allow_anonymous true
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
```

To read up more on this visit https://pagefault.blog/2020/02/05/how-to-set-up-persistent-storage-for-mosquitto-mqtt-broker.

An alternative option without using persistance on the MQTT server is to tell EMS-ESP to republish all the Home Assistant MQTT topics. You can do this via the EMS-ESP WebUI from version 3.4 and higher.

## Home Assistant

### HA is showing errors like _"Received message on illegal discovery topic"_ or _"Template variable warning: 'dict object' has no attribute..."_

This could happen when either upgrading from an earlier EMS-ESP version and some of the device entity names may have changed. Use a tool like MQTTExplorer to remove all the `homeassistant/sensor/ems-esp/*` and `homeassistant/*/ems-esp/*` topics from your MQTT broker and restart EMS-ESP.

### HA has duplicate entities, prefixed with \_2

See @swa72's fix [here](https://github.com/swa72/home-assistant/blob/main/README-mqtt.md).

### HA has messed up the names of my entities

This happens, when HA make changes to MQTT Discovery. There's a nice tool called [homeassistant-entity-renamer](https://github.com/saladpanda/homeassistant-entity-renamer) that can help you fix this.

## Specific EMS settings

### Thermostat Date/Time

The correct format for setting the Thermostat time is:

```
< NTP | dd.mm.yyyy-hh:mm:ss-day(0-6)-dst(0/1) >
```

The thermostat needs a setting of day-of-week and daylight-saving. Bosch day-of-week is Mo-0, Su-6, unlike unix-time.

If you have enabled NTP you can just enter "NTP" and the ntp time is set to the thermostat.

With NTP enabled the thermostat clock is also automatically set by EMS-ESP if it differs from the ntp time.
