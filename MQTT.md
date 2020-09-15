## MQTT topics

All topics are prefixed with the ESP's `hostname`, which is defaulted to `ems-esp`.

## Publishing Topics

All the key information from each of the EMS devices connected (Boilers, Thermostats, Solar Modules etc) are sent periodically on a single MQTT topic.

The table below list the topics being published:

| Topic               | Description         | Payload Example |
| ------------------- | ------------------- | --------------- |
| `status` | this is the MQTT will and testament messages | `online` or `offline` |
| `info` | for events | `{"event":"start","version":"2.0.2b0","ip":"10.10.10.140"}`|
| `heartbeat` | if enabled send out key system stats in JSON | `{"rssid":76,"uptime":"000+00:01:01.001","uptime_sec":61,"freemem":72,"mqttpublishfails":0,"txfails":0,"rxfails":0,"adc":1}` |
| `tapwater_active` | individual message if using a boolean sensor to show if hot tap water is running | `0` or `1` |
| `heating_active` | individual message if using a boolean sensor to show if heating is on | `0` or `1` |
| `boiler_data` | all the key data from the Boiler device | `{"wWComfort":"Eco","wWSelTemp":60,"wWSetTemp":62,"wWDisinfectionTemp":70,"selFlowTemp":5,"selBurnPow":0,"curBurnPow":0,"pumpMod":0,"wWCircPump":"off","wWCiPuType":"valve","wWCiPuMode":0,"wWCirc":"off","wWCurTmp":46.3,"wWCurFlow":0,"curFlowTemp":51.7,"retTemp":50.7,"sysPress":1.6,"boilTemp":53.3,"wwStorageTemp1":46.3,"wWActivated":"on","wWOnetime":"off","wWDisinfecting":"off","wWReady":"off","wWRecharge":"off","wWTempOK":"on","burnGas":"off","flameCurr":0,"heatPump":"off","fanWork":"off","ignWork":"off","wWHeat":"on","heatingTemp":75,"pumpModMax":90,"pumpModMin":55,"pumpDelay":1,"burnMinPeriod":10,"burnMinPower":0,"burnMaxPower":75,"boilHystOn":-6,"boilHystOff":6,"wWStarts":242174,"wWWorkM":85794,"UBAuptime":3957457,"burnStarts":270619,"burnWorkMin":432169,"heatWorkMin":346375,"serviceCode":"0H","serviceCodeNumber":203}` |
| `thermostat_data` | data from each of the Thermometer's Heating Circuits. Default HC is 1. The data sent depends on the model. | `{ "hc1":{"seltemp":15,"currtemp":20.6,"mode":"auto"}, "hc2":{"seltemp":8,"currtemp":18.2,"mode":"off"} }` |
| `mixing_data` | data from The Mixing Module for each of the Thermometer's Heating Circuits. | `{"hc1":{"flowTemp":55,"pumpMod":"1","valveStatus":"1"}}` |
| `settings_data` | key data from the installation settings | `{"display":"int. temperature","language":"French","building":"medium","MinExtTemperature":-10,"CalIntTemperature":0,"clockOffset":3}` |
| `shower_data` | the shower timer and alert toggles plus the duration of the last shower taken | `{"timer":"0","alert":"0","duration":"4 minutes 32 seconds"}` |
| `sm_data` | all data from the Solar Module (if connected) | JSON with `collectortemp` `bottomtemp` `pumpmodulation` `pump` `energylasthour` `energytoday` `energytotal` `pumpWorkMin` |
| `hp_data` | all data from the Heat Pump (if connected) | `{"pumpmodulation":10, "pumpspeed": 20}` |
| `sensors` | temperature readings from any external Dallas sensors attached to the ESP | `{"sensor1":{"id":"28FF47AC90160444","temp":20.94}}` |

## Receiving Topics

Based on which EMS devices are present EMS-ESP will subscribe to the topics below. All commands must be written as `{"cmd":<cmd> ,"data":<data>, "id":<n>}`. The `id` can be replaced with `hc` for some devices that use heating circuits, and represented either as a string or a number. `cmd` is a string, `data` can be a string or number.

### topic = *boiler_cmd*
```
  comfort <hot, eco, intelligent>
  flowtemp <degrees>
  wwtemp <degrees>
  boilhyston <degrees> (negative value)
  boilhystoff <degrees> (positive value)
  burnperiod <minutes>
  burnminpower <%>
  burnmaxpower <%>
  pumpdelay <minutes>
```

### topic = *thermostat_cmd*
```
--- without hc ---
  wwmode <off | on | auto>
  calinttemp <degrees>
  minexttemp <degrees>
  building <light | medium | heavy>
  language <n> (0=de, 1=nl, 2=fr, 3=it) only RC30
  display <n>  (0=int temp, 1= int set, 2=ext. temp, 3=burner, 4=ww, 5=mode, 6=time, 7=date, 8=smoke) only RC30
  clockoffset <seconds>  (only RC30)

--- with hc ---
  mode <auto | night | day | nofrost | heat | eco>
  temp <degrees>
  nighttemp <degrees>
  daytemp <degrees>
  nofrosttemp <degrees>
  ecotemp <degrees>
  heattemp <degrees>
  summertemp <degrees>
  designtemp <degrees>
  offsettemp <degrees>
  holidaytemp <degrees>
  remotetemp <degrees>
  control <0 | 1 | 2>
  pause <hours>
  party <hours>
  holiday <dd.mm.yyyy-dd.mm.yyyy>
  date <NTP | hh:mm:ss-dd.mm.yyyy-dw-dst>
```

### topic = *system_cmd*
```
  send <"0B XX XX ..">
  pin <gpio> <on|off|1|0|true|false>
```

## Monitoring the MQTT queues

If you want more precise monitoring of the MQTT traffic I suggest using [MQTT Explorer](http://mqtt-explorer.com/).

Using the `show mqtt` command in the Telnet console you can see the number of MQTT packages that have failed to publish (after 3 retries). You can also see if there have been any TCP or network disconnects to the MQTT broker.


