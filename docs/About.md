![EMS-ESP logo](_media/logo/boiler_64.png)

EMS-ESP is an open source firmware for [Espressif](https://www.espressif.com/en/products/socs) ESP32 based chipsets based devices originally developed by [@Proddy](https://github.com/proddy) back in 2018 and now owned and maintained exclusively by both Proddy and [@MichaelDvP](https://github.com/MichaelDvP).

<!-- prettier-ignore -->
!!! warning "Disclaimer"
    This code was developed based off information gathered on the internet and many hours of reverse engineering the communications between the EMS bus and real live devices. It is not based on any official documentation or supported libraries from Bosch/Buderus/Junkers/Nefit (and associated companies) and therefore there are no guarantees whatsoever regarding the safety of your devices and/or their settings, or the accuracy of the information provided.

## License

This program is licensed under GPL-3.0.

## A Brief history

How it all started.

- August 2017 - my first prototype, read only and based on an ESP8266. Because the Serial UART was used I couldn't display the values to the screen so had to write a Telnet service which consumed about 75% of the tine. The GitHub repo had 4 .cpp files and was called Boiler.
- May 2018 - Version 0.1.0 - The first public prototype. Built only for the ESP8266. This version only had a very simple telnet interface and MQTT.
- September 2018 - Version 1.0.0 - First official stable release on GitHub
- December 2018 - Version 1.1.0 - Added the RC30 and RC35 thermostats
- January 2019 - Version 1.3.0 - Added more boilers and thermostats, and EMS+ support
- February 2019 - Version 1.4.0 - Added dallas sensors. Renamed project from EMS-ESP-Boiler to just EMS-ESP
- March 2019 - Version 1.5.0 - Added support for the ESP32. Only way to change settings was via Telnet.

  ![1.5.0](_media/screenshot/telnet_menu.jpg)

- March 2019 - Version 1.6.0 - Added Solar module support
- May 2019 - Version 1.7.0 - Added HT3 support and to handle multiple thermostats
- June 2019 - Version 1.8.0 - Added Mixer module, Heat pumps and improved UART logic
- September 2019 - Version 1.9.0 - Major release with a new WebUI based on javascript

  ![1.9.0](_media/screenshot/ems_dashboard.png)

- April 2020 - Version 1.9.5 - Big update with more solar, mixer support and writing to HT3
- August 2020 - Version 2.0.0 - Complete re-write of the Telnet Console and WebUI. Added HA support plus an additional 50 new EMS devices

- November 2020 - Version 2.1.0 - More console commands and Web additions
- December 2020 - Version 2.2.0 - added RESTful API, SysLog
- March 2021 - Version 2.2.1 - the last version 2 for the ESP8266
- March 2021 - Version 3.0.0 - exclusive to the ESP32. Ethernet support, improved MQTT
- May 2021 - Version 3.1.0 - write to device from WebUI

  ![3.0.1](_media/screenshot/version301.png)

- August 2021 - Version 3.2.0 - IPv6 support, System Log in WebUI, more features
- November 2021 - Version 3.3.0 - More devices, pool data, mDNS
- January 2022 - Version 3.4.0 - New UI and more features

  ![3.4.0](_media/screenshot/version340.png)

- February 2023 - Version 3.5.0 - Multi-Language, Heat pumps, Customizations, MQTT Discovery improvements.

  ![3.5.0](_media/screenshot/version350.png)

- August 2023 - Version 3.6.0 - Sensors in it's own tab and able to browse all entities from the list. Added Scheduler and Custom Entity editor, plus Italian and Turkish.

  ![3.6.0](_media/screenshot/version360.png)
