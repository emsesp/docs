## MQTT topics

All topics are prefixed with the ESP's `hostname`, which is defaulted to `ems-esp`.

## Publishing Topics

Publishing timing can be configured from the Web UI to be either sent when data changes (which can be quite often) or set to a specific period in seconds.

Note when the MQTT format is set to "`Home Assistant`" the topics and payload formats may change to allow auto-discovery by Home Assistant. Standard format is `Nested` which uses a single topic to show multiple entries in the payload. Format `Single` will send each group as single payloads on multiple topics.

For booleans, the values will depend on the Boolean setting, either on/off, true/false or 1/0. The boolean setting 1/0 will also use numbers for enumerated values, i.e. building `light`, `medium`, `heavy` becomes `0`, `1`, `2`. Command can be written in any format, `false`, `off`, `0` can be used.

The table below list the topics being published:

| Topic               | Description         | Payload Example |
| ------------------- | ------------------- | --------------- |
| `status` | this is the MQTT will and testament messages | `online` or `offline` |
| `info` | for events | `{"event":"start","version":"2.1.0","ip":"10.10.10.140"}` |
| `heartbeat` | if enabled send out key system stats in JSON | `{"rssid":76, "uptime":"000+00:01:01.001", "uptime_sec":61, "freemem":72, "mqttpublishfails":0, "txfails":0, "rxfails":0, "adc":1}` |
| `tapwater_active` | boolean to show if the hot tap water is running (DHW) | `0` or `1` |
| `heating_active` | boolean to show if the heating is on | `0` or `1` |
| `boiler_data` | all the key data from the Boiler device | `{"wWComfort":"Eco", "wWSelTemp":60, "wWSetTemp":62, "wWDisinfectionTemp":70, "selFlowTemp":5, "selBurnPow":0, "curBurnPow":0, "pumpMod":0, "wWCircPump":"off", "wWCiPuType":"valve", "wWCiPuMode":0, "wWCirc":"off", "wWCurTmp":46.3, "wWCurFlow":0, "curFlowTemp":51.7, "retTemp":50.7, "sysPress":1.6, "boilTemp":53.3, "wwStorageTemp1":46.3, "wWActivated":"on", "wWOnetime":"off", "wWDisinfecting":"off", "wWReady":"off", "wWRecharge":"off", "wWTempOK":"on", "burnGas":"off", "flameCurr":0, "heatPump":"off", "fanWork":"off", "ignWork":"off", "wWHeat":"on", "heatingTemp":75, "pumpModMax":90, "pumpModMin":55, "pumpDelay":1, "burnMinPeriod":10, "burnMinPower":0, "burnMaxPower":75, "boilHystOn":-6, "boilHystOff":6, "wWStarts":242174, "wWWorkM":85794, "UBAuptime":3957457, "burnStarts":270619, "burnWorkMin":432169, "heatWorkMin":346375, "serviceCode":"0H", "serviceCodeNumber":203}` |
| `thermostat_data` (nested format)| data from the thermostat and for each of its Heating Circuits.| `{ "time":"07:47:05 09/03/2000", "display":"int. temperature", "language":"French", "building":"medium", "MinExtTemperature":-10, "CalIntTemperature":0, "clockOffset":3, "hc1":{"seltemp":15, "currtemp":20.6, "mode":"auto"}, "hc2":{"seltemp":8, "currtemp":18.2, "mode":"off"}}` |
| `thermostat_data` (single format) | In single format each heating ciruit is published with own topic | `{"time":"07:47:05 09/03/2000", "display":"int. temperature", "building":"medium", "MinExtTemperature":-10, "CalIntTemperature":0}` |
|`thermostat_data<id>` (single format)| hc in single format | `{"seltemp":15, "currtemp":20.6, "mode":"auto"}` |
| `mixing_data<id>` (nested format)| data from The Mixing Module for each of its Heating Circuits where `<id` is 1-8 for HC and 9-10 for WWC | `{"hc1": {"flowTemp":55, "pumpMod":"1", "valveStatus":"1"}}` |
| `mixing_data<id>` (single format) | data from The Mixing Module in single format for each of its Heating Circuits where `<id` is 1-8 for HC and 9-10 for WWC | `{"type":"hc", "flowTemp":55, "pumpMod":"1", "valveStatus":"1"}` |
| `shower_data` | the shower timer and alert toggles plus the duration of the last shower taken | `{"timer":"0","alert":"0","duration":"4 minutes 32 seconds"}` |
| `solar_data` | all data from the Solar Module (if connected) | JSON with `collectortemp` `bottomtemp` `pumpmodulation` `pump` `energylasthour` `energytoday` `energytotal` `pumpWorkMin` |
| `sensor_data` (nested format)| temperature readings from any external Dallas sensors attached to the ESP | `{"sensor1": {"id":"28FF47AC90160444", "temp":20.94}}` |
| `sensor_data<id>` (single format) | temperature readings from each Dallas sensor in single format, id is unique sensor number | `{"temp":20.94}` |

## Receiving Topics

Based on which EMS devices are present EMS-ESP will subscribe its respective topics, named after the device. For example `boiler`, `thermostat` etc. Commands can be sent to EMS-ESP on this topic using the payload format:
```json
{"cmd":"<cmd>", "data":<data>, "id":<n>}
```
where

* `cmd` is one of the commands listed in the [Commands](API) and ***must*** be enclosed in quotes.
* `data` can be a string or numeric value.
* `id` can be replaced with `hc` for some devices that use heating circuits, and represented either as a string or a number.

With Home Assistant, Thermostat commands can also be sent to control individual heating circuits via sending a mode string or temperature number to a topic `thermostat_hc<n>`.

