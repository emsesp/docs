EMS-ESP has an Command API which can be used to fetch information and issue commands to the EMS devices. There are 3 methods commands can be invoked:

- via the [**Console**](Console) with a `call <device> <command> <data> <id>`
- via the [**HTTP**](Command?id=http-api)
- via [**MQTT**](Command?id=MQTT)

For quick peak at all the commands you can go to the Telnet console and type `show commands`.

## HTTP REST API

- The API follows the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification)
- The URL path always starts with `http://<hostname>/api/`
- HTTPS is not supported yet
- You can use `http://<hostname>/api/<device>/commands` to show list of valid commands. For example `http://ems-esp.local/api/thermostat/commands` or `http://ems-esp.local/api/system/commands`

### Reading and Writing EMS Device information

Definitions

- **"cmd"** is the name of the device value, also known as the device entity, for example `wwcirc` in the Boiler or `mode` in the Thermostat. The name **"cmd"** can also be substituted for **"entity"**. See the [table below](Command?id=ems-device-entity-names) for the complete list
- **"data"** is the value and can be either a string in quotes, integer, float of boolean. **"value"** is an alias that can also be used instead.
- **"hc"** and **"wwc"** are used to represent a heating circuit or warm water controller. **"id"** can also be used as an alias.
- A boolean value can be represented either as a True value ("TRUE", "yes", true, "true", "on", 1) or False value ("FALSE", "no", false, "false", "off", 0)

#### Reading values

- Uses HTTP GET, no authentication is needed
- For querying all the values from an EMS device use the device name as the endpoint, e.g. `http://ems-esp.local/api/thermostat` to return the data in short-name format or prefix with `/info` for the verbose format, e.g. `http://ems-esp.local/api/thermostat/info`.
- For retrieving a single value from an EMS device add the device name/entity to the URL path, e.g. `http://ems-esp.local/api/thermostat/seltemp`.

#### Writing values

- Use HTTP POST or PUT. Authentication is required unless disabled in the Settings, and added to the HTTP header. An Access Token which can be generated from the Web UI's Security tab. An Access Token is a string 152 characters long. Token's do not expire. The token needs to be either embedded into the HTTP Header as `"Authorization: Bearer {ACCESS_TOKEN}"` or as query parameter `?access_token={ACCESS_TOKEN}`.
- For writing a single value to a specific device entity you can use the URL PATH with the value in the http body. For example:
  | URL | body | action |
  | ---------------------------- | ------------------------------------- | ------------- |
  | `http://ems-esp.local/api/thermostat/temp` | `22` | Sets the selected room temperature of the master thermostat on heating circuit 1 |
- For more extensive operations send a JSON object to the endpoint. For example:
  | URL | body | action |
  | ---------------------------- | ------------------------------------- | ------------- |
  | `http://ems-esp.local/api/thermostat` | `{"cmd":"mode", "data":"auto"}` | Sets the thermostat mode to auto for heating circuit 1 |
  | `http://ems-esp.local/api/thermostat` | `{"cmd":"seltemp", "data":23, "hc":3}` | Sets the room temperature to 23 degrees for for heating circuit 3 |
  | `http://ems-esp.local/api/thermostat/hc2` | `{"cmd":"seltemp", "data":20.5}` | Sets the room temperature to 20.5 degrees for for heating circuit 2 |

### System Commands

The URL is `http://<hostname>/system/api`

#### Fetching EMS-ESP system information

| endpoint    | action                               |
| ----------- | ------------------------------------ |
| `/system`   | shows the current system information |
| `/commands` | lists the available commands         |
| `/settings` | shows the current system settings    |

#### Calling system commands

HTTP POST and Authentication in the http header are required for these actions. An Access Token which can be generated from the Web UI's Security tab which is a string 152 characters long. Token's do not expire. The token needs to be embedded into the HTTP Header as `"Authorization: Bearer {ACCESS_TOKEN}"`.

| endpoint   | action                                 |
| ---------- | -------------------------------------- |
| `/fetch`   | Forces at refresh of all device values |
| `/restart` | restarts EMS-ESP                       |

The following require a Body or the value in a JSON object with format `{"value":<value>}`:

| endpoint        | JSON body                                                     | action                                                                          |
| --------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `/send`         | `"XX XX...XX"`                                                | send telegram to the EMS bus                                                    |
| `/publish`      | `[ha] \| [device]`                                            | MQTT publish all values, and optional HA-configuration or specific for a device |
| `/pin`          | `{"id":<gpio>, "value":<on \|off \| 1 \| 0 \| true \| false>` | sets ESP's GPIO pins high/low                                                   |
| `/watch`        | `<on \|off \| raw \| <type-id(hex)>`                          | watch incoming telegrams                                                        |
| `/syslog_level` | `<level>`                                                     | set syslog level                                                                |

### Fetching Dallas temperature sensor information

Use `http://<hostname>/api/dallassensor`.

## EMS Device Entity Names

The tables below list the available commands for each specific EMS device.

### Boiler: `boiler`

