# Notes for Developers

## Update register mappings

After adding or modifying EMS entities the register mapping also needs to be updated. The Modbus settings are stored in the file `src/modbus_entity_parameters.hpp` and contains the tag type, register offset and number of registers for
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

!!! note

    The size of string entities is not known to EMS-ESP at runtime. So in case you add a new string entity you must
    also add the size of the string field to variable `string_sizes` in `scripts/update_modbus_registers.py` which maps entity short names to string sizes.
