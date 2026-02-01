---
id: All-Entities
title: All Devices and Entities
description: Complete database of all supported EMS devices and their entities including boilers, thermostats, heat pumps, and modules
hide_table_of_contents: true
---

import EntitiesTable from '@site/src/components/EntitiesTable';

# All Devices and Entities

:::warning
Make sure you have read and understood the [Disclaimer](About) before sending ambiguous messages to your EMS bus as you could cause serious damage to your equipment.
:::

Most Bosch branded boilers that support the Logamatic EMS bus protocols work with this design. This includes Nefit, Buderus, Worcester, Junkers and Sieger (all copyrighted).

EMS devices are being constantly added to the database on each new EMS-ESP firmware release.

The following EMS device types are supported:

- [boiler](Boilers)
- [thermostat](Thermostats)
- [heatpump](Heat-Pumps)
- [heatsource](Heat-Pumps)
- [ventilation](Heat-Pumps)
- [solar](Solar-Modules)
- [connect](Connect)
- [mixer](Mixer-Modules)
- [controller](Controllers)
- [switch](Switches)
- [gateway](Gateways)
- [alert](Alert)
- [extension](Extension)
- water
- pool
- generic

The complete list of supported devices and entities can be downloaded [here](/data/dump_entities.csv).

The table below is dynamically generated. You can search by device name, entity name, or type, and filter by device type and access permissions. Click on any row to see detailed information including Home Assistant discovery IDs and Modbus parameters.

<EntitiesTable />

:::tip Understanding the Data

- **Device**: The EMS device name and product ID
- **Type**: Device category (boiler, thermostat, mixer, etc.)
- **Short Name**: Internal entity identifier used in commands
- **Full Name**: Human-readable entity description
- **Data Type**: Value type with optional constraints
- **Unit**: Unit of measurement (°C, %, bar, etc.)
- **Access**: Whether the entity is read-only or writeable
- **Click a row** to see Home Assistant entity IDs and Modbus register details
:::
