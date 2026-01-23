---
id: All-Entities
title: All Devices and Entities
hide_table_of_contents: true
---

import EntitiesTable from '@site/src/components/EntitiesTable';

# Alle Geräte und Entitäten

:::warning Vergewissern Sie sich, dass Sie die [Disclaimer](About) gelesen und verstanden haben, bevor Sie zweideutige Nachrichten an Ihren EMS-Bus senden, da Sie Ihre Ausrüstung ernsthaft beschädigen könnten.
:::

Die meisten Heizkessel der Marke Bosch, die die Logamatic EMS-Busprotokolle unterstützen, funktionieren mit diesem Design. Dazu gehören Nefit, Buderus, Worcester, Junkers und Sieger (alle urheberrechtlich geschützt).

Mit jeder neuen EMS-ESP-Firmwareversion werden ständig neue EMS-Geräte in die Datenbank aufgenommen.

Die folgenden EMS-Gerätetypen werden unterstützt:

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
- wasser
- pool
- generisch

Die vollständige Liste der unterstützten Geräte und Einheiten kann heruntergeladen werden [here](/data/dump_entities.csv).

Die folgende Tabelle wird dynamisch generiert. Sie können nach Gerätename, Entitätsname oder Typ suchen und nach Gerätetyp und Zugriffsberechtigungen filtern. Klicken Sie auf eine beliebige Zeile, um detaillierte Informationen einschließlich Home Assistant-Erkennungs-IDs und Modbus-Parameter anzuzeigen.

<EntitiesTable />

:::tip Verstehen der Daten

- **Gerät**: Der EMS-Gerätename und die Produkt-ID
- **Typ**: Gerätekategorie (Kessel, Thermostat, Mischer, usw.)
- **Kurzer Name**: Interner Bezeichner der Entität, der in Befehlen verwendet wird
- **Vollständiger Name**: Von Menschen lesbare Beschreibung der Entität
- **Datentyp**: Werttyp mit optionalen Beschränkungen
- **Einheit**: Maßeinheit (°C, %, bar, usw.)
- **Zugriff**: Ob die Entität schreibgeschützt oder schreibbar ist
- **Klicken Sie auf eine Zeile**, um die Home Assistant Entity IDs und Modbus-Registerdetails zu sehen
:::
