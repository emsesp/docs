> [!NOTE]
> The MQTT information below is based on the latest dev release (currently 2.1) so topics and format may differ from previous versions.

All topics are prefixed with the ESP's `hostname`, which is defaulted to `ems-esp`.

## Publishing Topics

Publishing timing can be configured from the Web UI to be either sent when data changes (which can be quite often) or set to a specific period in seconds.

Note when the MQTT format is set to "`Home Assistant`" the topics and payload formats may change to allow auto-discovery by Home Assistant. Standard format is `Nested` which uses a single topic to show multiple entries in the payload. Format `Single` will send each group as single payloads on multiple topics. This is shown in the "Format" column below.

For booleans, the values will depend on the Boolean setting, either on/off, true/false or 1/0. The boolean setting 1/0 will also use numbers for enumerated values, i.e. building `light`, `medium`, `heavy` becomes `0`, `1`, `2`. Command can be written in any format, `false`, `off`, `0` can be used.

The table below list the topics being published:

|Topic|Format|Description|Payload Example|
|-|-|-|-|
| `status` | n/a | this is the MQTT will and testament messages | `online` or `offline` |
| `info` | n/a| for events | `{"event":"start","version":"2.1.0","ip":"10.10.10.140"}` |
| `heartbeat` | all | system stats in JSON, every minute | `{"status":"connected","rssi":90,"uptime":"000+11:48:02.367","uptime_sec":42482,"mqttfails":2,"txfails":0,"rxfails":3,"freemem":68,"fragmem":17}` |
| `tapwater_active` | all | boolean to show if the hot tap water is running (DHW) | |
| `heating_active` | all | boolean to show if the heating is on | |
| `boiler_data_main` | all | non warm water data from the Boiler device | `{"heatingActive":"off","tapwaterActive":"off","selFlowTemp":0,"selBurnPow":23,"curBurnPow":0,"pumpMod":0,"curFlowTemp":35.1,"retTemp":35.5,"sysPress":1.6,"boilTemp":36.3,"burnGas":"off","flameCurr":0,"heatPump":"off","fanWork":"off","ignWork":"off","heatingActivated":"on","heatingTemp":75,"pumpModMax":90,"pumpModMin":55,"pumpDelay":1,"burnMinPeriod":10,"burnMinPower":0,"burnMaxPower":75,"boilHystOn":-6,"boilHystOff":6,"UBAuptime":4007616,"burnStarts":275144,"burnWorkMin":436129,"heatWorkMin":349044,"serviceCode":"0A","serviceCodeNumber":305}` |
| `boiler_data_ww` | all | warm water data from the Boiler device | `{"wWComfort":"Hot","wWSelTemp":60,"wWSetTemp":62,"wWDisinfectionTemp":70,"wWType":"flow","wWChargeType":"3-way valve","wWCircPump":"off","wWCircPumpMode":"0x3min","wWCirc":"off","wWCurTemp":32.4,"wWCurFlow":0,"wwStorageTemp1":32.4,"wWActivated":"on","wWOneTime":"off","wWDisinfecting":"off","wWCharging":"off","wWRecharging":"on","wWTempOK":"on","wWActive":"off","wWHeat":"on","wWStarts":246432,"wWWorkM":87085}` |
| `thermostat_data` | nested | data from the thermostat and for each of its Heating Circuits.| `{ "time":"07:47:05 09/03/2000", "display":"int. temperature", "language":"French", "building":"medium", "MinExtTemperature":-10, "CalIntTemperature":0, "clockOffset":3, "hc1":{"seltemp":15, "currtemp":20.6, "mode":"auto"}, "hc2":{"seltemp":8, "currtemp":18.2, "mode":"off"}}` |
| `thermostat_data` | single | In single format each heating ciruit is published with own topic | `{"time":"07:47:05 09/03/2000", "display":"int. temperature", "building":"medium", "MinExtTemperature":-10, "CalIntTemperature":0}` |
|`thermostat_data<id>` | single | hc in single format | `{"seltemp":15, "currtemp":20.6, "mode":"auto"}` |
| `mixing_data<id>` | nested | data from The Mixing Module for each of its Heating Circuits where `<id` is 1-8 for HC and 9-10 for WWC | `{"hc1": {"flowTemp":55, "pumpMod":"1", "valveStatus":"1"}}` |
| `mixing_data<id>` | single | data from The Mixing Module in single format for each of its Heating Circuits where `<id` is 1-8 for HC and 9-10 for WWC | `{"type":"hc", "flowTemp":55, "pumpMod":"1", "valveStatus":"1"}` |
| `shower_data` | | the shower timer and alert toggles plus the duration of the last shower taken | `{"timer":"0","alert":"0","duration":"4 minutes 32 seconds"}` |
| `solar_data` | all | all data from the Solar Module (if connected) | JSON with `collectortemp` `bottomtemp` `pumpmodulation` `pump` `energylasthour` `energytoday` `energytotal` `pumpWorkMin` |
| `sensor_data` | nested| temperature readings from any external Dallas sensors attached to the ESP | `{"sensor1": {"id":"28FF47AC90160444", "temp":20.94}}` |
| `sensor_data<id>` | single | temperature readings from each Dallas sensor in single format, id is unique sensor number | `{"temp":20.94}` |

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

## Monitoring the Queue

If you want more precise monitoring of the MQTT traffic I suggest using [MQTT Explorer](http://mqtt-explorer.com/). The console command `show mqtt` will show the status of the MQTT service and also the topic subscriptions and outbound publishing queue.

## Value descriptions

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
   * `curFlowTemp` = Current flow temperature = current flow temperature of water leaving the boiler
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
   * `dampedtemp` = Damped outdoor temperature = the thermostat damps changes to the actual outside temperature to mirror the thermal mass of the building. Building Type setting changes the time constant of the damping
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
   * `heatingtype` = underfloor, radiator etc.
   * `targetflowtemp` = Target flow temperature = flow temperature calculated by the thermostat as required to get the target room temperature given current conditions (usually a combination of heat curve and external temp and, possibly, current room temp)
   * `offsettemp` = Offset temperature
   * `designtemp` = Design temperature
   * `summertemp` = Summer temperature
   * `summermode` = Summer mode
   * `mode` = Mode
   * `modetype` = Mode type
