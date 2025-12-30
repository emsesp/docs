---
id: Modbus
---

# Modbus

Der Modbus-Anschluss ermöglicht das Lesen und Schreiben von Einheiten über das Modbus/TCP-Protokoll. Siehe [Settings](Modbus-Settings.md) für die Aktivierung und Konfiguration des Modbus-Anschlusses.

## EMS Entity / Modbus Register Mapping

In diesem Dokument wird das Gerät, das eine Modbus-Anfrage stellt, als _Client_ (früher als _Modbus-Master_ bezeichnet) und das Gerät, das die Anfragen abhört und erfüllt, d.h. EMS-ESP, als _Server_ (früher als _Modbus-Slave_ bezeichnet) bezeichnet.

EMS-ESP erstellt einen Modbus-Server für jedes an den EMS-Bus angeschlossene Gerät, einschließlich EMS-ESP selbst. Jeder Server wird mit einer numerischen Kennung adressiert, die den Gerätetyp darstellt. Siehe [Server Unit Identifiers](Modbus-Server-IDs.md) für eine Liste aller möglichen Server-IDs.

Ein Server organisiert alle Entitäten des Geräts, das er darstellt, in Blöcken, die den Entitäts-Tags entsprechen (z. B. `hc1` für den ersten Heizkreis). Die Entitäten werden mit einem Offset innerhalb des Registerblocks adressiert. Siehe [Register Blocks](Modbus-Register-Blocks.md) für eine Liste aller Block-Offsets.

Alle Werte werden in einem oder mehreren Registern gespeichert.

- Jedes Modbus-Register enthält einen 16-Bit-Wert.
- Numerische Werte werden als 16- oder 32-Bit-Ganzzahlen in einem oder zwei Registern gespeichert. Es kann ein einrichtungsspezifischer Skalierungsfaktor angewendet werden. Der Skalierungsfaktor wird für jedes Gerät und jede Einheit separat definiert.
- Enums werden in einem einzigen Register gespeichert.
- Zeichenketten werden mit Null beendet und mit zwei Zeichen pro Register gespeichert.

Siehe [Entity/Register Mapping](Modbus-Entity-Registers.md) für eine Liste aller Registeroffsets, Datentypen und Skalierungsfaktoren.

:::tip

    Ein Modbus-Client möchte die Soll-Vorlauftemperatur des zweiten Heizkreises (hc2) eines an den EMS-Bus angeschlossenen Thermostaten vom Typ RC310 auslesen.

    - Die Tabelle [Server IDs](Modbus-Server-IDs.md) gibt an, dass die Gerätekennung eines *Thermostaten* `6` ist. Daher muss der Kunde in allen Anfragen die Gerätekennung `6` angeben.
    - Tabelle [Register Blocks](Modbus-Register-Blocks.md) zeigt, dass der Offset für HC2 2000 beträgt.
    - Die Zeile *targetflowtemp* in der Tabelle [Entity/Register Mapping for thermostat RC310](http://localhost:8000/docs/Modbus-Entity-Registers/#rc300rc310moduline-30001010hcw400sense-iihpc410) enthält den Registeroffset 18, die Registeranzahl 1 und den Skalierungsfaktor 1. Tipp: Klicken Sie auf eine Spaltenüberschrift, um die Tabelle zu sortieren, z.B. nach Entitätskurznamen.

    Der endgültige Register-Offset für die Soll-Vorlauftemperatur in hc2 ist also 2000 + 18 = 2018. Wir müssen ein Register mit dem Offset 2018 vom Server mit der Unit ID 6 lesen und das Ergebnis mit dem Skalierungsfaktor multiplizieren, der in diesem Fall 1 ist.

:::

## Der SYSTEM-Server

EMS-ESP weist einem Server eine spezielle Einheitenkennung `1` zu, die allgemeine Informationen über EMS-ESP liefert. Die Register des Systemservers sind [here](Modbus-System-Server.md) dokumentiert.

## Lesen und Schreiben von Entitätswerten

Die folgenden Modbus-Funktionscodes sind implementiert:

- `READ_HOLD_REGISTER` (`0x03`)
- `READ_INPUT_REGISTER` (`0x04`)
- `WRITE_HOLD_REGISTER` (`0x06`)
- `WRITE_MULT_REGISTERS` (`0x10`)

Der Modbus-Anschluss unterstützt das Lesen und Schreiben eines einzelnen Objekts pro Anfrage. Das Lesen oder Schreiben mehrerer Einheiten, auch wenn sie aufeinanderfolgenden Registern zugeordnet sind, wird nicht unterstützt. Ein einzelnes Objekt, das mehreren Registern zugeordnet ist, muss jedoch in einer einzigen Anfrage gelesen oder geschrieben werden.

## Registerzuordnungen aktualisieren (für Entwickler)

Nach dem Hinzufügen oder Ändern von EMS-Einheiten muss auch die Registerzuordnung aktualisiert werden. Die Modbus-Einstellungen werden in der Datei `src/core/modbus_entity_parameters.hpp` gespeichert und enthalten den Tag-Typ, den Register-Offset und die Anzahl der Register für jede Einheit.

Um die Registerzuordnung zu aktualisieren, führen Sie den Befehl

```sh
sh ./scripts/generate_csv_and_headers.sh
```

aus dem EMS-ESP-Stammverzeichnis. Es läuft auf Linux/OSX und erfordert die Installation von `GNUmake` und `python3`. Das Skript führt die folgenden Aufgaben aus:

- Erzeugt EMS-ESP im Standalone-Modus unter Verwendung des Makefiles
- Führt `emsesp` auf der Kommandozeile mit dem Argument `test entity_dump` aus. Dies gibt alle Entitäten einschließlich ihrer Modbus-Parameter in eine CSV-Datei aus.
- Weisen Sie jeder Entität auf der Grundlage ihres Typs Tag-Typen, Register-Offsets und die Registeranzahl zu. In diesem Schritt werden zuvor zugewiesene Modbus-Parameter beibehalten und nur neue Werte für Einheiten zugewiesen, für die noch keine Modbus-Parameter definiert sind.

Nachdem die angepasste `modbus_entity_parameters.hpp`-Datei und die Dokumentation (.md-Datei) aktualisiert wurden, erstellen und testen Sie die Datei und übertragen Sie sie in das EMS-ESP-Dev-Repository.

:::note

    Die Größe von String-Entities ist dem EMS-ESP zur Laufzeit nicht bekannt. Wenn Sie also eine neue String-Entität hinzufügen, müssen Sie auch die Größe des String-Feldes zur Variablen `string_sizes` in `scripts/update_modbus_registers.py` hinzufügen, die die Kurznamen der Entitäten auf die String-Größen abbildet.
:::
