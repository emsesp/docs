---
id: EMS-bus
title: The EMS Bus Explained
description: Technical documentation of the EMS bus protocol including telegram structure and communication details
---

# Der EMS-Bus erklärt

Pakete werden von jedem anderen kompatiblen angeschlossenen Gerät über eine serielle TTL-Übertragung mit dem Protokoll 9600 Baud, 8N1 (8 Byte, keine Parität, 1 Stoppbit) an den EMS-"Bus" übertragen. Jedes Paket wird mit einem Break-Signal `<BRK>` abgeschlossen, einem 11-Bit langen Low-Signal mit Nullen.

Ein Paket kann ein einzelnes Byte sein (siehe Polling unten) oder eine Zeichenkette von 6 oder mehr Bytes, die ein eigentliches Datentelegramm bilden. Ein Telegramm für das EMS 1.0 hat immer das Format:

`[src] [dest] [type] [offset] [data] [crc] <BRK>` (Write/Broadcast)

`[src] [dest|0x80] [type] [offset] [length] [crc] <BRK>` (Lesen)

Die ersten 4 Bytes werden in diesem Dokument als _Header_ bezeichnet.

Bei EMS+/EMS2.0 ist der Typ länger als 1 Byte. Die Kodierung ist:

`[src] [dest] FF [offset] [typeHigh] [typeLow] [data] [crc] <BRK>` (Write/Broadcast)

`[src] [dest|0x80] FF [offset] {length] [typeHigh] [typeLow] [crc] <BRK>` (Lesen)

Und der _Header_ beträgt 6/7 Bytes.

Junkers-Geräte setzen das MSB in `[src]` auf `[src|0x80]`, alle anderen Marken nicht.

### EMS-IDs

Jedes Gerät hat eine eindeutige ID.

In diesem Beispiel hat ein UBA-Kessel die ID 0x08 (wie ein MC10) und wird auch als Bus-Master bezeichnet.

Der Schaltkreis fungiert als Serviceschlüssel und verwendet daher eine ID 0x0B. Diese ID ist für spezielle Geräte reserviert, die für Servicetechniker bestimmt sind.

### EMS Polling

Der Bus-Master (Boiler) sendet jede Sekunde eine Abfrage, indem er eine sequentielle Liste aller möglichen IDs als einzelnes Byte, gefolgt von einem Break-Signal, sendet. Bei der ID ist immer das höchste 8. Bit (MSB) gesetzt, so dass wir im Code nach 1-Byte-Nachrichten suchen, die dem Format `[dest|0x80] <BRK>` entsprechen. Bei Junkers-Geräten ist das MSB nicht gesetzt.

Jedes angeschlossene Gerät kann auf eine Polling-Anfrage mit einer Bestätigung antworten, indem es ein einzelnes Byte mit seiner eigenen ID zurücksendet. In unserem Fall würden wir auf ein `[0x8B] <BRK>` (also uns) warten und dann `[0x0B] <BRK>` zurücksenden, um zu sagen, dass wir am Leben und bereit sind.

Das Polling ist auch der Auslöser für die Übertragung von Paketen, die in der Warteschlange zum Senden stehen. Dies muss innerhalb von 200 ms erfolgen, da der Bus-Master sonst eine Zeitüberschreitung verursacht.

### EMS Broadcasting

Wenn ein Gerät an alle sendet, ist kein spezielles Ziel erforderlich. `[dest]` ist immer 0x00.

