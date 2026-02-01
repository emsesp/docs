---
id: Modbus
title: Modbus Integration
description: Access EMS-ESP entities using Modbus/TCP protocol for industrial automation systems
---

# Modbus

The Modbus connector allows to read and write entities using the Modbus/TCP protocol. See [Settings](Modbus-Settings.md)
on how to enable and configure the Modbus connector.

## EMS Entity / Modbus Register Mapping

This document refers to the device issuing a Modbus request as the _client_ (formerly known as a _Modbus master_) and to
the device listening and fulfilling the requests, i.e. EMS-ESP, as the _server_ (formerly known as a _Modbus slave_).

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

:::tip

    A Modbus client wants to read the target flow temperature of the second heating circuit (hc2) of a thermostat of type RC310 connected to the EMS bus.

    - Table [Server IDs](Modbus-Server-IDs.md) indicates that the unit identifier of a *thermostat* device
      is `6`. So the client needs to specify the unit identifier `6` in all requests.
    - Table [Register Blocks](Modbus-Register-Blocks.md) shows that the offset for HC2 is 2000.
    - The row *targetflowtemp* in table [Entity/Register Mapping for thermostat RC310](Modbus-Entity-Registers.md). Look for "RC3*0, Moduline 3000/1010H, CW400, Sense II, HPC410"
      where it lists register offset 18, register count 1 and scale factor 1. Hint: click a column header to sort the table, e.g. by entity shortnames.

    So the final register offset for the target flow temperature in hc2 is 2000 + 18 = 2018. We need to read one
    register at offset 2018 from the server with unit ID 6 and multiply the result by the scale factor which in this
    case is 1.

:::

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

## Update register mappings (for developers)

After adding or modifying EMS entities the register mapping also needs to be updated. The Modbus settings are stored in the file `src/core/modbus_entity_parameters.hpp` and contains the tag type, register offset and number of registers for
each entity.

To update the register mapping run the command

```sh
sh ./scripts/generate_csv_and_headers.sh
```

from the EMS-ESP root folder. It runs on Linux/OSX and requires `GNUmake` and `python3` to be installed. The script performs the following tasks:

- Builds EMS-ESP in standalone mode using the Makefile
- Executes `emsesp` on the command-line with the `test entity_dump` argument. This dumps all entities including their modbus parameters to an CSV file.
- Assign tag types, register offsets and the register count to each entity based on its type. This step preserves previously assigned Modbus parameters and only assigns new values for entities that do not yet have Modbus parameters defined.

After the adjusted `modbus_entity_parameters.hpp` file is updated as well as the documentation (.md file), build, test and then commit and push to the EMS-ESP dev repository.

:::note

    The size of string entities is not known to EMS-ESP at runtime. So in case you add a new string entity you must
    also add the size of the string field to variable `string_sizes` in `scripts/update_modbus_registers.py` which maps entity short names to string sizes.

:::
