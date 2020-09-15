
## First-time configuration

 - After powering up the ESP, watch the onboard blue LED. A solid light means good connection and EMS data is coming in. A slow pulse means either the WiFi or the EMS bus is not connected yet. A very fast pulse is when the system is booting up and configuring itself which typically takes 5 seconds.
  
 - Connect to the Access Point called `ems-esp` using the WPA password `ems-esp-neo`. When you see the captive portal sign-in with username `admin` and password `admin`. Set the WiFi credentials and go back to http://ems-esp. Remember to change the passwords!

 - First thing to check is if Tx is working and that you have a connection to the EMS bus. If Tx fails are shown in the Web interface try changing the Tx Mode from the settings page. There is no need to re-start the EMS-ESP.

 - If Rx incomplete telegrams are reported in the Web interface, don't panic. Some telegrams can be missed and this is usually caused by noise interference on the line.

> [!TIP]
> If you have an EMS Gateway board also follow the instructions on [BBQKees' wiki](https://bbqkees-electronics.nl/wiki/)

## Configuring the settings

Use the Web UI to further configure the settings.

## Adding external temperature sensors

The code supports auto-detection of Dallas type temperature sensors. The default GPIO pin used on the ESP8266 is D5 but this can be configured via the Web UI. The Dallas chips DS1822, DS18S20, DS18B20, DS1825 are supported including their parasite varieties and can also be daisy-chained on a single line.