Die nachstehenden Tabellen zeigen, welche Typen regelmäßig vom Heizkessel (in diesem Fall ID 0x08) und Thermostat (ID 0x17) gesendet werden. Die **Datenlänge** ist ohne den 4-Byte-Header und CRC und der **Name** bezieht sich auf die in der deutschen [EMS wiki](https://emswiki.thefischer.net/doku.php?id="wiki:ems:telegramme").

| `Source (ID)` | `Type ID` | `Name` | `Description` | `Data length` | `Frequency` |
| ------------- | ------- | ------------------- | -------------------------------------- | ----------- | ---------- |
| Boiler (0x08) | 0x34 | UBAMonitorWWMessage | Warmwassertemperatur | 19 Bytes | 10 Sekunden |
| Kessel (0x08) | 0x18 | UBAMonitorFast | Kesseltemperaturen, Leistung, gas/pump Schalter | 25 Bytes | 10 Sekunden |
| Kessel (0x08) | 0x19 | UBAMonitorSlow | Kesseltemperatur und -zeiten | 22 Bytes | 60 Sekunden |
| Boiler (0x08) | 0x1C | UBAWartungsmelding | Wartungsmeldungen | 27 Bytes | 60 Sekunden |
| Kessel (0x08) | 0x2A | n/a | Status, spezifisch für den Kesseltyp | 21 Bytes | 10 Sekunden |
| Kessel (0x08) | 0x07 | n/a | ?                                      | 21 Bytes | 30 Sekunden |

| Quelle (ID) | Typ-ID | Name | Beschreibung | Häufigkeit |
| ----------------- | ------- | ----------------- | --------------------------------------------------- | ---------- |
| Thermostat (0x17) | 0x06 | RCTime | liefert Uhrzeit und Datum des Thermostats | 60 Sekunden |
| Thermostat (0x17) | 0x91 | RC30StatusMessage | liefert aktuelle und eingestellte Temperaturen | 60 Sekunden |
| Thermostat (0x17) | 0xA3 | RCTempMessage | liefert Temperaturwerte von externen (Außen-)Sensoren | 60 Sekunden |

### EMS Lesen und Schreiben

Telegramme können nur gesendet werden, nachdem der Master (Kessel) einen Poll an das empfangende Gerät gesendet hat. Die Antwort kann ein Lesebefehl zum Anfordern von Daten oder ein Schreibbefehl zum Senden von Daten sein. Am Ende der Übertragung wird vom Client (`<ID> <BRK>`) eine Poll-Antwort gesendet, um mitzuteilen, dass alles erledigt ist und den Bus für andere Clients freizugeben.

Bei der Ausführung einer Anfrage zum Lesen von Daten ist `[src]` unser Gerät `(0x0B)` und bei `[dest]` muss das MSB (8. Bit) gesetzt sein. Angenommen, wir würden Daten vom Thermostat abfragen, dann würden wir `[dest] = 0x97` verwenden, da RC20 eine ID von 0x17 hat. In emsesp-logs wird diese Anfrage mit `R`` between`[src]`and`[dst]` angezeigt: _"Me(0x0B) R Thermostat(0x17)..."_.

Nach einer Schreibanforderung ist bei `[dest]` das 8. Bit nicht gesetzt, und nach dieser Schreibanforderung sendet das Zielgerät entweder ein einzelnes Byte 0x01 für Erfolg oder 0x04 für Fehler. In den emsesp-Protokollen wird dieses Schreiben mit `W` zwischen `[src]` und `[dst]` angezeigt: _"Me(0x0B) W Thermostat(0x17)..."_.

### Abruf von EMS-Telegrammen

Nicht alle Telegramme werden häufig gesendet, viele Einstellungstelegramme werden nur teilweise gesendet, wenn es eine Änderung gibt. Um alle Werte aus einem Telegramm zu erhalten, muss EMS-ESP eine Leseanforderung an das Gerät senden und das Gerät antwortet das Telegramm nur an emsesp, dies nennen wir "Telegramm abholen".

In `system/info` sind die Geräte mit den Handlern (Typ-IDs, die verarbeitet werden) aufgeführt:

- `handlers received`: Telegramme, die häufig vom Gerät an alle gesendet werden: _"Boiler(0x08) B All(0x00)..."_
- `handlers fetched`: Telegramme, die nicht ausgestrahlt werden und von EMS-ESP einmal pro Minute angefordert werden: _"Me(0x0B) R Boiler(0x08) .. Boiler(0x08) W Me(0x0B)..."_
- `handlers pending`: Telegramme noch nicht empfangen oder leer beim Abholen. Beispiel: ems-boilers verwendet das Telegramm 0x18 zur Überwachung der aktuellen Werte, ems+ boilers verwendet das Telegramm 0xE4 für die gleichen Informationen. Wenn Sie 0x18 in der Empfangsliste finden, haben Sie einen ems-Kessel und 0xE4 steht an.
