## General:
Mixing modules are used for different tasks.
- Main task is to keep the boiler hot and mix cold water from backflow to flow to achieve a constant flowtemp.
- Mixing module MM10 can also be used to add a hybrid-switching-module to hc2 if HM10 is installed on hc1.
- MM100, 200 and 400 can also be used to charge hot water buffers.

## MM10:
- Device address 0x21, fixed to hc2
- EMS protocol
### Type 0xAC:
- command from thermostat; sets temperature setpoint (index 00) and pump modulation (index 01)
- ``Thermostat -> Mixing Module, MM10ParameterMessage(0xAC), telegram: 10 21 AC 00 2A 64 01``
- setpoint 42°C (2A), pump 100% (64)
### Type 0xAB  
- status-message from mixing module; publishes setpoint(00), temperatur(01) and pump(03) 
- `Mixing Module -> All, MMStatusMessage(0xAB), telegram: 21 00 AB 00 2A 01 A3 64 02 01 00`
- setpoint 42°C (2A), temperature 41.9°C (01A3), pump 100% (64) 

## MM50
- Same protokoll as MM100 but fixed to address 0x21 (hc2) and Type 0x1D08

## MM100, MM200, MM400
- Device address selectable by rotary switch 1-0x20 ... 9-0x29
- addresses 0x20 .. 0x23 sets mixing to hc1 .. hc4, 0x28, 0x29 sets water buffer function
- EMS+ protocol
- MM200 is two MM100 in one case, MM400 four modules in one case
### Type 0x01D7, 0x01D8, 0x01D9, 0x01DA:
- status-message per hc from mixing module; publishes valve status (02), temperatur(03) and pump(05) 
### Type 0x0231, 0x0232
- warm water buffer status; publishes flow temperature (00), pump (02) and temperature status (0B)
