---
title: Installing
id: Installing
description: Getting started with EMS-ESP. What you need, how to install and do initial configuration.
---

import { StableVersion, DevVersion, FirmwareLink } from '@site/src/components/LatestReleases';

# 📦 Installeren

Er zijn een aantal manieren om de firmware op je ESP32-apparaat te installeren en bij te werken:

1. Als je EMS-ESP al hebt draaien, ga dan naar de Instellingen->Versie pagina in de WebUI en je kunt ervoor kiezen om de laatste firmware versie te downloaden en handmatig te installeren door drag&dropping in het upload vak of laat EMS-ESP automatisch updaten. Dit is de aanbevolen methode voor de meeste gebruikers.
2. De [EMS-ESP Flash Tool](https://github.com/emsesp/EMS-ESP-Flasher/releases) gebruiken. Dit is een native toepassing voor Windows, MacOS en Linux. Je ESP32-apparaat moet psychisch verbonden zijn met je computer via de USB- of seriële poort. Deze methode is handig als je een schone installatie wilt uitvoeren en alle configuratie-instellingen opnieuw wilt instellen.
3. Met [EMS-ESP Web Installer](https://install.emsesp.org/), een online installatieprogramma dat ondersteuning biedt, moet het EMS-ESP-apparaat worden aangesloten via de poort USB/Serial.
4. Flash de firmware handmatig met de [guide](#manual-flashing) hieronder.
5. Voor ontwikkelaars: bouw de firmware vanaf de broncode en upload deze direct door de handleiding op [Building](Building.md) te volgen.

## De juiste firmwareversie kiezen

De laatste stabiele versie van de firmware is <StableVersion /> en de laatste ontwikkelingsversie is <DevVersion />.

Er zijn kant-en-klare firmwarebestanden voor de ESP32- en ESP32-S3-chipsets. Er zijn variaties op basis van de toegewezen flashgrootte (4MB, 16MB) en of er extra PSRAM op het bord aanwezig is. Voor andere chipsets, zoals de ESP32-C3, kan de firmware handmatig worden gebouwd vanaf de broncode met PlatformIO.

Je kunt kiezen om de huidige _Stable_ of de laatste _Development_ versie te gebruiken. De stabiele versies worden meestal binnen een paar maanden bijgewerkt of gepatcht als er een kritiek probleem is gevonden. De Development-versies (met het woord `dev` in de bestandsnaam) worden vaker bijgewerkt, maar kunnen bugs bevatten. Dit wordt aanbevolen voor gevorderde gebruikers die nieuwe functies willen testen. Je kunt op elk moment van Stable naar Development overschakelen via de EMS-ESP webinterface.

## Upgraden van versies voorafgaand aan v3.7

Het wordt altijd aanbevolen om te upgraden naar de nieuwste versie van de firmware. Als u een upgrade uitvoert vanaf een versie voorafgaand aan v3.7 (v3.6.4 of v3.6.5), maak dan eerst een back-up van uw configuratie-instellingen voordat u een upgrade uitvoert voor het geval het flashproces mislukt. Dit kan gedaan worden via de EMS-ESP webinterface. Als je problemen ondervindt bij het gebruik van een van de bovenstaande flashmethoden, wis dan de EMS-ESP en begin opnieuw met een nieuwe installatie. Als u een upgrade uitvoert vanaf v3.7 of later, dan kunt u veilig upgraden zonder een back-up te hoeven maken van uw configuratie-instellingen.

## Hoe de binaire bestanden van de firmware heten

De gebruikte bestandsindeling voor firmware is:

`EMS-ESP-<version>-<chipset>-<flashsize>[+].bin`

waarbij `<chipset>` `ESP32` of `ESP32S3` is en `<flashsize>` ofwel `4MB` of `16MB`. De `+` geeft aan dat de firmware is gebouwd om eventueel extra RAM (PSRAM genoemd) te gebruiken als dat beschikbaar is.

Bepaal het juiste type van je ESP32-apparaat en download de nieuwste stabiele versie van de firmware met behulp van de onderstaande tabel. Als je niet zeker weet welke firmware je moet gebruiken, neem dan contact met ons op.

| `chipset` | `flashsize` | `PSRAM` | `Firmware file` |
| --------- | ----------- | ------- | ---------------------------------------- |
| ESP32 16MB 8MB <FirmwareLink variant="ESP32-16MB+" /> |
| ESP32-S3 16MB 8MB <FirmwareLink variant="ESP32S3-16MB+" /> |
| ESP32 4MB
| ESP32 16MB

Als u een [BBQKees Electronics Gateway](https://bbqkees-electronics.nl)-kaart gebruikt, volg dan deze handleiding om er zeker van te zijn dat u de juiste firmware selecteert:

| `Model` | `Release Year` | `Has PSRAM?` | `Firmware file` |
| --------------------- | ---------------- | ------------ | ---------------------------------------- |
| Gateway E32 V2 V2 >01-2024 | Ja | <FirmwareLink variant="ESP32-16MB+" /> |
| Gateway S3(-LR) | >09-2023 | Ja | <FirmwareLink variant="ESP32S3-16MB+" /> |
| Gateway E32 V1.5 | >12-21 &lt;06-23 | Nee | <FirmwareLink variant="ESP32-4MB" /> |
| Gateway E32 V1.0/V1.4 | >04-21 &lt;12-21 | Nee | <FirmwareLink variant="ESP32-4MB" /> |
| Gateway S32 V2 | >02-22 &lt;01-23 | Nee | <FirmwareLink variant="ESP32-16MB" /> |
| Gateway S32 V1 | >02-21 &lt;02-22 | Nee | <FirmwareLink variant="ESP32-4MB" /> |

MD5-Checksums zijn ook beschikbaar voor elke release. Ze hebben dezelfde bestandsnaam als het image-bestand, maar eindigt met `.md5`. Ze kunnen worden gevonden op de [GitHub-Release-Page](https://github.com/emsesp/EMS-ESP32/releases). Je kunt ze optioneel uploaden **vóór** het bin-image-bestand met behulp van de EMS-ESP-web-installer, zodat ze worden geëvalueerd vóór de installatie.

## De firmware handmatig flashen

Als je een aangepaste firmware gebruikt of de firmware handmatig wilt flashen, kun je de volgende handleiding gebruiken:

1. Bepaal het ESP32-bordprofiel dat je gebruikt:
   - `s_4M`: ESP met 4 MB flash - bijv. BBQKees oudere S32- en E32-modellen
   - `s_16M`: ESP met 16 MB flash - bijvoorbeeld BBQKees latere S32 V2-modellen
   - `s_16M_P`: ESP met 16 MB flash en PSRAM - bijvoorbeeld BBQKees E32V2-modellen
   - `s3_16M_P`: ESP32-S3 met 16 MB flash en PSRAM - bijvoorbeeld BBQKees S3-modellen
   - Voor alle andere borden is het aanbevolen om platformio rechtstreeks te gebruiken om de firmware te bouwen en te uploaden vanaf de broncode.
2. Download het binaire bestand van de firmware via de bovenstaande koppelingen of gebruik de GitHub Releases pagina ([dev releases](https://github.com/emsesp/EMS-ESP32/releases) of [stable releases](https://github.com/emsesp/EMS-ESP32/releases)).
3. Download deze 3 binaire bestanden die bij je boardprofiel horen:
   - `s_4M`
     - [bootloader.bin](/bin/s_4M/bootloader.bin)
     - [partitions.bin](/bin/s_4M/partitions.bin)
     - [boot_app0.bin](/bin/boot_app0.bin)
   - `s_16M`
     - [bootloader.bin](/bin/s_16M/bootloader.bin)
     - [partitions.bin](/bin/s_16M/partitions.bin)
     - [boot_app0.bin](/bin/boot_app0.bin)
   - `s_16M_P`
     - [bootloader.bin](/bin/s_16M_P/bootloader.bin)
     - [partitions.bin](/bin/s_16M_P/partitions.bin)
     - [boot_app0.bin](/bin/boot_app0.bin)
   - `s3_16M_P`
     - [bootloader.bin](/bin/s3_16M_P/bootloader.bin)
     - [partitions.bin](/bin/s3_16M_P/partitions.bin)
     - [boot_app0.bin](/bin/boot_app0.bin)
4. Installeer [esptool](https://docs.espressif.com/projects/esptool/en/latest/esp32/). Je kunt OS-specifieke binairen downloaden van [here](https://github.com/espressif/esptool/releases) of Python gebruiken zoals `pip install esptool`.
5. Sluit het ESP32/Gateway bord aan op uw computer via de USB-poort.
6. Open een terminal en navigeer naar de map waar de .bin-bestanden zijn gedownload.
7. Voer het volgende commando uit om de firmware te flashen, afhankelijk van het type bord:

#### s_4M (ESP met 4MB flash) - bijv. BBQKees oudere S32- en E32-modellen

`esptool --chip esp32 --port <COM PORT> --baud 460800 --before default-reset --after hard-reset write-flash -z --flash-mode dio --flash-freq 40m --flash-size detect 0x1000
 bootloader.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x10000 <FIRMWARE BIN FILE>`

#### s_16M (ESP met 16 MB flash) - bijv. BBQKees latere S32 V2-modellen

`esptool --chip esp32 --port <COM PORT> --baud 460800 --before default-reset --after hard-reset write-flash -z --flash-mode dio --flash-freq 40m --flash-size detect 0x1000
 bootloader.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x490000 <FIRMWARE BIN FILE>`

#### s_16M_P (ESP met 16 MB flash en PSRAM) - bijv. BBQKees E32V2-modellen

`esptool --chip esp32 --port <COM PORT> --baud 460800 --before default-reset --after hard-reset write-flash -z --flash-mode dio --flash-freq 80m --flash-size detect 0x1000
 bootloader.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x490000 <FIRMWARE BIN FILE>`

#### s3_16M_P (ESP32-S3 met 16 MB flash en PSRAM) - bijv. BBQKees S3-modellen

`esptool --chip esp32s3 --port <COM PORT> --baud 460800 --before default-reset --after hard-reset write-flash -z --flash-mode dio --flash-freq 80m --flash-size detect 0x0000
 bootloader.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x490000  <FIRMWARE BIN FILE>`

## Hulp nodig?

- Als je problemen ondervindt tijdens het installatieproces, raadpleeg dan de [Troubleshooting](Troubleshooting.md).
- Als je een BBQKees Electronics EMS gateway board gebruikt en vragen hebt over de connectiviteit, raadpleeg dan de [EMS Gateway Wiki](https://bbqkees-electronics.nl/wiki/).
- Misschien staat je probleem al vermeld in de [FAQ](FAQ.md).
- Kom in contact met de EMS-ESP-community via ons kanaal [Discord](https://discord.gg/GP9DPSgeJq). Dit is een goede plek om algemene vragen te stellen en te chatten met andere gebruikers. Je hebt hier meer kans op snelle reacties.
- Zoek in bestaande open en gesloten [GitHub issues](https://github.com/emsesp/EMS-ESP32/issues) en [GitHub discussions](https://github.com/emsesp/EMS-ESP32/discussions) omdat uw probleem mogelijk al is opgelost, misschien in een latere versie.
- Maak een [Problem Report/Change Request](https://github.com/emsesp/EMS-ESP32/issues/new?template=bug_report.md) aan op het EMS-ESP-project. Zorg ervoor dat u de vereiste ondersteuningsinformatie vermeldt, zodat het probleem zo snel mogelijk kan worden opgelost.
- Ga naar de pagina [Getting Support](Support.md) voor meer informatie.
