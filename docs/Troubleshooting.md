---
id: Troubleshooting
---
# Troubleshooting

Below are responses to some common problems.

## Firmware Installation issues

### Unable to upload via the Web interface

When uploading the firmware via the Web interface and you see the error "Invalid file extension or incompatible bin file", check that you are using the correct firmware binary file that matches your board and ESP32 chip set. If that is correct, it may be because the firmware is too large for the boot partition, which could be the case when moving from 3.6.5 to 3.7.0 in certain situations. The solution is to use one of the flash tools.

### Web Interface shows old data or errors in browser after an update

This is caused by the browser caching the old files. To fix this, clear the browser cache and reload the page. CTRL-R or CMD-R or F5 on most browsers.

### EMS-ESP fails to connect to a hidden WiFi network

There is known issue with some WiFi routers (e.g. Unifi) that hidden networks are not supported with the ESP32. Try to connect to the network using the BSSID name (sometimes the MAC address of the Access Point).

## Stability

### EMS-ESP can not connect to the WiFi

The EMS-ESP is probably in Access Point mode. Look for a wifi SSID `ems-esp`, connect to this and open a browser to 'http://192.168.4.1'. If you have configured a WiFi client your router would have appointed an IP address via DHCP. You should be able to then connect via https://ems-esp or https://ems-esp.local.

On boards with Ethernet, Ethernet will be disabled if a WiFi SSID exists. If you want to use Ethernet, set this clear this setting.

### The LED is constantly flashing

A fast pulse of the LED means the system is booting or in installation mode. Connect via the WiFi to its Access Point (`ems-esp`) to complete the configuration.

A slow pulse means either there is no WiFi connection or EMS-ESP cannot read from the EMS bus. In this case go to the Web interface and try a different Tx Mode setting.

See further details on that the LED flashes mean in the [Getting Started](Getting-Started.md) section.

### EMS-ESP often restarts

A healthy gateway/interface board running EMS-ESP should run happily for long periods without spontaneous restarts so, if yours is restarting by itself at random intervals, then something's not right.

Record how often it crashes and whether there is any relation to activity on the network (e.g. wifi or mqtt reconnecting) or something incoming/outgoing to one of the EMS devices. A good way to spot this is to use Home Assistant or simple MQTT Explorer to watch the system up time.

Things to check:

#### It may be power related

- Power down the gateway and check wiring connections are secure. Check that the ESP32, DC-DC converter and any jumpers on the gateway are securely seated onto their connectors.
- Try powering the gateway from the ESP32's USB socket (check the [wiki](https://bbqkees-electronics.nl/wiki/) for how to do this on your particular gateway model). If the restarts stop, then you've got a problem with the external power source (BUS or service jack) or the DC-DC converter inside the gateway.
- If on WiFi, try reducing the WiFi Tx Power to 10 dBm from the `Network Settings` page and see if that helps.

#### It may be memory related

The ESP32 has very limited RAM, split between run-time stack and the heap. The heap can quickly become fragmented reducing the maximum size of a buffer, and we use A LOT of buffers to prepare all that lovely JSON files for sending to MQTT and populating the Web pages. When the ESP32 runs out of available it will simply restart itself. Things to check:

- If the WebUI is accessible, go to `Status->Hardware` and look at the Heap. If the Free memory is below 90KB or the Max allocation below 45KB then that may be an issue and you'll need to turn off services, try again and report this. Start by disabling mDNS and SysLog (if running) one by one and see if that helps.
- Make sure the System Log's Max Buffer Size at `Status->System Log` is at its lowest (25).
- Each network protocol (Ethernet, Wifi, AP) consumes memory. If you're only using Ethernet (e.g. an BBQKees E32 Gateway) switch off WiFi and the Access Point (use a blank WiFI ssid).
- If you have many EMS entities use the Customizations page and set any unused entities (shown by having a blank value) to "remove from memory".

#### It could be code related

- Go to `Status->System Log` and set the `Log Level` to `INFO`. This will make sure you'll see the restart log at the top next time it restarts. It'll show something similar to `2022-12-30 11:58:02.000    INFO 0:      [emsesp]     Last system reset reason Core0: Software reset CPU, Core1: Software reset CPU`.
- And finally, if none of the above works then the problem is the core processing the incoming telegrams. Try and capture some logs just before it crashes (using SysLog is good for this) and post the information in a new GitHub issue.

### EMS-ESP becomes unresponsive

If the EMS-ESP becomes unresponsive and you cannot access the WebUI, follow these steps:

- Check your network router to see if ems-esp is still active. If you're running a Mesh of WiFi Access Points it may have been roamed to a new location or switched WiFi channels. The work-around for this is to set a BSSID in EMS-ESP (WiFI only).
- Look at the on-board LED, if you haven't disabled it. If the LED is flashing or solid it means EMS-ESP is still running.
- Next check the EMS-ESP services. Can you Telnet to port 25 to access the Console? Are MQTT messages still being sent, if enabled?
- If you're using the Ethernet port, do you see the LED on the port flashing showing traffic in and out?
- If EMS-ESP has restarted itself check the system logs for the Reset Reason. It will be one of the first messages. See above.
- Attach the board to a computer via USB, without restarting on powering down EMS-ESP and access the Serial console to see if there are any errors.
- Lastly, log a GitHub issue with the Support Info and details of your setup.

