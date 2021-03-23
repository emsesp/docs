The various types from newer EMS+ controllers like the MC110 found in GB122/125's.

In the schema below the first number represent the byte position, so 1 being the first byte of the message block (which is the 5th byte of an EMS 1.0 telegram). 

This information was compiled with most if it coming from https://github.com/Th3M3/buderus_ems-wiki.
Some positions has changed due to user feedback. Positions as offset, counting from 0.  

## Type 0xD1: UBAOutdoorTemp

Sent every minute. The first 2 bytes is a short value * 10

```
0 - 1 = outdoor temp, short value * 10
```

## Type 0x14: UBAOperatingTime

```
0 - 1 = total operating time in minutes
```

## Type 0xBF: DevicesErrorMessage

Sent every 10 minutes

```
0 = Device address (Boiler 0x08)
1 = Model ID, 0x85 for MC110/GB125, 0xEA for GB122
2 = blocking error: always 0x0A (fault class, see service manual)
3 = blocking error: 0x00 or 0x10 = interlocking error, 0x11 = blocking error, 0x12 = system error, 0x13 = reset system error
4 = ASCII | Fault code 0. character (possibly 0x0a = space)
5 = ASCII | Fault code (operation code) 1st character
6 = ASCII | Fault code (operation code) 2nd character
7 - 8 = additional code (status code)
9 - 16 next error as in 0 - 8
17 - 24 next error as in 0 - 8
```

## Type 0xE3: UBA??

Sent every 10 seconds

```
2 = heat request. is 1 if byte 1/bit 1 is set, otherwise 0
5 = bit 1 for warming water yes/no
11 - 12 = boiler actual temperature * 10 C
13 = Burner capacity-actual in %
14 = Always 0x64 (100%)
15 = Boiler max. temperature in C
18 = %, is 0x64 (100%) if byte 1/bit 1 is set to 1. Otherwise 0.
19 = Cool set temperature for DHW preparation in C
```

## Type 0xE4: UBAMonitorFast

Sent every 3 seconds

```
1 =  operation code 1st character
2 = operation code 2nd character
3 = operation code 3rd character
4 - 5 = status code, as numerical value
6 = boiler set temp/heater temp in C
7 - 8 = actual boiler temp * 10
9 = burner selected power, , 0x64 (= 100%) in heating mode, 0x00 in DHW preparation, as %
10 = burner current power as %
11 = bit 0 = flame yes/no, bit 1 = pump active yes/no, bit 2 = heating active yes/no
13 - 14 temperature value, unknown
17 - 18 return temperature
19 - 20 = flame current * 10 in uA
21 = system pressure * 10 in bar
24 - 25 = same as bytes 7-8
```

## Type 0xE5: UBAMonitorSlow

Sent every 60 seconds

```
2 =
 bit 0 = fuel valve 1 open
 bit 1 = fuel valve 2 open
 bit 2 = blower on
 bit 3 = ignition on
 bit 4 = oil preheater on
 bit 5 = boiler circuit pump on
 bit 6 = 3-way valve on WW
 bit 7 = circulating pump on
6 -7 = exhaust temperature
10 - 12 = total burner starts
13 - 15 = burner operating hours
16 - 18 = burner level 2 operating hours
19 - 21 = Burner operating hours due to heating demand (excluding DHW preparation)
22 - 24 = Burner starting by heat demand (excluding WW-preparation)
25 = Heating circuit pump modulation %
```

## Type 0xE6: UBA Paramter 

```
0 = heating activated
1 = heating temperature
4 = burner max power
5 = burner min power
8 = boiler hysteresis off
9 = boiler hysteresis on
10 = burner min cycle time
```

## Type 0xE9: DHW status
  
Sent every 10 seconds

```
0 = DHW setpoint (with setpoint = "off": 0x0A = 10 ° C)
1 - 2 = hot water actual value * 10
3 - 4 = hot water 2 actual value * 10
9 = setpoint thermal disinfection
10 = setpoint daily heating temperature
12 = 
 bit 0 : DHW preparation activated by automatic program
 bit 2 : DHW preparation activated by one-time charge
 bit 3 : DHW preparation activated by thermal disinfection
 bit 4 : DHW preparation active (always 1 if bit 0, 2 or 3 also 1)
13 =
 bit 0 : Circulation day mode (or by single charge / th. disinfection activated)
 bit 2 : circulating pump on
 bit 4 : WW-preparation (when switching to daytime operation sometimes short 0, then again 1)
 bit 5 : WW temperature ok
14 - 16 = # hours water heating
17 - 19 = # of Warm water preparations
20 = Warming water (0x64 = 100%)
23 = Set value of time program (if set = "off": 0x00)
25 = same as byte 1, in C
```

## Type 0xEA: DHW settings
  
```
5 = DHW activated
10 = circulation pump installed
11 = circulation pump mode: off, 1x3min, .. 6x3min, continuous
```

## Type 0x07E4: UBA Status

Sent every 10 seconds

```
5 = operation code 1st character
6 = operation code 2nd character
9 = Boiler setpoint temperature during heating operation (0x00 with DHW preparation)
10 = 0x64 (= 100%) in heating mode, 0x00 in DHW preparation or when night
11 = Boiler setpoint temperature during DHW preparation (0x00 during heating operation or when night)
```