## Monitoring the MQTT queues

If you want more precise monitoring of the MQTT traffic I suggest using [MQTT Explorer](http://mqtt-explorer.com/). The console command `show mqtt` will show the status of the MQTT service and also the topic subscriptions and outbound publishing queue.

## Full names for the each of the key names

Below is the english description for each of the JSON keys per device type.

### boiler
   * `heatingActive` = Heating active
   * `tapwaterActive` = Warm water/DHW active
   * `serviceCode` = Service Code
   * `serviceCodeNumber` = Service code number
   * `wWSelTemp` = Warm water selected temperature
   * `wWSetTemp` = Warm water set temperature
   * `wWDisinfectionTemp` = Warm water disinfection temperature
   * `selFlowTemp` = Selected flow temperature
   * `selBurnPow` = Burner selected max power
   * `curBurnPow` = Burner current power
   * `pumpMod` = Pump modulation
   * `pumpMod2` = Heat pump modulation
   * `wWType` = Warm water type
   * `wWChargeType` = Warm water charging type
   * `wWCircPump` = Warm water circulation pump available
   * `wWCircPumpMode` = Warm water circulation pump freq
   * `wWCirc` = Warm water circulation active
   * `outdoorTemp` = Outside temperature
   * `wWCurTemp` = Warm water current temperature (intern)
   * `wWCurTemp2` = Warm water current temperature (extern)
   * `wWCurFlow` = Warm water current tap water flow
   * `curFlowTemp` = Current flow temperature
   * `retTemp` = Return temperature
   * `switchTemp` = Mixing switch temperature
   * `sysPress` = System pressure
   * `boilTemp` = Max boiler temperature
   * `wwStorageTemp1` = Warm water storage temperature (intern)
   * `wwStorageTemp2` = Warm water storage temperature (extern)
   * `exhaustTemp` = Exhaust temperature
   * `wWActivated` = Warm water activated
   * `wWOneTime` = Warm water one time charging
   * `wWDisinfecting` = Warm water disinfecting
   * `wWCharging` = Warm water charging
   * `wWRecharging` = Warm water recharging
   * `wWTempOK` = Warm water temperature ok
   * `wWActive` = Warm water active
   * `burnGas` = Gas
   * `flameCurr` = Flame current
   * `heatPump` = Boiler pump
   * `fanWork` = Fan
   * `ignWork` = Ignition
   * `wWHeat` = Warm water heating
   * `heatingActivated` = Heating activated
   * `heatingTemp` = Heating temperature setting on the boiler
   * `pumpModMax` = Boiler circuit pump modulation max power
   * `pumpModMin` = Boiler circuit pump modulation min power
   * `pumpDelay` = Boiler circuit pump delay time
   * `burnMinPeriod` = Boiler burner min period
   * `burnMinPower` = Boiler burner min power
   * `burnMaxPower` = Boiler burner max power
   * `boilHystOn` = Boiler temperature hysteresis on
   * `boilHystOff` = Boiler temperature hysteresis off
   * `setFlowTemp` = Set Flow temperature
   * `wWSetPumpPower` = Warm water pump set power
   * `wwMixTemperature` = Warm water mix temperature
   * `wwBufferBoilerTemperature` = Warm water buffer boiler temperature
   * `wWStarts` = Warm water # starts
   * `wWWorkM` = Warm water active time
   * `setBurnPow` = Boiler burner set power
   * `burnStarts` = Burner # starts

### solar
   * `collectorTemp` = Collector temperature (TS1)
   * `tankBottomTemp` = Bottom temperature (TS2)
   * `tankBottomTemp2` = Bottom temperature (TS5)
   * `heatExchangerTemp` = Heat exchanger temperature (TS6)
   * `solarPumpModulation` = Solar pump modulation (PS1)
   * `cylinderPumpModulation` = Cylinder pump modulation (PS5)
   * `pumpWorkMin` = Pump working time
   * `energyLastHour` = Energy last hour
   * `energyToday` = Energy today
   * `energyTotal` = Energy total
   * `solarPump` = Solar Pump (PS1) active
   * `valveStatus` = Valve status
   * `tankHeated` = Tank heated
   * `collectorShutdown` = Collector shutdown

### mixing
   * `wwTemp` = Current warm water temperature
   * `pumpStatus` = Current pump status
   * `tempStatus` = Current temperature status
   * `flowTemp` = Current flow temperature
   * `flowSetTemp` = Setpoint flow temperature

### thermostat
   * `time` = Time
   * `display` = Display
   * `language` = Language
   * `offsetclock` = Offset clock
   * `dampedtemp` = Damped outdoor temperature
   * `inttemp1` = Temperature sensor 1
   * `inttemp2` = Temperature sensor 2
   * `intoffset` = Offset int. temperature
   * `minexttemp` = Min ext. temperature
   * `building` = Building
   * `wwmode` = Warm water mode
   * `wwcircmode` = Warm Water circulation mode

*per thermostat heating circuit*:
   * `seltemp` = Setpoint room temperature
   * `currtemp` = Current room temperature
   * `heattemp` = Heat temperature
   * `comforttemp` = Comfort temperature
   * `daytemp` = Day temperature
   * `ecotemp` = Eco temperature
   * `nighttemp` = Night temperature
   * `manualtemp` = Manual temperature
   * `holidaytemp` = Holiday temperature
   * `nofrosttemp` = Nofrost temperature
   * `targetflowtemp` = Target flow temperature
   * `offsettemp` = Offset temperature
   * `designtemp` = Design temperature
   * `summertemp` = Summer temperature
   * `summermode` = Summer mode
   * `mode` = Mode
   * `modetype` = Mode type
