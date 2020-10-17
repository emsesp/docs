### EMS-ESP can't connect to the Wifi

The EMS-ESP is probably in Access Point mode. Look for a wifi SSID `ems-esp`, connect to this and open a browser to 'https://192.168.4.1'. If you have configured a WiFi client your router would have appointed an IP address via DHCP. You should be able to then connect via https://ems-esp or https://ems-esp.local.

### The LED is constantly flashing

A fast pulse of the LED means the system is booting or in installation mode. Connect via the WiFi to its Access Point (ems-esp) to complete the configuration.

A slow pulse means either there is no WiFi connection or EMS-ESP cannot read from the EMS bus. In this case go to the Web interface and try a different Tx Mode setting.

### MQTT is not sending data correctly

First make sure you have set the correct `MQTT Format` in the MQTT Settings page in the Web UI. Then follow the instructions "Monitoring the MQTT queues" in the [MQTT](MQTT.md) section of this document.

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

### Some commands via MQTT are not working

Use the Telnet console to manually test the commands, with logging on. For example if changing the thermostat temperature is not working try
```
ems-esp:/$ su
ems-esp:/# log debug
ems-esp:/# call thermostat temp 15
```
You should see a log statement pop in the console like `[thermostat] Setting thermostat temperature to 15.0 for heating circuit 1, mode auto` followed by which telegrams are being sent. If you see errors then reach out via Gitter or create a GitHub issue to get [Support](Support.md).

### Settings are not saved and lost after restart

Try wiping the ESP (`esptool.py erase_flash`) and [uploading](Uploading-firmware) the firmware again using the command-line with the ESP connected via the USB.

