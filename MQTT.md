> [!NOTE]
> The MQTT information below is based on the latest dev release (currently 2.1) so topics and format may differ from previous versions.

All topics are prefixed with the `Base`, which is defaulted to `ems-esp` and can be written as path, e.g. `home/heating/ems-esp2`.

## Outbound Data

When MQTT is enabled EMS-ESP will publish MQTT topics for each device. The frequency can be configured from the Web UI to be either sent when data changes or set to a specific period in seconds. A few important points

* When a value is a boolean it will be rendered according to the Boolean setting you have defined in the settings.
* The format is the MQTT Format as defined in the settings. Default format is `Nested` which uses a single topic to show multiple entries in the payload. Format `Single` will send each group as single payloads on multiple topics. `Home Assistant` will send additional config topics so HA can pick up the values automatically. 

The table below list the topics being published:

|Topic|Format|Description|Payload Example|
|-|-|-|-|
| `status` | n/a | this is the MQTT will and testament messages | `online` or `offline` |
| `info` | n/a| for events | `{"event":"start","version":"2.1.0","ip":"10.10.10.140"}` |
| `heartbeat` | all | system stats in JSON, every minute | `{"status":"connected","rssi":90,"uptime":"000+11:48:02.367","uptime_sec":42482,"mqttfails":2,"txfails":0,"rxfails":3,"freemem":68,"fragmem":17}` |
| `tapwater_active` | all | boolean to show if the hot tap water is running (DHW) | |
| `heating_active` | all | boolean to show if the heating is on | |
| `boiler_data` | all | non warm water data from the Boiler device | `{"heatingActive":"off","tapwaterActive":"off","selFlowTemp":0,"selBurnPow":23,"curBurnPow":0,"pumpMod":0,"curFlowTemp":35.1,"retTemp":35.5,"sysPress":1.6,"boilTemp":36.3,"burnGas":"off","flameCurr":0,"heatPump":"off","fanWork":"off","ignWork":"off","heatingActivated":"on","heatingTemp":75,"pumpModMax":90,"pumpModMin":55,"pumpDelay":1,"burnMinPeriod":10,"burnMinPower":0,"burnMaxPower":75,"boilHystOn":-6,"boilHystOff":6,"UBAuptime":4007616,"burnStarts":275144,"burnWorkMin":436129,"heatWorkMin":349044,"serviceCode":"0A","serviceCodeNumber":305}` |
| `boiler_data_ww` | all | warm water data from the Boiler device | `{"wWComfort":"Hot","wWSelTemp":60,"wWSetTemp":62,"wWDisinfectionTemp":70,"wWType":"flow","wWChargeType":"3-way valve","wWCircPump":"off","wWCircPumpMode":"0x3min","wWCirc":"off","wWCurTemp":32.4,"wWCurFlow":0,"wwStorageTemp1":32.4,"wWActivated":"on","wWOneTime":"off","wWDisinfecting":"off","wWCharging":"off","wWRecharging":"on","wWTempOK":"on","wWActive":"off","wWHeat":"on","wWStarts":246432,"wWWorkM":87085}` |
| `boiler_data_info` | all | information data from the Boiler device | `{"nrgConsTotal":10,"auxElecHeatNrgConsTotal":10,"auxElecHeatNrgConsHeating":10,"auxElecHeatNrgConsDHW":10}` |
| `thermostat_data` | nested | data from the thermostat and for each of its Heating Circuits.| `{ "datetime":"07:47:05 09/03/2000", "display":"int. temperature", "language":"French", "building":"medium", "MinExtTemperature":-10, "CalIntTemperature":0, "clockOffset":3, "hc1":{"seltemp":15, "currtemp":20.6, "mode":"auto"}, "hc2":{"seltemp":8, "currtemp":18.2, "mode":"off"}}` |
| `thermostat_data` | single | In single format each heating ciruit is published with own topic | `{"datetime":"07:47:05 09/03/2000", "display":"int. temperature", "building":"medium", "MinExtTemperature":-10, "CalIntTemperature":0}` |
|`thermostat_data_hc<id>` | single | hc in single format | `{"seltemp":15, "currtemp":20.6, "mode":"auto"}` |
| `mixer_data` | nested | data from The Mixer with nests `hc1` to `hc4`and `wwc1`, `wwc2` | `{"hc1": {"flowTemp":55, "pumpStatus":"on", "valveStatus":25}}` |
| `mixer_data_hc<id>` `mixer_data_wwc<id>` | single | data from The Mixer in single format for each of its Heating Circuits where `<id>` is circuit number | `{"type":"hc", "flowTemp":55, "pumpStatus":"on", "valveStatus":55}` |
| `shower_data` | | the shower timer and alert toggles plus the duration of the last shower taken | `{"timer":"0","alert":"0","duration":"4 minutes 32 seconds"}` |
| `solar_data` | all | all data from the Solar Module (if connected) | `{ "collectorTemp": 15.8, "tankBottomTemp": 29.8, "solarPumpModulation": 0, "cylinderPumpModulation": 0, "solarPump": "off", "valveStatus": "off", "tankHeated": "off", "collectorShutdown": "off", "energyLastHour": 0, "energyToday": 1792, "energyTotal": 2784.7 }` |
| `dallassensor_data` | nested| temperature readings from any external Dallas sensors attached to the ESP | `{"sensor1": {"id":"28-FF47-AC90-1604", "temp":20.94}}` |
| `dallassensor_data` | single | temperature readings from Dallas sensor in single format with unique sensor id | `{"28-FF47-AC90-1604":20.94}` |

