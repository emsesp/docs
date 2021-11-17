## General

### Can't connect to the WiFi

The EMS-ESP is probably in Access Point mode. Look for a wifi SSID `ems-esp`, connect to this and open a browser to 'http://192.168.4.1'. If you have configured a WiFi client your router would have appointed an IP address via DHCP. You should be able to then connect via https://ems-esp or https://ems-esp.local.

### The LED is constantly flashing

A fast pulse of the LED means the system is booting or in installation mode. Connect via the WiFi to its Access Point (ems-esp) to complete the configuration.

A slow pulse means either there is no WiFi connection or EMS-ESP cannot read from the EMS bus. In this case go to the Web interface and try a different Tx Mode setting.

### Settings are not saved and lost after restart

Try erasing the ESP (`esptool.py erase_flash`) and [uploading](Uploading-firmware) the firmware again using the command-line with the ESP connected via the USB.

## EMS Connectivity

### Not all EMS devices are recognized or data is missing

Experiment with changing the Tx Mode value in the Settings page. The default EMS works for older EMS1.0 systems, EMS2 or EMSPlus systems and HT3 for Junkers/Worcester using the Heatronics protocol.

If you have EMS devices that may not yet be supported by EMS-ESP then use `scan devices` from the Console to find out their details and then post an enhancement issue on GitHub. Remember the `su` password is default `ems-esp-neo` unless this has been changed via the console (`passwd`) or in the Web UI (`Security->Security Settings`).

e.g.

```
ems-esp:$ su
Password:
000+00:01:38.291 N 0: [shell] Admin session opened on console
ems-esp:# scan devices
000+00:01:41.034 N 1: [emsesp] Unrecognized EMS device (device ID 0x08, product ID 123). Please report on GitHub.
ems-esp:#
```

If you want to see the EMS data streaming in, use the `watch` command. See [Console](Console?id=monitoring-the-ems-traffic).

### Many Rx errors

It is quite usual to see a few warnings in the log about incomplete telegrams. This could be due to interference on the line. The warnings are usually harmless as EMS-ESP will either wait for the next broadcast or keep trying to fetch the telegram. If you're seeing an Rx or Tx quality less than 80% then try:

- powering: try to power ems-esp by USB or service-jack. We've seen examples where a noisy or failing DC supply can cause RX Fail or incomplete telegrams and trying USB power (check how to switch to USB powering in the [wiki](https://bbqkees-electronics.nl/wiki/)) can help track this down.
- disruptions on the bus (emc, reflections, etc): try to connect ems-esp to another device on the bus. In general a previously unconnected bus-out on a devices like MM100 is better than a split connection on an already used connector.

### Frequent Restarts

A healthy gateway board running EMS-ESP should run happily for long periods without spontaneous restarts so, if yours is restarting by itself at random intervals, then something's not right. Things to check...

- Power down the gateway and check wiring connections are secure. Check that the ESP32, DC-DC converter and any jumpers on the gateway securely seated onto their connectors.
- Try powering the gateway from the ESP32's USB socket (check the [wiki](https://bbqkees-electronics.nl/wiki/) for how to do this on your particular gateway model). If the restarts stop, then you've got a problem with the external power source (BUS or service jack) or the DC-DC converter inside the gateway.
- Firmware and settings are loaded OK. Re-flashing the firmware and resetting the config might help. Make a note of the settings first if you can

### Changing a value on an EMS Device doesn't work

If you notice that setting/writing an EMS device value has no effect then from the WebUI set the System Log level to DEBUG and repeat the action, noticing any errors or warnings in the System Log. For a more thorough analysis use the Telnet Console, `su`, then `log debug` and then repeat the action using the `call` command. Post the output to a new GitHub issue, making sure you state which version of EMS-ESP you are using.

Note on some systems with for example a gateway or controller attached, any change will be reset or overwritten. This is just the behaviour of the other master controllers and not much we can do about it.

### Incorrect values are shown from a specific device

If you notice that certain values are displayed incorrectly, either in the Web UI, Console or MQTT then please help us correct this by logging a GitHub issue, along with the expected value. When asked to provide debug information, go the Telnet console and do

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

### MQTT is not stable

If you're noticing that MQTT messages are failing to arrive at the broker try:

- First make sure you have set the correct `MQTT Format` in the MQTT Settings page in the Web UI
- in Console, set logging to debug (`log debug`), `su` and `publish`. Watch the screen for errors (see "Monitoring the MQTT queues" in the [MQTT](MQTT.md))
- increase the Publish Time. Perhaps there are too many messages and it is flooding the queue
- run a local copy of the MQTT mosquitto broker, in verbose mode (-v) so you see if there are errors on the server side

### Commands via MQTT are not working

Use the Console to manually test the commands, with logging on. For example if changing the thermostat temperature is not working try

```
ems-esp:$ su
ems-esp:# log debug
ems-esp:# call thermostat seltemp 15
```

You should see a log statement pop in the console like `[thermostat] Setting thermostat temperature to 15.0 for heating circuit 1, mode auto` followed by which telegrams are being sent. If you see errors then reach out on Discord or create a GitHub issue to get [Support](Support.md).

## Home Assistant

### HA is showing errors like _"Received message on illegal discovery topic"_

This could happen when upgrading from an earlier EMS-ESP version and some of the device entity names may have changed. Use a tool like MQTTExplorer to remove all the `homeassistant/sensor/ems-esp/*` and `homeassistant/binary_sensor/ems-esp/*` topics from your MQTT broker and restart EMS-ESP.

### HA is showing errors like _"Template variable warning: 'dict object' has no attribute..."_

This happens after EMS-ESP is started and the entities are created in Home Assistant but the data has yet to arrive from EMS-ESP to the MQTT topics, which may take up to 10 seconds. It's safe to ignore these warnings. IF they keep coming up use a tool like MQTTExplorer to remove all the `homeassistant/sensor/ems-esp/*` and `homeassistant/binary_sensor/ems-esp/*` topics from your MQTT broker and restart EMS-ESP.
