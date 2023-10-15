# List of Thermostats

This is the current list of supported thermostats from Buderus, Nefit, Sieger, Junkers and Bosch:

- TC100/Moduline Easy EASY
- EasyControl CT200 EASY
- UI800/BC400
- RC10
- RC20/Moduline 300
- Moduline 400
- RC10/Moduline 100
- Moduline 200
- RC35
- RC10/Moduline 100
- RC20RF
- RFM20 Remote
- RC25
- RC200/CW100
- RC300/RC310/Moduline 3000/1010H/CW400/Sense II/HPC410
- RC100/Moduline 1000/1010
- Rego 2000/3000
- Comfort RF CRF
- CRF200S CRF
- Comfort+2RF CRF
- Rego 3000/UI800 RC300
- ES72/RC20
- FW100
- FW200
- FR110
- FB10
- FB100
- FR10
- FW500
- FR50
- FR120
- RT800
- RC100H
- TR120RF/CR20RF

<!-- prettier-ignore -->
!!! note
    These thermostats below unfortunately do not support direct EMS write commands so will appear in EMS-ESP as read-only devices:

    - Buderus Logamatic TC100, Bosch EasyControl CT200, Junkers CT100, Moduline Easy. See [here](https://community.home-assistant.io/t/buderus-tc100-junkers-ct100-thermostat/67992)
    - Junkers FW/FR build before 9/2008 (FD889). See [here](https://github.com/emsesp/EMS-ESP32/issues/105#issuecomment-915874482)
    - Tado Thermostats

## Device Entities

<!-- prettier-ignore -->
!!! warning
    The actual thermostat commands below will vary depending on which Thermostat brand and model you have.
    This list is also not complete and subject to change between versions.

<!-- prettier-ignore -->
| command | data | id | comments |
| - | - | - | - |
| `datetime` | `<ntp \| dd.mm.yyyy-hh:mm:ss-dw-dst>` | | RC35, RC100, RC300, `dw`:day of week: 0-mo,.. `dst`:daylight saving 0/1 |
| `wwmode` | `<off \| on \| auto>` | | RC100, RC300, RC30, RC35 |
| `wwsettemp` | `<degrees>` | | RC100, RC300 |
| `wwsettemplow` | `<degrees>` | | RC100, RC300 |
| `wwcircmode` | `<off \| on \| auto \| own>` | | RC30, RC35, RC100, RC300 |
| `wwcharge` | `<off \| on>` | | RC100, RC300 |
| `clockoffset` | `<seconds>` | | RC30 |
| `language` | `<n>` | | RC30 (0=de, 1=nl, 2=fr, 3=it) |
| `display` | `<n>` | | RC30 (0=int temp, 1= int set, 2=ext temp, 3=burner, 4=ww, 5=mode, 6=time, 7=date, 8=smoke) |
| `minexttemp` | `<degrees>` | | RC30, RC35, RC100, RC300 |
| `calinttemp` | `<degrees>` | | RC30, RC35 |
| `building` | `<light \| medium \| heavy>` | | RC30, RC35, RC100, RC300 |
| `temp` | `<degrees>` | heating circuit | actual setpoint depending on mode |
| `mode` | `<auto \| night \| day \| nofrost \| heat \| eco>` | heating circuit | |
| `manualtemp` | `<degrees>` | heating circuit | RC100, RC300 |
| `ecotemp` | `<degrees>` | heating circuit | RC100, RC300, Junkers |
| `heattemp` | `<degrees>` | heating circuit | Junkers |
| `comforttemp` | `<degrees>` | heating circuit | RC100, RC300 |
| `summermode` | `<winter \| auto \| summer>` | heating circuit | RC100, RC300 |
| `summertemp` | `<degrees>` | heating circuit | RC30, RC35, RC100, RC300 |
| `nighttemp` | `<degrees>` | heating circuit | RC20, RC30, RC35 |
| `daytemp` | `<degrees>` | heating circuit | RC20, RC30, RC35 |
| `daytemp2` | `<degrees>` | heating circuit | RC20 |
| `daytemp3` | `<degrees>` | heating circuit | RC20 |
| `daytemp4` | `<degrees>` | heating circuit | RC20 |
| `nofrosttemp` | `<degrees>` | heating circuit | RC30, RC35, RC100, RC300, Junkers |
| `remotetemp` | `<degrees>` | heating circuit | RC30, RC35 |
| `control` | `<off \| RC20 \| RC3x>` | heating circuit | RC30, RC35 (roomcontrol for hc) |
| `pause` | `<hours>` | heating circuit | RC30, RC35 |
| `party` | `<hours>` | heating circuit | RC30, RC35 |
| `holiday` | `<dd.mm.yyyy-dd.mm.yyyy \| dd.mm.yyyy+dd.mm.yyyy>` | heating circuit | RC30, RC35, use `-` for 'away from home', `+` for 'at home' |
| `designtemp` | `<degrees>` | heating circuit | RC30, RC35, RC100, RC300 |
| `offsettemp` | `<degrees>` | heating circuit | RC30, RC35, RC100, RC300 |
| `holidaytemp` | `<degrees>` | heating circuit | RC30, RC35 |
| `roominfluence` | `<degrees>` | heating circuit | RC30, RC35, RC100, RC300 |
| `minflowtemp` | `<degrees>` | heating circuit | RC30, RC35, RC100, RC300 |
| `maxflowtemp` | `<degrees>` | heating circuit | RC30, RC35, RC100, RC300 |
| `flowtempoffset` | `<degrees>` | heating circuit | RC30, RC35 |
| `program` | `<0 - 10 \| 1 - 9 \| 1 - 2>` | heating circuit | RC30, RC35, RC20, RC100, RC300 |
| `controlmode` | `<room \| outdoor>` | heating circuit | RC30, RC35, RC100, RC300 |
| `reducemode` | `<nofrost \| reduce \| room \| outdoor>` | heating circuit | RC30, RC35 |
| `roomtemp` | `<degrees>` | heating circuit | only v2.2: fake HA-thermostat roomtemp, use `-1` to clear |
| `switchtime` | `<nn.d.o.hh:mm>` | heating circuit | only v3: set one of the programs switch times, nn=number(00-42), d=day(0-6), o=on(0,1), hh:mm=time, d=7 or o=7 clears |
