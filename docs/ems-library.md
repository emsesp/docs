**This pages is a summary of collected EMS knowledge from the community, such as entity names and how they work.**

Please contribute, content is in [Markdown](https://www.markdownguide.org/cheat-sheet/) format.

---

### Telegram: 0x02A5, 0x02A6, 0x02A7, 0x02A8, 0x02A9, 0x02AA, 0x02AB, 0x02AC

*Name:* NSC controller CH monitor for HCx  
*Description:* Monitor values for HC1, HC2, ... HC8  
*Class:* monitor  
*EMS category:* EMS2.0  
*Distribution:* broadcast-on-change, unicast-on-request, broadcast-periodically  
*Offset of variables:*  

| Offset | Variable name | min | max | resolution | unit | comment |
| --- | --- | --- | --- | --- | --- | --- |
| 0-1| current room temp for this HC| 0| 40| 0.1| °C| -32768=open, 32767=short|
| 2.0| heating possible| 0| 1| 1| bool| false=0, true=1|
| 2.1| frost danger outdoor |0| 1| 1| bool| false=0, true=1|
| 2.2| frost danger room| 0| 1 |1| bool|false=0, true=1|
| 2.3| open window detected in this HC| 0| 1| 1| bool|false=0, true=1|
| 2.4| Weather Depended Control summer mode| 0| 1| 1| bool |false=0, true=1|
| 2.5| Room temp valid| 0| 1| 1| bool|false=0, true=1|
| 2.6| Local season optimizer summer mode| 0| 1| 1| bool|false=0, true=1|
| 3| Optimized room temp setpoint| 0| 60| 0.5| °C |off=0|
| 4| Room temp flow setpoint| 0| 90| 1|°C|off_heat=0, off_cool=90|
| 5| Room temp power setpoint| 0| 100| 1| %|na=255|
| 6| Current room temp setpoint| 0| 60| 0.5| °C|off=0|
| 7| Next room temp setpoint| 0| 60| 0.5|°C| off=0|
| 8-9| Room Temperature Setpoint Determination: time to next setpoint   | 1 | 1440  |1   | min| |
| 10.0| Room temp setpoint set automatically        | 0| 1|1| bool   |false=0, true=1|
| 10.1| RTSD: Comfort Active                        | 0| 1|1| bool   |false=0, true=1|
| 10.2| RTSD: Temporary increase of setpoint active   | 0| 1|1| bool   |false=0, true=1|
| 10.3| RTSD: Prevention of eco mode active         |0| 1| 1| bool   |false=0, true=1|
| 10.4| RTSD: Advance mode is active                |  0| 1| 1||false=0, true=1|
| 11| Room Temp Setpoint: Heating Level             |  1| 4| 1||ECO=1, COMFORT1=2, COMFORT2=3, COMFORT3=4|
| 12| RTSD: Next Heating Level                      |  1| 4| 1||ECO = 1, COMFORT1=2, COMFORT2=3, COMFORT3=4|
| 13-14| RTSD: Time To Next Heating Level           |   1|1440|1|min||
| 15-16| RTSD: Time Since Last Heating Level        |   1| 1440|1|min||
| 17| Floordrying active                            |  0| 1| 1| bool|false=0, true=1|
| 18| HolidayMode activated for this heating circuit| 0| 4| 1| enum|none=0, AUTO_SAT=1, FIX_TEMP=2, OFF=3, ECO=4|
| ...| ||||||
| 20| Local Season Optimizer mode                   |  1| 3| 1|enum|heating=1, idle=2, cooling=3|
| ...| ||||||
| 27-28| Offset on room temperature setpoint due to room temperature influence| -100| 300| 0.1| K||
| ...| ||||||
| 32| Room temp sensor value controller extsensor. Value defines the requested relative heating power for the heating circuit| 0| 100| 1| %||
| ...|||||||

### Telegram: 0x02C3, 0x02C4, 0x02C5, 0x02C6, 0x02C7, 0x02C8, 0x02C9, 0x02CA

*Name:* NSC Clock Program for for HCx  
*Description:* Sets heating level switch points for HC1, HC2, ... HC8  
*Class:* parameter  
*EMS category:* EMS2.0  
*Distribution:* broadcast-on-change, unicast-on-request, unicast-write-request  
*Offset of variables:*  

| Offset | Variable name | min | max | resolution | unit | comment |
| --- | --- | --- | --- | --- | --- | ---|
| 0| 1st switch point Monday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 1| 1st switch point Monday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 2| 2nd switch point Monday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 3| 2nd switch point Monday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 4| 3rd switch point Monday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 5| 3rd switch point Monday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 6| 4th switch point Monday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 7| 4th switch point Monday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 8| 5th switch point Monday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 9| 5th switch point Monday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 10| 6th switch point Monday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 11| 6th switch point Monday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 12| 1st switch point Tuesday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 13| 1st switch point Tuesday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 14| 2nd switch point Tuesday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 15| 2nd switch point Tuesday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 16| 3rd switch point Tuesday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 17| 3rd switch point Tuesday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 18| 4th switch point Tuesday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 19| 4th switch point Tuesday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 20| 5th switch point Tuesday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 21| 5th switch point Tuesday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 22| 6th switch point Tuesday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 23| 6th switch point Tuesday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 24| 1st switch point Wednesday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 25| 1st switch point Wednesday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 26| 2nd switch point Wednesday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 27| 2nd switch point Wednesday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 28| 3rd switch point Wednesday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 29| 3rd switch point Wednesday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 30| 4th switch point Wednesday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 31| 4th switch point Wednesday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 32| 5th switch point Wednesday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 33| 5th switch point Wednesday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 34| 6th switch point Wednesday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 35| 6th switch point Wednesday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 36| 1st switch point Thursday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 37| 1st switch point Thursday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 38| 2nd switch point Thursday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 39| 2nd switch point Thursday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 40| 3rd switch point Thursday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 41| 3rd switch point Thursday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 42| 4th switch point Thursday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 43| 4th switch point Thursday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 44| 5th switch point Thursday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 45| 5th switch point Thursday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 46| 6th switch point Thursday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 47| 6th switch point Thursday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 48| 1st switch point Friday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 49| 1st switch point Friday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 50| 2nd switch point Friday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 51| 2nd switch point Friday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 52| 3rd switch point Friday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 53| 3rd switch point Friday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 54| 4th switch point Friday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 55| 4th switch point Friday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 56| 5th switch point Friday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 57| 5th switch point Friday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 58| 6th switch point Friday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 59| 6th switch point Friday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 60| 1st switch point Saturday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 61| 1st switch point Saturday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 62| 2nd switch point Saturday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 63| 2nd switch point Saturday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 64| 3rd switch point Saturday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 65| 3rd switch point Saturday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 66| 4th switch point Saturday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 67| 4th switch point Saturday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 68| 5th switch point Saturday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 69| 5th switch point Saturday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 70| 6th switch point Saturday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 71| 6th switch point Saturday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 72| 1st switch point Sunday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 73| 1st switch point Sunday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 74| 2nd switch point Sunday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 75| 2nd switch point Sunday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 76| 3rd switch point Sunday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 77| 3rd switch point Sunday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 78| 4th switch point Sunday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 79| 4th switch point Sunday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 80| 3rd switch point Sunday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 81| 3rd switch point Sunday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 82| 4th switch point Sunday level| -1| 30| 1| |1=ECO, 2=Comfort1, 3=comfort2, 4=comfort3|
| 83| 4th switch point Sunday time| -1| 95| 1| 15min |-1=na, 15min increments from midnight |
| 84-101|Heating program name | 32 | 255 | 1 | ASCII | 18 ASCII characters|

### Telegram: 0x043F, 0x0440, 0x0441, 0x0442, 0x0443, 0x0444, 0x0445, 0x0446

*Name:* NSC HolidayMode for HCx  
*Description:* Sets start and end date for holiday mode for HC1, HC2, ... HC8  
*Class:* parameter  
*EMS category:* EMS2.0  
*Distribution:* broadcast-on-change, unicast-on-request, unicast-write-request  
*Offset of variables:*  

| Offset | Variable name | min | max | resolution | unit | comment |
| --- | --- | --- | --- | --- | --- | ---|
| 0| holiday start year| 9| 99| 1| |add 2000|
| 1| holiday start month| 1| 12| 1| ||
| 2| holiday start day| 1| 31| 1| ||
| 3| holiday end year| 9| 99| 1| |add 2000|
| 4| holiday end month| 1| 12| 1| ||
| 5| holiday end day| 1| 31| 1| ||
