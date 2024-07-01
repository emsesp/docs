# Modbus/TCP

The Modbus connector allows to read and write entities using the Modbus/TCP protocol. See [Settings](Modbus-Settings.md)
on how to enable and configure the Modbus connector.

## EMS Entity / Modbus Register Mapping

This document refers to the device issuing a Modbus request as the *client* (formerly known as a *Modbus master*) and to
the device listening and fulfilling the requests, i.e. EMS-ESP, as the *server* (formerly known as a *Modbus slave*).

EMS-ESP creates a Modbus server for each device connected to the EMS bus, including EMS-ESP itself. Each server is
addressed with a numeric identifier representing the device type. See [Server Unit Identifiers](Modbus-Server-IDs.md)
for a list of all possible server IDs.

A server organizes all entities of the device it represents in blocks that correspond to the entity tags (e.g. `hc1` for
the first heating circuit). The entities are addressed with an offset within the register block. See
[Register Blocks](Modbus-Register-Blocks.md) for a list of all block offsets.

All values are stored in one or more registers.

- Each Modbus register contains a 16 bit value.
- Numeric values are stored as 16 or 32 bit integers, in one or two registers. An entity specific scale factor may be 
  applied. The scale factor is defined separately for each device and entity.
- Enums are stored in a single register.
- Strings are null terminated and stored with two characters per register.

See [Entity/Register Mapping](Modbus-Entity-Registers.md) for a list of all register offsets, data types and scale
factors.

!!! example

    A Modbus client wants to read the target flow temperature of the second heating circuit (hc2) of a thermostat
    of type RC310 connected to the EMS bus.
    
    - Table [Server IDs](Modbus-Server-IDs.md) indicates that the unit identifier of a *thermostat* device
      is `6`. So the client needs to specify the unit identifier `6` in all requests.
    - Table [Register Blocks](Modbus-Register-Blocks.md) shows that the offset for HC2 is 2000.
    - The row *targetflowtemp* in table [Entity/Register Mapping for thermostat RC310](http://localhost:8000/docs/Modbus-Entity-Registers/#rc300rc310moduline-30001010hcw400sense-iihpc410)
      lists register offset 18, register count 1 and scale factor 1. Hint: click a column header to sort the table,
      e.g. by entity shortnames.
    
    So the final register offset for the target flow temperature in hc2 is 2000 + 18 = 2018. We need to read one
    register at offset 2018 from the server with unit ID 6 and multiply the result by the scale factor which in this
    case is 1.

## The SYSTEM server

EMS-ESP assigns a special unit identifier, `1`, to a server that provides general information about EMS-ESP. The
system server registers are documented [here](Modbus-System-Server.md).

## Reading and Writing Entity values

The following Modbus function codes are implemented:

- `READ_HOLD_REGISTER` (`0x03`)
- `READ_INPUT_REGISTER` (`0x04`)
- `WRITE_HOLD_REGISTER` (`0x06`)
- `WRITE_MULT_REGISTERS` (`0x10`)

The Modbus connector supports reading and writing of a single entity per request. Reading or writing multiple entities,
even if mapped to consecutive registers, is not supported. However, a single entity that is mapped to multiple registers
must be read or written in a single request.
