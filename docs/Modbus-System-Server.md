# SYSTEM server

EMS-ESP provides a server with general read only information with unit ID `1`. It provides the following data:

| Name               | Description                                                                                                                                                                                                                                           | Register offset | Register count |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------- |
| NUM_DEVICES        | The number of devices recognized on the EMS bus                                                                                                                                                                                                       | 1               | 1              |
| DEVICE_TYPE_AND_ID | The device type and ID for each device. "n" in the register offset is the index of the device with 0 <= n < NUM_DEVICES. The first byte of the 16 bit value contains the [device type](Modbus-Server-IDs.md), the second byte contains the device ID. | 1000 + n        | 1              |
