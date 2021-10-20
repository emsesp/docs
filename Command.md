EMS-ESP can repsond to external commands in a few ways:

- via the [**Console**](Console) with a `call <device> <command> <data> <id>`.
- via [**MQTT**](MQTT) in the payload with `{"cmd":"<command>" ,"data":<data>, "id":<id>}`. The MQTT topic being the `<device>`. Or directly via `<device>/<command>` or `<device>/hc<id>/<command>` with a payload `<data>`.
- or via the [**REST API**](Web) in a URL or a http POST. See the section below.

where

- `<device>` can be `system`, `dallassensor`, `boiler`, `thermostat`, `solar` or `mixer`.
- `<command>` are listed in the tables below. This is a mandatory parameter and always a string.
- `<data>` is the data value to be sent, either a string, boolean (true/false) or numerical value (integer or float). This parameter is optional.
- `<id>` is an additional integer identifier. `"hc":<id>` can also be used an alternative alias, for example to depict a heating circuit. This parameter is also optional.

## List of commands

The tables below list the available commands for each specific `device`.
To see which commands are available on your system, go into the Console and type `show commands`. This will list all the commands per device.

### `system`

| command        | data                                    | id       | comments                                                                                                                |
| -------------- | --------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `info`         |                                         |          | list system information                                                                                                 |
| `settings`     |                                         |          |                                                                                                                         |
| `commands`     |                                         |          | list all commands                                                                                                       |
| `send`         | `"XX XX...XX"`                          |          | send raw ems-command                                                                                                    |
| `fetch`        |                                         |          | fetch ems values from all devices                                                                                       |
| `publish`      | `[ha]`                                  |          | mqtt publish all values and optional HA-configuration, v3: also `publish [device]` to publish a single device on demand |
| `pin`          | `<on \|off \| 1 \| 0 \| true \| false>` | `<gpio>` | sets ESP's GPIO pins high/low                                                                                           |
| `watch`        | `<on \|off \| raw \| <type-id(hex)>`    |          | watch incoming telegrams                                                                                                |
| `syslog_level` | `<level>`                               |          | set syslog level                                                                                                        |

### `dallassensor`

| command    | data | id  | comments      |
| ---------- | ---- | --- | ------------- |
| `info`     |      |     | list values   |
| `commands` |      |     | list commands |

### `boiler`

> [!NOTE] The boiler commands below will vary depending on boiler type/brand and system configuration Some commands will not work because they are overwritten by controller or thermostat. In this case there are thermostat commands for this setting.

| command            | data                                        | id  | comments                                                                           |
| ------------------ | ------------------------------------------- | --- | ---------------------------------------------------------------------------------- |
| `info`             |                                             |     | list all values                                                                    |
| `commands`         |                                             |     | list all commands                                                                  |
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

### `thermostat`

> [!NOTE] The actual thermostat commands below will vary depending on which Thermostat brand and model you have.

