---
id: Modbus-System-Server
---

# Modbus System Server

EMS-ESP stellt einen Server mit allgemeinen, nur lesbaren Informationen mit der Unit-ID `1` zur Verfügung. Er liefert die folgenden Daten:

| `Name` | `Description` | `Register offset` | `Register count` |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------- |
| NUM_DEVICES | Die Anzahl der auf dem EMS-Bus erkannten Geräte | 1 | 1 |
| DEVICE_TYPE_AND_ID | Der Gerätetyp und die ID für jedes Gerät. "n" im Register Offset ist der Index des Gerätes mit 0 &lt;= n &lt; NUM_DEVICES. Das erste Byte des 16-Bit-Wertes enthält den [device type](Modbus-Server-IDs.md), das zweite Byte enthält die Geräte-ID. | 1000 + n | 1 |
