---
id: Modbus-System-Server
---

# Modbus systeemserver

EMS-ESP biedt een server met algemene alleen-lezen informatie met unit ID `1`. Het biedt de volgende gegevens:

| `Name` | `Description` | `Register offset` | `Register count` |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------- |
| NUM_DEVICES Het aantal apparaten dat wordt herkend op de EMS-bus
| DEVICE_TYPE_AND_ID | Het apparaattype en ID voor elk apparaat. "n" in de registeroffset is de index van het apparaat met 0 &lt;= n &lt; NUM_DEVICES. De eerste byte van de 16-bits waarde bevat de [device type](Modbus-Server-IDs.md), de tweede byte bevat de apparaat-ID. | 1000 + n | 1 |
