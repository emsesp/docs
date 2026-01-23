---
title: Installing
id: Installing
description: Getting started with EMS-ESP. What you need, how to install and do initial configuration.
---

# 📦 Installeren

Er zijn een aantal manieren om de firmware op je ESP32-apparaat te installeren:

1. De [EMS-ESP Flash Tool](https://github.com/emsesp/EMS-ESP-Flasher/releases) gebruiken. Dit is een native toepassing voor Windows, MacOS en Linux/Ubuntu. Je ESP32-apparaat moet psychisch verbonden zijn met je computer via de USB- of seriële poort.
2. Met [EMS-ESP Web Installer](https://install.emsesp.org/), een online installatieprogramma dat 16MB/PSRAM-varianten ondersteunt, moet het EMS-ESP-apparaat worden aangesloten via de USB/Serial-poort.
3. EMS-ESP direct gebruiken vanaf de WebUI-instellingenpagina om automatisch de nieuwste versie te detecteren en installeren (vanaf v3.7).
4. Gebruik een kopie van het commandoregelhulpmiddel [EMS-ESP CLI Installer](https://github.com/emsesp/EMS-ESP-Flasher-CLI). Dit is gebaseerd op Unix en ondersteunt dus geen Windows (tenzij WSL2 wordt gebruikt).
5. De firmware vanaf de broncode bouwen en direct uploaden met behulp van de handleiding op [Building](Building.md).

## De juiste firmwareversie kiezen

Er zijn kant-en-klare firmwarebestanden voor de ESP32- en ESP32-S3-chipsets. Er zijn variaties op basis van de toegewezen flashgrootte (4MB, 16MB) en of er extra PSRAM op het bord aanwezig is. Voor andere chipsets, zoals de ESP32-C3, kan de firmware handmatig worden gebouwd vanaf de broncode met PlatformIO.

Je kunt kiezen om de huidige _Stable_ of de laatste _Development_ versie te gebruiken. De stabiele versies worden meestal binnen een paar maanden bijgewerkt of gepatcht als er een kritiek probleem is gevonden. De Development-versies (met het woord `dev` in de bestandsnaam) worden vaker bijgewerkt, maar kunnen bugs bevatten. Dit wordt aanbevolen voor gevorderde gebruikers die nieuwe functies willen testen. Je kunt op elk moment van Stable naar Development overschakelen via de EMS-ESP webinterface.

### Upgraden van versies voorafgaand aan v3.7

Het wordt altijd aanbevolen om te upgraden naar de nieuwste versie van de firmware. Als u een upgrade uitvoert vanaf een versie voorafgaand aan v3.7 (v3.6.4 of v3.6.5), maak dan eerst een back-up van uw configuratie-instellingen voordat u een upgrade uitvoert voor het geval het flashproces mislukt. Dit kan gedaan worden via de EMS-ESP webinterface. Als je problemen ondervindt bij het gebruik van een van de bovenstaande flashmethoden, wis dan de EMS-ESP en begin opnieuw met een nieuwe installatie. Als u een upgrade uitvoert vanaf v3.7 of later, dan kunt u veilig upgraden zonder een back-up te hoeven maken van uw configuratie-instellingen.

### Hoe de binaire bestanden van de firmware worden genoemd

De gebruikte bestandsindeling voor firmware is:

`EMS-ESP-<version>-<chipset>-<flashsize>[+].bin`

waarbij `<chipset>` `ESP32` of `ESP32S3` is en `<flashsize>` ofwel `4MB` of `16MB`. De `+` geeft aan dat de firmware is gebouwd om eventueel extra RAM (PSRAM genoemd) te gebruiken als dat beschikbaar is.

Bepaal het juiste type van je ESP32-apparaat en download de nieuwste stabiele versie van de firmware met behulp van de onderstaande tabel. Als je niet zeker weet welke firmware je moet gebruiken, neem dan contact met ons op.

| `chipset` | `flashsize` | `PSRAM` | `Firmware file` |
| -------- | --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| ESP32 16MB 8MB [EMS-ESP-3_8_1-ESP32-16MB+.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32-16MB+.bin) |
| ESP32-S3 16MB 8MB [EMS-ESP-3_8_1-ESP32S3-16MB+.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32S3-16MB+.bin) |
| ESP32 4MB
| ESP32 16MB

Als u een [BBQKees Electronics Gateway](https://bbqkees-electronics.nl)-kaart gebruikt, volg dan deze handleiding om er zeker van te zijn dat u de juiste firmware selecteert:

| `Model` | `Release Year` | `Has PSRAM?` | `Firmware file` |
| --------------------- | ------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Gateway E32 V2 V2 >01-2024 | Ja | [EMS-ESP-3_8_1-ESP32-16MB+.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32-16MB+.bin) |
| Gateway S3(-LR) | >09-2023 | Ja | [EMS-ESP-3_8_1-ESP32S3-16MB+.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32S3-16MB+.bin) |
| Gateway E32 V1.5 | >12-21 &lt;06-23 | Nee | [EMS-ESP-3_8_1-ESP32-4MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32-4MB.bin) |
| Gateway E32 V1.0/V1.4 | >04-21 &lt;12-21 | Nee | [EMS-ESP-3_8_1-ESP32-4MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32-4MB.bin) |
| Gateway S32 V2 | >02-22 &lt;01-23 | Nee | [EMS-ESP-3_8_1-ESP32-16MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32-16MB.bin) |
| Gateway S32 V1 | >02-21 &lt;02-22 | Nee | [EMS-ESP-3_8_1-ESP32-4MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.1/EMS-ESP-3_8_1-ESP32-4MB.bin) |

MD5-Checksums zijn ook beschikbaar voor elke release. Ze hebben dezelfde bestandsnaam als het afbeeldingsbestand, maar eindigen met `.md5`. 
Je kunt ze vinden in de [GitHub-Release-Page](https://github.com/emsesp/EMS-ESP32/releases). Je kunt ze optioneel uploaden **vóór** het bin-image-bestand met de EMS-ESP-web-installer, zodat ze worden geëvalueerd vóór de installatie.

## Hulp nodig?

- Als je problemen ondervindt tijdens het installatieproces, raadpleeg dan de [Troubleshooting](Troubleshooting.md).
- Als je een BBQKees Electronics EMS gateway board gebruikt en vragen hebt over de connectiviteit, raadpleeg dan de [EMS Gateway Wiki](https://bbqkees-electronics.nl/wiki/).
- Misschien staat je probleem al vermeld in de [FAQ](FAQ.md).
- Kom in contact met de EMS-ESP-community via ons kanaal [Discord](https://discord.gg/3J3GgnzpyT). Dit is een goede plek om algemene vragen te stellen en te chatten met andere gebruikers. Je hebt hier meer kans op snelle reacties.
- Zoek in bestaande open en gesloten [GitHub issues](https://github.com/emsesp/EMS-ESP32/issues) en [GitHub discussions](https://github.com/emsesp/EMS-ESP32/discussions) omdat uw probleem mogelijk al is opgelost, misschien in een latere versie.
- Maak een [Problem Report/Change Request](https://github.com/emsesp/EMS-ESP32/issues/new?template=bug_report.md) aan op het EMS-ESP-project. Zorg ervoor dat u de vereiste ondersteuningsinformatie vermeldt, zodat het probleem zo snel mogelijk kan worden opgelost.
- Ga naar de pagina [Getting Support](Support.md) voor meer informatie.

