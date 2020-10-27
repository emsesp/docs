## General
Mixer modules are used for different tasks.
- Main task is to keep the boiler hot and mix cold water from backflow to flow to achieve a constant flowtemp.
- Mixer module MM10 can also be used to add a hybrid-switching-module to hc2 if HM10 is installed on hc1.
- MM100, 200 and 400 can also be used to charge hot water buffers.

## MM10
- internal switch for device address (remove cap), only heating circuits
- EMS protocol

#### Type 0xAA Config
- mixer module off/on (index 00) 0x00 or 0xFF, valve time to open (index 01) in 10sec steps 

#### Type 0xAC Command
- command from thermostat; sets temperature setpoint (index 00) and pump modulation (index 01)
- ``Thermostat -> Mixer, MM10ParameterMessage(0xAC), telegram: 10 21 AC 00 2A 64 01``
- setpoint 42°C (2A), pump 100% (64)
  
#### Type 0xAB Status
- status-message from mixer module; publishes setpoint(00), temperature(01), pump(03) and valve status (04) 
- `Mixer -> All, MMStatusMessage(0xAB), telegram: 21 00 AB 00 2A 01 A3 64 02 01 00`
- setpoint 42°C (2A), temperature 41.9°C (01A3), pump 100% (64), valve (02)
- pump is switched and shows only 0 or 100%, valve range -100% to 100%

## MM50
- Same protocol as MM100 but but without warm water circuits

## MM100, MM200, MM400
- Device address selectable by rotary switch 1-0x20 ... 9-0x29
- addresses 0x20 .. 0x23 sets mixer to hc1 .. hc4, 0x28, 0x29 sets water buffer function
- EMS+ protocol
- MM200 is two MM100 in one case, MM400 four modules in one case
  
#### Type 0x01D7, 0x01D8, 0x01D9, 0x01DA
- status-message per hc from mixer module; publishes valve position 0-100% (02), temperature(03) and pump(05) 

#### Type 0x0231, 0x0232
- warm water buffer status; publishes flow temperature (00), pump (02) and temperature status (0B)

## IPM

#### Type 0x000C
- status message; mixer on (00), pump on/off (01), valve position 0-100% (02), flow temperature (03), setpoint of flow temperature (05)