| command          | data                                               | id                       | comments                                                                                                              |
| ---------------- | -------------------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `info`           |                                                    | `[0 \| heating circuit]` | REST API only, v3: id=0 for short names                                                                               |
| `commands`       |                                                    |                          | list all commands                                                                                                     |
| `datetime`       | `<ntp \| hh:mm:ss-dd.mm.yyyy-dw-dst>`              |                          | RC35, RC100, RC300, `dw`:day of week: 0-mo,.. `dst`:daylight saving 0/1                                               |
| `wwmode`         | `<off \| on \| auto>`                              |                          | RC100, RC300, RC30, RC35                                                                                              |
| `wwsettemp`      | `<degrees>`                                        |                          | RC100, RC300                                                                                                          |
| `wwsettemplow`   | `<degrees>`                                        |                          | RC100, RC300                                                                                                          |
| `wwcircmode`     | `<off \| on \| auto \| own>`                       |                          | RC30, RC35, RC100, RC300                                                                                              |
| `wwonetime`      | `<off \| on>`                                      |                          | RC100, RC300                                                                                                          |
| `clockoffset`    | `<seconds>`                                        |                          | RC30                                                                                                                  |
| `language`       | `<n>`                                              |                          | RC30 (0=de, 1=nl, 2=fr, 3=it)                                                                                         |
| `display`        | `<n>`                                              |                          | RC30 (0=int temp, 1= int set, 2=ext temp, 3=burner, 4=ww, 5=mode, 6=time, 7=date, 8=smoke)                            |
| `minexttemp`     | `<degrees>`                                        |                          | RC30, RC35, RC100, RC300                                                                                              |
| `calinttemp`     | `<degrees>`                                        |                          | RC30, RC35                                                                                                            |
| `building`       | `<light \| medium \| heavy>`                       |                          | RC30, RC35, RC100, RC300                                                                                              |
| `temp`           | `<degrees>`                                        | heating circuit          | actual setpoint depending on mode                                                                                     |
| `mode`           | `<auto \| night \| day \| nofrost \| heat \| eco>` | heating circuit          |                                                                                                                       |
| `manualtemp`     | `<degrees>`                                        | heating circuit          | RC100, RC300                                                                                                          |
| `ecotemp`        | `<degrees>`                                        | heating circuit          | RC100, RC300, Junkers                                                                                                 |
| `heattemp`       | `<degrees>`                                        | heating circuit          | Junkers                                                                                                               |
| `comforttemp`    | `<degrees>`                                        | heating circuit          | RC100, RC300                                                                                                          |
| `summermode`     | `<winter \| auto \| summer>`                       | heating circuit          | RC100, RC300                                                                                                          |
| `summertemp`     | `<degrees>`                                        | heating circuit          | RC30, RC35, RC100, RC300                                                                                              |
| `nighttemp`      | `<degrees>`                                        | heating circuit          | RC20, RC30, RC35                                                                                                      |
| `daytemp`        | `<degrees>`                                        | heating circuit          | RC20, RC30, RC35                                                                                                      |
| `nofrosttemp`    | `<degrees>`                                        | heating circuit          | RC30, RC35, RC100, RC300, Junkers                                                                                     |
| `remotetemp`     | `<degrees>`                                        | heating circuit          | RC30, RC35                                                                                                            |
| `control`        | `<off \| RC20 \| RC3x>`                            | heating circuit          | RC30, RC35 (roomcontrol for hc)                                                                                       |
| `pause`          | `<hours>`                                          | heating circuit          | RC30, RC35                                                                                                            |
| `party`          | `<hours>`                                          | heating circuit          | RC30, RC35                                                                                                            |
| `holiday`        | `<dd.mm.yyyy-dd.mm.yyyy \| dd.mm.yyyy+dd.mm.yyyy>` | heating circuit          | RC30, RC35, use `-` for 'away from home', `+` for 'at home'                                                           |
| `designtemp`     | `<degrees>`                                        | heating circuit          | RC30, RC35, RC100, RC300                                                                                              |
| `offsettemp`     | `<degrees>`                                        | heating circuit          | RC30, RC35, RC100, RC300                                                                                              |
| `holidaytemp`    | `<degrees>`                                        | heating circuit          | RC30, RC35                                                                                                            |
| `roominfluence`  | `<degrees>`                                        | heating circuit          | RC30, RC35, RC100, RC300                                                                                              |
| `minflowtemp`    | `<degrees>`                                        | heating circuit          | RC30, RC35, RC100, RC300                                                                                              |
| `maxflowtemp`    | `<degrees>`                                        | heating circuit          | RC30, RC35, RC100, RC300                                                                                              |
| `flowtempoffset` | `<degrees>`                                        | heating circuit          | RC30, RC35                                                                                                            |
| `program`        | `<0 - 10 \| 1 - 9 \| 1 - 2>`                       | heating circuit          | RC30, RC35, RC20, RC100, RC300                                                                                        |
| `controlmode`    | `<room \| outdoor>`                                | heating circuit          | RC30, RC35, RC100, RC300                                                                                              |
| `reducemode`     | `<nofrost \| reduce \| room \| outdoor>`           | heating circuit          | RC30, RC35                                                                                                            |
| `roomtemp`       | `<degrees>`                                        | heating circuit          | only v2.2: fake HA-thermostat roomtemp, use `-1` to clear                                                             |
| `switchtime`     | `<nn.d.o.hh:mm>`                                   | heating circuit          | only v3: set one of the programs switch times, nn=number(00-42), d=day(0-6), o=on(0,1), hh:mm=time, d=7 or o=7 clears |

### `mixer`

| command    | data | id                  | comments      |
| ---------- | ---- | ------------------- | ------------- |
| `info`     |      | `[heating circuit]` | list values   |
| `commands` |      |                     | list commands |

### `solar`

| command    | data | id  | comments      |
| ---------- | ---- | --- | ------------- |
| `info`     |      |     | list values   |
| `commands` |      |     | list commands |

### `heatpump`

| command    | data | id  | comments      |
| ---------- | ---- | --- | ------------- |
| `info`     |      |     | list values   |
| `commands` |      |     | list commands |

# REST API

OpenAPI is an open standard specification for describing REST APIs. From the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification):

> The OpenAPI Specification (OAS) defines a standard, programming language-agnostic interface description for HTTP APIs, which allows both humans and computers to discover and understand the capabilities of a service without requiring access to source code, additional documentation, or inspection of network traffic. When properly defined via OpenAPI, a consumer can understand and interact with the remote service with a minimal amount of implementation logic. Similar to what interface descriptions have done for lower-level programming, the OpenAPI Specification removes guesswork in calling a service.

## Specification

