Most Bosch branded boilers that support the Logamatic EMS bus protocols work with this design. This includes Nefit, Buderus, Worcester, Junkers and Sieger (all copyrighted).

> [!ATTENTION] Please make sure you read the Disclaimer on the home page carefully before sending ambiguous messages to your EMS bus as you could cause serious damage to your equipment.

EMS devices are being constantly added to the database on each new release.

### Thermostats

- Buderus RC10, RC20, RC20F, RC25, RC30, RC35, RC300, RC200, RC310, RC3000
- Nefit Moduline 100, 200, 300, 400, 1010, 3000
- Sieger ES72, ES73
- Junkers FR50, FR100, FR110, FW100, FW200, FR10, FR120, FW120
- Bosch CW100, CW400, Sense II

> [!NOTE]
> These thermostats below unfortunately do not support direct EMS write commands so will appear in EMS-ESP as read-only devices:
>
> - Buderus Logamatic TC100, Bosch EasyControl CT200, Junkers CT100, Moduline Easy. 
>   See also <https://community.home-assistant.io/t/buderus-tc100-junkers-ct100-thermostat/67992>
> - Junkers FW/FR build before 9/2008 (FD889). See <https://github.com/emsesp/EMS-ESP32/issues/105#issuecomment-915874482>

### Boilers

- Buderus Logamax, Logamax Plus, Logano, Logano Plus (GBx72, GB162, GB152, GB125, GB212, U122, GB062, GB122, GB192, KB195)
- Bosch Condens GC2300, 2500, 5000i, Compress 6000AW
- Worcester-Bosch Greenstar 550CDi, Greenstar 24i
- Junkers Cerapur
- Nefit Proline, Trendline, Topline, Enviline, Smartline, EcomLine
- Sieger BK13, BK15

### Solar Modules

- Buderus SM10, SM50, SM100, SM200
- MS100, MS200
- Junkers ISM1

### Mixer Modules

- Buderus MM10, MM50, MM100, MM200
- Junkers IPM

### Heat Pump Modules

- Buderus Heat Pump Module

### Other devices

- Generic Buderus MC10 Module
- Buderus WM10 Switch Module
- Buderus RFM20 Receiver
- Buderus BC10, BC25, BC40 Base Controller
- M200, RFM200
- Buderus Web Gateway KM200, MB LAN2
- Nefit Moduline Easy Connect
- Bosch Easy Connect
- EMS-OT OpenTherm converter
- Junkers Controller
