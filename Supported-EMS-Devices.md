Most Bosch branded boilers that support the Logamatic EMS bus protocols work with this design. This includes Nefit, Buderus, Worcester, Junkers and Sieger (all copyrighted).

!> Please make sure you read the **Disclaimer** on the home page carefully before sending ambiguous messages to your EMS bus as you could cause serious damage to your equipment.

EMS devices are being constantly added to the database on each new release (see file `ems_devices.h`).

### Thermostats

* Buderus RC10, RC20, RC20F, RC30, R35, RC300, RC310, RC3000
* Nefit Moduline 100, 200, 300, 400
* Nefit Moduline 1010, 3000
* Junkers FR10, FR50, FR100, FR110, FW100, FW120
* Sieger ES72, ES73
* Buderus Logamatic TC100 (read-only)
* Nefit Moduline Easy (read-only)
* Bosch CW100, Easy Control/CT200  (read-only)

> [!NOTE]
> (read-only) The latest touch type of thermostats (TC100/CW100/CT100) that are connected to the internet and use a mobile app do not transmit or listen to EMS+ commands so although EMS-ESP will recognize them it will not support changing it's values. In some cases even reading out the temperature values is not possible.

### Boilers

* Buderus GBx72, GB162, GB152, GB125, Logamax U122, Logamax Plus GB062/GB122/GB192, Logano
* Bosch Condens 2500
* Worcester-Bosch Greenstar 550CDi
* Worcester Bosch Greenstar 24i
* Junkers Cerapur, Junkers Heatronic 3 boilers
* Nefit Proline, Trendline, Topline, Enviline, Smartline
* Sieger BK13 and BK15 Boiler

### Solar Modules

* Buderus SM10, SM50, SM100 Solar Module
* Junkers ISM1 Solar Module

### Mixing Modules

* Buderus MM10, MM50, MM100, MM200 Mixing Module

### Heat Pump Modules

* Buderus HeatPump Module

### Other devices

* Generic Buderus MC10 Module
* Buderus WM10 Switch Module
* Buderus RFM20 Receiver
* Buderus BC10, BC25, BC40 Base Controller
* Buderus Web Gateway KM200
* Nefit Moduline Easy Connect
* Bosch Easy Connect
* EMS-OT OpenTherm converter
* Junkers Controller
