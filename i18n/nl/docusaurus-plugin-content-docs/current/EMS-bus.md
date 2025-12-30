---
id: EMS-bus
---
# De EMS-bus uitgelegd

Pakketten worden naar de EMS "bus" gestreamd vanaf elk ander compatibel aangesloten apparaat via seriële TTL-transmissie met protocol 9600 baud, 8N1 (8 bytes, geen pariteit, 1 stopbit). Elk pakket wordt afgesloten met een onderbrekingssignaal `<BRK>`, een 11-bits lang laag signaal van nullen.

Een pakket kan een enkele byte zijn (zie Polling hieronder) of een string van 6 of meer bytes die samen een feitelijk gegevenstelegram vormen. Een telegram voor de EMS 1.0 heeft altijd het formaat:

`[src] [dest] [type] [offset] [data] [crc] <BRK>` (Write/Broadcast)

`[src] [dest|0x80] [type] [offset] [length] [crc] <BRK>` (Lezen)

De eerste 4 bytes worden in dit document de _header_ genoemd.

Voor EMS+/EMS2.0 is het type langer dan 1 byte. De codering is:

`[src] [dest] FF [offset] [typeHigh] [typeLow] [data] [crc] <BRK>` (Write/Broadcast)

`[src] [dest|0x80] FF [offset] {length] [typeHigh] [typeLow] [crc] <BRK>` (Lezen)

En de _header_ is 6/7 bytes.

Junkers-apparaten stellen de MSB in `[src]` in op `[src|0x80]`, alle andere merken niet.

### EMS-ID's

Elk apparaat heeft een unieke ID.

In dit voorbeeld heeft een UBA-ketel een ID van 0x08 (zoals een MC10) en wordt ook wel de Bus Master genoemd.

Het circuit werkt als een servicesleutel en gebruikt daarom een ID 0x0B. Deze ID is gereserveerd voor speciale apparaten die bedoeld zijn voor servicemonteurs.

### EMS-peiling

De busmaster (boiler) stuurt elke seconde een poll-verzoek uit door een sequentiële lijst van alle mogelijke ID's als een enkele byte te verzenden, gevolgd door het break-signaal. Het ID heeft altijd zijn hoge 8e bit (MSB) ingesteld, dus in de code zoeken we naar 1 byte berichten die overeenkomen met het formaat `[dest|0x80] <BRK>`. In Junkers-apparaten is de MSB niet ingesteld.

Elk aangesloten apparaat kan reageren op een Polling verzoek met een bevestiging door een enkele byte met zijn eigen ID terug te sturen. In ons geval zouden we luisteren naar een `[0x8B] <BRK>` (dat betekent wij) en dan `[0x0B] <BRK>` terugsturen om te zeggen dat we leven en klaar zijn.

Polling is ook de trigger om te beginnen met het verzenden van pakketten die in de wachtrij staan om verzonden te worden. Dit moet binnen 200 ms gebeuren of de busmaster zal een time-out krijgen.

### EMS Uitzending

Als een apparaat naar iedereen uitzendt, is er geen specifieke bestemming nodig. `[dest]` is altijd 0x00.

