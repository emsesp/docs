---
id: Building
title: Building the Firmware
description: Guide to building EMS-ESP firmware from source using PlatformIO and dev containers
---

# De firmware bouwen

## Vereisten

Er wordt van uitgegaan dat je beschikt over basiskennis van het programmeren en ontwikkelen van software voor microcontrollers met behulp van Git, dat je weet hoe Node en package.json werken, en dat je enige kennis hebt van het PlatformIO-framework voor het ontwikkelen van Espressif IDF- en Arduino-projecten.

Je kunt ofwel de [dev container](https://containers.dev/) gebruiken (zie hieronder), of alles lokaal instellen. Bij gebruik op Windows wordt het ten zeerste aanbevolen om een WSL-Linux-omgeving te gebruiken, aangezien het compileren daar veel sneller verloopt dan op het standaard Windows-systeem.

Zorg ervoor dat de volgende softwarepakketten zijn geïnstalleerd:

- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io/installation)
- [pioarduino](https://github.com/pioarduino/platform-espressif32)

## De firmware bouwen

Maak eerst een lokaal PlatformIO-configuratiebestand aan door het voorbeeldbestand `pio_local.ini_example` naar `pio_local.ini` te kopiëren en dit aan te passen aan je behoeften, bijvoorbeeld door met `default_envs` het doelbord in te stellen waarvoor je wilt bouwen of door met `my_build_flags` debug-informatie toe te voegen.

Voordat je de firmware compileert, moet je eerst de distributiebestanden voor de WebUI aanmaken door ofwel `pio run -e build-webUI` vanuit de hoofdmap uit te voeren, ofwel `pnpm build-webUI ` vanuit de map `interface`. Hierdoor wordt het bestand `src/ESP32React/WWWData.h` aangemaakt, dat door de firmware wordt gebruikt.

Voer vervolgens `pio run -e <your_environment_name>` uit om de firmware te bouwen, of gewoon `pio run` als je een standaardomgeving hebt ingesteld in je `pio_local.ini`-bestand.

## De firmware uploaden

Om de firmware naar je ESP32-apparaat te uploaden, kun je het `pio run -e upload`-commando gebruiken. Er zijn twee manieren om de firmware te uploaden: via USB of via OTA. Om OTA te gebruiken, moet je ervoor zorgen dat `upload_protocol` is uitgecommentarieerd in je `pio_local.ini`-bestand; PlatformIO detecteert dan automatisch de USB (je kunt dit ook specifiek aangeven met de parameter `upload_port`). Als je OTA gebruikt, stel dan `upload_protocol` in op `custom` en `custom_emsesp_ip` op het IP-adres van je EMS-ESP-apparaat. Dit is de snelste manier om de firmware naar je apparaat te uploaden, maar hiervoor moet EMS-ESP uiteraard actief en bereikbaar zijn.

Volgens 3.10.0 is firmware die je zelf samenstelt geen officiële EMS-ESP-build. Als je deze uploadt met `pio run -t upload`, wordt deze zonder te vragen geïnstalleerd en wordt op de versiepagina "Aangepaste build" weergegeven. Als je deze in plaats daarvan via de webinterface uploadt, klik dan op "Toch installeren". Zie [Official and custom builds](FAQ#standaard-en-aangepaste-configuraties).

## Lokaal testen

### Ontwikkeling van web-UI’s

De WebUI kan in realtime worden ontwikkeld en getest met behulp van fictieve voorbeeldgegevens uit het bestand `/mock-api/restServer.ts`. Dit is handig bij het aanbrengen van wijzigingen in de WebUI, het testen van vertalingen of het observeren van het gedrag wanneer de testgegevens veranderen.

U moet een extra softwarepakket installeren, [bun](https://bun.com/docs/installation).

Om de mock-API-gegevensservice te bouwen:

```sh
cd mock-api
pnpm install
```

en voer vervolgens vanuit de map `interface` het volgende uit:

```sh
pnpm standalone
```

Hierdoor wordt een browservenster geopend met de URL `http://localhost:3000`.

### Offline simuleren, zonder een ESP32-microcontroller

Je kunt EMS-ESP ook zonder een ESP32 draaien (wat we ‘standalone’ noemen). De PlatformIO-omgeving beschikt over twee omgevingen van het type `native` waarmee je uitvoerbare bestanden van het type `emsesp` kunt bouwen die compatibel zijn met Linux, Windows en macOS.

```sh
pio run -e standalone -t exec
```

Wanneer de standalone-versie draait, zie je de EMS-ESP-console. Van hieruit kun je het `test`-commando gebruiken om tests uit te voeren. `test general` is een algemene test die een standaardboiler en -thermostaat met alle standaardentiteiten instelt. Alle tests zijn hardgecodeerd in het bestand `test/test.cpp` en kunnen eenvoudig worden aangepast.

Er is ook een reeks unit-tests die vanuit de pio-omgeving kunnen worden uitgevoerd, net als `pio run -e native-test -t exec`. Dit werkt standaard op elk platform en vereist geen extra configuratie.

### Een ontwikkelcontainer gebruiken

Je kunt de dev-container lokaal gebruiken of een codespace op GitHub opzetten. Als je de dev-container gebruikt en de standalone UI uitvoert, moet je het script `standalone-devcontainer` uitvoeren in plaats van het standaard `standalone`-script. Anders is je Vite-poort niet toegankelijk vanaf je computer.

```sh
pnpm standalone-devcontainer
```

#### GitHub Codespace

Klik op ‘Code’ en vervolgens op ‘Codespace aanmaken op dev’ om een codespace te starten die je kunt gebruiken voor het ontwikkelen, zonder dat je lokaal iets hoeft te installeren.

![Codespace start](/media/screenshot/codespace_start.jpg)

### De partitiestructuur

| Naam | Type | Subtype  | Offset | Grootte | Opmerkingen | Bestand |
| ---------- | ---- | -------- | ------------- | ------------------ | ------------------------------- | ---------------------------------- |
| bootloader | | | 0x0000/0x1000 | 0x8000 (32 KB)     | ESP32-S3=0x1000, ESP32=0x1000   | bootloader\*.bin |
| partities | | | 0x8000 | 0x1000 (4 KB) | hetzelfde voor elk bord | partities\*.bin |
| - | | | | | | |
| nvs | gegevens | nvs | 0x9000 | 0x5000 (20 KB)     | gereserveerd voor ESP32 | |
| otadata    | data | ota | 0xE000 | 0x2000 (8 KB) | hetzelfde voor elk bord | boot_app0\*.bin |
| opstart | app  | fabrieksinstellingen  | 0x10000 | 0x480000 (4,5 MB)  | standaard opstartpartitie | EMS-ESP-firmware \*.bin/loader     |
| app0 | app  | ota_0    | 0x290000 | 0x490000 (4,56 MB) | OTA-cyclus 1 | EMS-ESP-firmware \*.bin |
| app1 | app  | ota_1    | 0x510000 | 0x490000 (4,56 MB) | OTA-cyclus 2 | EMS-ESP-firmware \*.bin |
| nvs1 | gegevens | nvs | 0xAA0000 | 0x040000 (256 KB)  | op maat voor EMS-ESP | (gegenereerd door script) |
| spiffs     | data | spiffs   | 0xAA0000 | 0x200000 (2 MB)    | voor het LittleFS/EMS-ESP-bestandssysteem | (optionele inhoud van de map ‘data’) |
| coredump   | gegevens | coredump | 0xCE0000 | 0x010000 (64 KB)   | | |

- Referentie: [ESP-IDF Partition Tables](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/partition-tables.html)
- Er zijn 3 locaties waar de EMS-ESP-firmware is opgeslagen:
  - `boot` is de standaardinstelling bij nieuwe installaties.
  - `app0` en `app1` zijn de firmwarepartities die bij OTA-updates worden gebruikt; het systeem schakelt tussen deze twee partities. De firmware wordt in een van deze niet-actieve partities geladen, waarna het apparaat opnieuw wordt opgestart.
- De bootloader (ook wel ‘second stage’ genoemd) is het kleine uitvoerbare bestand dat wordt gebruikt om de partitietabel op offset 0x8000 te lezen en te bepalen welke partities beschikbaar zijn. Let op: de offset van de bootloader verschilt per chiptype. ESP32 is [0x1000](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-guides/bootloader.html#bootloader) en ESP32-S3 is [0x0000](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/bootloader.html#bootloader).
- De partitie `otadata` wordt gebruikt om een kleine toepassing op te slaan waarmee wordt bepaald welke partitie (boot, app0, app1) moet worden gebruikt. Deze toepassing haalt de gegevens op die zijn opgeslagen in het `partitions`-blok.
- EMS-ESP kan met het commando `restart <boot|app0|app1>` opnieuw worden opgestart op andere partities.
- Met het EMS-ESP-commando Console/API `show system` worden de huidige partitie en de partitie weergegeven die na een herstart zal worden opgestart.
- Bij alle board/chip-types zijn de `boot_app0.bin` en `partitions.bin` doorgaans hetzelfde bestand voor elk bord. Alleen de `bootloader.bin` is anders.
- Zie [EMS-ESP-Flasher-CLI](https://github.com/emsesp/EMS-ESP-Flasher-CLI/blob/main/README.md) voor meer informatie over de CLI-tool ‘flasher’.
- Zie ook https://docs.emsesp.org/Installing#manual-flashing-the-firmware voor informatie over het handmatig flashen van de firmware en de locatie van de .bin-bestanden.