> [!NOTE] The boiler commands below will vary depending on boiler type/brand and system configuration Some commands will not work because they are overwritten by controller or thermostat. In this case there are thermostat commands for this setting.

| command            | data                                        | id  | comments                                                                           |
| ------------------ | ------------------------------------------- | --- | ---------------------------------------------------------------------------------- |
| `comfort`          | `<hot \|eco \| intelligent>`                |     |                                                                                    |
| `flowtemp`         | `<degrees>`                                 |     | Limited to heatingtemp, set by thermostat if present                               |
| `wwsettemp`        | `<degrees>`                                 |     | Only if thermostat does not manage it                                              |
| `boilhyston`       | `<degrees>`                                 |     | Start burner below flowtemp (negative value), allowed range depends on boiler type |
| `boilhystoff`      | `<degrees>`                                 |     | Stop burner above flowtemp (positive value), allowed range depends on boiler type  |
| `burnperiod`       | `<minutes>`                                 |     |                                                                                    |
| `burnminpower`     | `<%>`                                       |     | Changeable only for modulated burners                                              |
| `burnmaxpower`     | `<%>`                                       |     | Changeable only for modulated burners                                              |
| `pumpdelay`        | `<minutes>`                                 |     |                                                                                    |
| `wwactivated`      | `<off \| on>`                               |     |                                                                                    |
| `wwtapactivated`   | `<off \| on>`                               |     | Special function working in boiler test-mode                                       |
| `wwonetime`        | `<off \| on>`                               |     | Overwritten by some thermostats, see thermostat commands                           |
| `wwcircpump`       | `<off \| on>`                               |     |                                                                                    |
| `wwcirculation`    | `<off \| on>`                               |     | Overwritten by some thermostats, see thermostat commands                           |
| `wwcircmode`       | `<n>`                                       |     | (1=1x3min, .. 6=6x3min, 7=on)                                                      |
| `wwflowtempoffset` | `<degrees>`                                 |     | Offset to boiler temperature while preparing warm water                            |
| `wwmaxpower`       | `<%>`                                       |     | Maximum power for warm water heating                                               |
| `heatingactivated` | `<off \| on>`                               |     | Not changeable for some systems. i.g. Set by MC10 rotary control                   |
| `heatingtemp`      | `<degrees>`                                 |     | Upper limit for flowtemp, not changeable for some systems or overwritten (MC10)    |
| `maintenance`      | `<off \| <hours> \| <dd.mm.yyyy> \| reset>` |     | set maintenance to date or time or reset message                                   |
| `pumpmodmin`       | `<%>`                                       |     | Changeable only for modulated pumps                                                |
| `pumpmodmax`       | `<%>`                                       |     | Changeable only for modulated pumps                                                |
| `reset`            | `<error \| maintenance>`                    |     | Use `reset error` only if there is an active error!                                |

### Thermostats: `thermostat`

> [!NOTE] The actual thermostat commands below will vary depending on which Thermostat brand and model you have.