De onderstaande tabellen laten zien welke typen regelmatig worden uitgezonden door de ketel (in dit geval ID 0x08) en thermostaat (ID 0x17). De **datalengte** is exclusief de 4 bytes header en CRC en de **naam** verwijst naar die in het Duitse [EMS wiki](https://emswiki.thefischer.net/doku.php?id="wiki:ems:telegramme").

| `Source (ID)` | `Type ID` | `Name` | `Description` | `Data length` | `Frequency` |
| ------------- | ------- | ------------------- | -------------------------------------- | ----------- | ---------- |
| Ketel (0x08) | 0x34 | UBAMonitorWWMessage | warm water temperatuur | 19 bytes | 10 seconden |
| Ketel (0x08) | 0x18 | UBAMonitorFast | keteltemperaturen, vermogen, gas/pompschakelaars | 25 bytes | 10 seconden |
| Ketel (0x08) | 0x19 | UBAMonitorSlow | keteltemp en timings | 22 bytes | 60 seconden |
| Ketel (0x08) | 0x1C | UBAWartungsmelding | onderhoudsberichten | 27 bytes | 60 seconden |
| Ketel (0x08) | 0x2A | n/a | status, specifiek voor keteltype | 21 bytes | 10 seconden |
| Ketel (0x08) 0x07 | n/a | ?                                      | 21 bytes | 30 seconden |

| Bron (ID) | Type ID | Naam | Beschrijving | Frequentie |
| ----------------- | ------- | ----------------- | --------------------------------------------------- | ---------- |
| Thermostaat (0x17) 0x06 RCTime Geeft de tijd en datum op de thermostaat 60 seconden weer
| Thermostaat (0x17) 0x91 RC30StatusMessage | geeft huidige en ingestelde temperaturen terug | 60 seconden |
| Thermostaat (0x17) 0xA3 RCTempMessage | geeft temperatuurwaarden terug van externe (buiten) sensoren | 60 seconden |

### EMS lezen en schrijven

Telegrammen kunnen alleen worden verzonden nadat de master (ketel) een poll naar het ontvangende apparaat heeft gestuurd. Het antwoord kan een leesopdracht zijn om gegevens op te vragen of een schrijfopdracht om gegevens te verzenden. Aan het einde van de verzending wordt een poll-antwoord verzonden door de client (`<ID> <BRK>`) om aan te geven dat we klaar zijn en de bus vrij te maken voor andere clients.

Bij het uitvoeren van een verzoek om gegevens te lezen is de `[src]` ons apparaat `(0x0B)` en moet de `[dest]` zijn MSB (8e bit) hebben ingesteld. Stel dat we gegevens opvragen van de thermostaat, dan gebruiken we `[dest] = 0x97` omdat RC20 een ID heeft van 0x17. In emsesp-logs wordt dit verzoek weergegeven met `R`` between`[src]`and`[dst]`: _"Me(0x0B) R Thermostat(0x17)..."_.

Na een schrijfopdracht heeft de `[dest]` niet de 8e bit ingesteld en na deze schrijfopdracht stuurt het bestemmingsapparaat ofwel een enkele byte 0x01 voor succes of 0x04 voor mislukking. In emsesp-logs wordt deze schrijfactie weergegeven met `W` tussen `[src]` en `[dst]`: _"Me(0x0B) W Thermostat(0x17)..."_.

### EMS-telegrammen ophalen

Niet alle telegrammen worden frequent uitgezonden, veel insteltelegrammen worden alleen gedeeltelijk uitgezonden als er een wijziging is. Om alle waarden uit een telegram te halen moet EMS-ESP een leesaanvraag naar het apparaat sturen en het apparaat antwoordt het telegram alleen aan emsesp, dit noemen we "een telegram ophalen".

In `system/info` worden de apparaten vermeld met de handlers (type-ids die worden verwerkt):

- `handlers received`: Telegrammen die vaak worden uitgezonden door een apparaat naar iedereen: _"Ketel(0x08) B Alle(0x00)..."_
- `handlers fetched`: Telegrammen die niet worden uitgezonden en één keer per minuut door EMS-ESP worden opgevraagd: _"Ik(0x0B) R Ketel(0x08) .. Ketel(0x08) W Ik(0x0B)..."_
- `handlers pending`: Telegrammen nog niet ontvangen of leeg bij ophalen. Voorbeeld: ems-ketels gebruikt telegram 0x18 om actuele waarden te controleren, ems+ketels gebruikt telegram 0xE4 voor dezelfde informatie. Als u 0x18 in de ontvangen lijst aantreft, hebt u een ems-ketel en is 0xE4 in behandeling.
