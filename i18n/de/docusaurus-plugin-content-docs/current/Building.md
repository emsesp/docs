---
id: Building
---

# Erstellen der Firmware

### Voraussetzungen

Es wird vorausgesetzt, dass Sie ein grundlegendes Verständnis für die Programmierung und Erstellung von Software für Mikrocontroller mit git und PlatformIO haben.

Zu Beginn müssen Sie die folgenden Softwarepakete installieren. Alternativ können Sie auch einen [Devcontainer](https://containers.dev/) verwenden (siehe unten):

- [PlatformIO](https://platformio.org/)
- [Node.js](https://nodejs.org)
- pnpm (`corepack use pnpm@latest-10` auf Linux oder `winget install -e --id pnpm.pnpm` auf Windows). Siehe [pnpm installation](https://pnpm.io/installation)

Visual Studio Code wird als IDE für die Verwendung mit PlatformIO empfohlen.

Besondere Hinweise für Windows-Benutzer:

- unter Windows 10 müssen Sie UTF-8 in den Ländereinstellungen aktivieren, um die slowakischen Übersetzungen zu kompilieren.

Die Standard-Targets von PlatformIO werden speziell vom GitHub CI (Continuous Integration) Prozess verwendet, um Firmware-Binaries für verschiedene ESP32-Boards zu erstellen. Diese Ziele beginnen mit "ci\_", wie in der `platformio.ini`-Datei zu sehen, und sollten nicht verwendet werden. Wenn Sie den Fehler "fatal error: WWWData.h: No such file or directory", dann verwenden Sie das falsche Ziel. Für lokale Builds erstellen Sie eine `pio_local.ini`-Datei (eine Beispieldatei wird mitgeliefert) und wählen das Zielboard, für das Sie bauen wollen. Sie können hier auch zusätzliche Flags setzen, wie DEBUG für zusätzliche Debug-Informationen oder TEST, um die Unit-Tests zu laden. Sie können auch wählen, wie Sie die Firmware hochladen möchten, über USB oder OTA.

## Testen vor Ort

### WebUI

Die WebUI kann mit Hilfe von Dummy-Daten in Echtzeit entwickelt und getestet werden. Dies ist nützlich, wenn Sie Änderungen an der Web-Benutzeroberfläche vornehmen, Übersetzungen testen oder das Verhalten bei Änderungen der Testdaten beobachten.

Erstellen Sie den Mock-API-Datendienst:

```sh
% cd mock-api
% pnpm install
```

und dann aus dem Ordner `interface` ausführen:

```sh
% pnpm standalone
```

Stellen Sie sicher, dass Sie die neueste Version von Node installiert haben. Sie benötigen mindestens 18.20 und können dies mit `node -v` überprüfen. Eine einfache Möglichkeit, zwischen verschiedenen Node-Versionen zu wechseln, ist die Verwendung von [nvm](https://github.com/nvm-sh/nvm).

Dadurch wird ein Browserfenster mit der URL `http://localhost:3000` geöffnet.

Die verwendeten Scheindaten sind alle in der Datei `/mock-api/restServer.ts` fest kodiert.

### Offline simulieren, ohne einen ESP32-Mikrocontroller

Sie können EMS-ESP auch ohne ESP32 betreiben (wir nennen das "standalone"). Die PlatformIO-Umgebung hat zwei `native`-Umgebungen, die `emsesp`-Programme erstellen, die mit Linux, Windows und Max OSX kompatibel sind.

Unter **Linux/OSX** (einschließlich Windows' `WSL2`) führen Sie einfach aus: `pio run -e standalone -t exec`

Unter **Windows** ist es etwas komplizierter, da die EMS-ESP-Konsole Winsock für die Tasteneingabe benötigt. Der einfachste Weg ist, [Msys2](https://www.msys2.org) auf Ihrem Windows-Rechner zu installieren, gefolgt von der Installation des GNU g++ Compilers direkt danach mit `run pacman -S mingw-w64-ucrt-x86_64-gcc`. Dies ist nur einmal erforderlich. Von da an können Sie den `pio`-Befehl ausführen, um die mit `pio run -e standalone` ausführbare Windows-.exe zu erstellen und sie in einem Msys-Terminal zu starten, etwa so:

`C:/msys64/msys2_shell.cmd -defterm -here -no-start -ucrt64 -c <source location>/.pio/build/standalone/program.exe`

Verwenden Sie den Befehl `test`, um Tests auszuführen. `test general` ist ein allgemeiner Test, der einen Standardkessel und einen Thermostat mit allen Standardentitäten einrichtet.

Alle Tests sind in der Datei `test/test.cpp` fest kodiert und können leicht angepasst werden.

Es gibt auch eine Reihe von Unit-Tests, die auch von der pio-Umgebung aus mit `pio run -e native-test -t exec` ausgeführt werden können. Dies funktioniert nativ auf jeder Plattform und erfordert keine zusätzlichen Einstellungen.

### Fehlersuche

So debuggen Sie von Visual Studio Code aus und gehen schrittweise durch den Code, schauen sich Variablen an, setzen Haltepunkte usw. Erstellen Sie zunächst die ausführbare Datei mit der oben beschriebenen `make`-Methode, die die .o-Objektdateien in einem `build`-Ordner ablegt, und rufen Sie dann den Debugger auf (F5 unter Windows).

Sie können auch eine VSC-Aufgabe in der `launch.json`-Datei erstellen, um dies für Sie zu automatisieren, z. B. durch Hinzufügen:

```json
    ...
    {
      "name": "Debug ems-esp standalone",
      "type": "cppdbg",
      "request": "launch",
      "program": "${workspaceFolder}/emsesp",
      "cwd": "${workspaceFolder}",
      "environment": [],
      "miDebuggerPath": "/usr/bin/gdb",
      "MIMode": "gdb",
      "launchCompleteCommand": "exec-run",
      ]
    }
    ...
```

### WSL (Aufbau einer Linux-Umgebung unter Windows)

Vor kurzem musste ich meine Linux WSL unter Windows von Grund auf neu aufbauen, um EMS-ESP zu erstellen. Ich dachte, ich würde die Schritte, die ich unternommen habe, um es zum Laufen zu bringen, mit Ihnen teilen.

Erstellen Sie eine neue WSL2-Umgebung. Beachten Sie, dass eine WSL2-Instanz bis zu 8 GB RAM beanspruchen kann. Stellen Sie also zunächst sicher, dass Ihr PC dies bewältigen kann.

- `wsl.exe -l -v`, um alle aktuellen Installationen zu sehen.
- `wsl.exe --list --online`, um die verfügbaren Installationen anzuzeigen.
- `wsl.exe -d <dist>`, um die Distro zu starten. Im Zweifelsfall verwenden Sie `Ubuntu-24.04`, da dies die neueste LTS ist.
- `lsb_release -a`, nachdem es installiert wurde, um die Version zu überprüfen.
- `do-release-upgrade` (optional), um auf die neueste Version zu aktualisieren. Ich habe ein Upgrade auf 24.10 durchgeführt. Möglicherweise müssen Sie in der `/etc/update-manager/release-upgrades`-Datei "Prompt=normal" einstellen.
- `wsl.exe --setdefault <dist name>`, um diese Installation zur Standardinstallation zu machen. Sie können `wsl.exe --terminate <dist name>` verwenden, um alle alten zu entfernen.

Rufen Sie die WSL-Instanz (`wsl`) auf und richten Sie Folgendes ein:

- `sudo apt install unzip make g++ python3-venv nodejs curl zsh`
- `sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"` (optional) zur Installation von zsh
- `npm install -g npm-check-updates` für den Befehl ncu
- `curl -fsSL https://bun.sh/install | bash` für die Mock-Api

Installieren Sie [usbipd](https://github.com/dorssel/usbipd-win/releases) über ein DOS-Admin-Befehlsfenster, um USB zu verwenden. In diesem Fenster können Sie `usbipd list` verwenden, um den COM-Port zu finden, und dann zum Beispiel `usbipd bind -b 1-6` und `usbipd attach -w -b 1-6`, um ihn mit der WSL-Instanz zu verbinden. So erhalten Sie ein `/dev/ttyUSB0`- oder `/dev/ttyACM0`-Gerät.

Führen Sie Visual Studio Code in Ihrer Windows-Umgebung aus und klicken Sie auf "Mit WSL verbinden", um eine Verbindung zur WSL-Instanz herzustellen. Sie können dann das WSL-Terminal verwenden, um die Firmware zu erstellen. Sie werden feststellen, dass das Erstellen und Kompilieren von EMS-ESP 2-3 Mal schneller ist als unter Windows.

### Verwendung eines Devcontainers für die Entwicklung

Sie können den Devcontainer lokal verwenden oder einen Codespace auf Github einrichten.

Wenn Sie den Devcontainer verwenden und die Standalone-UI ausführen, müssen Sie das Standalone-Devcontainer-Skript anstelle des Standard-Standalone-Skripts ausführen. Andernfalls ist Ihr vite-Port von Ihrem Rechner aus nicht erreichbar.

```sh
% pnpm standalone-devcontainer
```

#### Codespace

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
  - `app0` und `app1` sind die Firmware-Partitionen, die bei OTA-Updates verwendet werden, und wechseln zwischen diesen beiden Partitionen. Die Firmware wird in eine dieser nicht aktiven Partitionen geladen und dann wird das Gerät neu gebootet.
- Der Bootloader (zweite Stufe genannt) ist die ausführbare Datei `bootloader_dio_80m.bin` und wird verwendet, um die Partitionstabelle am Offset 0x8000 zu lesen und festzustellen, welche Partitionen verfügbar sind. Beachten Sie, dass der Offset des Bootloaders für jeden Chiptyp unterschiedlich ist. ESP32 ist [0x1000](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-guides/bootloader.html#bootloader) und ESP32-S3 ist [0x0000](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/bootloader.html#bootloader). Dies wird in unserem Skript `upload.sh` für jeden Modelltyp mit dem Parameter `bootloader_address` behandelt.
- Die Partition `otadata` wird für eine kleine Anwendung verwendet, die bestimmt, welche Partition (boot, app0, app1) zu verwenden ist. Sie wird die im `partitions`-Block gespeicherten Daten abfragen.
- EMS-ESP kann mit dem Befehl `restart <boot|app0|app1>` auf anderen Partitionen neu gestartet werden.
- Der EMS-ESP-Befehl Console/API `show system` zeigt die aktuelle Partition und die Partition, die nach einem Neustart gebootet wird.
- Bei allen board/chip-Typen sind `boot_app0.bin` und `partitions.bin` für jede Karte die gleiche Datei. Nur `bootloader.bin` ist anders. Aber wir behalten lokale Kopien, um in einem einzigen Ordner Ordnung zu halten.
