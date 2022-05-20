EMS-ESP has a command API which can be used to read and write values to EMS device and call specific commands.

There are 3 methods commands can be invoked:

- via the [**Console**](Command?id=console)
- via [**HTTP**](Command?id=http-api)
- via [**MQTT**](Command?id=MQTT)

## Definitions

- `<device>` is the short-name of either
  - an EMS Device such as `boiler`, `thermostat`, `mixer`, `heatpump`, `solar` or `gateway`
  - the EMS-ESP system itself as `system`
  - the Dallas temperature sensors as `dallassensor`
- `<command>` is the name of either
  - a generic command, or
  - an EMS device entity also referred to as an `<entity>`. See the [table below](Command?id=ems-device-entity-names) for the complete list
- `<id>` is an optional identifier and has different meanings depending on the context
- `<data>` is used to represent the value to read or write. It can be either:
  - a single value. This can be of any type; integer, float, string or boolean
  - as a JSON object containing the following optional key/values:
    - **"cmd"** is the `<command>`. The key **"cmd"** may also be substituted for **"entity"**.
    - **"value"** is the value and can be either a text string in quotes, an integer, float of boolean. **"data"** is an alias that can also be used instead for the key.
    - **"hc"**, **"wwc"** and **"id"** are all are used to represent a value or in the context of an EMS Device a heating or warm water circuit.

Note: A boolean value can be represented in many forms:

- as a True value, "TRUE", "yes", true, "true", "on", 1
- as a False value, "FALSE", "no", false, "false", "off", 0

## Console

- Commands can be executed using the `call` command
- You need to be admin to use the `call` command. First `su` and enter the password
- For a list of all available commands you can use `show commands`
- The syntax is `call <device> <command> <data> <id>`

For more information on how to use the Telnet Console see the [**Console**](Console) section.

## HTTP API

Things to note:

- The REST API follows the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification)
- The URL path always starts with `http://<hostname>/api/`
- `<hostname>` is either an IP address or the mDNS name, which default is `ems-esp.local`
- Some commands require can be dangerous and require security authentication, unless disabled via an EMS-ESP setting. The authentication is in the form of an Access Token which is generated from the Web UI's Security tab. The 152 character long string must be included in the HTTP header like `"Authorization: Bearer {ACCESS_TOKEN}"`. The tokens have no expiry date
- With HTTP PUSH/PUT/PATCH commands an HTTP body may be required. This can be in the form of either plain text or as a JSON object `<data>`
- HTTPS with self-signed certificates are not yet supported

### Reading and Writing EMS Device information

The URL path is `http://<hostname>/api/<device>/`

| endpoint        | HTTP method | action                                                             | authentication required? | body     |
| --------------- | ----------- | ------------------------------------------------------------------ | ------------------------ | -------- |
| `info`          | GET         | outputs current EMS device information in verbose                  | no                       |          |
| `values`        | GET         | outputs current EMS device information in short format             | no                       |          |
| _(empty)_       | GET         | same as `values` above                                             | no                       |          |
| `commands`      | GET         | lists the available commands or entities to call                   | no                       |
| `entities`      | GET         | lists the matching Home Assistant entities (HA only)               | no                       |          |
| `{entity}`      | GET         | outputs details of a specific entity, for reading                  | no                       |          |
| `{entity}/{hc}` | GET         | same as the read command above but for a specific heating circuit  | no                       |          |
| `{entity}`      | POST        | updates a entity value, for writing                                | yes                      | `<data>` |
| `{entity}/{hc}` | POST        | same as the write command above but for a specific heating circuit | yes                      | `<data>` |

Examples:

| URL                                        | body                                   | action                                                                           |
| ------------------------------------------ | -------------------------------------- | -------------------------------------------------------------------------------- |
| `http://ems-esp.local/api/thermostat/temp` | `22`                                   | sets the selected room temperature of the master thermostat on heating circuit 1 |
| `http://ems-esp.local/api/thermostat`      | `{"cmd":"mode", "data":"auto"}`        | sets the thermostat mode to auto for heating circuit 1                           |
| `http://ems-esp.local/api/thermostat`      | `{"cmd":"seltemp", "data":23, "hc":3}` | sets the room temperature to 23 degrees for for heating circuit 3                |
| `http://ems-esp.local/api/thermostat/hc2`  | `{"cmd":"seltemp", "data":20.5}`       | sets the room temperature to 20.5 degrees for for heating circuit 2              |

### System Commands

The URL path is `http://<hostname>/api/system/<endpoint>`

