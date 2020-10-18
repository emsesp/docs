Commands can be sent to EMS-ESP in a few ways

 - via the Console with a `call <device> <command> <data> <id>` from the respective device context/menu.
 - via MQTT in the payload with `{"cmd":<command> ,"data":<data>, "id":<id>}`. The MQTT topic is the `<device>`. Refer to the [MQTT](MQTT) section for more information.
 - via the REST API in the URL like `http://ems-esp/api?device=<device>&cmd=<command>&data=<data>&id=<id>`. If ems-esp does not work, replace with `ems-esp.local`.

where
* `<device>`'s are `system`, `sensor`, `boiler`, `thermostat`, `solar` and `mixing`.
* `<data>` is the data value to be sent, either a string, bool or numerical value. It is optional.
* `<id>` is an additional identifier. `<hc>` is an alternative alias. Both are optional.

> [!DANGER]
> Note unlike the Console and MQTT, the Web restful interface does not yet support any security. Which means anyone with the URL can send commands to control the EMS connected devices. If you're worried, all write operations from the Web API can be disabled via the 'Enable WEB API' option in the Settings configuration.

To see which commands are available for your system, go into the Console and type `call` (be su/admin first). This will list all the commands per device.

### Commands

## device: `system`
| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `send` | `"XX XX...XX"` |  |   |
| `info` |  |  | REST API only |
| `report` |  |  | REST API only |
| `pin` | `<gpio>` | `<on \|off \| 1 \| 0 \| true \| false>` | turns pins high/low |

## device: `boiler`
| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `info` |  |  | REST API only |
| `comfort` | `<hot \|eco \| intelligent>` |  |  |
| `flowtemp` | `<degrees>` |  |  |
| `wwtemp` | `<degrees>` |  |  |
| `boilhyston` | `<degrees>` |  | negative value |
| `boilhystoff` | `<degrees>` |  | positive value |
| `burnperiod` | `<minutes>` |  |  |
| `burnminpower` | `<%>` |  |  |
| `burnmaxpower` | `<%>` |  |  |
| `pumpdelay` | `<minutes>` |  |  |
| `comfort` | `<degrees>` |  |  |
| `wwactivated` | `<degrees>` |  |  |
| `wwtapactivated` | `<degrees>` |  |  |
| `wwonetime` | `<degrees>` |  |  |
| `wwcircpump` | `<degrees>` |  |  |
| `wwcirculation` | `<degrees>` |  |  |
| `wwcircmode` | `<degrees>` |  |  |
| `heatingactivated` | `<degrees>` |  |  |
| `heatingtemp` | `<degrees>` |  |   |

## device: `thermostat`

> [!NOTE]
> The actual thermostat commands below will vary depending on which Thermostat brand and model you have.

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
| `summermode` |  | heating circuit | RC100, RC300 |
| `summertemp` | `<degrees>` | heating circuit | RC30, RC35, RC100, RC300 |
| `wwmode` | `<off \| on \| auto>` |  | RC100, RC300, RC30, RC35 |
| `wwtemp` |  |  | RC100, RC300 |
| `wwtemplow` |  |  | RC100, RC300 |
| `nighttemp` | `<degrees>` | heating circuit | RC20, RC30, RC35 |
| `daytemp` | `<degrees>` | heating circuit | RC20, RC30, RC35 |
| `clockoffset` | `<seconds>` |  | RC30 |
| `language` | `<n>` |  | (0=de, 1=nl, 2=fr, 3=it) RC30 |
| `display` | `<n>` |  | (0=int temp, 1= int set, 2=ext temp, 3=burner, 4=ww, 5=mode, 6=time, 7=date, 8=smoke) RC30 only |
| `nofrosttemp` | `<degrees>` | heating circuit | RC30, RC35, Junkers |
| `remotetemp` | `<degrees>` | heating circuit | RC30, RC35 |
| `minexttemp` | `<degrees>` |  | RC30, RC35 |
| `calinttemp` | `<degrees>` |  | RC30, RC35 |
| `building` | `<light \| medium \| heavy>` |  | RC30, RC35 |
| `control` | | heating circuit  | RC30, RC35 |
| `pause` | `<hours>` | heating circuit | RC30, RC35 |
| `party` | `<hours>` | heating circuit | RC30, RC35 |
| `holiday` | `<dd.mm.yyyy-dd.mm.yyyy>` | heating circuit | RC30, RC35 |
| `designtemp` | `<degrees>` | heating circuit | RC30, RC35 |
| `offsettemp` | `<degrees>` | heating circuit | RC30, RC35 |
| `holidaytemp` | `<degrees>` | heating circuit | RC30, RC35 |
| `wwcircmode` |  |  | RC30, RC35 |
| `roominfluence` |  |  | RC30, RC35 |

## device: `mixing`
| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `info` |  |  | REST API only |

## device: `sensor`
| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `info` |  |  | REST API only |

## device: `solar`
| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `info` |  |  | REST API only | 
