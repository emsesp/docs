---
id: Building
---

# Erstellen der Firmware

## Voraussetzungen

Es wird vorausgesetzt, dass Sie ein grundlegendes Verständnis für die Programmierung und Erstellung von Software für Mikrocontroller mit git und PlatformIO haben.

Sie können entweder den [dev container](https://containers.dev/) verwenden (siehe unten) oder alles lokal einrichten. Bei der lokalen Ausführung wird dringend empfohlen, eine Linux-Umgebung (wie WSL für Windows) zu verwenden, da die Erstellung fast dreimal schneller ist als unter Windows. Sie müssen die folgenden Softwarepakete installieren:

- [PlatformIO](https://platformio.org/)
- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io/installation)
- [VSCode](https://code.visualstudio.com/) mit git und der [pioarduino](https://github.com/pioarduino/pioarduino) Erweiterung. Die Installation von pioarduino ist wie PlatformIO IDE for VSCode. Suchen Sie nach pioarduino auf dem Visual Studio Code Marketplace und folgen Sie der Dokumentation PlatformIO IDE for VSCode, wie man es installiert.

## Erstellung der Firmware

Erstellen Sie zunächst eine lokale PlatformIO-Konfigurationsdatei, indem Sie die Beispieldatei `pio_local.ini_example` nach `pio_local.ini` kopieren, und passen Sie sie an Ihre Bedürfnisse an, indem Sie z.B. mit `default_envs` das Zielboard festlegen, für das Sie bauen wollen, oder mit `my_build_flags` Debug-Informationen hinzufügen.

Bevor Sie die Firmware erstellen, müssen Sie zunächst die WebUI-Verteilungsdateien erstellen, indem Sie entweder `pio run -e build_webUI` oder `pnpm build` aus dem Ordner `interface` ausführen. Dadurch wird die Datei `src/ESP32React/WWWData.h` erstellt, die von der Firmware verwendet wird.

Um die Firmware zu erstellen, führen Sie dann `pio run -e <your_environment_name>` oder nur `pio run` aus, wenn Sie eine Standardumgebung in Ihrer `pio_local.ini`-Datei eingestellt haben.

## Hochladen der Firmware

Um die Firmware auf Ihr ESP32-Gerät zu laden, können Sie den Befehl `pio run -e upload` verwenden. Es gibt zwei Möglichkeiten, die Firmware hochzuladen: über USB oder über OTA. Um OTA zu verwenden, stellen Sie sicher, dass `upload_protocol` in Ihrer `pio_local.ini`-Datei auskommentiert ist, dann erkennt PlatformIO automatisch den USB (Sie können auch den Parameter `upload_port` verwenden). Wenn Sie OTA verwenden, setzen Sie `upload_protocol` auf `custom` und `custom_emsesp_ip` auf die IP-Adresse Ihres EMS-ESP Gerätes. Dies ist der schnellste Weg, die Firmware auf Ihr Gerät zu laden, aber natürlich muss EMS-ESP laufen und zugänglich sein.

## Testen vor Ort

### WebUI-Entwicklung

Die WebUI kann in Echtzeit entwickelt und getestet werden, indem Scheindaten in der Datei `/mock-api/restServer.ts` verwendet werden. Dies ist nützlich, wenn Sie Änderungen an der WebUI vornehmen, Übersetzungen testen oder das Verhalten bei Änderungen der Testdaten beobachten.

Sie müssen ein zusätzliches Softwarepaket, [bun](https://bun.com/docs/installation), installieren.

Zum Aufbau des Mock-API-Datendienstes:

```sh
cd mock-api
pnpm install
```

und dann aus dem Ordner `interface` ausführen:

```sh
pnpm standalone
```

Dadurch wird ein Browserfenster mit der URL `http://localhost:3000` geöffnet.

### Offline simulieren, ohne einen ESP32-Mikrocontroller

Sie können EMS-ESP auch ohne ESP32 betreiben (wir nennen das "standalone"). Die PlatformIO-Umgebung hat zwei `native`-Umgebungen, die `emsesp`-Programme erstellen, die mit Linux, Windows und Max OSX kompatibel sind.

```sh
pio run -e standalone -t exec
```

Wenn die Standalone-Version läuft, sehen Sie die EMS-ESP-Konsole. Von hier aus können Sie den Befehl `test` verwenden, um Tests durchzuführen. `test general` ist ein allgemeiner Test, der einen Standardkessel und einen Thermostat mit all seinen Standardentitäten einrichtet. Alle Tests sind in der Datei `test/test.cpp` fest kodiert und können leicht angepasst werden.

Es gibt auch eine Reihe von Unit-Tests, die auch von der pio-Umgebung aus mit `pio run -e native-test -t exec` ausgeführt werden können. Dies funktioniert nativ auf jeder Plattform und erfordert keine zusätzlichen Einstellungen.

### Verwendung eines Entwicklungscontainers

Sie können den Dev-Container lokal verwenden oder einen Codespace auf Github einrichten. Wenn Sie den Dev-Container verwenden und die Standalone-Benutzeroberfläche ausführen, müssen Sie das Skript standalone-devcontainer anstelle des standardmäßigen Standalone-Skripts ausführen. Andernfalls wird Ihr vite-Port nicht von Ihrem Rechner aus erreichbar sein.

```sh
pnpm standalone-devcontainer
```

#### GitHub Codespace

Klicken Sie auf "Code" und "Create codespace on dev", um einen Codespace zu starten, den Sie für die Entwicklung nutzen können, ohne etwas lokal installieren zu müssen.

![Codespace start](/media/screenshot/codespace_start.jpg)

### Die Partitionsstruktur

| Name | Typ | Untertyp | Versatz | Größe | Anmerkungen | Datei |
|------------|------------|----------|---------------|--------------------|---------------------------------|---------------------------------|
| bootloader | | 0x0000/0x1000 | 0x8000 (32 KB) | ESP32-S3=0x1000, ESP32=0x1000 | bootloader*.bin |
| Partitionen | | 0x8000 | 0x1000 (4 KB) | gleich für jede Karte | Partitionen*.bin |
| - | | | | | | |
| nvs | data | nvs | 0x9000 | 0x5000 (20 KB) | reserviert für ESP32 | |
| otadata | data | ota | 0xE000 | 0x2000 (8 KB) | für jede Karte gleich | boot_app0*.bin |
| Boot | App | Werk | 0x10000 | 0x480000 (4,5 MB) | Standard-Boot-Partition | EMS-ESP-Firmware *.bin/loader |
| app0 | app | ota_0 | 0x290000 | 0x490000 (4,56 MB) | OTA-Zyklus 1 | EMS-ESP-Firmware *.bin |
| app1 | app | ota_1 | 0x510000 | 0x490000 (4,56 MB) | OTA-Zyklus 2 | EMS-ESP-Firmware *.bin |
| nvs1 | data | nvs | 0xAA0000 | 0x040000 (256 KB) | benutzerdefiniert für EMS-ESP | (durch Skript erzeugt) |
| spiffs | data | spiffs | 0xAA0000 | 0x200000 (2 MB) | für LittleFS/EMS-ESP Dateisystem | (nicht verwendet) |
| coredump | data | coredump | 0xCE0000 | 0x010000 (64 KB) | | |

- Referenz: [ESP-IDF Partition Tables](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/partition-tables.html)
- Es gibt 3 Orte, an denen die EMS-ESP-Firmware gespeichert wird:
  - `boot` ist der Standard, der bei Neuinstallationen verwendet wird.
  - `app0` und `app1` sind die Firmware-Partitionen, die bei OTA-Updates verwendet werden, und wechseln zwischen diesen beiden Partitionen. Die Firmware wird in eine dieser nicht aktiven Partitionen geladen, und dann wird das Gerät neu gebootet.
- Der Bootloader (zweite Stufe genannt) ist die ausführbare Datei `bootloader_dio_80m.bin` und wird verwendet, um die Partitionstabelle am Offset 0x8000 zu lesen und festzustellen, welche Partitionen verfügbar sind. Beachten Sie, dass der Offset des Bootloaders für jeden Chiptyp unterschiedlich ist. ESP32 ist [0x1000](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-guides/bootloader.html#bootloader) und ESP32-S3 ist [0x0000](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/bootloader.html#bootloader). Dies wird in unserem Skript `upload.sh` für jeden Modelltyp mit dem Parameter `bootloader_address` behandelt.
- Die Partition `otadata` wird für eine kleine Anwendung verwendet, die bestimmt, welche Partition (boot, app0, app1) zu verwenden ist. Sie wird die im `partitions`-Block gespeicherten Daten abfragen.
- EMS-ESP kann mit dem Befehl `restart <boot|app0|app1>` auf anderen Partitionen neu gestartet werden.
- Der EMS-ESP-Befehl Console/API `show system` zeigt die aktuelle Partition und die Partition, die nach einem Neustart gebootet wird.
- Bei allen board/chip-Typen sind `boot_app0.bin` und `partitions.bin` für jede Karte die gleiche Datei. Nur `bootloader.bin` ist anders. Aber wir behalten lokale Kopien, um in einem einzigen Ordner Ordnung zu halten.
