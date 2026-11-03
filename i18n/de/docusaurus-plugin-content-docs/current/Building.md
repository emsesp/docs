---
id: Building
title: Building the Firmware
description: Guide to building EMS-ESP firmware from source using PlatformIO and dev containers
---

# Erstellen der Firmware

## Voraussetzungen

Es wird vorausgesetzt, dass Sie über grundlegende Kenntnisse im Programmieren und in der Softwareentwicklung für Mikrocontroller unter Verwendung von Git verfügen, wissen, wie Node und package.json funktionieren, und außerdem über gewisse Kenntnisse des PlatformIO-Frameworks zur Erstellung von Espressif-IDF- und Arduino-Projekten verfügen.

Sie können entweder den Befehl [dev container](https://containers.dev/) verwenden (siehe unten) oder alles lokal einrichten. Bei der Ausführung unter Windows wird dringend empfohlen, eine WSL-Linux-Umgebung zu verwenden, da die Kompilierung dort wesentlich schneller erfolgt als unter nativem Windows.

Stellen Sie sicher, dass die folgenden Softwarepakete installiert sind:

- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io/installation)
- [pioarduino](https://github.com/pioarduino/platform-espressif32)

## Erstellen der Firmware

Erstellen Sie zunächst eine lokale PlatformIO-Konfigurationsdatei, indem Sie die Beispieldatei `pio_local.ini_example` nach `pio_local.ini` kopieren und sie an Ihre Bedürfnisse anpassen, beispielsweise indem Sie mit `default_envs` das Zielboard festlegen, für das Sie kompilieren möchten, oder mit `my_build_flags` Debug-Informationen hinzufügen.

Bevor Sie die Firmware erstellen, müssen Sie zunächst die WebUI-Distributionsdateien erstellen, indem Sie entweder `pio run -e build-webUI` aus dem Stammordner oder `pnpm build-webUI ` aus dem Ordner `interface` ausführen. Dadurch wird die Datei `src/ESP32React/WWWData.h` erstellt, die von der Firmware verwendet wird.

Um die Firmware zu erstellen, führen Sie dann `pio run -e <your_environment_name>` aus – oder einfach `pio run`, falls Sie in Ihrer `pio_local.ini`-Datei eine Standardumgebung festgelegt haben.

## Hochladen der Firmware

Um die Firmware auf Ihr ESP32-Gerät hochzuladen, können Sie den Befehl `pio run -e upload` verwenden. Es gibt zwei Möglichkeiten, die Firmware hochzuladen: über USB oder über OTA. Um OTA zu verwenden, stellen Sie sicher, dass `upload_protocol` in Ihrer `pio_local.ini`-Datei auskommentiert ist; dann erkennt PlatformIO automatisch den USB-Anschluss (Sie können dies auch mithilfe des Parameters `upload_port` festlegen). Bei Verwendung von OTA setzen Sie `upload_protocol` auf `custom` und `custom_emsesp_ip` auf die IP-Adresse Ihres EMS-ESP-Geräts. Dies ist der schnellste Weg, die Firmware auf Ihr Gerät hochzuladen, setzt jedoch voraus, dass EMS-ESP läuft und erreichbar ist.

Bei 3.10.0 handelt es sich bei einer selbst erstellten Firmware nicht um einen offiziellen EMS-ESP-Build. Wenn Sie diese mit `pio run -t upload` hochladen, wird sie ohne Rückfrage installiert, und auf der Versionsseite wird „Custom build“ angezeigt. Wenn Sie sie stattdessen über die Web-Benutzeroberfläche hochladen, klicken Sie auf „Trotzdem installieren“. Siehe [Official and custom builds](FAQ#offizielle-und-benutzerdefinierte-builds).

## Lokales Testen

### Entwicklung der Web-Benutzeroberfläche

Die Web-Benutzeroberfläche kann mithilfe von Scheindaten aus der Datei `/mock-api/restServer.ts` in Echtzeit entwickelt und getestet werden. Dies ist nützlich, wenn Änderungen an der Web-Benutzeroberfläche vorgenommen, Übersetzungen getestet oder das Verhalten bei Änderungen der Testdaten beobachtet werden sollen.

Sie müssen ein zusätzliches Softwarepaket installieren: [bun](https://bun.com/docs/installation).

So erstellen Sie den Mock-API-Datendienst:

```sh
cd mock-api
pnpm install
```

und führen Sie anschließend im Ordner `interface` folgenden Befehl aus:

```sh
pnpm standalone
```

Dadurch wird ein Browserfenster mit der URL `http://localhost:3000` geöffnet.

### Offline-Simulation ohne ESP32-Mikrocontroller

Sie können EMS-ESP auch ohne ESP32 ausführen (was wir als „Standalone“ bezeichnen). Die PlatformIO-Umgebung verfügt über zwei Umgebungen vom Typ `native`, die `emsesp`-ausführbare Dateien erstellen, die mit Linux, Windows und macOS kompatibel sind.

```sh
pio run -e standalone -t exec
```

Wenn die Standalone-Version läuft, wird die EMS-ESP-Konsole angezeigt. Von hier aus können Sie den Befehl `test` verwenden, um Tests auszuführen. `test general` ist ein allgemeiner Test, der einen Standard-Heizkessel und einen Thermostat mit allen Standard-Entitäten einrichtet. Alle Tests sind in der Datei `test/test.cpp` fest codiert und lassen sich leicht anpassen.

Außerdem gibt es eine Reihe von Unit-Tests, die ebenfalls aus der pio-Umgebung heraus mit `pio run -e native-test -t exec` ausgeführt werden können. Dies funktioniert auf jeder Plattform nativ und erfordert keine zusätzliche Einrichtung.

### Verwendung eines Entwicklungscontainers

Du kannst den Dev-Container lokal verwenden oder einen Codespace auf GitHub erstellen. Wenn du den Dev-Container verwendest und die Standalone-Benutzeroberfläche ausführst, musst du das Skript „standalone-devcontainer“ anstelle des standardmäßigen „standalone“-Skripts ausführen. Andernfalls ist dein Vite-Port von deinem Rechner aus nicht erreichbar.

```sh
pnpm standalone-devcontainer
```

#### GitHub Codespace

Klicken Sie auf „Code“ und dann auf „Codespace auf dev erstellen“, um einen Codespace zu starten, den Sie für die Entwicklung nutzen können, ohne lokal etwas installieren zu müssen.

![Codespace start](/media/screenshot/codespace_start.jpg)

### Die Partitionsstruktur

| Name | Typ | Untertyp | Offset | Größe | Anmerkungen | Datei |
| ---------- | ---- | -------- | ------------- | ------------------ | ------------------------------- | ---------------------------------- |
| Bootloader | | | 0x0000/0x1000 | 0x8000 (32 KB)     | ESP32-S3=0x1000, ESP32=0x1000   | bootloader\*.bin |
| Partitionen | | | 0x8000 | 0x1000 (4 KB) | für jede Platine gleich | partitions\*.bin |
| - | | | | | | |
| nvs | Daten | nvs | 0x9000 | 0x5000 (20 KB)     | für ESP32 reserviert | |
| otadata    | data | ota | 0xE000 | 0x2000 (8 KB) | für jede Platine gleich | boot_app0\*.bin |
| Boot | App  | Factory  | 0x10000 | 0x480000 (4,5 MB)  | Standard-Boot-Partition | EMS-ESP-Firmware \*.bin/loader     |
| app0 | app  | ota_0    | 0x290000 | 0x490000 (4,56 MB) | OTA-Zyklus 1 | EMS-ESP-Firmware \*.bin |
| app1 | app  | ota_1    | 0x510000 | 0x490000 (4,56 MB) | OTA-Zyklus 2 | EMS-ESP-Firmware \*.bin |
| nvs1 | Daten | nvs | 0xAA0000 | 0x040000 (256 KB)  | speziell für EMS-ESP | (durch Skript generiert) |
| spiffs     | data | spiffs   | 0xAA0000 | 0x200000 (2 MB)    | für das Dateisystem LittleFS/EMS-ESP | (optionaler Inhalt des Ordners „data“) |
| Coredump   | Daten | Coredump | 0xCE0000 | 0x010000 (64 KB)   | | |

- Referenz: [ESP-IDF Partition Tables](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/partition-tables.html)
- Es gibt drei Speicherorte für die EMS-ESP-Firmware:
  - `boot` ist die Standardeinstellung bei Neuinstallationen.
  - `app0` und `app1` sind die Firmware-Partitionen, die bei OTA-Updates verwendet werden, wobei zwischen den beiden hin- und hergewechselt wird. Die Firmware wird in eine dieser inaktiven Partitionen geladen, und anschließend wird das Gerät neu gestartet.
- Der Bootloader (auch als „Second Stage“ bezeichnet) ist eine kleine ausführbare Datei, die dazu dient, die Partitionstabelle am Offset 0x8000 auszulesen und festzustellen, welche Partitionen verfügbar sind. Beachten Sie, dass der Offset des Bootloaders je nach Chip-Typ unterschiedlich ist. Für den ESP32 ist er [0x1000](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-guides/bootloader.html#bootloader) und für den ESP32-S3 [0x0000](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/bootloader.html#bootloader).
- Die Partition `otadata` dient zur Speicherung einer kleinen Anwendung, mit der ermittelt wird, welche Partition (boot, app0, app1) verwendet werden soll. Sie fragt die im Block `partitions` gespeicherten Daten ab.
- EMS-ESP kann mit dem Befehl `restart <boot|app0|app1>` auf anderen Partitionen neu gestartet werden.
- Der Befehl EMS-ESP Console/API `show system` zeigt die aktuelle Partition sowie die Partition an, von der nach einem Neustart gebootet wird.
- Bei allen board/chip-Typen handelt es sich bei den `boot_app0.bin`- und `partitions.bin`-Dateien in der Regel um dieselbe Datei für jede Platine. Nur die `bootloader.bin`-Datei ist unterschiedlich.
- Weitere Informationen zum CLI-Tool „flasher“ finden Sie unter [EMS-ESP-Flasher-CLI](https://github.com/emsesp/EMS-ESP-Flasher-CLI/blob/main/README.md).
- Siehe auch https://docs.emsesp.org/Installing#manual-flashing-the-firmware für Informationen zum manuellen Flashen der Firmware und zum Speicherort der .bin-Dateien.
