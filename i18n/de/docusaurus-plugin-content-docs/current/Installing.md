---
title: Installation Guide
id: Installing
description: Getting started with EMS-ESP. What you need, how to install and do initial configuration.
---

# 📦 Installieren

Es gibt eine Reihe von Möglichkeiten, die Firmware auf Ihrem ESP32-Gerät zu installieren:

1. Verwendung des [EMS-ESP Flash Tool](https://github.com/emsesp/EMS-ESP-Flasher/releases). Dies ist eine native Anwendung für Windows, MacOS und Linux/Ubuntu. Ihr ESP32-Gerät muss über den USB- oder seriellen Anschluss mit Ihrem Computer verbunden sein.
2. Mit dem [EMS-ESP Web Installer](https://install.emsesp.org/), einem Online-Installationsprogramm, das 16MB/PSRAM-Varianten unterstützt, muss das EMS-ESP-Gerät über den USB/Serial-Port angeschlossen werden.
3. Verwendung von EMS-ESP direkt von der WebUI-Einstellungsseite aus, um automatisch die neueste Version (ab v3.7) zu erkennen und zu installieren.
4. Verwendung einer Kopie des Befehlszeilen-Tools [EMS-ESP CLI Installer](https://github.com/emsesp/EMS-ESP-Flasher-CLI). Dieses Tool ist Unix-basiert und unterstützt daher Windows nicht (es sei denn, Sie verwenden WSL2).
5. Erstellen der Firmware aus dem Quellcode und direktes Hochladen mit Hilfe der Anleitung unter [Building](Building.md).

## Auswahl der richtigen Firmware-Version

Es gibt vorgefertigte Firmware-Binaries für die ESP32- und ESP32-S3-Chipsätze. Diese variieren je nach zugewiesener Flash-Größe (4MB, 16MB) und ob das Board über zusätzliches PSRAM verfügt. Für andere Chipsätze, wie z.B. den ESP32-C3, kann die Firmware manuell aus den Quellen mit PlatformIO erstellt werden.

Sie können wählen, ob Sie die aktuelle _Stable_ oder die neueste _Development_ Version verwenden möchten. Die Stable-Versionen werden in der Regel innerhalb weniger Monate aktualisiert oder gepatcht, wenn ein kritisches Problem gefunden wird. Die Entwicklungsversionen (mit dem Wort `dev` im Dateinamen) werden häufiger aktualisiert, können aber noch Fehler enthalten. Diese Version wird für fortgeschrittene Benutzer empfohlen, die neue Funktionen testen möchten. Sie können jederzeit über die EMS-ESP-Webschnittstelle von Stable auf Development umschalten.

### Upgrade von Versionen vor v3.7

Es wird empfohlen, immer auf die neueste Version der Firmware zu aktualisieren. Wenn Sie ein Upgrade von einer Version vor v3.7 (v3.6.4 oder v3.6.5) durchführen, sollten Sie vor dem Upgrade ein Backup Ihrer Konfigurationseinstellungen erstellen, für den Fall, dass der Flash-Vorgang fehlschlägt. Dies kann über die EMS-ESP-Webschnittstelle erfolgen. Wenn Sie Probleme mit einer der oben beschriebenen Flash-Methoden haben, löschen Sie das EMS-ESP und beginnen Sie mit einer Neuinstallation, und laden Sie dann Ihre gespeicherten Einstellungen hoch. Wenn Sie ein Upgrade von v3.7 oder später durchführen, können Sie das Upgrade ohne Sicherung Ihrer Konfigurationseinstellungen durchführen.

### Wie die Firmware-Binärdateien benannt sind

Der Dateiname der Firmware hat das folgende Format:

`EMS-ESP-<version>-<chipset>-<flashsize>[+].bin`

wobei `<chipset>` `ESP32` oder `ESP32S3` und `<flashsize>` entweder `4MB` oder `16MB` ist. `+` zeigt an, dass die Firmware so aufgebaut ist, dass zusätzlicher Arbeitsspeicher (PSRAM genannt) verwendet werden kann, falls vorhanden.

Bestimmen Sie den korrekten Typ Ihres ESP32-Geräts und laden Sie die neueste stabile Version der Firmware anhand der unten stehenden Tabelle herunter. Wenn Sie sich nicht sicher sind, welche Firmware Sie verwenden sollen, kontaktieren Sie uns.

| `chipset` | `flashsize` | `PSRAM` | `Firmware file` |
| -------- | --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| ESP32 | 16MB | 8MB | [EMS-ESP-3_8_0-ESP32-16MB+.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.0/EMS-ESP-3_8_0-ESP32-16MB+.bin) |
| ESP32-S3 | 16MB | 8MB | [EMS-ESP-3_8_0-ESP32S3-16MB+.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.0/EMS-ESP-3_8_0-ESP32S3-16MB+.bin) |
| ESP32 | 4MB | | [EMS-ESP-3_8_0-ESP32-4MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.0/EMS-ESP-3_8_0-ESP32-4MB.bin) |
| ESP32 | 16MB | | [EMS-ESP-3_8_0-ESP32-16MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.0/EMS-ESP-3_8_0-ESP32-16MB.bin) |

Wenn Sie eine [BBQKees Electronics Gateway](https://bbqkees-electronics.nl)-Karte verwenden, folgen Sie dieser Anleitung, um sicherzustellen, dass Sie die richtige Firmware auswählen:

| `Model` | `Release Year` | `Has PSRAM?` | `Firmware file` |
| --------------------- | ------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Gateway E32 V2 | >01-2024 | Ja | [EMS-ESP-3_8_0-ESP32-16MB+.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.0/EMS-ESP-3_8_0-ESP32-16MB+.bin) |
| Gateway S3(-LR) | >09-2023 | Ja | [EMS-ESP-3_8_0-ESP32S3-16MB+.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.0/EMS-ESP-3_8_0-ESP32S3-16MB+.bin) |
| Gateway E32 V1.5 | >12-21 &lt;06-23 | Nein | [EMS-ESP-3_8_0-ESP32-4MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.0/EMS-ESP-3_8_0-ESP32-4MB.bin) |
| Gateway E32 V1.0/V1.4 | >04-21 &lt;12-21 | Nein | [EMS-ESP-3_8_0-ESP32-4MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.0/EMS-ESP-3_8_0-ESP32-4MB.bin) |
| Gateway S32 V2 | >02-22 &lt;01-23 | Nein | [EMS-ESP-3_8_0-ESP32-16MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.0/EMS-ESP-3_8_0-ESP32-16MB.bin) |
| Gateway S32 V1 | >02-21 &lt;02-22 | Nein | [EMS-ESP-3_8_0-ESP32-4MB.bin](https://github.com/emsesp/EMS-ESP32/releases/download/v3.8.0/EMS-ESP-3_8_0-ESP32-4MB.bin) |

## Hilfe benötigt?

- Wenn Sie während der Installation auf Probleme stoßen, lesen Sie bitte den [Troubleshooting](Troubleshooting.md).
- Wenn Sie eine BBQKees Electronics EMS-Gateway-Platine verwenden und Fragen zur Konnektivität haben, lesen Sie das [EMS Gateway Wiki](https://bbqkees-electronics.nl/wiki/).
- Treten Sie mit der EMS-ESP-Community über unseren [Discord](https://discord.gg/3J3GgnzpyT)-Kanal in Kontakt. Dies ist ein guter Ort, um allgemeine Fragen zu stellen und mit anderen Benutzern zu chatten. Hier haben Sie bessere Chancen, schnelle Antworten zu erhalten.
- Suchen Sie in den bestehenden offenen und geschlossenen [GitHub issues](https://github.com/emsesp/EMS-ESP32/issues) und [GitHub discussions](https://github.com/emsesp/EMS-ESP32/discussions), da Ihr Problem möglicherweise bereits behandelt wird, vielleicht in einer späteren Version.
- Erstellen Sie ein [Problem Report/Change Request](https://github.com/emsesp/EMS-ESP32/issues/new?template=bug_report.md) auf dem EMS-ESP-Projekt. Stellen Sie sicher, dass Sie die erforderlichen Support-Informationen angeben, damit das Problem so schnell wie möglich behoben werden kann.
- Weitere Informationen finden Sie auf der Seite [Getting Support](Support.md).
