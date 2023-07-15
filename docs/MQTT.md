## Published Data

When MQTT is enabled EMS-ESP will publish MQTT topics for each device. The frequency can be configured from the WebUI to be either sent when data changes are detected or set to a specific period in seconds which is kinder on network traffic.

When MQTT Discovery is enabled, EMS-ESP will automatically create a special Discovery topics (with `/config`) for each EMS device entity that has received a valid value in EMS-ESP. If the entity should disappear (i.e. no longer has a valid value in an EMS telegram) then the discovery topic is automatically removed. This is to avoid warnings in systems like Home Assistant. When EMS-ESP starts all prior Discovery topics are removed to keep system clean.

When a value is a boolean it will be rendered according to the Boolean setting you have defined in the settings.

The table below list the topics being published. The format shown in the table below is the MQTT Format as defined in EMS-ESP's settings. Default format is `Nested` which uses a single topic to show multiple entries in the payload. Format `Single` will send each group as single payloads on multiple topics.

<!-- prettier-ignore -->
| Topic | Format | Description | Payload Example |
| - | - | - | - |
| `status` | n/a | this is the MQTT will and testament messages | `online` or `offline` |
| `info` | n/a | for events | `{"event":"connected","version":"3.5.0-dev.14","boot time":"2022-12-30T13:50:54+0100","network":"ethernet","hostname":"ems-esp","MAC":"A9:03:3A:61:34:CE","IPv4 address":"192.168.1.134/255.255.255.0","IPv4 gateway":"192.168.1.1","IPv4 nameserver":"192.168.1.1"}` |
| `heartbeat` | all | system stats in JSON, default is every minute | `{"bus_status":"connected","uptime":"000+22:32:01.497","uptime_sec":81121,"ntp_status":"on","rxreceived":76970,"rxfails":28,"txreads":17587,"txwrites":0,"txfails":0,"mqttcount":42344,"mqttfails":0,"mqttconnects":1,"apicalls":0,"apifails":0,"sensorreads":16224,"sensorfails":0,"freemem":151}` |
| `tapwater_active` | all | boolean to show if the hot tap water is running (DHW) | |
| `heating_active` | all | boolean to show if the heating is on | |
| `boiler_data` | all | non warm water data from the Boiler device | `{"heatingactive":"off","tapwateractive":"off","selflowtemp":0,"selburnpow":23,"heatingpumpmod":0,"curflowtemp":57.5,"rettemp":56.9,"syspress":1.5,"boiltemp":60.8,"burngas":"off","burngas2":"off","flamecurr":0.0,"heatingpump":"off","fanwork":"off","ignwork":"off","oilpreheat":"off","heatingactivated":"on","heatingtemp":65,"pumpmodmax":70,"pumpmodmin":30,"pumpdelay":1,"burnminperiod":10,"burnminpower":0,"burnmaxpower":50,"boilhyston":-6,"boilhystoff":6,"boil2hyston":0,"boil2hystoff":0,"curburnpow":0,"burnstarts":359634,"burnworkmin":620952,"burn2workmin":0,"heatworkmin":508794,"heatstarts":42076,"ubauptime":5166357,"servicecode":"0A","servicecodenumber":305,"maintenancemessage":"H00","maintenance":"manual","maintenancetime":6000,"maintenancedate":"01.01.2012"}` |
| `boiler_data_ww` | all | warm water data from the Boiler device | `{"wwtapactivated":"on","wwsettemp":62,"wwseltemp":60,"wwtype":"flow","wwcomfort":"hot","wwflowtempoffset":40,"wwmaxpower":100,"wwcircpump":"off","wwchargetype":"3-way valve","wwhyston":-5,"wwhystoff":0,"wwdisinfectiontemp":70,"wwcirc":"off","wwcurtemp":52.9,"wwcurflow":0.0,"wwstoragetemp1":52.9,"wwactivated":"on","wwonetime":"off","wwdisinfecting":"off","wwcharging":"off","wwrecharging":"on","wwtempok":"on","wwactive":"off","ww3wayvalve":"on","wwstarts":317558,"wwworkm":112158}` |
| `thermostat_data` | nested | data from the thermostat and for each of its Heating Circuits. | `{"datetime":"31.12.2022 12:25","hc1":{"seltemp":15.0,"currtemp":20.7,"mode":"auto","manualtemp":21.0,"daytemp2":20.5,"daytemp3":20.0,"daytemp4":20.5,"nighttemp":15.0,"switchtime":"00 mo 00:00 T1"}}` |
| `thermostat_data` | single | In single format each heating circuit is published with own topic | `{"datetime":"31.12.2022 12:25"}` |
| `thermostat_data_hc<id>` | single | hc in single format | `{"seltemp":15, "currtemp":20.6, "mode":"auto"}` |
| `mixer_data` | nested | data from The Mixer with nests `hc1` to `hc4`and `wwc1`, `wwc2` | `{"hc1": {"flowTemp":55, "pumpStatus":"on", "valveStatus":25}}` |
| `mixer_data_hc<id>` `mixer_data_wwc<id>` | single | data from The Mixer in single format for each of its Heating Circuits where `<id>` is circuit number | `{"type":"hc", "flowTemp":55, "pumpStatus":"on", "valveStatus":55}` |
| `shower_data` | | the shower timer and alert toggles plus the duration of the last shower taken | `{"timer":"0","alert":"0","duration":"4 minutes 32 seconds"}` |
| `solar_data` | all | all data from the Solar Module (if connected) | `{ "collectorTemp": 15.8, "tankBottomTemp": 29.8, "solarPumpModulation": 0, "cylinderPumpModulation": 0, "solarPump": "off", "valveStatus": "off", "tankHeated": "off", "collectorShutdown": "off", "energyLastHour": 0, "energyToday": 1792, "energyTotal": 2784.7 }` |
| `temperaturesensor_data` | nested| temperature readings from any external Dallas temperature sensors attached to the ESP | `{"28-233D-9497-0C03":{"name":"zolder32","temp":19.6}}` |
| `temperaturesensor_data` | single | temperature readings from Dallas temperature sensor in single format with unique sensor id | `{"28-FF47-AC90-1604":20.94}` |
| `analogsensor_data` | nested | readings from external analog sensors | `{"31":{"name":"analog31","value":0}}` |

# Using MQTT to send commands

Refer to the [Commands](Commands#mqtt) Section for how to use MQTT to send commands to EMS-ESP.

## Monitoring the Queue

If you want more precise monitoring of the MQTT traffic I suggest using [MQTT Explorer](http://mqtt-explorer.com/). The console command `show mqtt` will show the status of the MQTT service and also the topic subscriptions and outbound publishing queue. In the WebUI you can see the size of the queue and overall stats are in the `Status` page.
