---
id: Modbus
---
# Modbus

Met de Modbus-connector kunnen entiteiten worden gelezen en geschreven met behulp van het Modbus/TCP protocol. Zie [Settings](Modbus-Settings.md) voor het inschakelen en configureren van de Modbus-connector.

## EMS entiteit / Modbus register toewijzing

Dit document verwijst naar het apparaat dat een Modbus-aanvraag verstuurt als de _client_ (vroeger bekend als een _Modbus-master_) en naar het apparaat dat luistert en de aanvragen uitvoert, d.w.z. EMS-ESP, als de _server_ (vroeger bekend als een _Modbus-slave_).

EMS-ESP maakt een Modbus-server aan voor elk apparaat dat is aangesloten op de EMS-bus, inclusief EMS-ESP zelf. Elke server wordt geadresseerd met een numerieke identificatie die het apparaattype vertegenwoordigt. Zie [Server Unit Identifiers](Modbus-Server-IDs.md) voor een lijst met alle mogelijke server-ID's.

Een server organiseert alle entiteiten van het apparaat dat hij vertegenwoordigt in blokken die overeenkomen met de entiteittags (bijv. `hc1` voor het eerste verwarmingscircuit). De entiteiten worden geadresseerd met een offset binnen het registerblok. Zie [Register Blocks](Modbus-Register-Blocks.md) voor een lijst met alle blokoffsets.

Alle waarden worden opgeslagen in een of meer registers.

- Elk Modbus-register bevat een waarde van 16 bits.
- Numerieke waarden worden opgeslagen als gehele getallen van 16 of 32 bits in één of twee registers. Er kan een entiteitspecifieke schaalfactor worden toegepast. De schaalfactor wordt afzonderlijk gedefinieerd voor elk apparaat en elke entiteit.
- Enums worden opgeslagen in een enkel register.
- Strings worden met nul afgesloten en opgeslagen met twee karakters per register.

Zie [Entity/Register Mapping](Modbus-Entity-Registers.md) voor een lijst met alle registeroffsets, gegevenstypen en schaalfactoren.

:::tip

    Een Modbus client wil de gewenste aanvoertemperatuur lezen van het tweede verwarmingscircuit (hc2) van een thermostaat van het type RC310 die aangesloten is op de EMS-bus.

    - Tabel [Server IDs](Modbus-Server-IDs.md) geeft aan dat de unit identifier van een *thermostaat* apparaat `6` is. De klant moet dus in alle verzoeken de unit identifier `6` opgeven.
    - Tabel [Register Blocks](Modbus-Register-Blocks.md) laat zien dat de offset voor HC2 2000 is.
    - De rij *targetflowtemp* in tabel [Entity/Register Mapping for thermostat RC310](http://localhost:8000/docs/Modbus-Entity-Registers/#rc300rc310moduline-30001010hcw400sense-iihpc410) vermeldt register offset 18, register count 1 en schaalfactor 1. Tip: klik op een kolomkop om de tabel te sorteren, bijvoorbeeld op korte entiteitnamen.

    Dus de uiteindelijke registeroffset voor de gewenste aanvoertemperatuur in hc2 is 2000 + 18 = 2018. We moeten één register op offset 2018 uitlezen van het basisstation met unit ID 6 en het resultaat vermenigvuldigen met de schaalfactor die in dit geval 1 is.

:::

## De SYSTEM-server

EMS-ESP kent een speciale eenheidsaanduiding, `1`, toe aan een server die algemene informatie over EMS-ESP verschaft. De registers van de systeemserver zijn gedocumenteerd [here](Modbus-System-Server.md).

## Entiteitswaarden lezen en schrijven

De volgende Modbus-functiecodes zijn geïmplementeerd:

- `READ_HOLD_REGISTER` (`0x03`)
- `READ_INPUT_REGISTER` (`0x04`)
- `WRITE_HOLD_REGISTER` (`0x06`)
- `WRITE_MULT_REGISTERS` (`0x10`)

De Modbus-connector ondersteunt het lezen en schrijven van een enkele entiteit per request. Het lezen of schrijven van meerdere entiteiten, zelfs als deze zijn toegewezen aan opeenvolgende registers, wordt niet ondersteund. Een enkele entiteit die is toegewezen aan meerdere registers moet echter in één verzoek worden gelezen of geschreven.

## Register-toewijzingen bijwerken (voor ontwikkelaars)

Na het toevoegen of wijzigen van EMS-entiteiten moet ook de registertoewijzing worden bijgewerkt. De Modbus-instellingen worden opgeslagen in het bestand `src/core/modbus_entity_parameters.hpp` en bevat het tagtype, de registeroffset en het aantal registers voor elke entiteit.

Voer de opdracht uit om de registertoewijzing bij te werken

```sh
sh ./scripts/generate_csv_and_headers.sh
```

uit de EMS-ESP hoofdmap. Het draait op Linux/OSX en vereist dat `GNUmake` en `python3` zijn geïnstalleerd. Het script voert de volgende taken uit:

- Bouwt EMS-ESP in standalone modus met de Makefile
- Voert `emsesp` uit op de opdrachtregel met het argument `test entity_dump`. Hiermee worden alle entiteiten inclusief hun modbusparameters naar een CSV-bestand gedumpt.
- Wijs tagtypes, registeroffsets en de registertelling toe aan elke entiteit op basis van het type. Deze stap behoudt eerder toegewezen Modbus-parameters en wijst alleen nieuwe waarden toe voor entiteiten waarvoor nog geen Modbus-parameters zijn gedefinieerd.

Nadat het aangepaste `modbus_entity_parameters.hpp` bestand is bijgewerkt, evenals de documentatie (.md bestand), bouw je het, test je het en commit je het en push je het naar de EMS-ESP dev repository.

:::note

    De grootte van string-entiteiten is niet bekend bij EMS-ESP tijdens runtime. Dus als u een nieuwe stringentiteit toevoegt, moet u ook de grootte van het stringveld toevoegen aan variabele `string_sizes` in `scripts/update_modbus_registers.py`, die korte entiteitnamen koppelt aan stringgroottes.
:::
