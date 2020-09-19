Commands can be sent to EMS-ESP in a few ways

 - via the Console with a `call <command> <data> <id>` from the respective device context/menu.
 - via MQTT in the payload with `{"cmd":<command> ,"data":<data>, "id":<id>}`. The MQTT topic is the <device>.
 - via the REST API in the URL like `http://ems-esp/api?device=<device>&cmd=<command>&data=<data>&id=<id>`. The `data` and `id` can be optional.

### Commands

valid `<device>`'s are `system, boiler, thermostat, solar, mixing, heatpump`.

| device | command | data | id | comments |
| -----  | ------- | ---- | -- | -------- |
| `system` | `send` | `"XX XX...XX"` |  |
| `system` | `info` |  |  | EST API only
| `system` | `pin` | `<gpio>` | `<on \|off \| 1 \| 0 \| true \| false>` | turns pins high/low
| `boiler` | `info` |  |  | REST API only
| `boiler` | `comfort` | `<hot \|eco \| intelligent>` |  |
| `boiler` | `flowtemp` | `<degrees>` |  | 
| `boiler` | `wwtemp` | `<degrees>` |  |
| `boiler` | `boilhyston` | `<degrees>` |  | negative value
| `boiler` | `boilhystoff` | `<degrees>` |  | positive value
| `boiler` | `burnperiod` | `<minutes>` |  |
| `boiler` | `burnminpower` | `<%>` |  |
| `boiler` | `burnmaxpower` | `<%>` |  |
| `boiler` | `pumpdelay` | `<minutes>` |  |
| `thermostat` | `info` |  |  | via REST API only
| `thermostat` | `wwmode` | `<off \| on \| auto>` |  |
| `thermostat` | `calinttemp` | `<degrees>` |  |
| `thermostat` | `minexttemp` | `<degrees>` |  |
| `thermostat` | `building` | `<light \| medium \| heavy>` |  | (RC30 only)
| `thermostat` | `language` | `<n>` |  | 0=de, 1=nl, 2=fr, 3=it (RC30 only)
| `thermostat` | `display` | `<n>` |  | 0=int temp, 1= int set, 2=ext temp, 3=burner, 4=ww, 5=mode, 6=time, 7=date, 8=smoke (RC30 only)
| `thermostat` | `clockoffset` | `<seconds>` |  | (RC30 only)
| `thermostat` | `mode` | `<auto \| night \| day \| nofrost \| heat \| eco>` | heating circuit number | 
| `thermostat` | `temp` | `<degrees>` | heating circuit number | 
| `thermostat` | `nighttemp` | `<degrees>` | heating circuit number | 
| `thermostat` | `daytemp` | `<degrees>` | heating circuit number | 
| `thermostat` | `nofrosttemp` | `<degrees>` | heating circuit number | 
| `thermostat` | `ecotemp` | `<degrees>` | heating circuit number | 
| `thermostat` | `heattemp` | `<degrees>` | heating circuit number | 
| `thermostat` | `summertemp` | `<degrees>` | heating circuit number | 
| `thermostat` | `designtemp` | `<degrees>` | heating circuit number | 
| `thermostat` | `offsettemp` | `<degrees>` | heating circuit number | 
| `thermostat` | `holidaytemp` | `<degrees>` | heating circuit number | 
| `thermostat` | `remotetemp` | `<degrees>` | heating circuit number | 
| `thermostat` | `control` | `<0 \| 1 \| 2>` | heating circuit number | 
| `thermostat` | `pause` | `<hours>` | heating circuit number | 
| `thermostat` | `party` | `<hours>` | heating circuit number | 
| `thermostat` | `holiday` | `<dd.mm.yyyy-dd.mm.yyyy>` | heating circuit number | 
| `thermostat` | `date` | `<NTP \| hh:mm:ss-dd.mm.yyyy-dw-dst>` | heating circuit number | 
| `mixing` | `info` |  |  | REST API only
| `heatpump` | `info` |  |  | REST API only
| `solar` | `info` |  |  | REST API only