| endpoint       | HTTP method | action                                                                          | authentication required? | body                                 |
| -------------- | ----------- | ------------------------------------------------------------------------------- | ------------------------ | ------------------------------------ |
| `info`         | GET         | outputs current system information                                              | no                       |
| `fetch`        | GET         | forces at refresh of all device values                                          | no                       |                                      |
| `restart`      | GET         | restarts EMS-ESP                                                                | yes                      |                                      |
| `commands`     | GET         | lists the available system commands                                             | no                       |                                      |
| `send`         | POST        | send telegram to the EMS bus                                                    | yes                      | `"XX XX...XX"`                       |
| `publish`      | POST        | MQTT publish all values, and optional HA-configuration or specific for a device | yes                      | `[ha] \| [device]`                   |
| `watch`        | POST        | watch incoming telegrams                                                        | yes                      | `<on \|off \| raw \| <type-id(hex)>` |
| `syslog_level` | POST        | set syslog level                                                                | yes                      | `<level>`                            |

### Fetching Dallas temperature sensor information

The URL path is `http://<hostname>/api/dallassensor/`

| endpoint | HTTP method | action                                        | authentication required? | body |
| -------- | ----------- | --------------------------------------------- | ------------------------ | ---- |
| `info`   | GET         | outputs connected Dallas sensors and readings | no                       |

### Fetching analog sensor information

The URL path is `http://<hostname>/api/analogsensor/`

| endpoint   | HTTP method | action                                                             | authentication required? | body                           |
| ---------- | ----------- | ------------------------------------------------------------------ | ------------------------ | ------------------------------ |
| `info`     | GET         | outputs configured analog sensors and readings                     | no                       |                                |
| `commands` | GET         | lists the available system commands                                | no                       |                                |
| `setvalue` | POST        | set value/offset of counter or output pin, +/- sign corrects value | yes                      | `{"value":<val>, "id":<gpio>}` |

## EMS Device Entity Names

The tables below list the available commands (or entities) for each specific EMS device. These replace the `<entity>` in the URL.

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
| `wwcirc`           | `<off \| on>`                               |     | Overwritten by some thermostats, see thermostat commands                           |
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
| `datetime`       | `<ntp \| dd.mm.yyyy-hh:mm:ss-dw-dst>`              |                 | RC35, RC100, RC300, `dw`:day of week: 0-mo,.. `dst`:daylight saving 0/1                                               |
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
| `daytemp2`       | `<degrees>`                                        | heating circuit | RC20                                                                                                                  |
| `daytemp3`       | `<degrees>`                                        | heating circuit | RC20                                                                                                                  |
| `daytemp4`       | `<degrees>`                                        | heating circuit | RC20                                                                                                                  |
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

### ...via the command line

```bash
# GETs do not need authentication
% curl http://ems-esp.local/api/thermostat/temp

# POSTs (with -d) need authentication tokens
% curl http://ems-esp.local/api/thermostat/temp \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsInZlcnNpb24iOiIzLjEuMWIwIn0.qeGT53Aom4rDYeIT1Pr4BSMdeWyf4_zN9ue2c51ZnM0' \
  -d '{ "value" : 22.5 }'

# GET with authentication using query parameter with token
% curl http://ems-esp.local/api/system/publish\?access_token\="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsInZlcnNpb24iOiIzLjEuMWIwIn0.qeGT53Aom4rDYeIT1Pr4BSMdeWyf4_zN9ue2c51ZnM0"

# GET to restart EMS-ESP
curl http://ems-esp.local/api/system/restart -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsInZlcnNpb24iOiIzLjEuMWIwIn0.qeGT53Aom4rDYeIT1Pr4BSMdeWyf4_zN9ue2c51ZnM0'
```

### ...using a Python script

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

MQTT uses the same format as the API.

The **topic** matches the URL path except the `<hostname>` is replaced with the MQTT Base name as defined in the Settings (default is ems-esp).

The **payload** is the same as the `<data>` as described above and used in the API.

Examples:

| topic                        | payload                                          | action                                                                                  |
| ---------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `ems-esp/system/send`        | `"XX XX...XX"`                                   | send raw ems-command                                                                    |
| `ems-esp/thermostat/seltemp` |                                                  | fetches the seltemp entity values and publishes it in the topic `ems-esp/response`      |
| `ems-esp/thermostat/seltemp` | `23`                                             | change the selected setpoint temperature to 23 degreees on the master thermostat on hc1 |
| `ems-esp/thermostat/mode`    | `"auto"`                                         | sets the thermostat mode to auto for hc1                                                |
| `ems-esp/thermostat`         | `{\"cmd\":\"mode\",\"value\":\"heat\",\"id\":1}` | sets the thermostat mode to heat for hc1                                                |
