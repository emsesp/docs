---
id: All-Entities
title: All Devices and Entities
hide_table_of_contents: true
---

import EntitiesTable from '@site/src/components/EntitiesTable';

# Alle apparaten en entiteiten

:::warning please read Zorg ervoor dat u de [Disclaimer](About) hebt gelezen en begrepen voordat u dubbelzinnige berichten naar uw EMS-bus stuurt, want u kunt uw apparatuur ernstig beschadigen.
:::

De meeste boilers van het merk Bosch die de Logamatic EMS-busprotocollen ondersteunen, werken met dit ontwerp. Hieronder vallen Nefit, Buderus, Worcester, Junkers en Sieger (allemaal auteursrechtelijk beschermd).

EMS-apparaten worden voortdurend toegevoegd aan de database bij elke nieuwe release van de EMS-ESP-firmware.

De volgende EMS-apparaattypes worden ondersteund:

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
- zwembad
- generiek

De volledige lijst met ondersteunde apparaten en entiteiten kan worden gedownload [here](/data/dump_entities.csv).

De onderstaande tabel wordt dynamisch gegenereerd. Je kunt zoeken op apparaatnaam, entiteitnaam of type en filteren op apparaattype en toegangsrechten. Klik op een rij om gedetailleerde informatie te zien, waaronder Home Assistant-detectie-ID's en Modbus-parameters.

<EntitiesTable />

:::tip De gegevens begrijpen

- **Apparaat**: De naam en product-ID van het EMS-apparaat
- **Type**: Categorie apparaat (ketel, thermostaat, mengkraan, enz.)
- **Korte naam**: Interne entiteitsaanduiding gebruikt in commando's
- **Volledige naam**: Menselijk leesbare beschrijving van de entiteit
- **Gegevens type**: Waardetype met optionele beperkingen
- **Unit**: Meeteenheid (°C, %, bar, enz.)
- **Toegang**: Of de entiteit alleen-lezen of schrijfbaar is
- **Klik op een rij** om de Home Assistant entiteit-ID's en Modbus registergegevens te zien
:::