- All data is sent and received as JSON.
- The URL is `http://<hostname>/api` with the default `<hostname>` being `ems-esp`. Note that it may also be ems-esp.local on some environments depending on your domain and dns setup.
- Only HTTP for now. HTTPS will be supported soon, with self-signed certificates or user's own.
- The EMS-ESP REST API will eventually be fully described in an OpenAPI 3.0 compliant document, available via [postman](https://www.postman.com/collections/479af3935991ac030130).
- Read instructions to fetch data use HTTP `GET` and operations that change data use HTTP `POST`, `PUT` or `PATCH`.
- To keep backwards compatibility with earlier versions, parameters can also be provided as HTML query parameters (name-value pairs) as opposed to URI path parameters. For example `POST http://ems-esp/api/boiler/wwtemp` with a JSON body of `{value: 50}` is the same as the URL `http://ems-esp/api?device=boiler?cmd=wwtemp?data=50`.
- Unless explicitly bypassed in the WebUI some operations required admin privileges in the form of an Access Token which can be generated from the Web UI's Security tab. An Access Token is a string 152 characters long. Token's do not expire. The token needs to be either embedded into the HTTP Header as `"Authorization: Bearer {ACCESS_TOKEN}"` or as query parameter `?access_token={ACCESS_TOKEN}`. To test you can use a command line instruction like

  ```bash
    % curl -i -H "Authorization: Bearer {ACCESS_TOKEN}" -X GET http://ems-esp/api/system/settings
    % curl -i -H "Authorization: Bearer {ACCESS_TOKEN}" -H "Content-Type: application/json" -d '{ "name": "wwtemp", "value":60}' http://ems-esp/api/boiler
    % curl -i http://ems-esp.local/api/system/settings\?access_token\="{ACCESS_TOKEN}"
  ```

## Error handling

- Requests that require authentication will return `403 Forbidden`
- Authenticating with invalid credentials will return `401 Unauthorized`

  ```html
  HTTP/1.1 401 Unauthorized {"message": "Bad credentials"}
  ```

- Sending invalid JSON will result in a `400 Bad Request` response.

  ```html
  HTTP/1.1 400 Bad Request {"message":"Problems parsing JSON"}
  ```

- Sending invalid fields will result in a `422 Unprocessable Entity` response.

  ```html
  HTTP/1.1 422 Unprocessable Entity {"message":"Invalid command"}
  ```

## Endpoints

### types

- `<string>` is a character string
- `<integer>` is a positive integer value
- `<number>` is an integer or floating point number
- `<boolean>` is either 1, 0, "1", "0", "on", "off", "true" or "false"

### descriptions

- `{device}` is boiler, thermostat, mixer, solar, heatpump, dallassensor
- `{name}` is the short name of the parameter, e.g. **curflowtemp**
- `{command}` is a command such as `info`, `commands`
- `{hc}` is the heating circuit number as a string, like **hc1**, **hc2** etc
- `{value}` is either a `<string>`, `<integer>`, `<number>` or `<boolean>`

## Device Endpoints

| Method   | Endpoint                                                | Description                                                                                                                                                                                                           | Access Token required | JSON body data                                                 |
| -------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------- |
| GET      | `/{device}`                                             | return all device details and values                                                                                                                                                                                  |                       |                                                                |
| GET      | `/{device}/:name`                                       | return a specific parameter and all its properties (name, fullname, value, type, min, max, unit, writeable)                                                                                                           |                       |                                                                |
| GET      | `/{device}/:command`                                    | calls a command, like `info`, `commands`                                                                                                                                                                              |                       |                                                                |
| GET      | `/device={device}?cmd={name}?data={value}[?hc=<number>` | Using HTTP query parameters. This is to keep compatibility with v2. Unless bypassed in the EMS-ESP settings make sure you include `access_token={ACCESS_TOKEN}`                                                       | x                     |
| POST/PUT | `/{device}[/{hc\|wwc}][/{name}]`                        | sets a specific value to a parameter name. If no hc is selected and one is required for the device, the default will be used. The `hc` or `wwc` are only used with the `mixer` and `thermostat` devices, and optional | x                     | `{ ["name" : <string>] , ["hc": <number>], "value": <value> }` |

## System Endpoints

| Method   | Endpoint               | Description                         | Access Token required | JSON body data                                           |
| -------- | ---------------------- | ----------------------------------- | --------------------- | -------------------------------------------------------- |
| GET      | `/system/info`         | list system information             |                       |                                                          |
| GET      | `/system/settings`     | list all settings, except passwords |                       |
| GET      | `/system/commands`     | list all commands                   |                       |
| POST/PUT | `/system/pin`          | switch a GPIO state to HIGH or LOW  | x                     | `{ "id":<gpio>, "value":<boolean> }`                     |
| POST/PUT | `/system/send`         | send a telegram to the EMS bus      | x                     | `{ "value" : <string> }`                                 |
| POST/PUT | `/system/publish`      | force an MQTT publish               | x                     | `{ "value" : <device> \| "ha" }`                         |
| POST/PUT | `/system/fetch`        | fetch all EMS data from all devices | x                     | `{ "value" : <device> \| "all" }`                        |
| POST/PUT | `/system/watch`        | watch incoming telegrams            | x                     | `{ "value" : "off" \| "on" \| "raw" \| <type-id(hex)> }` |
| POST/PUT | `/system/syslog_level` | set syslog level                    | x                     | `{ "value" : <level> }`                                  |
| POST/PUT | `/system/restart`      | restarts EMS-ESP                    | x                     |                                                          |

## Examples

### From command line

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

### Using Python

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
