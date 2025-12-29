# The EMS Bus explained

Packages are streamed to the EMS "bus" from any other compatible connected device via serial TTL transmission using protocol 9600 baud, 8N1 (8 bytes, no parity, 1 stop bit). Each package is terminated with a break signal `<BRK>`, a 11-bit long low signal of zeros.

A package can be a single byte (see Polling below) or a string of 6 or more bytes making up an actual data telegram. A telegram for the EMS 1.0 is always in the format:

`[src] [dest] [type] [offset] [data] [crc] <BRK>` (Write/Broadcast)

`[src] [dest|0x80] [type] [offset] [length] [crc] <BRK>` (Read)

The first 4 bytes is referenced as the _header_ in this document.

For EMS+/EMS2.0 the type is longer that 1 byte. The coding is:

`[src] [dest] FF [offset] [typeHigh] [typeLow] [data] [crc] <BRK>` (Write/Broadcast)

`[src] [dest|0x80] FF [offset] {length] [typeHigh] [typeLow] [crc] <BRK>` (Read)

And the _header_ is 6/7 bytes.

Junkers devices sets the MSB in `[src]` to `[src|0x80]`, all other brands not.

### EMS IDs

Each device has a unique ID.

In this example a UBA boiler has an ID of 0x08 (such as a MC10) and also referred to as the Bus Master.

The circuit acts as a service key and thus uses an ID 0x0B. This ID is reserved for special devices intended for service engineers.

### EMS Polling

The bus master (boiler) sends out a poll request every second by sending out a sequential list of all possible IDs as a single byte followed by the break signal. The ID always has its high 8th bit (MSB) set so in the code we're looking for 1 byte messages matching the format `[dest|0x80] <BRK>`. In Junkers devices the MSB is not set.

Any connected device can respond to a Polling request with an acknowledgement by sending back a single byte with its own ID. In our case we would listen for a `[0x8B] <BRK>` (meaning us) and then send back `[0x0B] <BRK>` to say we're alive and ready.

Polling is also the trigger to start transmitting any packages queued for sending. It must be done within 200ms or the bus master will time out.

### EMS Broadcasting

When a device is broadcasting to everyone there is no specific destination needed. `[dest]` is always 0x00.

The tables below shows which types are broadcasted regularly by the boiler (in this case ID 0x08) and thermostat (ID 0x17). The **data length** is excluding the 4 byte header and CRC and the **Name** references those in the German [EMS wiki](https://emswiki.thefischer.net/doku.php?id="wiki:ems:telegramme").

| Source (ID)   | Type ID | Name                | Description                            | Data length | Frequency  |
| ------------- | ------- | ------------------- | -------------------------------------- | ----------- | ---------- |
| Boiler (0x08) | 0x34    | UBAMonitorWWMessage | warm water temperature                 | 19 bytes    | 10 seconds |
| Boiler (0x08) | 0x18    | UBAMonitorFast      | boiler temps, power, gas/pump switches | 25 bytes    | 10 seconds |
| Boiler (0x08) | 0x19    | UBAMonitorSlow      | boiler temp and timings                | 22 bytes    | 60 seconds |
| Boiler (0x08) | 0x1C    | UBAWartungsmelding  | maintenance messages                   | 27 bytes    | 60 seconds |
| Boiler (0x08) | 0x2A    | n/a                 | status, specific to boiler type        | 21 bytes    | 10 seconds |
| Boiler (0x08) | 0x07    | n/a                 | ?                                      | 21 bytes    | 30 seconds |

| Source (ID)       | Type ID | Name              | Description                                         | Frequency  |
| ----------------- | ------- | ----------------- | --------------------------------------------------- | ---------- |
| Thermostat (0x17) | 0x06    | RCTime            | returns time and date on the thermostat             | 60 seconds |
| Thermostat (0x17) | 0x91    | RC30StatusMessage | returns current and set temperatures                | 60 seconds |
| Thermostat (0x17) | 0xA3    | RCTempMessage     | returns temp values from external (outdoor) sensors | 60 seconds |

### EMS Reading and Writing

Telegrams can only be sent after the Master (boiler) sends a poll to the receiving device. The response can be a read command to request data or a write command to send data. At the end of the transmission a poll response is sent from the client (`<ID> <BRK>`) to say we're all done and free up the bus for other clients.

When executing a request to read data the `[src]` is our device `(0x0B)` and the `[dest]` must have has it's MSB (8th bit) set. Say we were requesting data from the thermostat we would use `[dest] = 0x97` since RC20 has an ID of 0x17. In emsesp-logs this request is shown with `R`` between`[src]`and`[dst]`: _"Me(0x0B) R Thermostat(0x17)..."_.

Following a write request, the `[dest]` doesn't have the 8th bit set and after this write request the destination device will send either a single byte 0x01 for success or 0x04 for failure. In emsesp-logs this write is shown with with `W` between `[src]` and `[dst]`: _"Me(0x0B) W Thermostat(0x17)..."_.

### Fetching EMS telegrams

Not all telegrams are broadcasted frequently, a lot of setting telegrams are only broadcasted partial if there is a change. To get all values from a telegram EMS-ESP has send a read request to the device and the device reply's the telegram only to emsesp, this we call "fetching a telegram".

In `system/info` the devices listed with the handlers (type-ids that are processed):

- `handlers received`: Telegrams that are frequently broadcasted by device to all: _"Boiler(0x08) B All(0x00)..."_
- `handlers fetched`: Telegrams that are not broadcasted and requested by EMS-ESP once a minute: _"Me(0x0B) R Boiler(0x08) .. Boiler(0x08) W Me(0x0B)..."_
- `handlers pending`: Telegrams not received yet or empty on fetch. Example: ems-boilers uses telegram 0x18 to monitor actual values, ems+ boilers uses telegram 0xE4 for the same information. If you find 0x18 on the received list, you have a ems boiler and 0xE4 is pending.
