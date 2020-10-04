## MQTT topics

All topics are prefixed with the ESP's `hostname`, which is defaulted to `ems-esp`.

## Publishing Topics

Publishing timing can be configured from the Web UI to be either sent when data changes (which can be quite often) or set to a specific period in seconds.

Note when the MQTT format is set to "`Home Assistant`" the topics and payload formats may change. Please consult the section in [MQTT](MQTT.md) for further details.

For booleans, the values will depend on the Boolean setting, either on/off, true/false or 1/0.

The table below list the topics being published:

| Topic               | Description         | Payload Example |
| ------------------- | ------------------- | --------------- |
| `status` | this is the MQTT will and testament messages | `online` or `offline` |
| `info` | for events | `{"event":"start","version":"2.1.0","ip":"10.10.10.140"}`|
| `heartbeat` | if enabled send out key system stats in JSON | `{"rssid":76,"uptime":"000+00:01:01.001","uptime_sec":61,"freemem":72,"mqttpublishfails":0,"txfails":0,"rxfails":0,"adc":1}` |
| `tapwater_active` | boolean to show if the hot tap water is running (DHW) | `0` or `1` |
| `heating_active` | boolean to show if the heating is on | `0` or `1` |
| `boiler_data` | all the key data from the Boiler device | `{"wWComfort":"Eco","wWSelTemp":60,"wWSetTemp":62,"wWDisinfectionTemp":70,"selFlowTemp":5,"selBurnPow":0,"curBurnPow":0,"pumpMod":0,"wWCircPump":"off","wWCiPuType":"valve","wWCiPuMode":0,"wWCirc":"off","wWCurTmp":46.3,"wWCurFlow":0,"curFlowTemp":51.7,"retTemp":50.7,"sysPress":1.6,"boilTemp":53.3,"wwStorageTemp1":46.3,"wWActivated":"on","wWOnetime":"off","wWDisinfecting":"off","wWReady":"off","wWRecharge":"off","wWTempOK":"on","burnGas":"off","flameCurr":0,"heatPump":"off","fanWork":"off","ignWork":"off","wWHeat":"on","heatingTemp":75,"pumpModMax":90,"pumpModMin":55,"pumpDelay":1,"burnMinPeriod":10,"burnMinPower":0,"burnMaxPower":75,"boilHystOn":-6,"boilHystOff":6,"wWStarts":242174,"wWWorkM":85794,"UBAuptime":3957457,"burnStarts":270619,"burnWorkMin":432169,"heatWorkMin":346375,"serviceCode":"0H","serviceCodeNumber":203}` |
| `thermostat_data` | data from the thermostat and for each of its Heating Circuits. | `{ "time":"07:47:05 09/03/2000","display":"int. temperature","language":"French","building":"medium","MinExtTemperature":-10,"CalIntTemperature":0,"clockOffset":3, "hc1":{"seltemp":15,"currtemp":20.6,"mode":"auto"}, "hc2":{"seltemp":8,"currtemp":18.2,"mode":"off"} }` |
| `mixing_data<id>` | data from The Mixing Module for each of its Heating Circuits. | `{"hc1":{"flowTemp":55,"pumpMod":"1","valveStatus":"1"}}` |
| `shower_data` | the shower timer and alert toggles plus the duration of the last shower taken | `{"timer":"0","alert":"0","duration":"4 minutes 32 seconds"}` |
| `solar_data` | all data from the Solar Module (if connected) | JSON with `collectortemp` `bottomtemp` `pumpmodulation` `pump` `energylasthour` `energytoday` `energytotal` `pumpWorkMin` |
| `sensor_data` | temperature readings from any external Dallas sensors attached to the ESP | `{"sensor1":{"id":"28FF47AC90160444","temp":20.94}}` |

## Receiving Topics

Based on which EMS devices are present EMS-ESP will subscribe its respective topics, named after the device. For example `boiler`, `thermostat` etc. Commands can be sent to EMS-ESP on this topic using the payload format `{"cmd":<cmd> ,"data":<data>, "id":<n>}`. The `id` can be replaced with `hc` for some devices that use heating circuits, and represented either as a string or a number. `cmd` is one of the commands listed in the [Commands](API) section and `data` can be a string or numeric value.

## Monitoring the MQTT queues

If you want more precise monitoring of the MQTT traffic I suggest using [MQTT Explorer](http://mqtt-explorer.com/). The console command `show mqtt` will show the status of the MQTT service and also the topic subscriptions and outbound publishing queue.

