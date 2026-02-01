---
id: Commands
title: Commands and API Reference
description: Complete command reference for controlling EMS-ESP via Console, MQTT, and REST API
---
# Commands

EMS-ESP has a command API which can be used to read and write values to EMS device and call specific commands.

There are 3 methods commands can be invoked:

- via the [**Console**](#console) using Telnet or Serial
- via [**HTTP**](#http) using RESTful API calls
- via [**MQTT**](#mqtt) via topics and their payloads

## Definitions

:::info Important Definitions - `<device>` is the short-name. It can be either:

    - a EMS Device and supported devices include: `boiler` `thermostat` `mixer` `heatpump` `solar` `gateway` `switch` `controller` `pump` `generic` `heatsource` `ventilation`
        * the EMS-ESP system itself identified as `system`
        * the Dallas temperature sensors as `temperaturesensor`
        * any custom Analog sensors as `analogsensor`
        * any EMS telegram custom entities as `custom`
    - `<command>` is the name of either
        * a generic command, or
        * an EMS device entity also referred to as an `<entity>`. See the [Supported Devices](All-Entities) page for the complete list
    - `<id>` is an optional identifier and has different meanings depending on the context
    - `<data>` is used to represent the value to read or write. It can be either a single value as any type (integer, float, string or boolean) or a JSON object {} string containing multiple key/values pairs as:

        * **"cmd"** is the `<command>`. The key **"cmd"** may also be substituted for **"entity"**.
        * **"value"** is the value and can be either a text string in quotes, an integer, float of boolean. **"data"** is an alias that can also be used instead for the key.
        * **"hc"**, **"wwc"** and **"id"** are all are used to represent a value or in the context of an EMS Device a heating or warm water circuit.

    - A boolean value can be represented in many forms:

        * as a True value, "TRUE", "yes", true, "true", "on", 1
        * as a False value, "FALSE", "no", false, "false", "off", 0

    - The bearer Access Token (JWT) is used to authenticate HTTP requests and can be obtained from the WebUI's `Settings->Security->Manage Users` page and then clicking on the key icon for the user that has admin privileges (`is Admin` set). The token is generated using a combination of the username and a secret key which is the super user (su) password found in the WebUI's `Settings->Security->Security Settings` page. This 152 character long string must be included in the HTTP header as `"Authorization: Bearer {ACCESS_TOKEN}"`. Note the token has no expiry date.

:::

## Console

- Commands can be executed using the `call` command
- You need to be admin to use the `call` command. First `su` and enter the password
- For a list of all available commands you can use `show commands`
- The syntax is `call <device> <command> [data] [id]`
- For a complete list of commands use `call <device> commands`

For more information on how to use the Telnet Console see the [**Console**](Console) section.

## HTTP

Things to note:

- The REST API follows the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification)
- The URL path always starts with `http://<hostname>/api/`
- `<hostname>` is either an IP address or the mDNS name, which default is `ems-esp.local`
- Some commands require security authentication, unless disabled via an EMS-ESP setting. The authentication is in the form of an Access Token which is generated from the WebUI's Security->Manage Users and then clicking on the key button for the admin user. The 152 character long string must be included in the HTTP header like `"Authorization: Bearer {ACCESS_TOKEN}"`. The tokens have no expiry date
- With HTTP POST commands an HTTP body may be required. This can be in the form of either plain text or as a JSON object `<data>`, the Content-Type-header has to be set to `application/json` in both cases.
- HTTPS with self-signed certificates are not yet supported
- For a complete list of commands use `http://<hostname>/api/<device>/commands`
- using ems-esp v2-api style GET commands is still supported (`http://<hostname>/api?device=<device>&id=<id>&cmd=<cmd>`)

### Reading and Writing EMS Device information

The URL path is `http://<hostname>/api/<device>/`

| `endpoint`       | `HTTP method` | `action`                                                             | `authentication required?` | `post body` |
| --------------- | ----------- | ------------------------------------------------------------------ | ------------------------ | --------- |
| `info`          | `GET`         | outputs current EMS device information in verbose                  | no                       |           |
| `values`        | `GET`         | outputs current EMS device information in short format             | no                       |           |
| _(empty)_       | `GET`         | same as `values` above                                             | no                       |           |
| `commands`      | `GET`         | lists the available command entities to call                       | no                       |           |
| `entities`      | `GET`         | lists all enabled entities                                         | no                       |           |
| `{entity}`      | `GET`         | outputs details of a specific entity, for reading                  | no                       |           |
| `{entity}/{hc}` | `GET`         | same as the read command above but for a specific heating circuit  | no                       |           |
| `{entity}`      | `POST`        | updates a entity value, for writing                                | yes                      | `<data>`  |
| `{entity}/{hc}` | `POST`        | same as the write command above but for a specific heating circuit | yes                      | `<data>`  |

Examples:

| URL                                               | post body                                                    | action                                                                           |
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `http://ems-esp.local/api/thermostat/seltemp`     | `22`                                                         | sets the selected room temperature of the master thermostat on heating circuit 1 |
| `http://ems-esp.local/api/thermostat/hc2/seltemp` | `{"data":22}`                                                | sets the selected room temperature of the master thermostat on heating circuit 2 |
| `http://ems-esp.local/api/thermostat/mode`        | `'auto'`                                                     | sets the thermostat mode to auto for heating circuit 1                           |
| `http://ems-esp.local/api/thermostat`             | `{"cmd":"mode", "data":"auto"}`                              | sets the thermostat mode to auto for heating circuit 1                           |
| `http://ems-esp.local/api/thermostat`             | `{"cmd":"seltemp", "data":23, "hc":3}`                       | sets the selected room temperature to 23 degrees for for heating circuit 3       |
| `http://ems-esp.local/api/thermostat/hc2`         | `{"cmd":"seltemp", "data":20.5}`                             | sets the selected room temperature to 20.5 degrees for for heating circuit 2     |
| `http://ems-esp.local/api`                        | `{"device":"thermostat", cmd":"seltemp", "data":23, "hc":3}` | sets the selected room temperature of the master thermostat on heating circuit 3 |

### Fetching and writing to custom entities

The URL path is `http://<hostname>/api/custom/`

| endpoint             | HTTP method | action                                                   | authentication required? | post body |
| -------------------- | ----------- | -------------------------------------------------------- | ------------------------ | --------- |
| blank or `info`      | `GET`         | outputs all custom entities and their values             | no                       |           |
| `commands`           | `GET`         | lists the available custom entity commands               | no                       |           |
| `<name>`             | `GET`         | outputs all characteristics for a specific custom entity | no                       |           |
| `<name>/<attribute>` | `GET`         | outputs for a attribute of a specific custom entity      | no                       |           |
| `<name>`             | `POST`        | updates a custom entity value, for writing               | yes                      | `<data>`  |

### Fetching Temperature Sensor information

The URL path is `http://<hostname>/api/temperaturesensor/`

| endpoint       | HTTP method | action                                                          | authentication required? | post body |
| -------------- | ----------- | --------------------------------------------------------------- | ------------------------ | --------- |
| blank          | `GET`         | outputs connected Dallas temperature sensor names and readings  | no                       |           |
| `info`         | `GET`         | outputs all details on the connected Dallas temperature sensors | no                       |           |
| `<name>`       | `GET`         | outputs all characteristics for a specific temperature sensors  | no                       |           |
| `<name>/value` | `GET`         | outputs the value of a specific temperature sensor              | no                       |           |

### Controlling the Analog Sensors

The URL path is `http://<hostname>/api/analogsensor/`

| endpoint   | HTTP method | action                                                             | authentication required? | post body                      |
| ---------- | ----------- | ------------------------------------------------------------------ | ------------------------ | ------------------------------ |
| blank      | `GET`         | outputs analog sensors and their readings                          | no                       |                                |
| `info`     | `GET`         | outputs all details on the connected analog sensors                | no                       |                                |
| `<name>`   | `GET`         | outputs all characteristics for a specific analog sensors          | no                       |                                |
| `commands` | `GET`         | lists the available system commands                                | no                       |                                |
| `setvalue` | `POST`        | set value/offset of counter or output pin, +/- sign corrects value | yes                      | `{"value":<val>, "id":<gpio>}` |
| `<name>`   | `POST`        | set value/offset of counter or output pin, +/- sign corrects value | yes                      | `{"value":<val>}`              |

### System Commands

The URL path is `http://<hostname>/api/system/<endpoint>`

| endpoint                 | HTTP method | action                                                                                            | authentication required? | post body                                        |
| ------------------------ | ----------- | ------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------ |
| `info` or blank          | `GET`         | outputs current system information                                                                | no                       |                                                  |
| `fetch`                  | `GET`         | forces at refresh of all device values                                                            | no                       |                                                  |
| `restart`                | `GET`         | restarts EMS-ESP                                                                                  | yes                      |                                                  |
| `format`                 | `GET`         | factory reset's EMS-ESP                                                                           | yes                      |                                                  |
| `commands`               | `GET`         | lists the available system commands                                                               | no                       |                                                  |
| `send`                   | `POST`        | send telegram to the EMS bus                                                                      | yes                      | `"XX XX...XX"`                                   |
| `message`                | `POST`        | send a message to the log and MQTT. The message can also a logic command as used in the Scheduler | yes                      | `".."` or `'{"value":"system/settings/locale"}'` |
| `publish`                | `POST`        | MQTT publish all values, and optional HA-configuration or specific for a device                   | no                       | `[ha] \| [device]`                               |
| `watch`                  | `POST`        | watch incoming telegrams                                                                          | no                       | `<on \|off \| raw \| <type-id(hex)>`             |
| `values`                 | `GET`         | outputs all values in short format                                                                | no                       |                                                  |
| `read`                   | `GET`         | queries a specific EMS device and a typeID                                                        | yes                      | `<deviceID> <type ID> [offset] [length]`         |
| `response`               | `GET`         | outputs the last response from EMS-ESP                                                            | no                       |                                                  |
| `entities`               | `GET`         | lists all enabled entities                                                                        | no                       |                                                  |
| `mqtt/enabled`           | `GET`         | enable/disable MQTT                                                                               | yes                      | `<bool>`                                         |
| `ap/enabled`             | `GET`         | enable/disable Access Point                                                                       | yes                      | `<bool>`                                         |
| `settings/analogenabled` | `GET`         | enable/disable analog sensor                                                                      | yes                      | `<bool>`                                         |
| `settings/hideled`       | `GET`         | enable/disable LED                                                                                | yes                      | `<bool>`                                         |
| `settings/showeralert`   | `GET`         | enable/disable shower alert                                                                       | yes                      | `<bool>`                                         |
| `settings/showertimer`   | `GET`         | enable/disable shower timer                                                                       | yes                      | `<bool>`                                         |
| `syslog/enabled`         | `GET`         | enable/disable syslog                                                                             | yes                      | `<bool>`                                         |

### Examples

:::tip note
In these examples the URL is `http://ems-esp.local/api/` but adjust to your actual hostname. Also the change the bearer access token to your own as described in the [Definitions](#definitions) section.
:::

#### ...via the command line

```bash
# Most GETs do not need authentication
% curl http://ems-esp.local/api/thermostat/seltemp

# POSTs (with -d) need authentication tokens
% curl http://ems-esp.local/api/thermostat/seltemp \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsInZlcnNpb24iOiIzLjEuMWIwIn0.qeGT53Aom4rDYeIT1Pr4BSMdeWyf4_zN9ue2c51ZnM0' \
  -d '{ "value" : 22.5 }'

# GET with authentication using query parameter with token
% curl http://ems-esp.local/api/system/publish\?access_token\="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsInZlcnNpb24iOiIzLjEuMWIwIn0.qeGT53Aom4rDYeIT1Pr4BSMdeWyf4_zN9ue2c51ZnM0"

# GET to restart EMS-ESP
curl http://ems-esp.local/api/system/restart -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsInZlcnNpb24iOiIzLjEuMWIwIn0.qeGT53Aom4rDYeIT1Pr4BSMdeWyf4_zN9ue2c51ZnM0'

# This example will get the system info, via a GET request
curl -X GET ${emsesp_url}/api/system/info

# This example will execute a read command on product ID 8 and type ID 1
curl -X POST \
    -H "Authorization: Bearer ${emsesp_token}" \
    -H "Content-Type: application/json" \
    -d '{"data":"8 1"}' \
    ${emsesp_url}/api/system/read

# This example will export all values to a json file, including custom entities, sensors and schedules
curl -X POST \
    -H "Authorization: Bearer ${emsesp_token}" \
    -H "Content-Type: application/json" \
    -d '{"action":"export", "param":"allvalues"}' \
    ${emsesp_url}/rest/action

```

#### ...using a Python script

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

MQTT uses the same format as the API, but with a few differences. For the **topic** the `<hostname>` is replaced with the MQTT Base name as defined in the Settings (default is `ems-esp`). The `<device>` follows the same names as listed at the top of this page. For example `ems-esp/thermostat/<entity>` or `ems-esp/custom/<name>`.

The MQTT **payload** is the same as the `<data>` as described above and used in the API, and can be a JSON object or a string.

Examples:

| topic                           | payload                                | action                                                                                 |
| ------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| `ems-esp/system/send`           | `XX XX...XX`                           | send raw ems-command                                                                   |
| `ems-esp/thermostat/seltemp`    |                                        | fetches the seltemp entity values and publishes it in the topic `ems-esp/response`     |
| `ems-esp/thermostat/seltemp`    | `23`                                   | change the selected setpoint temperature to 23 degrees on the master thermostat on hc1 |
| `ems-esp/thermostat/mode`       | `auto`                                 | sets the thermostat mode to auto for hc1                                               |
| `ems-esp/thermostat`            | `{"cmd":"mode","value":"heat","id":1}` | sets the thermostat mode to heat for hc1                                               |
| `ems-esp/custom/myCustomEntity` | `7`                                    | sets the value of the EMS-ESP Custom Entity named `myCustomEntity` to 7                |

### Publishing Commands

EMS-ESP will MQTT 'subscribe' to specific topics depending on the EMS devices attached. For example `boiler`, `thermostat` etc.

Commands can be sent to EMS-ESP via these MQTT topics using the payload format:

```json
{"cmd":"<cmd>", "data":<data>, "id":<n>}
```

where

- `cmd` is one of the commands listed in the [Commands](Commands) and **_must_** be enclosed in quotes as a String. The key `entity` may also be used instead of `cmd`.
- `data` (or `value`) holds the value for the command, and can be either a String or numeric value.
- `id` is used as an generic indicator. `hc`, `wwc`, `ahs` and `hs` are other suppoerted aliases. For example with `hc` it is used to indicated a specific Heating Circuit. A numeric value or String can be both used.

Some more examples:

| topic                             | payload                                   | action                                                           |
| --------------------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| `ems-esp/boiler`                  | `{"cmd":"heatingactivated", "data":"on"}` | turn on heatingactivated in boiler                               |
| `ems-esp/boiler/heatingactivated` | `{"data":"on"}`                           | turn on DHW disinfecting in boiler (equivalent to command above) |
| `ems-esp/boiler`                  | `{"cmd":"dhw.disinfecting", "data":"on"}` | turn on DHW disinfecting in boiler                               |

You can check the log in Status - System Log if the command was accepted by EMS-ESP.

The first command in the table above was valid and thus accepted:\
Topic:`ems-esp/boiler` Command/payload: `{"cmd":"heatingactivated", "data":"on"}`

```
[command] Called command boiler/heatingactivated (heating activated) with value on
```

And the following bogus command is not accepted:\
Topic:`ems-esp/boiler` Command/payload: `{"cmd":"heatingactivated", "data":"5000"}`

```
[command] Command failed: no values in boiler
[mqtt] MQTT command failed with error no values in boiler (Error)
```

:::note You can easily test the MQTT commands with [MQTT Explorer](https://www.mqtt-explorer.com). Just connect to the MQTT broker and publish the payload to the topic.
:::

With Home Assistant, Thermostat commands can also be sent to control individual heating circuits via sending a mode string or temperature number to a topic `thermostat_hc<n>`.

Depending on mqtt-settings there are also direct subscriptions for each value like `boiler/wwtemp`, `thermostat/hc1/daytemp`, etc. Thermostats which supports only a single heating circuits will subscribe to `/thermostat/daytemp`.

You can also use MQTT to send a specific read request and the telegram response will be returned in a topic called `response`. For example sending the payload `{"cmd":"send", "data":"0B 88 19 19 02"}` to `ems-esp/system` will result in a topic `response` being published with the data `{"src":"08","dest":"0B","type":"19","offset":"19","data":"7D 00","value":32000}`.
