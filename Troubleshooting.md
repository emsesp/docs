### Can't connect to the Wifi router

The EMS-ESP is probably in Access Point mode. Look for a wifi SSID `ems-esp`, connect to this and open a browser to 'http://192.168.4.1'. If you have configured a WiFi client your router would have appointed an IP address via DHCP. You should be able to then connect via https://ems-esp or https://ems-esp.local.

### The LED is constantly flashing

A fast pulse of the LED means the system is booting or in installation mode. Connect via the WiFi to its Access Point (ems-esp) to complete the configuration.

A slow pulse means either there is no WiFi connection or EMS-ESP cannot read from the EMS bus. In this case go to the Web interface and try a different Tx Mode setting.

### Not all EMS devices are recognized or capturing data

Experiment with changing the Tx Mode value in the Settings page. The default EMS works for older EMS1.0 systems, EMS2 or EMSPlus systems and HT3 for Junkers/Worcester using the Heatronics protocol.

If you have EMS devices that may not yet be supported by EMS-ESP then use `scan devices` from the Console to find out their details and then post an enhancement issue on GitHub. Remember the `su` password is default `ems-esp-neo` unless this has been changed via the console (`passwd`) or in the Web UI (`Security->Security Settings`).

e.g.

```sh
ems-esp:/$ su
Password:
000+00:01:38.291 N 0: [shell] Admin session opened on console
ems-esp:/# scan devices
000+00:01:41.034 N 1: [emsesp] Unrecognized EMS device (device ID 0x08, product ID 123). Please report on GitHub.
ems-esp:/#
```

If you want to see the EMS data streaming in, use the `watch` command. See [Console](Console?id=monitoring-the-ems-traffic).

### MQTT is not stable

If you're noticing that MQTT messages are failing to arrive at the broker try:

- First make sure you have set the correct `MQTT Format` in the MQTT Settings page in the Web UI
- in Console, set logging to debug (`log debug`), `su` and `publish`. Watch the screen for errors (see "Monitoring the MQTT queues" in the [MQTT](MQTT.md))
- increase the Publish Time. Perhaps there are too many messages and it is flooding the queue
- run a local copy of the MQTT mosquitto broker, in verbose mode (-v) so you see if there are errors on the server side

### Commands via MQTT are not working

Use the Console to manually test the commands, with logging on. For example if changing the thermostat temperature is not working try

```sh
ems-esp:/$ su
ems-esp:/# log debug
ems-esp:/# call thermostat temp 15
```

You should see a log statement pop in the console like `[thermostat] Setting thermostat temperature to 15.0 for heating circuit 1, mode auto` followed by which telegrams are being sent. If you see errors then reach out on Discord or create a GitHub issue to get [Support](Support.md).

### Settings are not saved and lost after restart

Try erasing the ESP (`esptool.py erase_flash`) and [uploading](Uploading-firmware) the firmware again using the command-line with the ESP connected via the USB.

### Showing incorrect values from a specific device

If you notice that certain values are displayed incorrectly, either in the Web UI, Console or MQTT then please help us correct this by logging a GitHub issue, along with the expected value. When asked to provide debug information, go the Telnet console and do

```sh
% su
% log trace
```

and then either a `read` or `watch`, e.g. `read 21 2D8` to show all the data from HC2 on a Mixing MM100.

### Many Rx errors or incomplete telegrams

It is quite usual to see a few warnings in the log about incomplete telegrams. This could be due to interference on the line. The warnings are usually harmless as EMS-ESP will either wait for the next broadcast or keep trying to fetch the telegram. If you're seeing an Rx or Tx quality less than 80% then try:

- powering: try to power ems-esp by usb or service-jack.
- disruptions on the bus (emc, reflections, etc): try to connect ems-esp to another device on the bus. In general a previously unconnected bus-out on a devices like MM100 is better than a split connection on an already used connector.

### Home Assistant is showing errors like "Received message on illegal discovery topic"

This could happen when upgrading from an earlier EMS-ESP version and some of the device entity names may have changed. Use a tool like MQTTExplorer to remove all the `homeassistant` topics in your MQTT broker and restart EMS-ESP.
