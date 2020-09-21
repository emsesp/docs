Commands can be sent to EMS-ESP in a few ways

 - via the Console with a `call <command> <data> <id>` from the respective device context/menu.
 - via MQTT in the payload with `{"cmd":<command> ,"data":<data>, "id":<id>}`. The MQTT topic is the <device>.
 - via the REST API in the URL like `http://ems-esp/api?device=<device>&cmd=<command>&data=<data>&id=<id>`.

where
* `<device>`'s are `system`, `boiler`, `thermostat`, `solar`, `mixing` and `heatpump`.
* `<data>` is the data value to be sent, either a string, bool or numerical value. It is optional.
* `<id>` is an additional identifier. `<hc>` also works. Both are optional.

> [!DANGER]
> Note unlike the Console and MQTT, the Web restful interface does not yet support any security. Which means anyone with the URL can send commands to control the EMS connected devices. If you're worried, all write operations from the Web API can be disabled via the 'Enable WEB API' option in the Settings configuration.

### Commands

valid `<device>`'s are `system, boiler, thermostat, solar, mixing, heatpump`.

## device: `system`
| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `send` | `"XX XX...XX"` |  |   |
| `info` |  |  | REST API only |
| `pin` | `<gpio>` | `<on \|off \| 1 \| 0 \| true \| false>` | turns pins high/low |

## device: `boiler`
| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `info` |  |  | REST API only |
| `comfort` | `<hot \|eco \| intelligent>` |  |  |
| `flowtemp` | `<degrees>` |  |  |
| `wwtemp` | `<degrees>` |  |   |
| `boilhyston` | `<degrees>` |  | negative value |
| `boilhystoff` | `<degrees>` |  | positive value |
| `burnperiod` | `<minutes>` |  |  |
| `burnminpower` | `<%>` |  |  |
| `burnmaxpower` | `<%>` |  |  |
| `pumpdelay` | `<minutes>` |  |  |

## device: `thermostat`
| command | data | id | comments |
| ------- | ---- | -- | -------- |
| `info` |  |  | REST API only |
| `wwmode` | `<off \| on \| auto>` |  |  |
| `calinttemp` | `<degrees>` |  |  |
| `minexttemp` | `<degrees>` |  |  |
| `building` | `<light \| medium \| heavy>` |  | (RC30 only) |
| `language` | `<n>` |  | 0=de, 1=nl, 2=fr, 3=it (RC30 only) |
| `display` | `<n>` |  | 0=int temp, 1= int set, 2=ext temp, 3=burner, 4=ww, 5=mode, 6=time, 7=date, 8=smoke (RC30 only) |
| `clockoffset` | `<seconds>` |  | (RC30 only) |
| `mode` | `<auto \| night \| day \| nofrost \| heat \| eco>` | heating circuit |  |
| `temp` | `<degrees>` | heating circuit |  |
| `nighttemp` | `<degrees>` | heating circuit |  | 
| `daytemp` | `<degrees>` | heating circuit |  |
| `nofrosttemp` | `<degrees>` | heating circuit |  | 
| `ecotemp` | `<degrees>` | heating circuit |  |
| `heattemp` | `<degrees>` | heating circuit |  |
| `summertemp` | `<degrees>` | heating circuit |  |
| `designtemp` | `<degrees>` | heating circuit |  |
| `offsettemp` | `<degrees>` | heating circuit |  |
| `holidaytemp` | `<degrees>` | heating circuit |  |
| `remotetemp` | `<degrees>` | heating circuit |  |
| `control` | `<0 \| 1 \| 2>` | heating circuit |  |
| `pause` | `<hours>` | heating circuit |  |
| `party` | `<hours>` | heating circuit |  |
| `holiday` | `<dd.mm.yyyy-dd.mm.yyyy>` | heating circuit |  |
| `date` | `<NTP \| hh:mm:ss-dd.mm.yyyy-dw-dst>` | heating circuit |  |

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
