## MQTT configuration options

#### QOS
The QOS (Quality Of Service) is configurable within telnet (`mqtt_qos`) and WebUI. Valid options are At most once (0) At least once (1) and Exactly once (2). The default is 0.

#### Keep Alive
Likewise the Keep Alive (`mqtt_keepalive`) can be set. Keep alive ensures that the connection between the broker and client is still open and that the broker and the client are aware of being connected. This value is the number of seconds before giving up on a response and default set to 60 (1 minute). The lower the number the more WiFi traffic but greater the stability.

#### Retain
`mqtt_retain` sets the MQTT retain flag for all published messages on the broker. It's set to off as default.

[HiveMQ](https://www.hivemq.com/tags/mqtt-essentials/) has a good explanation of MQTT.

#### Nested JSON
When the setting `mqtt_nestedjson` is enabled, all device data (thermostat, solar modules, dallas sensors etc) will be sent as one nested payload package. When its disabled each will published as a seperate topic.

## MQTT topics

*all* topics are prefixed with `[base]`/[`host name`]/ where both `base` and `host name` are configurable in the Web UI.  The default is `home/ems-esp/`.

If you want to configure the topic names, these can be changed in the file `src/my_config.h`.

## Publishing Topics

All the key information from each of the EMS devices connected (Boilers, Thermostats, Solar Modules etc) are sent periodically on a single MQTT topic. The frequency of these publishes can be adjusted by the `publish_time` parameter which is set to 2 minutes (120 seconds) as default.

The table below list the topics being published:

| Topic               | Description         | Payload Example |
| ------------------- | ------------------- | --------------- |
| `sensors` | temperature readings from any external Dallas sensors attached to the ESP | `{"sensor1":{"id":"28FF47AC90160444","temp":20.94}}` |
| `start` | this is the first package sent when EMS-ESP boots up | `online` or `offline` |
| `status` | this is the MQTT will and testament messages | `{"version":"1.9.5b52","IP":"10.10.10.84","boottime":"19:24:45 CET "}` |
| `heartbeat` | if enabled send out key system stats in JSON | `{"rssid":64,"load":1,"uptime":192,"freemem":62,"tcpdrops":0,"mqttpublishfails":0}` |
| `tapwater_active` | individual message if using a boolean sensor to show if hot tap water is running | `0` or `1` |
| `heating_active` | individual message if using a boolean sensor to show if heating is on | `0` or `1` |
| `boiler_data` | all the key data from the Boiler device | `{"wWComfort":"Hot","wWSelTemp":52,"wWDesinfectionTemp":70,"selFlowTemp":75,"selBurnPow":74,"curBurnPow":70,"pumpMod":90,"wWCircPump":0,"wWCiPuType":255,"wWCiPuMode":0,"wWCurTmp":56.6,"wWCurFlow":0,"curFlowTemp":75.1,"retTemp":57.4,"sysPress":2,"boilTemp":74.9,"wwStorageTemp1":56.6,"wWActivated":"on","wWOnetime":"off","wWDesinfecting":"off","wWReady":"off","wWRecharge":"off","wWTempOK":"on","wWCirc":"off","burnGas":"on","flameCurr":39.1,"heatPmp":"on","fanWork":"on","ignWork":"off","heating_temp":75,"pump_mod_max":90,"pump_mod_min":60,"wWHeat":"off","wWStarts":220599,"wWWorkM":79487,"UBAuptime":3684975,"burnStarts":248086,"burnWorkMin":416304,"heatWorkMin":336817,"ServiceCode":"-H","ServiceCodeNumber":200}` |
| `thermostat_data` | data from each of the Thermometer's Heating Circuits. Default HC is 1. The data sent depends on the model. | `{ "hc1":{"seltemp":15,"currtemp":20.6,"mode":"auto"}, "hc2":{"seltemp":8,"currtemp":18.2,"mode":"off"} }` |
| `mixing_data` | data from The Mixing Module for each of the Thermometer's Heating Circuits. | `{"hc1":{"flowTemp":55,"pumpMod":"1","valveStatus":"1"}}` |
| `shower_data` | the shower timer and alert toggles plus the duration of the last shower taken | `{"timer":"0","alert":"0","duration":"4 minutes 32 seconds"}` |
| `sm_data` | all data from the Solar Module (if connected) | JSON with `collectortemp` `bottomtemp` `pumpmodulation` `pump` `energylasthour` `energytoday` `energytotal` `pumpWorkMin` |
| `hp_data` | all data from the Heat Pump (if connected) | `{"pumpmodulation":10, "pumpspeed": 20}` |

## Receiving Topics

EMS-ESP subscribes and listens to the following topics, used to send commands to the EMS-ESP:

| Topic               | Description         | Payload Format | Example |
| ------------------- | ------------------- | -------------- | ------- |
| `restart` | restarts the ESP | | |
| `thermostat_cmd_temp[n]` | sets the thermostat current setpoint temperature to the Heating Circuit `n` (1-4). `n` is optional. (Note: for Home Assistant climate component) | temperature value as a float | `20.8` |
| `thermostat_cmd_mode[n]` | sets the thermostat current mode to the Heating Circuit `n` (1-4). `n` is optional. (Note: for Home Assistant climate component) | manual, auto, heat, day, night, eco, comfort,holiday, nofrost | `auto` |
| `thermostat_cmd` | send a generic command to control the thermostat | JSON `{"cmd":<command>,"data":<value>}` with `<command>` being `<temp><hc>` with `<temp>` being `nighttemp`, `daytemp`, `holidaytemp`, `nofrosttemp`, `ecotemp` and `heattemp`, and `hc` optionally stating the heating circuit. `value` is a numeric floating point value | `{ "cmd":"daytemp2", "data": 20 }` |
| `shower_data` | for setting the shower timer or alert toggle | JSON as `{"timer|alert":"0|1"}` | `{"timer":"1"}` |
| `generic_cmd` | for sending a command to the EMS-ESP, e.g. sending a shot of cold water | `<command>` | `coldshot` |
| `boiler_cmd` | for sending generic command to control the Boiler | JSON `{"cmd":<command>,"data":<value>` with `command` being `comfort` and `data` = `[hot,comfort,intelligent]` or `flowtemp` with `data` being the desired temperature or `boiler_cmd_wwonetime` | `{"cmd":"flowtemp",data:55}` |
| `boiler_cmd_wwactivated` | for setting warm water on/off, used by the HA HVAC component | `"1"` or `"0"` | `"1"` |
| `boiler_cmd_wwtemp` | for setting the warm water boiler temperature, used by the HA HVAC component | temperature in degrees C | `60` |

## Monitoring MQTT

If you want more precise monitoring of the MQTT traffic I suggest using [MQTT Explorer](http://mqtt-explorer.com/).

Using the `system` command in the Telnet console you can see the number of MQTT packages that have failed to publish (after 3 retries). You can also see if there have been any TCP or network disconnects to the MQTT broker.

Lastly the `mqttqueue` will show you the MQTT messages scheduled to be published, which is done roughly between 500 and 750ms to avoid network congestion.

