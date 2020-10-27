Commands can be sent to EMS-ESP in a few ways, either

 * via the [**Console**](Console) with a `call <device> <command> <data> <id>`.
 * via [**MQTT**](MQTT) in the payload with `{"cmd":"<command>" ,"data":<data>, "id":<id>}`. The MQTT topic being the `<device>`.
 * or via the [**REST API**](Web) in the URL like `http://ems-esp/api?device=<device>&cmd=<command>&data=<data>&id=<id>`.

where
* `<device>` can be `system`, `dallassensor`, `boiler`, `thermostat`, `solar` or `mixer`.
* `<command>` are listed in the tables below. This is a mandatory parameter.
* `<data>` is the data value to be sent, either a string, boolean (true/false) or numerical value (integer or float). This parameter is optional.
* `<id>` is an additional identifier. `<hc>` can also be used an alternative alias, for example to depict a heating circuit. This parameter is also optional.

> [!WARNING]
> Unlike the Console and MQTT, the Web restful interface does not yet support any security. Which means anyone with the URL can send commands to control the EMS connected devices. If you're worried, all write operations from the Web API can be disabled via the 'Enable WEB API' option in the Settings configuration.

## Commands

The tables below list the available commands for each specific `device`.
To see which commands are available on your system, go into the Console and type `show commands`. This will list all the commands per device.

### `system`
| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `send` | `"XX XX...XX"` |  |   |
| `info` |  |  | REST API only |
| `report` |  |  | REST API only |
| `pin` | `<gpio>` | `<on \|off \| 1 \| 0 \| true \| false>` | sets ESP's GPIO pins high/low |

### `dallassensor`
| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `info` |  |  | REST API only |

### `boiler`
| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `info` |  |  | REST API only |
| `comfort` | `<hot \|eco \| intelligent>` |  |  |
| `flowtemp` | `<degrees>` |  |  |
| `wwtemp` | `<degrees>` |  |  |
| `boilhyston` | `<degrees>` |  | start burner below flowtemp (negative value) |
| `boilhystoff` | `<degrees>` |  | stop burner above flowtemp (positive value) |
| `burnperiod` | `<minutes>` |  |  |
| `burnminpower` | `<%>` |  |  |
| `burnmaxpower` | `<%>` |  |  |
| `pumpdelay` | `<minutes>` |  |  |
| `wwactivated` | `<off \| on>` |  |  |
| `wwtapactivated` | `<off \| on>` |  |  |
| `wwonetime` | `<off \| on>` |  |  |
| `wwcircpump` | `<off \| on>` |  |  |
| `wwcirculation` | `<off \| on>` |  |  |
| `wwcircmode` | `<n>` |  |  (1=1x3min, .. 6=6x3min, 7=on) |
| `heatingactivated` | `<off \| on>` |  |  |
| `heatingtemp` | `<degrees>` |  |  |

### `thermostat`

> [!NOTE] The actual thermostat commands below will vary depending on which Thermostat brand and model you have.

| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `info` |  |  | REST API only |
| `temp` | `<degrees>` | heating circuit |  |
| `mode` | `<auto \| night \| day \| nofrost \| heat \| eco>` | heating circuit |  |
| `datetime` | `<NTP \| hh:mm:ss-dd.mm.yyyy-dw-dst>` | | |
| `manualtemp` | `<degrees>` | heating circuit | RC100, RC300 |
| `ecotemp` | `<degrees>` | heating circuit | RC100, RC300, Junkers |
| `heattemp` | `<degrees>` | heating circuit  | Junkers |
| `comforttemp` | `<degrees>` | heating circuit | RC100, RC300 |
| `summermode` | `<winter \| auto \| summer>` | heating circuit | RC100, RC300 |
| `summertemp` | `<degrees>` | heating circuit | RC30, RC35, RC100, RC300 |
| `wwmode` | `<off \| on \| auto>` |  | RC100, RC300, RC30, RC35 |
| `wwtemp` | `<degrees>` |  | RC100, RC300 |
| `wwtemplow` | `<degrees>` |  | RC100, RC300 |
| `nighttemp` | `<degrees>` | heating circuit | RC20, RC30, RC35 |
| `daytemp` | `<degrees>` | heating circuit | RC20, RC30, RC35 |
| `clockoffset` | `<seconds>` |  | RC30 |
| `language` | `<n>` |  | RC30 (0=de, 1=nl, 2=fr, 3=it) |
| `display` | `<n>` |  | RC30 (0=int temp, 1= int set, 2=ext temp, 3=burner, 4=ww, 5=mode, 6=time, 7=date, 8=smoke) |
| `nofrosttemp` | `<degrees>` | heating circuit | RC30, RC35, Junkers |
| `remotetemp` | `<degrees>` | heating circuit | RC30, RC35 |
| `minexttemp` | `<degrees>` |  | RC30, RC35 |
| `calinttemp` | `<degrees>` |  | RC30, RC35 |
| `building` | `<light \| medium \| heavy>` |  | RC30, RC35 |
| `control` | `<0 \| 1 \| 2>` | heating circuit  | RC30, RC35 (roomcontrol for hc 0=off, 1=RC20, 2=RC3x) |
| `pause` | `<hours>` | heating circuit | RC30, RC35 |
| `party` | `<hours>` | heating circuit | RC30, RC35 |
| `holiday` | `<dd.mm.yyyy-dd.mm.yyyy>` | heating circuit | RC30, RC35 |
| `designtemp` | `<degrees>` | heating circuit | RC30, RC35 |
| `offsettemp` | `<degrees>` | heating circuit | RC30, RC35 |
| `holidaytemp` | `<degrees>` | heating circuit | RC30, RC35 |
| `wwcircmode` | `<off \| auto \| on>` |  | RC30, RC35 |
| `roominfluence` | `<degrees>` |  | RC30, RC35 |

### `mixer`
| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `info` |  |  | REST API only |

### `solar`
| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `info` |  |  | REST API only | 

### `heatpump`
| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `info` |  |  | REST API only | 
