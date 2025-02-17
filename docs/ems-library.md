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

### Telegram: 0x043F, 0x0440, 0x0441, 0x0442, 0x0443, 0x0444, 0x0445, 0x0446

*Name:* NSC HolidayMode for HCx  
*Description:* Sets start and end date for holiday mode for HC1, HC2, ... HC8  
*Class:* parameter  
*EMS category:* EMS2.0  
*Distribution:* broadcast-on-change, unicast-on-request, unicast-write-request  
*Offset of variables:*  

| Offset | Variable name | min | max | resolution | unit | comment |
| --- | --- | --- | --- | --- | --- | ---|
| 0| holiday start year| min=9| max=99| resolution=1| |add 2000|
| 1| holiday start month| min=1| max=12| resolution=1| ||
| 2| holiday start day| min=1| max=31| resolution=1| ||
| 3| holiday end year| min=9| max=99| resolution=1| |add 2000|
| 4| holiday end month| min=1| max=12| resolution=1| ||
| 5| holiday end day| min=1| max=31| resolution=1| ||
