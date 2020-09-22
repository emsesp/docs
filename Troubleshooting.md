### EMS-ESP can't connect to the Wifi

The EMS-ESP is probably in Access Point mode. Look for a wifi SSID `ems-esp`, connect to this and open a browser to 'https://192.168.4.1'. If you have configured a WiFi client your router would have appointed an IP address via DHCP. You should be able to connect via https://ems-esp or https://ems-esp.local.

### The LED is constantly flashing

A fast pulse of the LED means the system is booting or in installation mode. Connect via the WiFi to its Access Point to complete the configuration.

A slow pulse means either there is no WiFi connection or EMS-ESP cannot read from the EMS bus. In this case go to the Web interface and try a different Tx Mode setting.

### You can't find the MQTT data

First make sure you have set the correct `MQTT Format` in the MQTT Settings page in the Web UI. Then follow the instructions "Monitoring the MQTT queues" in the [MQTT](MQTT.md) section of this document.
