# Notes for Developers

## Update register mappings

After adding or modifying entities the register mapping needs to be updated. The Modbus settings are stored in the
file `src/modbus_entity_parameters.hpp`. This file contains the tag type, register offset and number of registers for
each entity.

To update the register mapping call the script `scripts/update_modbus_registers.sh` from the EMS-ESP project root
directory. It requires a `bash` shell and `python3` to run successfully. It performs the following tasks:

- Build EMS-ESP in standalone mode
- Execute `emsesp` with the `test entity_dump` argument. This dumps all entities including their modbus parameters
  (if already defined)
- Assign tag types, register offsets and the register count to each entity based on its type. This step preserves
  previously assigned Modbus parameters and only assigns new values for entities that do not yet have Modbus parameters
  defined.

After generating a new `modbus_entity_parameters.hpp`, build, test and then commit and push it to the repository.

!!! note

    The size of string entities is not known to EMS-ESP at runtime. So in case you add a new string entity you must
    also add the size of the string field to variable `string_sizes` in `scripts/update_modbus_registers.py` which
    maps entity short names to string sizes.

## Update the Documentation

To update the documentation use the script `scripts/generate-modbus-register-doc.sh`. Run it (after updating
`src/modbus_entity_parameters.hpp`) and it outputs the contents of the `Modbus-Entity-Registers.md` file to stdout.
Update this file in the documentation repo.
