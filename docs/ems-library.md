---
title: EMS Library
description: Comprehensive reference for EMS telegram protocols and entity definitions
tags:
  - devices
  - protocol
  - reference
---

# EMS Library

!!! info "Community Documentation"
    This page is a comprehensive summary of collected EMS knowledge from the community, including entity names, telegram protocols, and how they work.

!!! tip "Contributing"
    Please contribute! Content is in [Markdown](https://www.markdownguide.org/cheat-sheet/) format.

---

## Table of Contents

This document contains detailed information about EMS telegram protocols organized by telegram ID:

- [Basic Telegrams](#basic-telegrams) (0x0001 - 0x0013)
- [System Telegrams](#system-telegrams) (0x0026 - 0x0027)  
- [Error and Status Telegrams](#error-and-status-telegrams) (0x00BF - 0x00FB)
- [Thermostat Telegrams](#thermostat-telegrams) (0x0165 - 0x0178)
- [Hybrid Module Telegrams](#hybrid-module-telegrams) (0x099A)

---

## Basic Telegrams

Telegrams 0x0001 through 0x0013 contain basic system information and identification data.

### Telegram: 0x0001

!!! info "Product Data Electronics Hardware"
    **Used in:** Various controllers, thermostats and boilers  
    **Description:** Holds ASCII coded device information  
    **Class:** Constant  
    **EMS category:** EMS1.0 & EMS2.0  
    **Distribution:** unicast-on-request  

#### Offset Variables

| Offset | Variable name | Min | Max | Resolution | Unit | Comment |
| -------- | ------------------------- | ----- | ----- | ------------ | ------- | --------- |
| 0-26 | ASCII coded numbers | 0 | 255 | 1 | ASCII | Sequence of numbers. Examples: HMC310 25303763146288737718903, RC100.2 H 05704801002367738112973, MX300 25303394051798738806124 |
| 27-42 | Product name ASCII coded | 0 | 255 | 1 | ASCII | Should be \0 terminated, but is not always. i.e. Heat Pump responds with 43 55 48 50 = "CUHP", but \0 is missing |
| 43-69 | More data | 0 | 255 | 1 | - | Some devices send more data after offset 43. Either a series of 00 or FF |

### Telegram: 0x0002

!!! info "Module Identification Data"
    **Used in:** Various controllers, thermostats and boilers  
    **Description:** Holds device information  
    **Class:** Constant  
    **EMS category:** EMS1.0 & EMS2.0  
    **Distribution:** unicast-on-request, broadcast-on-powerup  

| Offset | Variable name | Min | Max | Resolution | Unit | Comment |
| -------- | -------------------------------- | ----- | ----- | ------------ | ------ | --------- |
| 0 | Product ID | 0 | 255 | 1 | - | 0=invalid?; 64=UBA3; ... ; 68=BC10; 69=MM10; ...; 72=GB125; 73=SM10; ...; 77=M300; 78=M400; ...; 86=RC35; ...; 95=HT3; 109=JunkersFW100; ...; 123=CBS ; ...; 125=MX25; 157=CW100; 158=HMC310/CW400/RC310; 160=MM100; ...; 172=CUHP;...; 190=BC10; ...; 195=GB172i; ...; 200=Sensor w/humidity; 219=WS170 234=ACU; 248=HM200; 252=KF30; 253=HMI800; .... |
| 1 | Major version | 0 | 255 | 1 | - | Major software version |
| 2 | Minor version | 0 | 255 | 1 | - | Minor software version |
| 3 | 2nd product ID | 0 | 255 | 1 | - |  |
| 4 | Major version of 2nd product ID | 0 | 255 | 1 | - |  |
| 5 | Minor version of 2nd product ID | 0 | 255 | 1 | - |  |
| ... |  |  |  |  |  |  |
| 9 | Brand ID | 0 | 255 | 1 | - | 1=Bosch; 2= Junkers; 3=Buderus; 4=Nefit; ...; 13=IVT; |

### Telegram: 0x0003

!!! info "Product Data Appliance"
    **Used in:** Various controllers, thermostats and boilers  
    **Description:** Holds ASCII coded device information  
    **Class:** Constant  
    **EMS category:** EMS1.0 & EMS2.0  
    **Distribution:** unicast-on-request  

| Offset | Variable name | Min | Max | Resolution | Unit | Comment |
| ---------- | -------------------- | ----- | ------ | ------------ | ------- | --------------------------------------------- |
| 0-26 | ASCII coded numbers | 0 | 255 | 1 | ASCII | Example heat pump 26003750000018738212162 |
| 27-54? | More data | 0 | 255 | 1 | - | Some appliances return a series of 00 or FF |

### Telegram: 0x0005

!!! warning "Special Commands"
    **Used in:** Various controllers, thermostats and boilers  
    **Description:** Collection of different special functions/commands  
    **Class:** Command  
    **EMS category:** EMS1.0  
    **Distribution:** unicast-write-request  

!!! danger "Use with Caution"
    These commands can affect device operation and should be used carefully.

| Offset | Variable name | Min | Max | Resolution | Unit | Comment |
| -------- | ------------------------------ | ----- | ------ | ------------ | ------ | ------------------------------------------------------------------------------------------------------------- |
| 0 | Reset Error | 0 | 255 | 1 | enum | 90=error reset, also 153 and 245 do a reset (maybe on a different level) |
| 2 | Reset burner timer and starts | 0 | 255 | 1 | enum | 165=reset burner timer and restarts |
| 4 | Chimney sweeper mode | 0 | 255 | 1 | enum | 100=activate, 0=off |
| 6 | Reset to factory setting | 0 | 255 | 1 | enum | 154=do a reset |
| 8 | Reset maintenance message | 0 | 255 | 1 | enum | 255=resets maintenance request |
| ... |  |  |  |  |  |  |
| 12 | Erase error history | 0 | 255 | 1 | enum | 169=erase error history |
| ... |  |  |  |  |  |  |
| 42 | Clear error history | 0 | 255 | 1 | enum | 1=local history, 2=global history, 3=both |
| 44 | Thermal desinfection | 0 | 255 | 1 | enum | 255=start, 254=stop |
| ... |  |  |  |  |  |  |
| 52 | Force manual defrost | 0 | 255 | 1 | enum | 1=start |
| ... |  |  |  |  |  |  |
| 68 | Standby mode | 0 | 255 | 1 | enum | 85=activate if standby can be selected in the menu, 170=deactivate, status is visible in 0x00E4 offset 12.0 |
| 70 | DHW ECO | 0 | 255 | 1 | enum | 85=activate, 170=deactivate |

### Telegram: 0x0010

!!! info "Locking Error History"
    **Used in:** Older systems hold this error list while newer systems use 0x00C2 and/or 0x00C6 and 0x00C7  
    **Description:** Holds the history of locking errors.  
    **Class:** monitor  
    **EMS category:** EMS1.0 and EMS2.0  
    **Distribution:** unicast-on-request, broadcast-on-change  

| Offset | Variable name | Min | Max | Resolution | Unit | Comment |
| --------- | --------------------- | ----- | ------- | ------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0-1 | Error 1 display code | 0 | 255 | 1 | ASCII | displayed error code |
| 2-3 | Error 1 cause code | 0 | 65535 | 1 | - | numbers >= 200, list used in Nefit and Buderus |
| 4 | Error 1 Start year | 0 | 255 | 1 | - | Bit 7 (=1) of this number indicates if the year is absolute. Bit 7=0 indicates relative time, then is offset 4 is unused |
| 5 | Error 1 Start month | 1 | 12 | 1 | - | Offset 4 Bit 7=1 indicates that this offset 5 is the absolute month. Offset 4 Bit 7=0 indicates relative time. Then the uptime in minutes is stored in offset 5-7 |
| 6 | Error 1 Start hour | 1 | 31 | 1 | - | Offset 4 Bit 7=1 indicates that this offset 6 is the absolute hour. Offset 4 Bit 7=0 indicates relative time. Then the uptime in minutes is stored in offset 5-7 |
| 7 | Error 1 Start day | 1 | 31 | 1 | - | Offset 4 Bit 7=1 indicates that this offset 7 is the absolute day. Offset 4 Bit 7=0 indicates relative time. Then the uptime in minutes is stored in offset 5-7 |
| 8 | Error 1 Start minute | 1 | 59 | 1 | - | Offset 4 Bit 7=1 indicates that this offset 7 is the absolute minute. Offset 4 Bit 7=0 indicates relative time. Then the offset 8 is empty |
| 9-10 | Error 1 duration | 1 | 65535 | 1 | min |  |
| 11 | Error 1 source | 1 | 127 | 1 | - | device ID of the error source |
| 12-23 | Error 2 |  |  |  |  | same as offset 0 ff. for error 1 |
| 24-35 | Error 3 |  |  |  |  | same as offset 0 ff. for error 1 |
| 36-47 | Error 4 |  |  |  |  | same as offset 0 ff. for error 1 |
| 48-59 | Error 5 |  |  |  |  | same as offset 0 ff. for error 1 |
| 60-71 | Error 6 |  |  |  |  | same as offset 0 ff. for error 1 |
| 72-83 | Error 7 |  |  |  |  | same as offset 0 ff. for error 1 |
| 84-95 | Error 8 |  |  |  |  | same as offset 0 ff. for error 1 |

### Telegram: 0x0011

!!! info "Blocking Error History"
    **Used in:** Older systems hold this error list while newer systems use 0x00C2 and/or 0x00C6 and 0x00C7  
    **Description:** Holds the history of blocking errors.  
    **Class:** monitor  
    **EMS category:** EMS1.0  
    **Distribution:** unicast-on-request, broadcast-on-change  

| Offset | Variable name | Min | Max | Resolution | Unit | Comment |
| --------- | --------------------- | ----- | ------- | ------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0-1 | Error 1 display code | 0 | 255 | 1 | ASCII | displayed error code |
| 2-3 | Error 1 cause code | 0 | 65535 | 1 | - | numbers >= 200, list used in Nefit and Buderus |
| 4 | Error 1 Start year | 0 | 255 | 1 |  | Bit 7 (=1) of this number indicates if the year is absolute. Bit 7=0 indicates relative time, then is offset 4 is unused |
| 5 | Error 1 Start month | 1 | 12 | 1 |  | Offset 4 Bit 7=1 indicates that this offset 5 is the absolute month. Offset 4 Bit 7=0 indicates relative time. Then the uptime in minutes is stored in offset 5-7 |
| 6 | Error 1 Start hour | 1 | 31 | 1 |  | Offset 4 Bit 7=1 indicates that this offset 6 is the absolute hour. Offset 4 Bit 7=0 indicates relative time. Then the uptime in minutes is stored in offset 5-7 |
| 7 | Error 1 Start day | 1 | 31 | 1 |  | Offset 4 Bit 7=1 indicates that this offset 7 is the absolute day. Offset 4 Bit 7=0 indicates relative time. Then the uptime in minutes is stored in offset 5-7 |
| 8 | Error 1 Start minute | 1 | 59 | 1 |  | Offset 4 Bit 7=1 indicates that this offset 7 is the absolute minute. Offset 4 Bit 7=0 indicates relative time. Then the offset 8 is empty |
| 9-10 | Error 1 duration | 1 | 65535 | 1 | min |  |
| 11 | Error 1 source | 1 | 127 | 1 |  | device ID of the error source |
| 12 - 23 | Error 2 |  |  |  |  | same as offset 0 ff. for error 1 |
| 24 - 35 | Error 3 |  |  |  |  | same as offset 0 ff. for error 1 |
| 36 - 47 | Error 4 |  |  |  |  | same as offset 0 ff. for error 1 |
| 48 - 59 | Error 5 |  |  |  |  | same as offset 0 ff. for error 1 |
| 60 - 71 | Error 6 |  |  |  |  | same as offset 0 ff. for error 1 |
| 72 - 83 | Error 7 |  |  |  |  | same as offset 0 ff. for error 1 |
| 84 - 95 | Error 8 |  |  |  |  | same as offset 0 ff. for error 1 |

### Telegram: 0x0012

!!! danger "Blocking actual system error history"
    **Used in:** Older systems hold this error list while newer systems use 0x00C0 and 0x00C1
    **Description:** Holds the history of blocking errors of the system.
    **Class:** monitor
    **EMS category:** EMS1.0
    **Distribution:** unicast-on-request, broadcast-on-change

| Offset | Variable name | min | max | resolution | unit | comment |
| ------- | -------------------- | --- | ----- | ---------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0-1 | Error 1 display code | 0 | 255 | 1 | ASCII | displayed error code |
| 2-3 | Error 1 cause code | 0 | 65535 | 1 |  | numbers >= 200, list used in Nefit and Buderus |
| 4 | Error 1 Start year | 0 | 255 | 1 |  | Bit 7 (=1) of this number indicates if the year is absolute. Bit 7=0 indicates relative time, then is offset 4 is unused |
| 5 | Error 1 Start month | 1 | 12 | 1 |  | Offset 4 Bit 7=1 indicates that this offset 5 is the absolute month. Offset 4 Bit 7=0 indicates relative time. Then the uptime in minutes is stored in offset 5-7 |
| 6 | Error 1 Start hour | 1 | 31 | 1 |  | Offset 4 Bit 7=1 indicates that this offset 6 is the absolute hour. Offset 4 Bit 7=0 indicates relative time. Then the uptime in minutes is stored in offset 5-7 |
| 7 | Error 1 Start day | 1 | 31 | 1 |  | Offset 4 Bit 7=1 indicates that this offset 7 is the absolute day. Offset 4 Bit 7=0 indicates relative time. Then the uptime in minutes is stored in offset 5-7 |
| 8 | Error 1 Start minute | 1 | 59 | 1 |  | Offset 4 Bit 7=1 indicates that this offset 7 is the absolute minute. Offset 4 Bit 7=0 indicates relative time. Then the offset 8 is empty |
| 9-10 | Error 1 duration | 1 | 65535 | 1 | min |  |
| 11 | Error 1 source | 1 | 127 | 1 |  | device ID of the error source |
| 12 - 23 | Error 2 |  |  |  |  | same as offset 0 ff. for error 1 |
| 24 - 35 | Error 3 |  |  |  |  | same as offset 0 ff. for error 1 |
| 36 - 47 | Error 4 |  |  |  |  | same as offset 0 ff. for error 1 |

### Telegram: 0x0013

!!! danger "System error history"
    **Used in:** Older systems hold this error list while newer systems use 0x00C0 and 0x00C1
    **Description:** Holds the history of system errors.
    **Class:** monitor
    **EMS category:** EMS1.0
    **Distribution:** unicast-on-request, broadcast-on-change

| Offset | Variable name | min | max | resolution | unit | comment |
| ------- | -------------------- | --- | ----- | ---------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0-1 | Error 1 display code | 0 | 255 | 1 | ASCII | displayed error code |
| 2-3 | Error 1 cause code | 0 | 65535 | 1 |  | numbers >= 200, list used in Nefit and Buderus |
| 4 | Error 1 Start year | 0 | 255 | 1 |  | Bit 7 (=1) of this number indicates if the year is absolute. Bit 7=0 indicates relative time, then is offset 4 is unused |
| 5 | Error 1 Start month | 1 | 12 | 1 |  | Offset 4 Bit 7=1 indicates that this offset 5 is the absolute month. Offset 4 Bit 7=0 indicates relative time. Then the uptime in minutes is stored in offset 5-7 |
| 6 | Error 1 Start hour | 1 | 31 | 1 |  | Offset 4 Bit 7=1 indicates that this offset 6 is the absolute hour. Offset 4 Bit 7=0 indicates relative time. Then the uptime in minutes is stored in offset 5-7 |
| 7 | Error 1 Start day | 1 | 31 | 1 |  | Offset 4 Bit 7=1 indicates that this offset 7 is the absolute day. Offset 4 Bit 7=0 indicates relative time. Then the uptime in minutes is stored in offset 5-7 |
| 8 | Error 1 Start minute | 1 | 59 | 1 |  | Offset 4 Bit 7=1 indicates that this offset 7 is the absolute minute. Offset 4 Bit 7=0 indicates relative time. Then the offset 8 is empty |
| 9-10 | Error 1 duration | 1 | 65535 | 1 | min |  |
| 11 | Error 1 source | 1 | 127 | 1 |  | device ID of the error source |
| 12 - 23 | Error 2 |  |  |  |  | same as offset 0 ff. for error 1 |
| 24 - 35 | Error 3 |  |  |  |  | same as offset 0 ff. for error 1 |
| 36 - 47 | Error 4 |  |  |  |  | same as offset 0 ff. for error 1 |

---

## System Telegrams

Telegrams 0x0026 and 0x0027 contain system-level configuration and status information.

### Telegram: 0x0026

!!! info "EMS service tool heating parameters"
    **Used in:** HT3 Junkers systems
    **Description:** This telegrams contains HT3 configuration parameters for Netcom service tools
    **Class:** parameter
    **EMS category:** EMS1.0
    **Distribution:** unicast-on-request, broadcast-on-change, broadcast-on-power-up, unicast-write-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ---------------------------------- | --- | --- | ---------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 | CH pump speed | 1 | 10 | 1 | enum | 1 = No predefined settings. Minimum pump speed telegram 0x16,offset 10 and maximum pump speed telegram 0x16 offset 9 manually adjustable; 2-7 = Constant speeds (minimum pump speed telegram 0x16 offset 10 and maximum pump speed telegram 0x16 offset 9 are the same). 8-10 = Predefined minimum pump speed 0x16 offset 10 and maximum pump speed 0x16 offset 9 settings. |
| 1 | pump switch mode | 0 | 5 | 1 | enum | auto = 0, according burner = 1, acc room temp control = 2, acc outdoor temp control = 3, acc outdoor temp control optimized = 4, energy saving = 4, acc CH heat request = 5 |
| 2 | automatic anti cycle mode | -1 | 0 | 1 | bool | time delay between switching the boiler off and on again, 0 = off, FF = on |
| 3 | Min appliance power for CH and dhw | 0 | 100 | 1 | percent |  |
| 4 | Fan overrun time | 1 | 18 | 1 | 10 sec |  |
| 5 | min flow temp setpoint | 30 | 90 | 1 | °C |  |
| 6 | max flow temp setpoint | 30 | 90 | 1 | °C |  |
| 7 | max appliance power in CH mode | 0 | 100 | 1 | percent |  |

### Telegram: 0x0027

!!! info "EMS service tool dhw parameters"
    **Used in:** HT3 Junkers systems
    **Description:** This telegrams contains HT3 configuration parameters for Netcom service tools
    **Class:** parameter
    **EMS category:** EMS1.0
    **Distribution:** unicast-on-request, broadcast-on-change, broadcast-on-power-up, unicast-write-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ----------------------------------------------------- | ----- | --- | ---------- | ---------------------------------- | -------------------------------------------------------- |
| 0 | thermal desinfection | -1 | 0 | 1 | bool | 0 = no, FF = yes |
| 1 | anti cycle time for dhw | 20 | 60 | 1 | min | time delay between switching the boiler off and on again |
| 2 | dhw standby time after tapping | 0 | 30 | 1 | min |  |
| 3 | max pre heat temp | 40 | 65 | 1 | °C |  |
| 4 | water flow threshold for dhw demand | 25 | 50 | 1 | 0.1 l/min |  |
| 5 | turbine signal delay time | 2 | 16 | 1 | 0.25 sec |  |
| 6 | hot water on demand active | -1 | 0 | 1 | bool | 0 = off, FF = on |
| 7 | activate stratifying tank pump for circulation | -1 | 0 | 1 | bool | 0 = off, FF = on |
| 8 | pump off in case of dhw demand | -1 | 0 | 1 | bool | 0 = off, FF = on |
| 9 | solar mode min activation time | 0 | 50 | 1 | min |  |
| 10 | max appliance power in dhw mode | 0 | 100 | 1 | percent |  |
| 11 | min dhw temperature | 10 80 | 1 | °C | user interface knob left position |  |
| 12 | max dhw temperature | 10 80 | 1 | °C | user interface knob right position |  |
| 13 | maximum of the max of the appliance power in dhw mode | 0 | 100 | 1 | percent |  |

---

## Error and Status Telegrams

Telegrams 0x00BF through 0x00FB contain error reporting, status information, and system diagnostics.

### Telegram: 0x00BF

!!! danger "Local error list"
    **Used in:** Used in systems that use the 0x00C2/0x00C6/0x00C7 error history lists
    **Description:** The lists holds up to three active errors, sorted by critically
    **Class:** monitor
    **EMS category:** EMS2.0
    **Distribution:** unicast-on-request, broadcast-on-change, broadcast-periodically

| Offset | Variable name | min | max | resolution | unit | comment |
| ------- | ---------------------- | --- | ----- | ---------- | ----- | -------------------------------------------------------------------------------------- |
| 0 | Source address | 0 | 127 | 1 |  | 0=invalid |
| 1 | module ID | 0 | 255 | 1 |  | 0=invalid |
| 2 | module ID | 0 | 255 | 1 |  | if offset 1 > 255 |
| 3 | Error 1 | 0 | 255 | 1 | enum | error with highest prio; enums see 0x00C0/0x00C2 offset 3 and 0x00C6 offset 4 |
| 4.0 | Error 1 logging | 0 | 1 | 1 | bool | Log this error, see also 0x00C0/0x00C2 offset 4.0 and 0x00C6 offset 5.0 |
| 4.1-4.4 | Error 1 display level | 0 | 15 | 1 | enum | see 0x00C0/0x00C2 offset 4.1-4.4 and 0x00C6 offset 5.1-5.4 |
| 4.5 | Error 1 local overrule | 0 | 1 | 1 | bool |  |
| 5-7 | Error 1 display code | 0 | 255 | 1 | ASCII | see 0x00C0/0x00C2 offset 5-7 and 0x00C6 offset 6-8; displayed error |
| 8-9 | Error 1 code numeric | 0 | 65535 | 1 | enum | see 0x00C0/0x00C2 offset 8-9 and 0x00C6 offset 9-10; numerical part of displayed error |
| 10-16 | Error 2 |  |  |  |  | next lower prio error; offsets see 3-9 |
| 17-23 | Error 3 |  |  |  |  | next lower prio error; offsets see 3-9 |

### Telegram: 0x00C0

!!! danger "System error history"
    **Used in:** Various controllers, thermostats and boilers
    **Description:** Hold the history of errors. 0x00C0 holds the first 10 error messages and 0x00C1 the next 10. Error #1 is the most recent one. Going down the list the errors get older. Older systems use telegrams 0x0012 and 0x0013.
    **Class:** monitor
    **EMS category:** EMS2.0
    **Distribution:** unicast-on-request

| Offset | Variable name | min | max | resolution | unit | comment |
| --------- | ---------------------------- | --- | ----- | ---------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 | Error 1 source address | 0 | 127 | 1 |  | if 0x00, then no error |
| 1 | Error 1 module ID | 0 | 255 | 1 |  | same as in telegram 0x02 offset 0 |
| 2 | Error 1 module ID extension? | 0 | 255 | 1 |  | is always 0, but maybe used if offset 1 is more than 255 |
| 3 | Error 1 reason | 0 | 255 | 1 | enum | found so far: 0x00=fatal, 0x02/0x04/0x06=locked, 0x08=safety shutdown with restart, 0x0A=safety shutdown blocking, 0x0C=controlled shutdown, 0x0E=standard, 0x10=minor, 0x12/0x13=reset after maintenance, 0x14=maintenance |
| 4.0 | Error 1 Log error | 0 | 1 | 1 | bool | 1=yes, 0=no |
| 4.1-4.4 | Error 1 display level | 0 | 15 | 1 | enum | 0=no display, 2=expert, 4=installer, 8=user |
| 5-7 | Error 1 code | 0 | 255 | 1 | ASCII | displayed error code |
| 8-9 | Error 1 code numeric | 0 | 65535 | 1 | enum | numerical part of displayed error |
| 10 | Error 1 start year | 0 | 255 | 1 |  | Ignore bit 7, bit 0-6 give the year + 2000. If year is 0, it looks like a relative time from power on of the device and minutes are stored in offset 11-13 |
| 11 | Error 1 start month | 0 | 12 | 1 |  | may be bigger than 12 if minutes since power on are stored here, see comment on offset 10 |
| 12 | Error 1 start hour | 0 | 23 | 1 |  | may be bigger than 23 if minutes since power on are stored here, see comment on offset 10 |
| 13 | Error 1 start day | 0 | 31 | 1 |  | may be bigger than 31 if minutes since power on are stored here, see comment on offset 10 |
| 14 | Error 1 start minute | 0 | 59 | 1 |  | Is 0 if offset 10 is 0 and a relative time is stored in offset 11-13 |
| 15 | Error 1 end year | 0 | 255 | 1 |  | Ignore bit 7, bit 0-6 give the year + 2000. If year is 0, it looks like a relative time from power on of the device and minutes are stored in offset 11-13 |
| 16 | Error 1 end month | 0 | 12 | 1 |  | may be bigger than 12 if minutes since power on are stored here, see comment on offset 10 |
| 17 | Error 1 end hour | 0 | 23 | 1 |  | may be bigger than 23 if minutes since power on are stored here, see comment on offset 10 |
| 18 | Error 1 end day | 0 | 31 | 1 |  | may be bigger than 31 if minutes since power on are stored here, see comment on offset 10 |
| 19 | Error 1 end minute | 0 | 59 | 1 |  | Is 0 if offset 10 is 0 and a relative time is stored in offset 11-13 |
| 20 - 39 | Error 2 |  |  |  |  | same as offset 0 ff. for error 1 |
| 40 - 59 | Error 3 |  |  |  |  | same as offset 0 ff. for error 1 |
| 60 - 79 | Error 4 |  |  |  |  | same as offset 0 ff. for error 1 |
| 80 - 99 | Error 5 |  |  |  |  | same as offset 0 ff. for error 1 |
| 100 - 119 | Error 6 |  |  |  |  | same as offset 0 ff. for error 1 |
| 120 - 139 | Error 7 |  |  |  |  | same as offset 0 ff. for error 1 |
| 140 - 159 | Error 8 |  |  |  |  | same as offset 0 ff. for error 1 |
| 160 - 179 | Error 9 |  |  |  |  | same as offset 0 ff. for error 1 |
| 180 - 199 | Error 10 |  |  |  |  | same as offset 0 ff. for error 1 |

### Telegram: 0x00C2

!!! danger "Local device error history"
    **Used in:** Various controllers, thermostats and boilers
    **Description:** Hold the history of errors. Each device has it´s own list of own errors. Error 1 is the most recent one. Going down the list the errors get older. Older systems use telegrams 0x0010 and 0x0011.
    **Class:** monitor
    **EMS category:** EMS2.0
    **Distribution:** unicast-on-request

| Offset | Variable name | min | max | resolution | unit | comment |
| --------- | ---------------------------- | --- | ----- | ---------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 | Error 1 source address | 0 | 127 | 1 |  | if 0x00, then no error |
| 1 | Error 1 module ID | 0 | 255 | 1 |  | same as in telegram 0x02 offset 0 |
| 2 | Error 1 module ID extension? | 0 | 255 | 1 |  | is always 0, but maybe used if offset 1 is more than 255 |
| 3 | Error 1 reason | 0 | 255 | 1 | enum | found so far: 0x00=fatal, 0x02/0x04/0x06=locked, 0x08=safety shutdown with restart, 0x0A=safety shutdown blocking, 0x0C=controlled shutdown, 0x0E=standard, 0x10=minor, 0x12/0x13=reset after maintenance, 0x14=maintenance |
| 4.0 | Error 1 Log error | 0 | 1 | 1 | bool | 1=yes, 0=no |
| 4.1-4.4 | Error 1 display level | 0 | ? | 1 | enum | 0=no display, 2=expert, 4=installer, 8=user |
| 5-7 | Error 1 code | 0 | 255 | 1 | ASCII | displayed error code |
| 8-9 | Error 1 code numeric | 0 | 65535 | 1 | enum | numerical part of displayed error |
| 10 | Error 1 start year | 0 | 255 | 1 |  | Ignore bit 7, bit 0-6 give the year + 2000. If year is 0, it looks like a relative time from power on of the device and minutes are stored in offset 11-13 |
| 11 | Error 1 start month | 0 | 12 | 1 |  | may be bigger than 12 if minutes since power on are stored here, see comment on offset 10 |
| 12 | Error 1 start hour | 0 | 23 | 1 |  | may be bigger than 23 if minutes since power on are stored here, see comment on offset 10 |
| 13 | Error 1 start day | 0 | 31 | 1 |  | may be bigger than 31 if minutes since power on are stored here, see comment on offset 10 |
| 14 | Error 1 start minute | 0 | 59 | 1 |  | Is 0 if offset 10 is 0 and a relative time is stored in offset 11-13 |
| 15 | Error 1 end year | 0 | 255 | 1 |  | Ignore bit 7, bit 0-6 give the year + 2000. If year is 0, it looks like a relative time from power on of the device and minutes are stored in offset 11-13 |
| 16 | Error 1 end month | 0 | 12 | 1 |  | may be bigger than 12 if minutes since power on are stored here, see comment on offset 10 |
| 17 | Error 1 end hour | 0 | 23 | 1 |  | may be bigger than 23 if minutes since power on are stored here, see comment on offset 10 |
| 18 | Error 1 end day | 0 | 31 | 1 |  | may be bigger than 31 if minutes since power on are stored here, see comment on offset 10 |
| 19 | Error 1 end minute | 0 | 59 | 1 |  | Is 0 if offset 10 is 0 and a relative time is stored in offset 11-13 |
| 20 - 39 | Error 2 |  |  |  |  | same as offset 0 ff. for error 1 |
| 40 - 59 | Error 3 |  |  |  |  | same as offset 0 ff. for error 1 |
| 60 - 79 | Error 4 |  |  |  |  | same as offset 0 ff. for error 1 |
| 80 - 99 | Error 5 |  |  |  |  | same as offset 0 ff. for error 1 |
| 100 - 119 | Error 6 |  |  |  |  | same as offset 0 ff. for error 1 |
| 120 - 139 | Error 7 |  |  |  |  | same as offset 0 ff. for error 1 |
| 140 - 159 | Error 8 |  |  |  |  | same as offset 0 ff. for error 1 |
| 160 - 179 | Error 9 |  |  |  |  | same as offset 0 ff. for error 1 |
| 180 - 199 | Error 10 |  |  |  |  | same as offset 0 ff. for error 1 |

### Telegram: 0x00C6

!!! danger "Local heat pump error history"
    **Used in:** heat pump (boiler)
    **Description:** Hold the history of errors. Error 1 is the most recent one. Going down the list the errors get older. This list is the same as 0x00C2, but has a unique identified at the beginning of each error. This list has 10 entries and is continued in 0x00C7. Older systems use telegrams 0x0010 and 0x0011.
    **Class:** monitor
    **EMS category:** EMS2.0
    **Distribution:** unicast-on-request

| Offset | Variable name | min | max | resolution | unit | comment |
| --------- | ---------------------------- | --- | ----- | ---------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 | Error UID | 0 | 254 | 1 |  | ID of error 1 |
| 1 | Error 1 source address | 0 | 127 | 1 |  | if 0x00, then no error |
| 2 | Error 1 module ID | 0 | 255 | 1 |  | same as in telegram 0x02 offset 0 |
| 3 | Error 1 module ID extension? | 0 | 255 | 1 |  | is always 0, but maybe used if offset 1 is more than 255 |
| 4 | Error 1 reason | 0 | 255 | 1 | enum | found so far: 0x00=fatal, 0x02/0x04/0x06=locked, 0x08=safety shutdown with restart, 0x0A=safety shutdown blocking, 0x0C=controlled shutdown, 0x0E=standard, 0x10=minor, 0x12/0x13=reset after maintenance, 0x14=maintenance |
| 5.0 | Error 1 Log error | 0 | 1 | 1 | bool | 1=yes, 0=no |
| 5.1-5.4 | Error 1 display level | 0 | ? | 1 | enum | 0=no display, 2=expert, 4=installer, 8=user |
| 6-8 | Error 1 code | 0 | 255 | 1 | ASCII | displayed error code |
| 9-10 | Error 1 code numeric | 0 | 65535 | 1 | enum | numerical part of displayed error |
| 11 | Error 1 start year | 0 | 255 | 1 |  | Ignore bit 7, bit 0-6 give the year + 2000. If year is 0, it looks like a relative time from power on of the device and minutes are stored in offset 11-13 |
| 12 | Error 1 start month | 0 | 12 | 1 |  | may be bigger than 12 if minutes since power on are stored here, see comment on offset 10 |
| 13 | Error 1 start hour | 0 | 23 | 1 |  | may be bigger than 23 if minutes since power on are stored here, see comment on offset 10 |
| 14 | Error 1 start day | 0 | 31 | 1 |  | may be bigger than 31 if minutes since power on are stored here, see comment on offset 10 |
| 15 | Error 1 start minute | 0 | 59 | 1 |  | Is 0 if offset 10 is 0 and a relative time is stored in offset 11-13 |
| 16 | Error 1 end year | 0 | 255 | 1 |  | Ignore bit 7, bit 0-6 give the year + 2000. If year is 0, it looks like a relative time from power on of the device and minutes are stored in offset 11-13 |
| 17 | Error 1 end month | 0 | 12 | 1 |  | may be bigger than 12 if minutes since power on are stored here, see comment on offset 10 |
| 18 | Error 1 end hour | 0 | 23 | 1 |  | may be bigger than 23 if minutes since power on are stored here, see comment on offset 10 |
| 19 | Error 1 end day | 0 | 31 | 1 |  | may be bigger than 31 if minutes since power on are stored here, see comment on offset 10 |
| 20 | Error 1 end minute | 0 | 59 | 1 |  | Is 0 if offset 10 is 0 and a relative time is stored in offset 11-13 |
| 21 - 41 | Error 2 |  |  |  |  | same as offset 0 ff. for error 1 |
| 42 - 62 | Error 3 |  |  |  |  | same as offset 0 ff. for error 1 |
| 63 - 83 | Error 4 |  |  |  |  | same as offset 0 ff. for error 1 |
| 84 - 104 | Error 5 |  |  |  |  | same as offset 0 ff. for error 1 |
| 105 - 125 | Error 6 |  |  |  |  | same as offset 0 ff. for error 1 |
| 126 - 146 | Error 7 |  |  |  |  | same as offset 0 ff. for error 1 |
| 147 - 167 | Error 8 |  |  |  |  | same as offset 0 ff. for error 1 |
| 168 - 188 | Error 9 |  |  |  |  | same as offset 0 ff. for error 1 |
| 189 - 209 | Error 10 |  |  |  |  | same as offset 0 ff. for error 1 |

### Telegram: 0x00C7

!!! danger "Local heat pump error history"
    **Used in:** heat pump (boiler)
    **Description:** This list is the continuation of 0x00C6. Here are the errors 11 ... 20 stored. Older systems use telegrams 0x0010 and 0x0011.
    **Class:** monitor
    **EMS category:** EMS2.0
    **Distribution:** unicast-on-request

| Offset | Variable name | min | max | resolution | unit | comment |
| --------- | ----------------------------- | --- | ----- | ---------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 | Error UID | 0 | 254 | 1 |  | ID of error 11 |
| 1 | Error 11 source address | 0 | 127 | 1 |  | if 0x00, then no error |
| 2 | Error 11 module ID | 0 | 255 | 1 |  | same as in telegram 0x02 offset 0 |
| 3 | Error 11 module ID extension? | 0 | 255 | 1 |  | is always 0, but maybe used if offset 1 is more than 255 |
| 4 | Error 11 reason | 0 | 255 | 1 | enum | found so far: 0x00=fatal, 0x02/0x04/0x06=locked, 0x08=safety shutdown with restart, 0x0A=safety shutdown blocking, 0x0C=controlled shutdown, 0x0E=standard, 0x10=minor, 0x12/0x13=reset after maintenance, 0x14=maintenance |
| 5.0 | Error 11 Log error | 0 | 1 | 1 | bool | 1=yes, 0=no |
| 5.1-5.4 | Error 11 display level | 0 | ? | 1 | enum | 0=no display, 2=expert, 4=installer, 8=user |
| 6-8 | Error 11 code | 0 | 255 | 1 | ASCII | displayed error code |
| 9-10 | Error 11 code numeric | 0 | 65535 | 1 | enum | numerical part of displayed error |
| 11 | Error 11 start year | 0 | 255 | 1 |  | Ignore bit 7, bit 0-6 give the year + 2000. If year is 0, it looks like a relative time from power on of the device and minutes are stored in offset 11-13 |
| 12 | Error 11 start month | 0 | 12 | 1 |  | may be bigger than 12 if minutes since power on are stored here, see comment on offset 10 |
| 13 | Error 11 start hour | 0 | 23 | 1 |  | may be bigger than 23 if minutes since power on are stored here, see comment on offset 10 |
| 14 | Error 11 start day | 0 | 31 | 1 |  | may be bigger than 31 if minutes since power on are stored here, see comment on offset 10 |
| 15 | Error 11 start minute | 0 | 59 | 1 |  | Is 0 if offset 10 is 0 and a relative time is stored in offset 11-13 |
| 16 | Error 11 end year | 0 | 255 | 1 |  | Ignore bit 7, bit 0-6 give the year + 2000. If year is 0, it looks like a relative time from power on of the device and minutes are stored in offset 11-13 |
| 17 | Error 11 end month | 0 | 12 | 1 |  | may be bigger than 12 if minutes since power on are stored here, see comment on offset 10 |
| 18 | Error 11 end hour | 0 | 23 | 1 |  | may be bigger than 23 if minutes since power on are stored here, see comment on offset 10 |
| 19 | Error 11 end day | 0 | 31 | 1 |  | may be bigger than 31 if minutes since power on are stored here, see comment on offset 10 |
| 20 | Error 11 end minute | 0 | 59 | 1 |  | Is 0 if offset 10 is 0 and a relative time is stored in offset 11-13 |
| 21 - 41 | Error 12 |  |  |  |  | same as offset 0 ff. for error 11 |
| 42 - 62 | Error 13 |  |  |  |  | same as offset 0 ff. for error 11 |
| 63 - 83 | Error 14 |  |  |  |  | same as offset 0 ff. for error 11 |
| 84 - 104 | Error 15 |  |  |  |  | same as offset 0 ff. for error 11 |
| 105 - 125 | Error 16 |  |  |  |  | same as offset 0 ff. for error 11 |
| 126 - 146 | Error 17 |  |  |  |  | same as offset 0 ff. for error 11 |
| 147 - 167 | Error 18 |  |  |  |  | same as offset 0 ff. for error 11 |
| 168 - 188 | Error 19 |  |  |  |  | same as offset 0 ff. for error 11 |
| 189 - 209 | Error 20 |  |  |  |  | same as offset 0 ff. for error 11 |

### Telegram: 0x00FB

!!! warning "Write data than be read with telegrams 0x0001 or 0x0003"
    **Used in:** Various controllers, thermostats and boilers?
    **Description:** Found by accident. **I would be careful with this, no idea what it can cause**
    **Class:** Command
    **EMS category:** EMS2.0
---

## Thermostat Telegrams

Telegrams 0x0165 through 0x0178 contain thermostat configuration, programming, and control data.

### Telegram: 0x0165

!!! info "HMI800 holiday mode parameters"
    **Used in:** Buderus/Bosch RC300, HMC310 and similar, newer Junkers controllers "Cxyz" (MY>2019)
    **Description:** Up to 8 holiday periods can be defined with the above telegrams
    **Class:** Parameter
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-write-request, unicast-on-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ---------------------------------- | --- | --- | ---------- | ------ | ---------------------------------------------------------------------------- |
| 0 | holiday start year | 0 | 99 | 1 | year | 0=invalid, offset 0-7 to be sent together |
| 1 | holiday start month | 0 | 12 | 1 | month | 0=invalid, offset 0-7 to be sent together |
| 2 | holiday start day | 0 | 31 | 1 | day | 0=invalid, offset 0-7 to be sent together |
| 3 | holiday start time | 0 | 95 | 1 | 15 min | 0=invalid, 15 minute steps starting midnight, offset 0-7 to be sent together |
| 4 | holiday end year | 0 | 99 | 1 | year | 0=invalid, offset 0-7 to be sent together |
| 5 | holiday end month | 0 | 12 | 1 | month | 0=invalid, offset 0-7 to be sent together |
| 6 | holiday end day | 0 | 31 | 1 | day | 0=invalid, offset 0-7 to be sent together |
| 7 | holiday end time | 0 | 95 | 1 | 15 min | 0=invalid, 15 minute steps starting midnight, offset 0-7 to be sent together |
| 8 | Holiday heating operation mode | 1 | 4 | 1 | enum | 1=auto, 2=fixed temp, 3=off, 4=eco |
| 9 | Holiday fixed heating temp | 5 | 30 | 1 | °C |  |
| 10 | Holiday DHW operation mode | 1 | 5 | 1 | enum | 1=auto, 2=off, 3=eco, 4=low, 5=high |
| 11 | Holiday auto thermal desinfection | -1 | 1 | 1 | bool | -1=yes, 1=no |
| 12 | Holiday ventilation operation mode | -1 | 5 | 1 | enum | -1=time, 0=off, 1=min, 2=reduced, 3=normal, 4=max, 5=demand |
| 13 | valid for HC1 | -1 | 1 | 1 | bool | -1=yes, 1=no |
| 14 | valid for HC2 | -1 | 1 | 1 | bool | -1=yes, 1=no |
| 15 | valid for HC3 | -1 | 1 | 1 | bool | -1=yes, 1=no |
| 16 | valid for HC4 | -1 | 1 | 1 | bool | -1=yes, 1=no |
| 17 | valid for DHW1 | -1 | 1 | 1 | bool | -1=yes, 1=no |
| 18 | valid for DHW2 | -1 | 1 | 1 | bool | -1=yes, 1=no |
| 19 | valid for vent1 | -1 | 1 | 1 | bool | -1=yes, 1=no |
| 20 | valid for vent2 | -1 | 1 | 1 | bool | -1=yes, 1=no |
| 21 | valid for vent3 | -1 | 1 | 1 | bool | -1=yes, 1=no |
| 22 | valid for vent4 | -1 | 1 | 1 | bool | -1=yes, 1=no |

### Telegram: 0x0165

!!! info "Older Junkers heating circuit control"
    **Used in:** older Junkers controllers "Fxyz" (MY<2019)
    **Description:** Up to 10 heating circuits can be controller with these telegrams. 0x0165=HC1, 0x0166=HC2, ...
    **Class:** Parameter
    **EMS category:** EMS1.0
    **Distribution:** broadcast-on-change, unicast-write-request, unicast-on-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | -------------------------------- | --- | --- | ---------- | ----- | -------------------------------------------------------------------------------------- |
| 0 | type of HC | 0 | 3 | 1 | enum | 0=not available, 1=unmixed HC without IPM, 2=unmixed HC with IPM, 3=mixed HC |
| 1 | Remote controller | 0 | 2 | 1 | enum | 0=not available, 1=FB10, 2=FB100 |
| 2 | type 2 of HC | 0 | 4 | 1 | enum | 0=undefined, 1=foot/endpoint, 2=radiators, 3=convectors, 4=floor heating |
| 3 | foot point of heating curve | ? | ? | 1 | °C |  |
| 4 | end point of heating curve | ? | ? | 1 | °C |  |
| 5 | max flow temperature | ? | ? | 1 | °C |  |
| 6 | room influence factor | 0 | 100 | 1 | % |  |
| 7 | room influence at operation mode | 0 | 2 | 1 | enum | 0=undefined, 1=normal/eco/frost protect, 2=eco/frost protect |
| 8 | room temperature correction | ? | ? | 1 | °C |  |
| 9 | room temperature sensor | 0 | 3 | 1 | enum | 0=undefined, 1=ext. sensor, 2=int. sensor, 3=temperature during eco |
| 10 | frost protect | -1 | 1 | 1 | bool | -1=ON, 1=OFF |
| 11 | stop heating at outside temp | ? | ? | 0.5 | °C |  |
| 12 | frost protection temp | ? | ? | 0.5 | °C |  |
| 13 | active heating program | 0 | 6 | 1 | enum | 0=undefined, 1-6=heating program (1=A, 2=B, ...) |
| 14 | operation mode HC | 0 | 4 | 1 | enum | 0=undefined, 1=frost protect, 2=eco, 3=normal, 4=auto |
| 15 | flow temp at frost protect mode | ? | ? | 0.5 | °C |  |
| 16 | flow temp at eco mode | ? | ? | 0.5 | °C |  |
| 17 | flow temp at normal mode | ? | ? | 0.5 | °C |  |
| 18 | heat up speed | 0 | 3 | 1 | enum | 0=undefined, 1=slow, 2=normal, 3=fast |
| 19 | holiday program | 0 | 4 | 1 | enum | 0=undefined, 1=op mode frost protect, 2=op mode eco, 3= op mode normal. 4=op mode auto |
| 20 | solar influence | ? | ? | 1 | °C |  |

### Telegram: 0x016F

!!! info "FX100 Monitor heating circuit values"
    **Used in:** Junkers FB100/FW120 controllers
    **Description:** Junkers monitor values of heating circuit. 10 heating circuits can be monitored
    **Class:** Monitor
    **EMS category:** EMS1.0
    **Distribution:** broadcast-on-change, broadcast-periodically, unicast-on-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ----------------------------------- | ------ | ----- | ---------- | ---- | ------------------------------------------------------------------------------------------- |
| 0 | Heating level | 0 | 3 | 1 | enum | 0=undefined, 1=frost, 2=low, 3=high |
| 1 | Operating mode | 0 | 5 | 1 | enum | 0=undefined, 1=permanent, 2=auto, 3=holiday, 4=floor drying waiting, 5=floor drying running |
| 2-3 | Requested room temperature setpoint | 0 | 300 | 0,1 | °C |  |
| 4-5 | Current internal temperature | -32768 | 32767 | 0,1 | °C | 2 byte signed int |
| 6-7 | Current external temperature | -32768 | 32767 | 0,1 | °C | 2 byte signed int |
| 8 | Solar influence value | 0 | 50 | 0,1 | °C |  |

### Telegram: 0x02A5

!!! info "NSC controller CH monitor for HCx"
    **Used in:** CR50
    **Description:** Monitor values for HC1, HC2, ... HC8
    **Class:** monitor
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request, broadcast-periodically

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ----------------------------------------------------------------------------------------------------------------------- | ---- | ---- | ---------- | ---- | -------------------------------------------- |
| 0-1 | current room temp for this HC | 0 | 40 | 0.1 | °C | -32768=open, 32767=short |
| 2.0 | heating possible | 0 | 1 | 1 | bool | false=0, true=1 |
| 2.1 | frost danger outdoor | 0 | 1 | 1 | bool | false=0, true=1 |
| 2.2 | frost danger room | 0 | 1 | 1 | bool | false=0, true=1 |
| 2.3 | open window detected in this HC | 0 | 1 | 1 | bool | false=0, true=1 |
| 2.4 | Weather Depended Control summer mode | 0 | 1 | 1 | bool | false=0, true=1 |
| 2.5 | Room temp valid | 0 | 1 | 1 | bool | false=0, true=1 |
| 2.6 | Local season optimizer summer mode | 0 | 1 | 1 | bool | false=0, true=1 |
| 3 | Optimized room temp setpoint | 0 | 60 | 0.5 | °C | off=0 |
| 4 | Room temp flow setpoint | 0 | 90 | 1 | °C | off_heat=0, off_cool=90 |
| 5 | Room temp power setpoint | 0 | 100 | 1 | % | na=255 |
| 6 | Current room temp setpoint | 0 | 60 | 0.5 | °C | off=0 |
| 7 | Next room temp setpoint | 0 | 60 | 0.5 | °C | off=0 |
| 8-9 | Room Temperature Setpoint Determination: time to next setpoint | 1 | 1440 | 1 | min |  |
| 10.0 | Room temp setpoint set automatically | 0 | 1 | 1 | bool | false=0, true=1 |
| 10.1 | RTSD: Comfort Active | 0 | 1 | 1 | bool | false=0, true=1 |
| 10.2 | RTSD: Temporary increase of setpoint active | 0 | 1 | 1 | bool | false=0, true=1 |
| 10.3 | RTSD: Prevention of eco mode active | 0 | 1 | 1 | bool | false=0, true=1 |
| 10.4 | RTSD: Advance mode is active | 0 | 1 | 1 |  | false=0, true=1 |
| 11 | Room Temp Setpoint: Heating Level | 1 | 4 | 1 |  | ECO=1, COMFORT1=2, COMFORT2=3, COMFORT3=4 |
| 12 | RTSD: Next Heating Level | 1 | 4 | 1 |  | ECO = 1, COMFORT1=2, COMFORT2=3, COMFORT3=4 |
| 13-14 | RTSD: Time To Next Heating Level | 1 | 1440 | 1 | min |  |
| 15-16 | RTSD: Time Since Last Heating Level | 1 | 1440 | 1 | min |  |
| 17 | Floordrying active | 0 | 1 | 1 | bool | false=0, true=1 |
| 18 | HolidayMode activated for this heating circuit | 0 | 4 | 1 | enum | none=0, AUTO_SAT=1, FIX_TEMP=2, OFF=3, ECO=4 |
| ... |  |  |  |  |  |  |
| 20 | Local Season Optimizer mode | 1 | 3 | 1 | enum | heating=1, idle=2, cooling=3 |
| ... |  |  |  |  |  |  |
| 27-28 | Offset on room temperature setpoint due to room temperature influence | -100 | 300 | 0.1 | K |  |
| ... |  |  |  |  |  |  |
| 32 | Room temp sensor value controller extsensor. Value defines the requested relative heating power for the heating circuit | 0 | 100 | 1 | % |  |

### Telegram: 0x02B9

!!! info "Thermostat settings"
    **Used in:** ems+ thermostats
    **Description:** hc settings
    **Class:** parameter
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request, writable

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ----------------------------------------------------------------------------------------------------------------------- | ---- | ---- | ---------- | ---- | -------------------------------------------- |
| 0 | Operation Mode | -1 | 0 | 1 | enum | auto=-1, manual=0 |
| 1 | Setpoint Comfort 3 | 10 | 60 | 0,5 | °C | 5°C ... 30°C |
| 2 | Setpoint Comfort 2 | 10 | 60 | 0,5 | °C | 5°C ... 30°C |
| 3 | Setpoint Comfort 1 | 10 | 60 | 0,5 | °C | 5°C ... 30°C |
| 4 | Setpoint Eco | 10 | 60 | 0,5 | °C | 5°C ... 30°C |
| 5 | Eco Mode | 0 | 3 | 1 | enum | off=0, outdoor=1, room=2,reduced=3 |
| 6 | Time Limit for manual operation mode: time | 0 | 95 | 1 | 15min | 15 minutes steps from midnight |
| 7 | Time Limit for manual operation mode: weekday | -1 | 6 | 1 | enum | OFF=-1, MONDAY=0, TUESDAY=1, WEDNESDAY=2, THURSDAY=3, FRIDAY=4, SATURDAY=5, SUNDAY=6 |
| 8 | Temporary Room Temp Setpoint | -1 | 60 | 0,5 | °C | NA=-1, OFF = 0 |
| 9 | Outdoor Temp Threshold | -20 | 10 | 1 | °C |  |
| 10 | Manual Setpoint | 10 | 60 | 0,5 | °C | OFF = 0 |
| 11 | Active Clock Program | 1 | 2 | 1 | enum | clock program 1 or 2 |
| 12 | Outdoor temp threshold for prevention of reduced temp | -30 | 10 | 1 | °C | OFF = -31 |
| ... |  |  |  |  |  |  |
| 17 | Room temperature setpoint for cooling | 5 | 30 | 0,5 | °C | OFF=0 |
| ... |  |  |  |  |  |  |
| 19 | Switch Clock Value Mode | 1 | 2 | 1 | enum | LEVELS=1, ABS_TEMP = 2 |
| 20 | Comfort Eco Temp Threshold | 24 | 44 | 0,5 | °C |  |  |
| 21 | Heating Mode New | 0 | 2 | 1 | enum | OFF=0, ON=1, AUTO=2 |
| 22 | Setpoint manual temp | 10 | 60 | 0,5 | °C | 5°C ... 30°C |
| 23 | Boost mode | -1 | 0 | 1 | bool | YES=-1, NO=0 |
| 24 | Boost mode duration | 1 | 8 | 1 | h |  |
| ... |  |  |  |  |  |  |
| 28 | Cooling Operation Mode | 0 | 1 | 1 | enum | OFF=0, ON=1 |
| 29 | Room temperature setpoint for cooling (new) | 10 | 60 | 0,5 | °C | 5°C ... 30°C |

### Telegram: 0x02C3

!!! info "NSC Clock Program **1** for HCx"
    **Used in:** CR50, RC310
    **Description:** Sets heating level switch points for HC1, HC2, ... HC8
    **Class:** parameter
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request, unicast-write-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | -------------------------------- | --- | --- | ---------- | ----- | ----------------------------------------- |
| 0 | 1st switch point Monday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 1 | 1st switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 2 | 2nd switch point Monday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 3 | 2nd switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 4 | 3rd switch point Monday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 5 | 3rd switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 6 | 4th switch point Monday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 7 | 4th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 8 | 5th switch point Monday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 9 | 5th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 10 | 6th switch point Monday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 11 | 6th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 12 | 1st switch point Tuesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 13 | 1st switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 14 | 2nd switch point Tuesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 15 | 2nd switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 16 | 3rd switch point Tuesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 17 | 3rd switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 18 | 4th switch point Tuesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 19 | 4th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 20 | 5th switch point Tuesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 21 | 5th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 22 | 6th switch point Tuesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 23 | 6th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 24 | 1st switch point Wednesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 25 | 1st switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 26 | 2nd switch point Wednesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 27 | 2nd switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 28 | 3rd switch point Wednesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 29 | 3rd switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 30 | 4th switch point Wednesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 31 | 4th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 32 | 5th switch point Wednesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 33 | 5th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 34 | 6th switch point Wednesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 35 | 6th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 36 | 1st switch point Thursday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 37 | 1st switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 38 | 2nd switch point Thursday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 39 | 2nd switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 40 | 3rd switch point Thursday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 41 | 3rd switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 42 | 4th switch point Thursday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 43 | 4th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 44 | 5th switch point Thursday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 45 | 5th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 46 | 6th switch point Thursday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 47 | 6th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 48 | 1st switch point Friday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 49 | 1st switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 50 | 2nd switch point Friday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 51 | 2nd switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 52 | 3rd switch point Friday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 53 | 3rd switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 54 | 4th switch point Friday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 55 | 4th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 56 | 5th switch point Friday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 57 | 5th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 58 | 6th switch point Friday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 59 | 6th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 60 | 1st switch point Saturday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 61 | 1st switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 62 | 2nd switch point Saturday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 63 | 2nd switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 64 | 3rd switch point Saturday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 65 | 3rd switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 66 | 4th switch point Saturday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 67 | 4th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 68 | 5th switch point Saturday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 69 | 5th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 70 | 6th switch point Saturday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 71 | 6th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 72 | 1st switch point Sunday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 73 | 1st switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 74 | 2nd switch point Sunday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 75 | 2nd switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 76 | 3rd switch point Sunday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 77 | 3rd switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 78 | 4th switch point Sunday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 79 | 4th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 80 | 5th switch point Sunday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 81 | 5th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 82 | 6th switch point Sunday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 83 | 6th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 84-101 | Heating program name | 32 | 255 | 1 | ASCII | 18 ASCII characters |

### Telegram: 0x02CC

!!! info "DHW priority for unmixed heating circuit"
    **Used in:** HMC310
    **Description:** Enables/disables dhw priority in unmixed circuits where HC1 is directly connected to the heat source
    **Class:** parameter
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request, unicast-write-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ------------- | --- | --- | ---------- | ---- | ----------- |
| ... |  |  |  |  |  |  |
| 3 | DHW priority | 0 | 1 | 1 | bool | 0=no, 1=yes |
| ... |  |  |  |  |  |  |

### Telegram: 0x02CD

!!! info "DHW priority for mixed heating circuit HC1, ..., HC8"
    **Used in:** RC310
    **Description:** Enables/disables dhw priority in unmixed circuits where HC1 is directly connected to the heat source
    **Class:** parameter
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request, unicast-write-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ------------------------------------ | --- | --- | ---------- | ----- | ------------ |
| 0 | HC mixed circuit | -1 | 0 | 1 | bool | -1=yes, 0=no |
| 1 | Valve runtime time | 1 | 60 | 1 | 10sec |  |
| 2 | Supply temp offset | 0 | 20 | 1 | K |  |
| 3 | DHW priority | -1 | 0 | 1 | bool | -1=yes, 0=no |
| 4 | Mixer pos for condesation protection | 0 | 100 | 1 | % |  |
| 5 | Constant heating hc | -1 | 0 | 1 | bool | -1=yes, 0=no |
| 6 | Detection of low flow volume | -1 | 0 | 1 | bool | -1=yes, 0=no |

### Telegram: 0x02F5

!!! info "Configuration of DHWx"
    **Used in:** CR50
    **Description:** Configuration of DHW1, DHW2
    **Class:** parameter
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request, unicast-write-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ---------------------------------- | --- | --- | ---------- | ------ | ----------------------------------------------------------------- |
| 0 | DHW configuration | 0 | 3 | 1 | enum | 0=none, 1=appliance, 2=module, 3=fresh water station |
| 1 | Circulation pump installed | -1 | 0 | 1 | bool | -1(0xFF)=yes, 0=no |
| 2 | Operation mode | 0 | 5 | 1 | enum | 0=off, 1=on low, 2=on high, 3=HC program, 4=own program, 5=on eco |
| 3 | Circulation pump operation mode | 0 | 3 | 1 | enum | 0=off, 1=on, 2=like DHW program, 3=own program |
| 4 | according HC program | 0 | 8 | 1 | enum | according HC program x |
| 5 | Automatic thermal desinfection | -1 | 0 | 1 | bool | -1(0xFF)=yes, 0=no |
| 6 | Thermal desinfection time | 0 | 95 | 1 | 15 min |  |
| 7 | Weekday for thermal desinfection | 0 | 7 | 1 | enum | 0=Mo, 1=Tu, 2=We, 3=Th, 4=Fr, 5=Sa, 6=So, 7=every day |
| 8 | Daily heat up | -1 | 0 | 1 | bool | -1(0xFF)=yes, 0=no |
| 9 | Daily heat up time | 0 | 95 | 1 | 15 min |  |
| 10 | Extra heat heat up duration | 0 | 95 | 1 | 15 min |  |
| 11 | Extra heat up from main controller | -1 | 0 | 1 | bool | -1(0xFF)=yes, 0=no |
| 12 | Extra heat up from HC1 controller | -1 | 0 | 1 | bool | -1(0xFF)=yes, 0=no |
| 13 | Extra heat up from HC2 controller | -1 | 0 | 1 | bool | -1(0xFF)=yes, 0=no |
| 14 | Extra heat up from HC3 controller | -1 | 0 | 1 | bool | -1(0xFF)=yes, 0=no |
| 15 | Extra heat up from HC4 controller | -1 | 0 | 1 | bool | -1(0xFF)=yes, 0=no |
| 16 | Extra heat up from HC5 controller | -1 | 0 | 1 | bool | -1(0xFF)=yes, 0=no |
| 17 | Extra heat up from HC6 controller | -1 | 0 | 1 | bool | -1(0xFF)=yes, 0=no |
| 18 | Extra heat up from HC7 controller | -1 | 0 | 1 | bool | -1(0xFF)=yes, 0=no |
| 19 | Extra heat up from HC8 controller | -1 | 0 | 1 | bool | -1(0xFF)=yes, 0=no |
| 20 | Fresh water system | 1 | 2 | 1 | enum | 1=appliance, 2=module |
| 21 | Solar start time | -1 | 95 | 1 | 15 min | -1=na |
| 22 | Solar stop time | -1 | 95 | 1 | 15 min | -1=na |
| 23 | All operation modes allowed | -1 | 0 | 1 | bool | -1=yes, 0=no |

### Telegram: 0x02FF

!!! info "NSC Clock Program for dhw"
    **Used in:** RC310
    **Description:** Sets dhw switch points for DHW1 and DHW2
    **Class:** parameter
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request, unicast-write-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | -------------------------------------- | --- | --- | ---------- | ----- | -------------------------------------------- |
| 0 | 1st switch point Monday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 1 | 1st switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 2 | 2nd switch point Monday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 3 | 2nd switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 4 | 3rd switch point Monday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 5 | 3rd switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 6 | 4th switch point Monday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 7 | 4th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 8 | 5th switch point Monday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 9 | 5th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 10 | 6th switch point Monday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 11 | 6th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 12 | 1st switch point Tuesday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 13 | 1st switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 14 | 2nd switch point Tuesday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 15 | 2nd switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 16 | 3rd switch point Tuesday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 17 | 3rd switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 18 | 4th switch point Tuesday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 19 | 4th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 20 | 5th switch point Tuesday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 21 | 5th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 22 | 6th switch point Tuesday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 23 | 6th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 24 | 1st switch point Wednesday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 25 | 1st switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 26 | 2nd switch point Wednesday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 27 | 2nd switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 28 | 3rd switch point Wednesday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 29 | 3rd switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 30 | 4th switch point Wednesday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 31 | 4th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 32 | 5th switch point Wednesday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 33 | 5th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 34 | 6th switch point Wednesday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 35 | 6th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 36 | 1st switch point Thursday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 37 | 1st switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 38 | 2nd switch point Thursday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 39 | 2nd switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 40 | 3rd switch point Thursday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 41 | 3rd switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 42 | 4th switch point Thursday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 43 | 4th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 44 | 5th switch point Thursday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 45 | 5th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 46 | 6th switch point Thursday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 47 | 6th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 48 | 1st switch point Friday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 49 | 1st switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 50 | 2nd switch point Friday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 51 | 2nd switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 52 | 3rd switch point Friday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 53 | 3rd switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 54 | 4th switch point Friday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 55 | 4th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 56 | 5th switch point Friday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 57 | 5th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 58 | 6th switch point Friday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 59 | 6th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 60 | 1st switch point Saturday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 61 | 1st switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 62 | 2nd switch point Saturday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 63 | 2nd switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 64 | 3rd switch point Saturday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 65 | 3rd switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 66 | 4th switch point Saturday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 67 | 4th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 68 | 5th switch point Saturday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 69 | 5th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 70 | 6th switch point Saturday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 71 | 6th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 72 | 1st switch point Sunday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 73 | 1st switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 74 | 2nd switch point Sunday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 75 | 2nd switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 76 | 3rd switch point Sunday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 77 | 3rd switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 78 | 4th switch point Sunday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 79 | 4th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 80 | 5th switch point Sunday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 81 | 5th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 82 | 6th switch point Sunday temperature | 0 | 3 | 1 | enum | OFF = 0, ON_LOW = 1, ON_HIGH = 2, ON_ECO = 3 |
| 83 | 6th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |

### Telegram: 0x0309

!!! info "NSC Clock Program for circulation pump for dhwx"
    **Used in:** RC310
    **Description:** Sets dhw circulation pump switch points for DHW1 and DHW2
    **Class:** parameter
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request, unicast-write-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | --------------------------------- | --- | --- | ---------- | ----- | ------------------------------------- |
| 0 | 1st switch point Monday on/off | -1 | 0 | 1 | bool | -1(0xFF)=on, 0=off |
| 1 | 1st switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 2 | 2nd switch point Monday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 3 | 2nd switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 4 | 3rd switch point Monday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 5 | 3rd switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 6 | 4th switch point Monday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 7 | 4th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 8 | 5th switch point Monday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 9 | 5th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 10 | 6th switch point Monday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 11 | 6th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 12 | 1st switch point Tuesday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 13 | 1st switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 14 | 2nd switch point Tuesday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 15 | 2nd switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 16 | 3rd switch point Tuesday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 17 | 3rd switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 18 | 4th switch point Tuesday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 19 | 4th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 20 | 5th switch point Tuesday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 21 | 5th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 22 | 6th switch point Tuesday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 23 | 6th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 24 | 1st switch point Wednesday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 25 | 1st switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 26 | 2nd switch point Wednesday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 27 | 2nd switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 28 | 3rd switch point Wednesday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 29 | 3rd switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 30 | 4th switch point Wednesday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 31 | 4th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 32 | 5th switch point Wednesday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 33 | 5th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 34 | 6th switch point Wednesday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 35 | 6th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 36 | 1st switch point Thursday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 37 | 1st switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 38 | 2nd switch point Thursday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 39 | 2nd switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 40 | 3rd switch point Thursday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 41 | 3rd switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 42 | 4th switch point Thursday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 43 | 4th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 44 | 5th switch point Thursday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 45 | 5th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 46 | 6th switch point Thursday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 47 | 6th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 48 | 1st switch point Friday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 49 | 1st switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 50 | 2nd switch point Friday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 51 | 2nd switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 52 | 3rd switch point Friday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 53 | 3rd switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 54 | 4th switch point Friday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 55 | 4th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 56 | 5th switch point Friday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 57 | 5th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 58 | 6th switch point Friday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 59 | 6th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 60 | 1st switch point Saturday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 61 | 1st switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 62 | 2nd switch point Saturday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 63 | 2nd switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 64 | 3rd switch point Saturday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 65 | 3rd switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 66 | 4th switch point Saturday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 67 | 4th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 68 | 5th switch point Saturday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 69 | 5th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 70 | 6th switch point Saturday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 71 | 6th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 72 | 1st switch point Sunday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 73 | 1st switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 74 | 2nd switch point Sunday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 75 | 2nd switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 76 | 3rd switch point Sunday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 77 | 3rd switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 78 | 4th switch point Sunday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 79 | 4th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 80 | 5th switch point Sunday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 81 | 5th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 82 | 6th switch point Sunday on/off | -1 | 0 | 1 | bool | -1=on, 0=off |
| 83 | 6th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |

### Telegram: 0x031D

!!! info "Monitoring DHWx"
    **Used in:** CR50
    **Description:** Monitors the values of DHW1, DHW2
    **Class:** monitor
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request, broadcast-periodically

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ---------------------------------------- | --- | ---- | ---------- | ---- | ------------------------------------------------------------------------------------------------------------------- |
| 0 | DHW extra active | 0 | 1 | 1 | bool | 0=false, 1=true |
| 1 | Holiday mode | 0 | 3 | 1 | enum | 0=none, 1=auto, 2=off, 3=thermal desinfection off |
| 2 | Status DHW setpoint | 1 | 10 | 1 | enum | 1=?, 2=extra hot water, 3=off, 4=low, 5=high, 6=holiday off, 7=holiday low, 8=clock off, 9=clock low, 10=clock high |
| 3 | Status DHW circulation pump | 1 | 7 | 1 | enum | 1=?, 2=extra, 3=off, 4=on, 5=holiday off, 6=clock off, 7=clock on |
| 4-5 | Remaining time in extra mode | 0 | 2880 | 1 | min |  |
| 6 | Holiday mode 2 | 0 | 5 | 1 | enum | 0=none, 1=auto, 2=off, 3=exo, 4=low, 5=high |
| 7 | Auto thermal desinfection during holiday | 0 | 1 | 1 | bool | 0=no, 1=yes |
| 8 | Current DHW status | 0 | 3 | 1 | enum | 0=off, 1=low, 2=high, 3=eco |

### Telegram: 0x043F

!!! info "NSC HolidayMode for HCx"
    **Used in:** CR50
    **Description:** Sets start and end date for holiday mode for HC1, HC2, ... HC8
    **Class:** parameter
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request, unicast-write-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ------------------- | --- | --- | ---------- | ---- | -------- |
| 0 | holiday start year | 9 | 99 | 1 |  | add 2000 |
| 1 | holiday start month | 1 | 12 | 1 |  |  |
| 2 | holiday start day | 1 | 31 | 1 |  |  |
| 3 | holiday end year | 9 | 99 | 1 |  | add 2000 |
| 4 | holiday end month | 1 | 12 | 1 |  |  |
| 5 | holiday end day | 1 | 31 | 1 |  |  |

### Telegram: 0x0449

!!! info "NSC Clock Program **2** for HCx"
    **Used in:** RC310
    **Description:** Sets heating level switch points for HC1, HC2, ... HC8
    **Class:** parameter
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request, unicast-write-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | -------------------------------- | --- | --- | ---------- | ----- | ----------------------------------------- |
| 0 | 1st switch point Monday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 1 | 1st switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 2 | 2nd switch point Monday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 3 | 2nd switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 4 | 3rd switch point Monday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 5 | 3rd switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 6 | 4th switch point Monday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 7 | 4th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 8 | 5th switch point Monday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 9 | 5th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 10 | 6th switch point Monday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 11 | 6th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 12 | 1st switch point Tuesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 13 | 1st switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 14 | 2nd switch point Tuesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 15 | 2nd switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 16 | 3rd switch point Tuesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 17 | 3rd switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 18 | 4th switch point Tuesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 19 | 4th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 20 | 5th switch point Tuesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 21 | 5th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 22 | 6th switch point Tuesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 23 | 6th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 24 | 1st switch point Wednesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 25 | 1st switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 26 | 2nd switch point Wednesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 27 | 2nd switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 28 | 3rd switch point Wednesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 29 | 3rd switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 30 | 4th switch point Wednesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 31 | 4th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 32 | 5th switch point Wednesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 33 | 5th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 34 | 6th switch point Wednesday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 35 | 6th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 36 | 1st switch point Thursday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 37 | 1st switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 38 | 2nd switch point Thursday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 39 | 2nd switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 40 | 3rd switch point Thursday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 41 | 3rd switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 42 | 4th switch point Thursday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 43 | 4th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 44 | 5th switch point Thursday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 45 | 5th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 46 | 6th switch point Thursday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 47 | 6th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 48 | 1st switch point Friday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 49 | 1st switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 50 | 2nd switch point Friday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 51 | 2nd switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 52 | 3rd switch point Friday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 53 | 3rd switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 54 | 4th switch point Friday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 55 | 4th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 56 | 5th switch point Friday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 57 | 5th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 58 | 6th switch point Friday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 59 | 6th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 60 | 1st switch point Saturday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 61 | 1st switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 62 | 2nd switch point Saturday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 63 | 2nd switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 64 | 3rd switch point Saturday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 65 | 3rd switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 66 | 4th switch point Saturday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 67 | 4th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 68 | 5th switch point Saturday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 69 | 5th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 70 | 6th switch point Saturday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 71 | 6th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 72 | 1st switch point Sunday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 73 | 1st switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 74 | 2nd switch point Sunday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 75 | 2nd switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 76 | 3rd switch point Sunday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 77 | 3rd switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 78 | 4th switch point Sunday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 79 | 4th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 80 | 5th switch point Sunday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 81 | 5th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 82 | 6th switch point Sunday level | -1 | 30 | 1 |  | 1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3 |
| 83 | 6th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 84-101 | Heating program name | 32 | 255 | 1 | ASCII | 18 ASCII characters |

### Telegram: 0x048D

!!! info "Heat pump monitor values"
    **Used in:** HMI800.2/Rego 3000, UI800, Logamatic BC400
    **Description:** Shows various values of the heat pump
    **Class:** monitor
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ------------------------ | --- | --- | ---------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| 0.0 | Heating circulation pump | 0 | 1 | 1 | bool | from source code |
| ... |  |  |  |  |  |  |
| 0.4 | Switch valve? | 0 | 1 | 1 | bool | hpSwitchValve from source code |
| ... |  |  |  |  |  |  |
| 0.6 | 3way valve | 0 | 1 | 1 | bool | hp3wayValve from source code |
| 0.7 | VC0 valve | 0 | 1 | 1 | bool | VC0valve from source code |
| ... |  |  |  |  |  |  |
| 1.4 | External input 1 | 0 | 1 | 1 | bool | hpInput[0] from source code |
| 1.5 | External input 2 | 0 | 1 | 1 | bool | hpInput[1] from source code |
| 1.6 | External input 3 | 0 | 1 | 1 | bool | hpInput[2] from source code |
| 1.7 | External input 4 | 0 | 1 | 1 | bool | hpInput[3] from source code |
| ... |  |  |  |  |  |  |
| 3.0 | Eletrical heater step 1 | 0 | 1 | 1 | bool | 0=off, 1=on |
| 3.1 | Eletrical heater step 2 | 0 | 1 | 1 | bool | 0=off, 1=on |
| 3.2 | Eletrical heater step 3 | 0 | 1 | 1 | bool | 0=off, 1=on |
| ... |  |  |  |  |  |  |
| 3.4 | Compressor on | 0 | 1 | 1 | bool | 0=off, 1=on |
| ... |  |  |  |  |  |  |
| 3.6 | hpEA0 | 0 | 1 | 1 | bool | 0=off, 1=on, hpEA0 from source code |
| 4 | Circulation pump speed | 0 | 100 | 1 | percent | hpCircSpd from source code |
| 5 | Brine pump speed | 0 | 100 | 1 | percent | hpBrinePumpSpd from source code |
| 6 | Aux heater level | 0 | 100 | 1 | percent | auxHeaterLevel from source code |
| 7 | Compressor activity | 0 | 7 | 1 | enum | hpActivity from source code; 0=OFF, 1=HEATING, 2=COOLING, 3=DHW, 4=POOL, 5=POOL_HEATING, 6=DEFROST, 7=ALARM |
| 8 | Aux heater status | 0 | 7 | 1 | enum | 0=OFF, 1=HEATING, 3=DHW, 4=POOL, 5=POOL_HEATING, 7=ALARM |
| ... |  |  |  |  |  |  |
| 10-11 | Compressor power | 0 | ? | 0.1 | kW | hpPower from source code |
| ... |  |  |  |  |  |  |
| 17 | Compressor speed | 0 | 100 | 1 | percent | hpCompSpd from source code |

### Telegram: 0x0683

!!! info "NSC Clock Program **3** for HCx"
    **Used in:** RC310
    **Description:** Sets heating level switch points for HC1, HC2, ... HC8
    **Class:** parameter
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request, unicast-write-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ------------------------------------- | --- | --- | ---------- | ----- | ------------------------------------- |
| 0 | 1st switch point Monday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 1 | 1st switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 2 | 2nd switch point Monday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 3 | 2nd switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 4 | 3rd switch point Monday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 5 | 3rd switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 6 | 4th switch point Monday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 7 | 4th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 8 | 5th switch point Monday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 9 | 5th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 10 | 6th switch point Monday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 11 | 6th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 12 | 1st switch point Tuesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 13 | 1st switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 14 | 2nd switch point Tuesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 15 | 2nd switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 16 | 3rd switch point Tuesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 17 | 3rd switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 18 | 4th switch point Tuesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 19 | 4th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 20 | 5th switch point Tuesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 21 | 5th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 22 | 6th switch point Tuesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 23 | 6th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 24 | 1st switch point Wednesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 25 | 1st switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 26 | 2nd switch point Wednesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 27 | 2nd switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 28 | 3rd switch point Wednesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 29 | 3rd switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 30 | 4th switch point Wednesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 31 | 4th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 32 | 5th switch point Wednesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 33 | 5th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 34 | 6th switch point Wednesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 35 | 6th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 36 | 1st switch point Thursday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 37 | 1st switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 38 | 2nd switch point Thursday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 39 | 2nd switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 40 | 3rd switch point Thursday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 41 | 3rd switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 42 | 4th switch point Thursday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 43 | 4th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 44 | 5th switch point Thursday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 45 | 5th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 46 | 6th switch point Thursday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 47 | 6th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 48 | 1st switch point Friday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 49 | 1st switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 50 | 2nd switch point Friday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 51 | 2nd switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 52 | 3rd switch point Friday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 53 | 3rd switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 54 | 4th switch point Friday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 55 | 4th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 56 | 5th switch point Friday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 57 | 5th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 58 | 6th switch point Friday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 59 | 6th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 60 | 1st switch point Saturday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 61 | 1st switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 62 | 2nd switch point Saturday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 63 | 2nd switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 64 | 3rd switch point Saturday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 65 | 3rd switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 66 | 4th switch point Saturday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 67 | 4th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 68 | 5th switch point Saturday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 69 | 5th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 70 | 6th switch point Saturday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 71 | 6th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 72 | 1st switch point Sunday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 73 | 1st switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 74 | 2nd switch point Sunday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 75 | 2nd switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 76 | 3rd switch point Sunday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 77 | 3rd switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 78 | 4th switch point Sunday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 79 | 4th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 80 | 5th switch point Sunday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 81 | 5th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 82 | 6th switch point Sunday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 83 | 6th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 84-101 | Heating program name | 32 | 255 | 1 | ASCII | 18 ASCII characters |

### Telegram: 0x068D

!!! info "NSC Clock Program **4** for HCx"
    **Used in:** RC310
    **Description:** Sets heating level switch points for HC1, HC2, ... HC8
    **Class:** parameter
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request, unicast-write-request

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ------------------------------------- | --- | --- | ---------- | ----- | ------------------------------------- |
| 0 | 1st switch point Monday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 1 | 1st switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 2 | 2nd switch point Monday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 3 | 2nd switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 4 | 3rd switch point Monday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 5 | 3rd switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 6 | 4th switch point Monday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 7 | 4th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 8 | 5th switch point Monday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 9 | 5th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 10 | 6th switch point Monday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 11 | 6th switch point Monday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 12 | 1st switch point Tuesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 13 | 1st switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 14 | 2nd switch point Tuesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 15 | 2nd switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 16 | 3rd switch point Tuesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 17 | 3rd switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 18 | 4th switch point Tuesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 19 | 4th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 20 | 5th switch point Tuesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 21 | 5th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 22 | 6th switch point Tuesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 23 | 6th switch point Tuesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 24 | 1st switch point Wednesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 25 | 1st switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 26 | 2nd switch point Wednesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 27 | 2nd switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 28 | 3rd switch point Wednesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 29 | 3rd switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 30 | 4th switch point Wednesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 31 | 4th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 32 | 5th switch point Wednesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 33 | 5th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 34 | 6th switch point Wednesday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 35 | 6th switch point Wednesday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 36 | 1st switch point Thursday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 37 | 1st switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 38 | 2nd switch point Thursday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 39 | 2nd switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 40 | 3rd switch point Thursday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 41 | 3rd switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 42 | 4th switch point Thursday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 43 | 4th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 44 | 5th switch point Thursday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 45 | 5th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 46 | 6th switch point Thursday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 47 | 6th switch point Thursday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 48 | 1st switch point Friday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 49 | 1st switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 50 | 2nd switch point Friday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 51 | 2nd switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 52 | 3rd switch point Friday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 53 | 3rd switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 54 | 4th switch point Friday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 55 | 4th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 56 | 5th switch point Friday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 57 | 5th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 58 | 6th switch point Friday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 59 | 6th switch point Friday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 60 | 1st switch point Saturday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 61 | 1st switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 62 | 2nd switch point Saturday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 63 | 2nd switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 64 | 3rd switch point Saturday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 65 | 3rd switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 66 | 4th switch point Saturday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 67 | 4th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 68 | 5th switch point Saturday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 69 | 5th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 70 | 6th switch point Saturday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 71 | 6th switch point Saturday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 72 | 1st switch point Sunday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 73 | 1st switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 74 | 2nd switch point Sunday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 75 | 2nd switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 76 | 3rd switch point Sunday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 77 | 3rd switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 78 | 4th switch point Sunday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 79 | 4th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 80 | 5th switch point Sunday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 81 | 5th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 82 | 6th switch point Sunday temp value | 0 | 60 | 0.5 | °C | 0=off |
| 83 | 6th switch point Sunday time | -1 | 95 | 1 | 15min | -1=na, 15min increments from midnight |
| 84-101 | Heating program name | 32 | 255 | 1 | ASCII | 18 ASCII characters |

---

## Hybrid Module Telegrams

Telegrams 0x099A contain hybrid module monitoring and control data.

### Telegram: 0x099A

!!! info "Hybrid module monitor"
    **Used in:** CT210b
    **Description:** Monitor data of the hybrid module
    **Class:** monitor
    **EMS category:** EMS2.0
    **Distribution:** broadcast-on-change, unicast-on-request, broadcast periodically

| Offset | Variable name | min | max | resolution | unit | comment |
| ------ | ------------------------- | --- | -------- | ---------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ... |  |  |  |  |  |  |
| 2 | HP activity | 0 | 4 | 1 | enum | 0=off, 1=heating, 2=DHW, 3=defrost,4=alarm |
| ... |  |  |  |  |  |  |
| 5-7 | HP operation time heating | 0 | 16777215 | 1 | h | 3 byte unsigned int |
| 8-10 | HP operation time dhw | 0 | 16777215 | 1 | h | 3 byte unsigned int |
| ... |  |  |  |  |  |  |
| 11-13 | HP starts heating | 0 | 16777215 | 1 |  | 3 byte unsigned int |
| 14-16 | HP starts dhw | 0 | 16777215 | 1 |  | 3 byte unsigned int |
| 17 | Smart grid mode | 0 | 3 | 1 | enum | 0=Mode1 (I1 closed, I4 open = Heat pump blocked by energy supplier); 1=Mode2 (I1 open, I4 open = Normal operation); 2=Mode3 (I1 open, I4 closed = Heatpump prefered); 3=Mode4 (I1 closed, I4 closed = Forced operation of heatpump) |
| ... |  |  |  |  |  |  |