### You forgot the admin password

If you forgot the admin password, you can reset it via the Console using the `set admin password` command.

```sh
ems-esp:$ su
ems-esp:# set admin password
```

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

If data is missing then this is where we need your help to expand our database. Try and locate which telegram could contain the data by making the change on the device (e.g. boiler or thermostat) with EMS-ESP running and looking at the System Log in Trace mode to spot which commands are being sent and what the new values are from incoming telegrams.

When you have located the telegram, find the offset and use the `Custom Entities` page in the WebUI to create a new entity which you can then test. Pay attention to the Unit of Measure. Then take a screenshot of this screen and post it to a new GitHub issue, along with a suitable 'long' name and a 'short' name in English and your native language, which will allow us to quickly implement it in the code.

Note that not all EMS devices allow their data to be published on the EMS bus, for example the smart thermostats like the Nefit Easy and Buderus Easy Control CT200 which only transmits the current room and setpoint temperatures as read-only attributes.

See this article on [Decoding EMS Telegrams](FAQ.md?id=decoding-ems-telegrams) for more information.

### Many Rx errors

It is quite usual to see a few warnings in the log about incomplete telegrams. This could be due to interference on the line, inadequate power or a wrong Tx Mode. The warnings are usually harmless as EMS-ESP will either wait for the next broadcast or keep trying to fetch the telegram. If you're seeing an Rx quality less than 80% then try:

- a different Tx Mode, for example switch between EMS+ and EMS.
- powering the EMS-ESP by USB or service-jack. We've seen examples where a noisy or failing DC supply can cause RX Fail or incomplete telegrams and trying USB power (check how to switch to USB powering in the [BBQKees wiki](https://bbqkees-electronics.nl/wiki/)) can help track this down.
- removing disruptions on the bus line from emc, reflections, other units. Connect the EMS-ESP to another device on the bus. In general a previously unconnected bus-out on a devices like MM100 is better than a split connection on an already used connector.

### EMS Bus is not connecting

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

## Temperature Sensors

### Unusual sensor readings

If you're seeing unusual Dallas sensor readings (crazy negative temperatures, sudden spikes in readings etc.) check the following:

- Wiring to the JST connector on the gateway.
- That you're in the right powering mode for your application : parasitic or non-parasitic
- Whether powering from USB fixes the issue (the [wiki](https://bbqkees-electronics.nl/wiki/) explains how to switch to/from USB power for your model of gateway). If it does, this might suggest a problem with power to the gateway from the BUS or service jack connectors.

## MQTT

### Messages are not always coming in via MQTT

If you're noticing that MQTT messages are failing to arrive at the MQTT broker/server try:

- Check the EMS-ESP logs for errors. If you see "low memory" errors then read [It may be memory related](Troubleshooting.md?id=general#it-may-be-memory-related) to see how you reduce memory usage
- Check the MQTT broker for errors. You may have incorrect credentials or duplicate Client IDs causing a connection conflict
- Set the EMS-ESP System log level to ALL (via Web or Console) and monitor the traffic
- Use the Telnet Console to force a publish to see what happens. (`log debug`, `su` and `publish`)
- Increase the Publish Time. Perhaps there are too many messages and it is flooding the queue
- If it still fails, run a local copy of the MQTT mosquitto broker and monitor the output like:
  - download the latest version of Mosquitto from `https://mosquitto.org/download/`
  - create a new `mosquitto.conf` file or update an existing with just:

  ```yaml
  listener 1883
  allow_anonymous true
  ```

  - run with the -v flag so you see all the verbose messages, e.g. on Windows its:

  ```txt
  "C:\Program Files\mosquitto\mosquitto.exe" -v -c "C:\Program Files\mosquitto\mosquitto.conf"
  ```

  Note, running with allow_anonymous true is not recommended for production environments.

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
allow_anonymous false
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
```

To read up more on this visit [this article](https://pagefault.blog/2020/02/05/how-to-set-up-persistent-storage-for-mosquitto-mqtt-broker).

An alternative option without using persistance on the MQTT server is to tell EMS-ESP to republish all the Home Assistant MQTT topics. You can do this via the EMS-ESP WebUI from version 3.4 and higher.

## Home Assistant

### HA is showing errors like _"Received message on illegal discovery topic"_ or _"Template variable warning: 'dict object' has no attribute..."_

This could happen when either upgrading from an earlier EMS-ESP version and some of the device entity names may have changed. Use a tool like MQTTExplorer to remove all the `homeassistant/sensor/ems-esp/*` and `homeassistant/*/ems-esp/*` topics from your MQTT broker and restart EMS-ESP.

### HA has duplicate entities, prefixed with \_2

See swa72's fix [here](https://github.com/swa72/home-assistant/blob/main/README-mqtt.md).

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

Pay attention to whether or not you want to enable daylight-saving time. This should be consistent with the setting on your thermostat.