The key's and their description:

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
   * `switchTemp` = Mixer switch temperature
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
   * `upTimeControl` = Operating time control
   * `upTimeCompHeating` = Operating time compressor heating
   * `upTimeCompCooling` = Operating time compressor cooling
   * `upTimeCompWw` = Operating time compressor warm water
   * `heatingStarts` = Heating starts (control)
   * `coolingStarts` = Cooling starts (control)
   * `wWStarts2` = Warm water starts (control)
   * `nrgConsTotal` = Energy consumption total
   * `auxElecHeatNrgConsTotal` = Auxiliary electrical heater energy consumption total
   * `auxElecHeatNrgConsHeating` = Auxiliary electrical heater energy consumption heating
   * `auxElecHeatNrgConsDHW` = Auxiliary electrical heater energy consumption DHW
   * `nrgConsCompTotal` = Energy consumption compressor total
   * `nrgConsCompHeating` = Energy consumption compressor heating
   * `nrgConsCompWw` = Energy consumption compressor warm water
   * `nrgConsCompCooling` = Energy consumption compressor total
   * `nrgSuppTotal` = Energy supplied total
   * `nrgSuppHeating` = Energy supplied heating
   * `nrgSuppWw` = Energy supplied warm water
   * `nrgSuppCooling` = Energy supplied cooling
   * `maintenanceMessage` = Code for maintenance H03-time, H08-date, etc.
   * `maintenance` = Type of scheduled maintenance Time in hours or date 

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

### mixer
   * `wwTemp` = Current warm water temperature
   * `pumpStatus` = Current pump status
   * `tempStatus` = Current temperature status
   * `flowTemp` = Current flow temperature
   * `flowSetTemp` = Setpoint flow temperature
   * `valveStatus` = Valve position in %

### heatpump
   * `airHumidity` = Relative air humidity
   * `dewTemperature` = Dew temperature point

### thermostat
   * `datetime` = Date & Time
   * `display` = Display (RC30 only)
   * `language` = Language (RC30 only)
   * `offsetclock` = Offset clock (RC30 only)
   * `dampedtemp` = Damped outdoor temperature = the thermostat damps changes to the actual outside temperature to mirror the thermal mass of the building. Building Type setting changes the time constant of the damping
   * `inttemp1` = Temperature sensor 1
   * `inttemp2` = Temperature sensor 2
   * `intoffset` = Offset int. temperature sensor
   * `minexttemp` = Min ext. temperature
   * `building` = Building type (light,medium, heavy)
   * `wwmode` = Warm water mode
   * `wwtemp` = Warm water upper temperature
   * `wwtemplow` = Warm water lower temperature
   * `wwextra1` = Onetime for circuit 1 started
   * `wwcircmode` = Warm Water circulation mode
   * `floordry` = Floordrying started
   * `floordrytemp`=  Temperature for floordrying

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
   * `offsettemp` = Offset temperature, heating curve at roomtemperature
   * `designtemp` = Design temperature, heating curve at minexttemp
   * `roominfluence` = Influence of roomtemperature in outdoorcontrolled circuits 
   * `flowtempoffset` = Offset for boiler in mixed circuits
   * `minflowtemp` = Flowtemperature lower limit
   * `maxflowtemp` = Flowtemperature upper limit
   * `summertemp` = Summer temperature
   * `summermode` = Summer mode
   * `reducemode` = How temperature is set in night/eco mode: 
   * `program` = timer program selection
   * `controlmode` = thermostat control by outdoortemperature or roomtemperature
   * `mode` = Mode
   * `modetype` = Mode type

## Sending Commands

EMS-ESP will subscribe to specific topics depending on the EMS devices attached. For example `boiler`, `thermostat` etc. Commands can be sent to EMS-ESP via these topics using the payload format:
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
