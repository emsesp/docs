---
id: Building
---

# De firmware bouwen

## Vereisten

Er wordt aangenomen dat je een basiskennis hebt van coderen en het bouwen van software voor microcontrollers met behulp van git en PlatformIO.

Je kunt de [dev container](https://containers.dev/) gebruiken (zie hieronder) of alles lokaal opzetten. Als je lokaal draait, is het sterk aan te raden om een Linux omgeving te gebruiken (zoals WSL voor Windows), omdat het bijna 3 keer sneller bouwt dan op Windows. Je moet de volgende softwarepakketten installeren:

- [PlatformIO](https://platformio.org/)
- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io/installation)
- [VSCode](https://code.visualstudio.com/) met git en de [pioarduino](https://github.com/pioarduino/pioarduino) extensie. De installatie van pioarduino gaat net als PlatformIO IDE voor VSCode. Zoek naar pioarduino op de Visual Studio Code Marketplace en volg de documentatie PlatformIO IDE voor VSCode hoe te installeren.

## De firmware bouwen

Maak eerst een lokaal PlatformIO-configuratiebestand door het voorbeeldbestand `pio_local.ini_example` te kopiëren naar `pio_local.ini` en pas het aan uw behoeften aan, bijvoorbeeld door het doelbord waarvoor u wilt bouwen in te stellen met `default_envs` of debug-informatie toe te voegen met `my_build_flags`.

Voordat je de firmware bouwt, moet je eerst de WebUI-distributiebestanden maken door `pio run -e build_webUI` of `pnpm build` uit te voeren vanuit de map `interface`. Hierdoor wordt het bestand `src/ESP32React/WWWData.h` gemaakt dat door de firmware wordt gebruikt.

Voer vervolgens `pio run -e <your_environment_name>` uit om de firmware te bouwen, of alleen `pio run` als je een standaardomgeving hebt ingesteld in je `pio_local.ini`-bestand.

## De firmware uploaden

Om de firmware te uploaden naar je ESP32-apparaat kun je het `pio run -e upload` commando gebruiken. Er zijn twee manieren om de firmware te uploaden: via USB of via OTA. Als je OTA wilt gebruiken, zorg er dan voor dat `upload_protocol` is uitgecommentarieerd in je `pio_local.ini` bestand en dan zal PlatformIO automatisch de USB detecteren (je kunt ook specifiek de `upload_port` parameter gebruiken). Bij gebruik van OTA stel je `upload_protocol` in op `custom` en `custom_emsesp_ip` op het IP-adres van je EMS-ESP apparaat. Dit is de snelste manier om de firmware naar je apparaat te uploaden, maar uiteraard moet EMS-ESP actief en toegankelijk zijn.

## Lokaal testen

### WebUI-ontwikkeling

De WebUI kan in realtime worden ontwikkeld en getest met behulp van nepgegevens in het bestand `/mock-api/restServer.ts`. Dit is handig wanneer je wijzigingen aanbrengt in de WebUI, vertalingen test of het gedrag bekijkt wanneer testgegevens veranderen.

Je moet een extra softwarepakket installeren, [bun](https://bun.com/docs/installation).

De mock API-dataservice bouwen:

```sh
cd mock-api
pnpm install
```

en dan vanuit de map `interface` uitvoeren:

```sh
pnpm standalone
```

Dit opent een browservenster met URL `http://localhost:3000`.

### Offline simuleren, zonder ESP32-microcontroller

Je kunt EMS-ESP ook uitvoeren zonder ESP32 (wat we 'standalone' noemen). De PlatformIO-omgeving heeft twee `native` type omgevingen die `emsesp` uitvoerbare bestanden bouwen die compatibel zijn met Linux, Windows en Max OSX.

```sh
pio run -e standalone -t exec
```

Als de standalone draait, zie je de EMS-ESP Console. Vanaf hier kun je het `test` commando gebruiken om testen uit te voeren. `test general` is een generieke test die een standaard boiler en thermostaat opzet met alle standaard entiteiten. Alle tests zijn hard gecodeerd in het bestand `test/test.cpp` en kunnen eenvoudig worden aangepast.

Er is ook een set Unit Tests die ook vanuit de pio-omgeving kunnen worden uitgevoerd met `pio run -e native-test -t exec`. Dit werkt op elk platform en vereist geen extra instellingen.

### Een ontwikkelcontainer gebruiken

Je kunt de dev container lokaal gebruiken of een codespace op github opzetten. Als je de dev container gebruikt en de standalone UI draait, moet je het standalone-devcontainer script draaien in plaats van het standaard standalone script. Anders is je vite-poort niet toegankelijk vanaf je machine.

```sh
pnpm standalone-devcontainer
```

#### GitHub-codeerruimte

Klik op "Code" en de "Create codespace on dev" om een codespace te starten die je kunt gebruiken om te ontwikkelen zonder lokaal iets te installeren.

![Codespace start](/media/screenshot/codespace_start.jpg)

### De partitiestructuur

| Naam | Type | Subtype | Offset | Grootte | Notities | Bestand |
|------------|------------|----------|---------------|--------------------|---------------------------------|---------------------------------|
| 0x0000/0x1000 | 0x8000 (32 KB) | ESP32-S3=0x1000, ESP32=0x1000 | bootloader*.bin |
| partities | | 0x8000 | 0x1000 (4 KB) | hetzelfde voor elk bord | partitions*.bin |
| - | | | | | | |
| nvs | data | nvs | 0x9000 | 0x5000 (20 KB) | gereserveerd voor ESP32 | |
| otadata | data | ota | 0xE000 | 0x2000 (8 KB) | hetzelfde voor elk bord | boot_app0*.bin |
| app | fabriek | 0x10000 | 0x480000 (4,5 MB) | standaard opstartpartitie | EMS-ESP-firmware *.bin/loader |
| app0 | app | ota_0 | 0x290000 | 0x490000 (4,56 MB) | OTA cyclus 1 | EMS-ESP firmware *.bin |
| app1 | app | ota_1 | 0x510000 | 0x490000 (4,56 MB) | OTA cyclus 2 | EMS-ESP firmware *.bin |
| nvs1 | data | nvs | 0xAA0000 | 0x040000 (256 KB) | aangepast voor EMS-ESP | (gegenereerd door script) |
| spiffs | data | spiffs | 0xAA0000 | 0x200000 (2 MB) | voor LittleFS/EMS-ESP bestandssysteem | (niet gebruikt) |
| coredump | data | coredump | 0xCE0000 | 0x010000 (64 KB) | | | |

- Referentie: [ESP-IDF Partition Tables](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/partition-tables.html)
- Er zijn 3 plaatsen waar de EMS-ESP-firmware wordt opgeslagen:
  - `boot` wordt standaard gebruikt bij nieuwe installaties.
  - `app0` en `app1` zijn de firmwarepartities die worden gebruikt tijdens OTA-updates en wisselen tussen de twee. De firmware wordt in een van deze niet-actieve partities geladen en vervolgens wordt het apparaat opnieuw opgestart.
- De bootloader (de zogenaamde tweede trap) is de `bootloader_dio_80m.bin` executable en wordt gebruikt om de partitietabel op offset 0x8000 te lezen en te bepalen welke partities beschikbaar zijn. Merk op dat de offset van de bootloader verschilt per chiptype. ESP32 is [0x1000](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-guides/bootloader.html#bootloader) en ESP32-S3 is [0x0000](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/bootloader.html#bootloader). Dit wordt afgehandeld in ons script `upload.sh` voor elk modeltype in de parameter `bootloader_address`.
- De partitie `otadata` wordt gebruikt om een kleine applicatie te bevatten die gebruikt wordt om te bepalen welke partitie (boot, app0, app1) gebruikt moet worden. Deze bevraagt de gegevens die zijn opgeslagen in het blok `partitions`.
- EMS-ESP kan opnieuw worden opgestart naar andere partities met het commando `restart <boot|app0|app1>`.
- Het EMS-ESP commando Console/API `show system` toont de huidige partitie en de partitie die wordt opgestart na een herstart.
- Bij alle board/chip-typen zijn de `boot_app0.bin` en `partitions.bin` hetzelfde bestand voor elk bord. Alleen de `bootloader.bin` is anders. Maar we bewaren lokale kopieën om alles netjes in één map te houden.