| command          | data                                               | id              | comments                                                                                                              |
| ---------------- | -------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `datetime`       | `<ntp \| hh:mm:ss-dd.mm.yyyy-dw-dst>`              |                 | RC35, RC100, RC300, `dw`:day of week: 0-mo,.. `dst`:daylight saving 0/1                                               |
| `wwmode`         | `<off \| on \| auto>`                              |                 | RC100, RC300, RC30, RC35                                                                                              |
| `wwsettemp`      | `<degrees>`                                        |                 | RC100, RC300                                                                                                          |
| `wwsettemplow`   | `<degrees>`                                        |                 | RC100, RC300                                                                                                          |
| `wwcircmode`     | `<off \| on \| auto \| own>`                       |                 | RC30, RC35, RC100, RC300                                                                                              |
| `wwonetime`      | `<off \| on>`                                      |                 | RC100, RC300                                                                                                          |
| `clockoffset`    | `<seconds>`                                        |                 | RC30                                                                                                                  |
| `language`       | `<n>`                                              |                 | RC30 (0=de, 1=nl, 2=fr, 3=it)                                                                                         |
| `display`        | `<n>`                                              |                 | RC30 (0=int temp, 1= int set, 2=ext temp, 3=burner, 4=ww, 5=mode, 6=time, 7=date, 8=smoke)                            |
| `minexttemp`     | `<degrees>`                                        |                 | RC30, RC35, RC100, RC300                                                                                              |
| `calinttemp`     | `<degrees>`                                        |                 | RC30, RC35                                                                                                            |
| `building`       | `<light \| medium \| heavy>`                       |                 | RC30, RC35, RC100, RC300                                                                                              |
| `temp`           | `<degrees>`                                        | heating circuit | actual setpoint depending on mode                                                                                     |
| `mode`           | `<auto \| night \| day \| nofrost \| heat \| eco>` | heating circuit |                                                                                                                       |
| `manualtemp`     | `<degrees>`                                        | heating circuit | RC100, RC300                                                                                                          |
| `ecotemp`        | `<degrees>`                                        | heating circuit | RC100, RC300, Junkers                                                                                                 |
| `heattemp`       | `<degrees>`                                        | heating circuit | Junkers                                                                                                               |
| `comforttemp`    | `<degrees>`                                        | heating circuit | RC100, RC300                                                                                                          |
| `summermode`     | `<winter \| auto \| summer>`                       | heating circuit | RC100, RC300                                                                                                          |
| `summertemp`     | `<degrees>`                                        | heating circuit | RC30, RC35, RC100, RC300                                                                                              |
| `nighttemp`      | `<degrees>`                                        | heating circuit | RC20, RC30, RC35                                                                                                      |
| `daytemp`        | `<degrees>`                                        | heating circuit | RC20, RC30, RC35                                                                                                      |
| `nofrosttemp`    | `<degrees>`                                        | heating circuit | RC30, RC35, RC100, RC300, Junkers                                                                                     |
| `remotetemp`     | `<degrees>`                                        | heating circuit | RC30, RC35                                                                                                            |
| `control`        | `<off \| RC20 \| RC3x>`                            | heating circuit | RC30, RC35 (roomcontrol for hc)                                                                                       |
| `pause`          | `<hours>`                                          | heating circuit | RC30, RC35                                                                                                            |
| `party`          | `<hours>`                                          | heating circuit | RC30, RC35                                                                                                            |
| `holiday`        | `<dd.mm.yyyy-dd.mm.yyyy \| dd.mm.yyyy+dd.mm.yyyy>` | heating circuit | RC30, RC35, use `-` for 'away from home', `+` for 'at home'                                                           |
| `designtemp`     | `<degrees>`                                        | heating circuit | RC30, RC35, RC100, RC300                                                                                              |
| `offsettemp`     | `<degrees>`                                        | heating circuit | RC30, RC35, RC100, RC300                                                                                              |
| `holidaytemp`    | `<degrees>`                                        | heating circuit | RC30, RC35                                                                                                            |
| `roominfluence`  | `<degrees>`                                        | heating circuit | RC30, RC35, RC100, RC300                                                                                              |
| `minflowtemp`    | `<degrees>`                                        | heating circuit | RC30, RC35, RC100, RC300                                                                                              |
| `maxflowtemp`    | `<degrees>`                                        | heating circuit | RC30, RC35, RC100, RC300                                                                                              |
| `flowtempoffset` | `<degrees>`                                        | heating circuit | RC30, RC35                                                                                                            |
| `program`        | `<0 - 10 \| 1 - 9 \| 1 - 2>`                       | heating circuit | RC30, RC35, RC20, RC100, RC300                                                                                        |
| `controlmode`    | `<room \| outdoor>`                                | heating circuit | RC30, RC35, RC100, RC300                                                                                              |
| `reducemode`     | `<nofrost \| reduce \| room \| outdoor>`           | heating circuit | RC30, RC35                                                                                                            |
| `roomtemp`       | `<degrees>`                                        | heating circuit | only v2.2: fake HA-thermostat roomtemp, use `-1` to clear                                                             |
| `switchtime`     | `<nn.d.o.hh:mm>`                                   | heating circuit | only v3: set one of the programs switch times, nn=number(00-42), d=day(0-6), o=on(0,1), hh:mm=time, d=7 or o=7 clears |

## Examples

### via the command line

```bash
# GETs do not need authentication
% curl http://ems-esp.local/api/thermostat/temp

# POSTs (with -d) need authentication tokens
% curl http://ems-esp.local/api/thermostat/temp \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsInZlcnNpb24iOiIzLjEuMWIwIn0.qeGT53Aom4rDYeIT1Pr4BSMdeWyf4_zN9ue2c51ZnM0' \
  -d '{ "value" : 22.5 }'

# GET with authentication using query parameter with token
% curl http://ems-esp.local/api/system/settings\?access_token\="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsInZlcnNpb24iOiIzLjEuMWIwIn0.qeGT53Aom4rDYeIT1Pr4BSMdeWyf4_zN9ue2c51ZnM0"
```

### Using a Python script

```python
import requests
import json

url = "http://ems-esp.local/api/thermostat/temp"
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsInZlcnNpb24iOiIzLjEuMWIwIn0.qeGT53Aom4rDYeIT1Pr4BSMdeWyf4_zN9ue2c51ZnM0"
body = json.dumps({ "value": 22.5 })
headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }

response = requests.post(url, headers=headers, data=body, verify=False)

print(response.json())
```

## MQTT

MQTT uses the same format as the API. The **topic** matches the URL path except the `<hostname>` is replaced with the MQTT base name defined in the Settings. The **payload** the HTTP body data. You can use the extended JSON format with key/value's but its recommended to keep the payload as a single value.

Some examples:

| topic                        | payload        | action                                                                     |
| ---------------------------- | -------------- | -------------------------------------------------------------------------- |
| `ems-esp/system/send`        | `"XX XX...XX"` | send raw ems-command                                                       |
| `ems-esp/thermostat/seltemp` |                | sends seltemp device value information back on an `ems-esp/response` topic |
| `ems-esp/thermostat/mode`    | `"auto"`       | sets the thermostat mode to auto for hc1                                   |
