EMS-ESP has a command API which can be used to read and write values to EMS device and call specific commands.

There are 3 methods commands can be invoked:

- via the [**Console**](#console) using Telnet CLI
- via [**HTTP**](#http) using RESTful HTTP calls
- via [**MQTT**](#mqtt) via topics their payloads

## Definitions

First some important definitions.

<!-- prettier-ignore -->
!!! important
    - `<device>` is the short-name. It can be either
        1. an EMS Device and supported devices include: `boiler` `thermostat` `mixer` `heatpump` `solar` `gateway` `switch` `controller` `pump` `generic` `heatsource` `ventilation`
        - the EMS-ESP system itself identified as `system`
        - the Dallas temperature sensors as `temperaturesensor`
        - any custom Analog sensors as `analogsensor`
        - any EMS telegram custom entities as `custom`
    - `<command>` is the name of either
        - a generic command, or
        - an EMS device entity also referred to as an `<entity>`. See the [Supported Devices](All-Devices) page for the complete list
    - `<id>` is an optional identifier and has different meanings depending on the context
    - `<data>` is used to represent the value to read or write. It can be either a single value as any type (integer, float, string or boolean) or a JSON object {} string containing multiple key/values pairs as:
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

## HTTP

Things to note:

- The REST API follows the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification)
- The URL path always starts with `http://<hostname>/api/`
- `<hostname>` is either an IP address or the mDNS name, which default is `ems-esp.local`
- Some commands require can be dangerous and require security authentication, unless disabled via an EMS-ESP setting. The authentication is in the form of an Access Token which is generated from the WebUI's Security->Manage Users and then clicking on the key button for the admin user. The 152 character long string must be included in the HTTP header like `"Authorization: Bearer {ACCESS_TOKEN}"`. The tokens have no expiry date
- With HTTP PUSH/PUT/PATCH commands an HTTP body may be required. This can be in the form of either plain text or as a JSON object `<data>`
- HTTPS with self-signed certificates are not yet supported

### Reading and Writing EMS Device information

The URL path is `http://<hostname>/api/<device>/`

<!-- prettier-ignore -->
| endpoint | HTTP method | action | authentication required? | post body |
| - | - | - | - | - |
| `info` | GET | outputs current EMS device information in verbose | no | |
| `values` | GET | outputs current EMS device information in short format | no | |
| _(empty)_ | GET | same as `values` above | no | |
| `commands` | GET | lists the available command entities to call | no | |
| `entities` | GET | lists all enabled entities | no | |
| `{entity}` | GET | outputs details of a specific entity, for reading | no | |
| `{entity}/{hc}` | GET | same as the read command above but for a specific heating circuit | no | |
| `{entity}` | POST | updates a entity value, for writing | yes | `<data>` |
| `{entity}/{hc}` | POST | same as the write command above but for a specific heating circuit | yes | `<data>` |

Examples:

<!-- prettier-ignore -->
| URL | post body | action |
| - | - | - |
| `http://ems-esp.local/api/thermostat/temp` | `22` | sets the selected room temperature of the master thermostat on heating circuit 1 |
| `http://ems-esp.local/api/thermostat` | `{"cmd":"mode", "data":"auto"}` | sets the thermostat mode to auto for heating circuit 1 |
| `http://ems-esp.local/api/thermostat` | `{"cmd":"seltemp", "data":23, "hc":3}` | sets the room temperature to 23 degrees for for heating circuit 3 |
| `http://ems-esp.local/api/thermostat/hc2` | `{"cmd":"seltemp", "data":20.5}` | sets the room temperature to 20.5 degrees for for heating circuit 2 |

### Fetching custom entities (EMS telegrams)

The URL path is `http://<hostname>/api/custom/`

<!-- prettier-ignore -->
| endpoint | HTTP method | action | authentication required? | post body |
| - | - | - | - | - |
| blank or `info`| GET | outputs all custom entities and their values | no |
| `<name>` | GET | outputs all characteristics for a specific custom entity | no |

### Fetching Temperature Sensor information

The URL path is `http://<hostname>/api/temperaturesensor/`

<!-- prettier-ignore -->
| endpoint | HTTP method | action | authentication required? | post body |
| - | - | - | - | - |
| blank | GET | outputs connected Dallas temperature sensor names and readings | no |
| `info` | GET | outputs all details on the connected Dallas temperature sensors | no |
| `<name>` | GET | outputs all characteristics for a specific temperature sensors | no |

### Controlling the Analog Sensors

The URL path is `http://<hostname>/api/analogsensor/`

<!-- prettier-ignore -->
| endpoint   | HTTP method | action | authentication required? | post body |
| - | - | - | - | - |
| blank | GET | outputs analog sensors and their readings | no | |
| `info` | GET | outputs all details on the connected analog sensors | no |
| `<name>` | GET | outputs all characteristics for a specific analog sensors | no |
| `commands` | GET | lists the available system commands | no | |
| `setvalue` | POST | set value/offset of counter or output pin, +/- sign corrects value | yes | `{"value":<val>, "id":<gpio>}` |

### System Commands

The URL path is `http://<hostname>/api/system/<endpoint>`

<!-- prettier-ignore -->
| endpoint | HTTP method | action | authentication required? | post body |
| - | - | - | - | - |
| `info` or blank | GET | outputs current system information | no |
| `fetch` | GET | forces at refresh of all device values | no | |
| `restart` | GET | restarts EMS-ESP | yes | |
| `commands` | GET | lists the available system commands | no | |
| `allvalues` | GET | lists all connect devices and sensors and their entity values | no | |
| `send` | POST | send telegram to the EMS bus | yes | `"XX XX...XX"` |
| `message` | POST | send a message to the log and MQTT | yes | `".."` |
| `publish` | POST | MQTT publish all values, and optional HA-configuration or specific for a device | no | `[ha] \| [device]` |
| `watch` | POST | watch incoming telegrams | no | `<on \|off \| raw \| <type-id(hex)>` |

### Examples

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

MQTT uses the same format as the API.

The **topic** matches the URL path except the `<hostname>` is replaced with the MQTT Base name as defined in the Settings (default is ems-esp).

The **payload** is the same as the `<data>` as described above and used in the API.

Examples:

<!-- prettier-ignore -->
| topic | payload | action |
| - | - | - |
| `ems-esp/system/send` | `XX XX...XX` | send raw ems-command |
| `ems-esp/thermostat/seltemp` | | fetches the seltemp entity values and publishes it in the topic `ems-esp/response` |
| `ems-esp/thermostat/seltemp` | `23` | change the selected setpoint temperature to 23 degrees on the master thermostat on hc1 |
| `ems-esp/thermostat/mode` | `auto` | sets the thermostat mode to auto for hc1 |
| `ems-esp/thermostat` | `{\"cmd\":\"mode\",\"value\":\"heat\",\"id\":1}` | sets the thermostat mode to heat for hc1 |

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

With Home Assistant, Thermostat commands can also be sent to control individual heating circuits via sending a mode string or temperature number to a topic `thermostat_hc<n>`.

Depending on mqtt-settings there are also direct subscriptions for each value like `boiler/wwtemp`, `thermostat/hc1/daytemp`, etc. Thermostats which supports only a single heating circuits will subscribe to `/thermostat/daytemp`.

You can also use MQTT to send a specific read request and the telegram response will be returned in a topic called `response`. For example sending the payload `{"cmd":"send", "data":"0B 88 19 19 02"}` to `ems-esp/system` will result in a topic `response` being published with the data `{"src":"08","dest":"0B","type":"19","offset":"19","data":"7D 00","value":32000}`.
