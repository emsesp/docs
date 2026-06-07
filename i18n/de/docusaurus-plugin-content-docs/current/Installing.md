---
title: Installing
id: Installing
description: Getting started with EMS-ESP. What you need, how to install and do initial configuration.
---

import { StableVersion, DevVersion, FirmwareLink } from '@site/src/components/LatestReleases';

# 📦 Installieren

Es gibt eine Reihe von Möglichkeiten, die Firmware auf Ihrem ESP32-Gerät zu installieren und zu aktualisieren:

- Wenn Sie EMS-ESP bereits im Einsatz haben, gehen Sie auf die Seite Einstellungen->Version in der WebUI und wählen Sie entweder den Download und das automatische Upgrade auf die neueste Firmware-Version oder installieren Sie die Version manuell, indem Sie die .bin-Datei in das Upload-Feld ziehen.
- Verwendung des [EMS-ESP Flash Tool](https://github.com/emsesp/EMS-ESP-Flasher/releases). Dies ist eine native Anwendung für Windows, MacOS und Linux. Ihr ESP32-Gerät muss über den USB- oder seriellen Anschluss mit Ihrem Computer verbunden sein. Diese Methode ist nützlich, wenn Sie eine saubere Installation durchführen und alle Konfigurationseinstellungen zurücksetzen möchten.
- Mit dem [EMS-ESP Web Installer](https://install.emsesp.org/), einer Online-Installationsunterstützung, die den Anschluss des EMS-ESP-Geräts über den USB/Serial-Port erfordert.
- Mit dem [EMS-ESP Flasher CLI](https://github.com/emsesp/EMS-ESP-Flasher-CLI/blob/main/README.md), einem Befehlszeilentool für Windows, MacOS und Linux. Dieses Tool ist selbsterklärend und die flexibelste Methode, um jede Version der stabilen oder Entwicklungs-Firmware-Releases herunterzuladen.
- Flashen Sie die Firmware manuell mit Hilfe des unten stehenden [guide](#manual-flashing).
- Erfahrene Entwickler können die Firmware aus dem Quellcode erstellen und direkt hochladen, indem sie die Anleitung unter [Building](Building.md) befolgen.

## Auswahl der richtigen Firmware-Version

Die letzte stabile Version der Firmware ist <StableVersion /> und die letzte Entwicklungsversion ist <DevVersion />.

Es gibt vorgefertigte Firmware-Binaries für die ESP32- und ESP32-S3-Chipsätze. Diese variieren je nach zugewiesener Flash-Größe (4MB, 16MB) und ob das Board über zusätzliches PSRAM verfügt. Für andere Chipsätze, wie z.B. den ESP32-C3, kann die Firmware manuell aus den Quellen mit PlatformIO erstellt werden.

Sie können wählen, ob Sie die aktuelle _Stable_ oder die neueste _Development_ Version verwenden möchten. Die Stable-Versionen werden in der Regel innerhalb weniger Monate aktualisiert oder gepatcht, wenn ein kritisches Problem gefunden wird. Die Entwicklungsversionen (mit dem Wort `dev` im Dateinamen) werden häufiger aktualisiert, können aber noch Fehler enthalten. Diese Version wird für fortgeschrittene Benutzer empfohlen, die neue Funktionen testen möchten. Sie können jederzeit über die EMS-ESP-Webschnittstelle von Stable zu Development wechseln.

## Aktualisierung von Versionen vor v3.7

Es wird empfohlen, immer auf die neueste Version der Firmware zu aktualisieren. Wenn Sie ein Upgrade von einer Version vor v3.7 (v3.6.4 oder v3.6.5) durchführen, sollten Sie vor dem Upgrade ein Backup Ihrer Konfigurationseinstellungen erstellen, für den Fall, dass der Flash-Vorgang fehlschlägt. Dies kann über die EMS-ESP-Webschnittstelle erfolgen. Wenn Sie Probleme mit einer der oben beschriebenen Flash-Methoden haben, löschen Sie das EMS-ESP und beginnen Sie mit einer Neuinstallation, und laden Sie dann Ihre gespeicherten Einstellungen hoch. Wenn Sie ein Upgrade von v3.7 oder später durchführen, können Sie das Upgrade ohne Sicherung Ihrer Konfigurationseinstellungen durchführen.

## Wie die Binärdateien der Firmware benannt sind

Der Dateiname der Firmware hat das folgende Format:

`EMS-ESP-<version>-<chipset>-<flashsize>[+].bin`

wobei `<chipset>` `ESP32` oder `ESP32S3` und `<flashsize>` entweder `4MB` oder `16MB` ist. `+` zeigt an, dass die Firmware so aufgebaut ist, dass zusätzlicher Arbeitsspeicher (PSRAM genannt) verwendet werden kann, falls vorhanden.

Bestimmen Sie den korrekten Typ Ihres ESP32-Geräts und laden Sie die neueste stabile Version der Firmware anhand der unten stehenden Tabelle herunter. Wenn Sie sich nicht sicher sind, welche Firmware Sie verwenden sollen, kontaktieren Sie uns.

| `chipset` | `flashsize` | `PSRAM` | `Firmware file` |
| --------- | ----------- | ------- | ---------------------------------------- |
| ESP32 | 16MB | 8MB | <FirmwareLink variant="ESP32-16MB+" /> |
| ESP32-S3 | 16MB | 8MB | <FirmwareLink variant="ESP32S3-16MB+" /> |
| ESP32 | 4MB | | <FirmwareLink variant="ESP32-4MB" /> |
| ESP32 | 16MB | | <FirmwareLink variant="ESP32-16MB" /> |

Wenn Sie eine [BBQKees Electronics Gateway](https://bbqkees-electronics.nl)-Karte verwenden, folgen Sie dieser Anleitung, um sicherzustellen, dass Sie die richtige Firmware auswählen:

| `Model` | `Release Year` | `Has PSRAM?` | `Firmware file` |
| --------------------- | ---------------- | ------------ | ---------------------------------------- |
| Gateway E32 V2 | >01-2024 | Ja | <FirmwareLink variant="ESP32-16MB+" /> |
| Gateway S3(-LR) | >09-2023 | Ja | <FirmwareLink variant="ESP32S3-16MB+" /> |
| Gateway E32 V1.5 | >12-21 &lt;06-23 | Nein | <FirmwareLink variant="ESP32-4MB" /> |
| Gateway E32 V1.0/V1.4 | >04-21 &lt;12-21 | Nein | <FirmwareLink variant="ESP32-4MB" /> |
| Gateway S32 V2 | >02-22 &lt;01-23 | Nein | <FirmwareLink variant="ESP32-16MB" /> |
| Gateway S32 V1 | >02-21 &lt;02-22 | Nein | <FirmwareLink variant="ESP32-4MB" /> |

MD5-Prüfsummen sind ebenfalls für jede Version verfügbar. Sie haben den gleichen Dateinamen wie die Image-Datei, enden aber mit `.md5`. Sie finden sie unter [GitHub-Release-Page](https://github.com/emsesp/EMS-ESP32/releases). Sie können sie optional **vor** der bin-image-Datei mit dem EMS-ESP-web-installer hochladen, damit sie vor der Installation ausgewertet werden.

## Manuelles Flashen der Firmware

Wenn Sie eine benutzerdefinierte Firmware verwenden oder die Firmware manuell flashen möchten, können Sie die folgende Anleitung verwenden:

1. Bestimmen Sie das Profil des ESP32-Boards, das Sie verwenden:
   - `s_4M`: ESP mit 4MB Flash - z.B. BBQKees ältere S32 und E32 Modelle
   - `s_16M`: ESP mit 16MB Flash - z.B. BBQKees spätere S32 V2 Modelle
   - `s_16M_P`: ESP mit 16MB Flash und PSRAM - z.B. BBQKees E32V2 Modelle
   - `s3_16M_P`: ESP32-S3 mit 16MB Flash und PSRAM - z.B. BBQKees S3 Modelle
   - Für alle anderen Boards wird empfohlen, Platformio direkt zu verwenden, um die Firmware aus dem Quellcode zu erstellen und hochzuladen.
2. Laden Sie die Firmware-Binärdatei über die obigen Links herunter oder verwenden Sie die GitHub-Releaseseite ([dev releases](https://github.com/emsesp/EMS-ESP32/releases) oder [stable releases](https://github.com/emsesp/EMS-ESP32/releases)).
3. Laden Sie diese 3 Binärdateien herunter, die mit Ihrem Boardprofil verbunden sind:
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
4. Installieren Sie [esptool](https://docs.espressif.com/projects/esptool/en/latest/esp32/). Sie können betriebssystemspezifische Binärdateien von [here](https://github.com/espressif/esptool/releases) herunterladen oder Python wie `pip install esptool` verwenden.
5. Schließen Sie die ESP32/Gateway-Karte über den USB-Anschluss an Ihren Computer an.
6. Öffnen Sie ein Terminal und navigieren Sie zu dem Verzeichnis, in das die .bin-Dateien heruntergeladen wurden.
7. Führen Sie den folgenden Befehl aus, um die Firmware je nach Boardtyp zu flashen:

#### s_4M (ESP mit 4MB Flash) - z.B. BBQKees ältere S32 und E32 Modelle

`esptool --chip esp32 --port <COM PORT> --baud 460800 --before default-reset --after hard-reset write-flash -z --flash-mode dio --flash-freq 40m --flash-size detect 0x1000
 bootloader.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x10000 <FIRMWARE BIN FILE>`

#### s_16M (ESP mit 16MB Flash) - z.B. BBQKees spätere S32 V2 Modelle

`esptool --chip esp32 --port <COM PORT> --baud 460800 --before default-reset --after hard-reset write-flash -z --flash-mode dio --flash-freq 40m --flash-size detect 0x1000
 bootloader.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x490000 <FIRMWARE BIN FILE>`

#### s_16M_P (ESP mit 16MB Flash und PSRAM) - z.B. BBQKees E32V2 Modelle

`esptool --chip esp32 --port <COM PORT> --baud 460800 --before default-reset --after hard-reset write-flash -z --flash-mode dio --flash-freq 80m --flash-size detect 0x1000
 bootloader.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x490000 <FIRMWARE BIN FILE>`

#### s3_16M_P (ESP32-S3 mit 16MB Flash und PSRAM) - z.B. BBQKees S3 Modelle

`esptool --chip esp32s3 --port <COM PORT> --baud 460800 --before default-reset --after hard-reset write-flash -z --flash-mode dio --flash-freq 80m --flash-size detect 0x0000
 bootloader.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x490000  <FIRMWARE BIN FILE>`

## Hilfe benötigt?

- Wenn Sie während der Installation auf Probleme stoßen, lesen Sie bitte den [Troubleshooting](Troubleshooting.md).
- Wenn Sie eine BBQKees Electronics EMS-Gateway-Platine verwenden und Fragen zur Konnektivität haben, lesen Sie den [EMS Gateway Wiki](https://bbqkees-electronics.nl/wiki/).
- Vielleicht ist Ihr Problem bereits im [FAQ](FAQ.md) aufgeführt.
- Treten Sie mit der EMS-ESP-Community über unseren [Discord](https://discord.gg/GP9DPSgeJq)-Kanal in Kontakt. Dies ist ein guter Ort, um allgemeine Fragen zu stellen und mit anderen Benutzern zu chatten. Hier haben Sie bessere Chancen, schnelle Antworten zu erhalten.
- Suchen Sie in den bestehenden offenen und geschlossenen [GitHub issues](https://github.com/emsesp/EMS-ESP32/issues) und [GitHub discussions](https://github.com/emsesp/EMS-ESP32/discussions), da Ihr Problem möglicherweise bereits behandelt wird, vielleicht in einer späteren Version.
- Erstellen Sie ein [Problem Report/Change Request](https://github.com/emsesp/EMS-ESP32/issues/new?template=bug_report.md) im EMS-ESP-Projekt. Stellen Sie sicher, dass Sie die erforderlichen Support-Informationen angeben, damit das Problem so schnell wie möglich behoben werden kann.
- Weitere Informationen finden Sie auf der Seite [Getting Support](Support.md).
