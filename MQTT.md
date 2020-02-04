## MQTT configuration options

#### QOS
The QOS (Quality Of Service) is configurable within telnet (`mqtt_qos`) and WebUI. Valid options are At most once (0) At least once (1) and Exactly once (2). The default is 0.

#### Keep Alive
Likewise the Keep Alive (`mqtt_keepalive`) can be set. Keep alive ensures that the connection between the broker and client is still open and that the broker and the client are aware of being connected. This value is the number of seconds before giving up on a response and default set to 60 (1 minute). The lower the number the more WiFi traffic but greater the stability.

#### Retain
`mqtt_retain` sets the MQTT retain flag for all published messages on the broker. It's set to off as default.

[HiveMQ](https://www.hivemq.com/tags/mqtt-essentials/) has a good explanation of MQTT.

## MQTT topics

*all* topics are prefixed with `[base]`/[`host name`]/ where both `base` and `host name` are configurable in the Web UI.  The default is `home/ems-esp/`.

If you want to configure the topic names, these can be changed in the file `src/my_config.h`.

## Publishing Topics

All the key information from each of the EMS devices connected (Boilers, Thermostats, Solar Modules etc) are sent periodically on a single MQTT topic. The frequency of these publishes can be adjusted by the `publish_time` parameter which is set to 2 minutes (120 seconds) as default.

The table below list the topics being published:

| Topic               | Description         | Payload Example |
| ------------------- | ------------------- | --------------- |
| `sensors` | temperature readings from any external Dallas sensors attached to the ESP | `{"temp_1":"20.18","temp_2":"40.81"}` |
| `start` | this is the MQTT will and testament messages | `online` or `offline` |
| `heartbeat` | if enabled send out key system stats in JSON | `{"version":"1.9.3b3","IP":"10.10.10.198","rssid":68,"load":100,"uptime":4,"freemem":68,"MQTTdisconnects":0}` |
| `tapwater_active` | individual message if using a boolean sensor to show if hot tap water is running | `0` or `1` |
| `heating_active` | individual message if using a boolean sensor to show if heating is on | `0` or `1` |
| `boiler_data` | all the key data from the Boiler device | `{"wWComfort":"Hot","wWSelTemp":54,....}` (see the example in the Monitoring MQTT section below) |
| `thermostat_data` | data from each of the Thermometer's Heating Circuits. Default HC is 1. The data sent depends on the model. | `{ "hc1":{"seltemp":15,"currtemp":20.6,"mode":"auto"}, "hc2":{"seltemp":8,"currtemp":18.2,"mode":"off"} }` |
| `mixing_data` | data from The Mixing Module for each of the Thermometer's Heating Circuits. | `{"hc1":{"flowTemp":55,"pumpMod":"1","valveStatus":"1"}}` |
| `shower_data` | the shower timer and alert toggles plus the duration of the last shower taken | `{"timer":"0","alert":"0","duration":"4 minutes 32 seconds"}` |
| `sm_data` | all data from the Solar Module (if connected) | JSON with `collectortemp` `bottomtemp` `pumpmodulation` `pump` `energylasthour` `energytoday` `energytotal` `pumpWorkMin` |
| `hp_data` | all data from the Heat Pump (if connected) | `{"pumpmodulation":10, "pumpspeed": 20}` |

## Receiving Topics

EMS-ESP subscribes and listens to the following topics, used to send commands to the EMS-ESP. Please make sure you are using MQTT authentication with username and password. Anonymous access to MQTT isn't allowed to perform any control operation.

| Topic               | Description         | Payload Format | Example |
| ------------------- | ------------------- | -------------- | ------- |
| `start` | this is the MQTT will and testament messages back from the broker | `online` or `offline` | `offline` |
| `restart` | restarts the ESP | | |
| `thermostat_cmd_temp[n]` | sets the thermostat current setpoint temperature to the Heating Circuit `n` (1-4). `n` is optional. (Note: for Home Assistant climate component) | temperature value as a float | `20.8` |
| `thermostat_cmd_mode[n]` | sets the thermostat current mode to the Heating Circuit `n` (1-4). `n` is optional. (Note: for Home Assistant climate component) | auto, day, night, off, manual | `auto` |
| `thermostat_cmd` | send a generic command to control the thermostat | JSON `{"cmd":<command>,"data":<value>}` with `<command>` being `temp<hc>`, `mode<hc>`, `nightemp<hc>`, `daytemp<hc>` or `holidaytemp<hc>` and `hc` optionally stating the heating circuit. `value` is a numeric floating point value | `{ "cmd":"temp2", "data": 20 }` |
| `shower_data` | for setting the shower timer or alert toggle | JSON as `{"timer|alert":"0|1"}` | `{"timer":"1"}` |
| `generic_cmd` | for sending a command to the EMS-ESP, e.g. sending a shot of cold water | `coldshot` | `coldshot` |
| `boiler_cmd` | for sending generic command to control the Boiler | JSON `{"cmd":<command>,"data":<value>` with `command` being `comfort` and `data` = `[hot,comfort,intelligent]` or `flowtemp` with `data` being the desired temperature or `boiler_cmd_wwonetime` | `{"cmd":"flowtemp",data:55}` |
| `boiler_cmd_wwactivated` | for setting warm water on/off, used by the HA HVAC component | `"1"` or `"0"` | `"1"` |
| `boiler_cmd_wwtemp` | for setting the warm water boiler temperature, used by the HA HVAC component | temperature in degrees C | `60` |

## Monitoring MQTT

In Telnet the command `mqttlog` will show you the last messages published. In the WebUI you also see in real-time the last set of published messages on the System Status screen. Below is an example of the telnet command output:

```
mqttlog

MQTT publish log:
  (20:31:15) Topic:status Payload:online
  (20:31:15) Topic:start Payload:start
  (20:29:16) Topic:heartbeat Payload:{"rssid":68,"load":1,"uptime":86285,"freemem":56}
  (10:22:43) Topic:shower_data Payload:{"timer":"1","alert":"0","duration":"5 minutes and 13 seconds"}
  (20:29:31) Topic:boiler_data Payload:{"wWComfort":"Hot","wWSelTemp":53,"wWDesinfectionTemp":70,"selFlowTemp":75,"selBurnPow":36,"curBurnPow":36,"pumpMod":69,"wWCircPump":0,"wWCurTmp":44.8,"wWCurFlow":0,"curFlowTemp":53,"retTemp":43.6,"switchTemp":0,"sysPress":1.9,"boilTemp":53.2,"wWActivated":"on","wWOnetime":"off","burnGas":"on","flameCurr":30.2,"heatPmp":"on","fanWork":"on","ignWork":"off","wWCirc":"off","heating_temp":75,"pump_mod_max":90,"pump_mod_min":60,"wWHeat":"off","wWStarts":216429,"wWWorkM":77809,"UBAuptime":3625817,"burnStarts":242849,"burnWorkMin":402077,"heatWorkMin":324268,"ServiceCode":"-H","ServiceCodeNumber":200}
  (20:05:41) Topic:tapwater_active Payload:0
  (20:05:41) Topic:heating_active Payload:1
  (20:29:21) Topic:thermostat_data Payload:{"hc1":{"seltemp":21,"currtemp":20.7,"mode":"auto"}}
  (20:29:31) Topic:sensors Payload:{"temp_1":20.06}
  ```

and using `mqttlog all` will give you the subscriptions too:

```
MQTT subscriptions:
  Topic:home/ems-esp/restart
  Topic:home/ems-esp/start
  Topic:home/ems-esp/thermostat_cmd_temp1
  Topic:home/ems-esp/thermostat_cmd_mode1
  Topic:home/ems-esp/thermostat_cmd_temp2
  Topic:home/ems-esp/thermostat_cmd_mode2
  Topic:home/ems-esp/thermostat_cmd_temp3
  Topic:home/ems-esp/thermostat_cmd_mode3
  Topic:home/ems-esp/thermostat_cmd_temp4
  Topic:home/ems-esp/thermostat_cmd_mode4
  Topic:home/ems-esp/thermostat_cmd
  Topic:home/ems-esp/boiler_cmd
  Topic:home/ems-esp/boiler_cmd_wwactivated
  Topic:home/ems-esp/boiler_cmd_wwonetime
  Topic:home/ems-esp/boiler_cmd_wwtemp
  Topic:home/ems-esp/generic_cmd
  Topic:home/ems-esp/shower_data
```

If you want more precise monitoring of the MQTT traffic I suggest using [MQTT Explorer](http://mqtt-explorer.com/).
