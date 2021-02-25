### EMS-ESP can't connect to the Wifi

The EMS-ESP is probably in Access Point mode. Look for a wifi SSID `ems-esp`, connect to this and open a browser to 'https://192.168.4.1'. If you have configured a WiFi client your router would have appointed an IP address via DHCP. You should be able to then connect via https://ems-esp or https://ems-esp.local.

### The LED is constantly flashing

A fast pulse of the LED means the system is booting or in installation mode. Connect via the WiFi to its Access Point (ems-esp) to complete the configuration.

A slow pulse means either there is no WiFi connection or EMS-ESP cannot read from the EMS bus. In this case go to the Web interface and try a different Tx Mode setting.

### Not all EMS devices are recognized or capturing data

Experiment with changing the Tx Mode value in the Settings page. 1 (default) typically works for EMS1.0 and most systems, 2 for EMS+ and new systems and 3 is better for Junkers/Heatronics.

If you have EMS devices that may not yet be supported by EMS-ESP then use `scan devices` from the Console to find out their details and then post an enhancement issue on GitHub. Remember the `su` password is default `ems-esp-neo` unless this has been changed via the console (`passwd`) or in the Web UI (`Security->Security Settings`).

e.g.

```
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
```
ems-esp:/$ su
ems-esp:/# log debug
ems-esp:/# call thermostat temp 15
```
You should see a log statement pop in the console like `[thermostat] Setting thermostat temperature to 15.0 for heating circuit 1, mode auto` followed by which telegrams are being sent. If you see errors then reach out via Gitter or create a GitHub issue to get [Support](Support.md).

### Settings are not saved and lost after restart

Try erasing the ESP (`esptool.py erase_flash`) and [uploading](Uploading-firmware) the firmware again using the command-line with the ESP connected via the USB.

### Web UI is non-responsive on an ESP8266 or frequent crashes occur

Due to the memory limitations on an ESP8266 having the Console open and then opening the Web UI will usually not work. Close the console and try again.

Also watch out for available free memory. If this drops to < 8kb (30%) EMS-ESP will struggle with MQTT and Web. This could very well happen when you have many EMS connected devices (say > 4). The only option here is to replace the ESP8266 chip with an ESP32.

### EMS-ESP is showing incorrect values from a specific device

If you notice that certain values are displayed incorrectly, either in the Web UI, Console or MQTT then please help us correct this by logging a GitHub issue, along with the expected value. When asked to provide debug information, go the Telnet console and do
```
% su
% log trace
```
and then either a `read` or `watch`, e.g. `read 21 2D8` to show all the data from HC2 on a Mixing MM100.

### EMS-ESP is showing CRC-errors

EMS-messages are sended and repeated often, a few crc-errors doesn't harm. The bad signal can be caused by mainly 2 factors:
- powering: try to power ems-esp by usb or service-jack. 
- disturbtions on the bus (emc, reflections, etc): try to connect ems-esp to another device on the bus. In general a previously unconnected bus-out on a devices like MM100 is better than a split connection on an already used connector. 
