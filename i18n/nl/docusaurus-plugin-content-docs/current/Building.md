---
id: Building
---
# De firmware bouwen

### Vereisten

Er wordt aangenomen dat je een basiskennis hebt van coderen en het bouwen van software voor microcontrollers met behulp van git en PlatformIO.

Om te beginnen moet je de volgende softwarepakketten geïnstalleerd hebben. Je kunt ook een [Devcontainer](https://containers.dev/) gebruiken (zie hieronder):

- [PlatformIO](https://platformio.org/)
- [Node.js](https://nodejs.org)
- pnpm (`corepack use pnpm@latest-10` op linux of `winget install -e --id pnpm.pnpm` op windows). Zie [pnpm installation](https://pnpm.io/installation)

Visual Studio Code wordt aanbevolen als IDE voor PlatformIO.

Speciale opmerkingen voor Windows-gebruikers:

- op Windows 10 moet je UTF-8 inschakelen via de regionale instellingen om de Slowaakse vertalingen te kunnen compileren.

PlatformIO's standaard targets worden specifiek gebruikt door het GitHub CI (Continuous Integration) proces om firmware binaries te bouwen voor verschillende ESP32 borden. Deze targets beginnen met 'ci_' zoals te zien is in het `platformio.ini` bestand en moeten niet gebruikt worden. Als u de foutmelding "fatal error: WWWData.h: No such file or directory" dan gebruikt u het verkeerde doel. Voor lokale builds maakt u een `pio_local.ini` bestand (een voorbeeldbestand wordt meegeleverd) en kiest u het target board waarvoor u wilt bouwen. U kunt hier ook extra vlaggen instellen zoals DEBUG voor extra debug-informatie of TEST om de unit tests te laden. Je kunt ook kiezen hoe je de firmware wilt uploaden, via USB of OTA.

## Lokaal testen

### WebUI

De WebUI kan in realtime worden ontwikkeld en getest met behulp van dummygegevens. Dit is handig wanneer je wijzigingen aanbrengt in de WebUI, vertalingen test of het gedrag bekijkt wanneer testgegevens veranderen.

Bouw de mock API-dataservice:

```sh
% cd mock-api
% pnpm install
```

en dan vanuit de map `interface` uitvoeren:

```sh
% pnpm standalone
```

Zorg ervoor dat je de laatste versie van node hebt geïnstalleerd. Je hebt minimaal 18.20 nodig en kunt dit controleren met `node -v`. Een gemakkelijke manier om te wisselen tussen verschillende node versies is om [nvm](https://github.com/nvm-sh/nvm) te gebruiken.

Dit opent een browservenster met URL `http://localhost:3000`.

De gebruikte schijngegevens zijn allemaal hard gecodeerd in het bestand `/mock-api/restServer.ts`.

### Offline simuleren, zonder ESP32-microcontroller

Je kunt EMS-ESP ook uitvoeren zonder ESP32 (wat we 'standalone' noemen). De PlatformIO-omgeving heeft twee omgevingen van het type `native` die `emsesp` uitvoerbare bestanden bouwen die compatibel zijn met Linux, Windows en Max OSX.

Op **Linux/OSX** (inclusief Windows' `WSL2`) voer je gewoon uit: `pio run -e standalone -t exec`

Op **Windows** is het een beetje lastiger omdat de EMS-ESP console Winsock nodig heeft voor de toetsinvoer. De eenvoudigste manier is om [Msys2](https://www.msys2.org) op je Windows machine te installeren, gevolgd door de installatie van de GNU g++ compiler direct daarna met `run pacman -S mingw-w64-ucrt-x86_64-gcc`. Dit is maar één keer nodig. Vanaf dat moment kun je het commando `pio` uitvoeren om de Windows .exe te bouwen die wordt uitgevoerd met `pio run -e standalone` en deze starten in een Msys-terminal, zoals:

`C:/msys64/msys2_shell.cmd -defterm -here -no-start -ucrt64 -c <source location>/.pio/build/standalone/program.exe`

Gebruik het commando `test` om tests uit te voeren. `test general` is een generieke test die een standaard ketel en thermostaat instelt met alle standaard entiteiten.

Alle tests zijn hard gecodeerd in het bestand `test/test.cpp` en kunnen eenvoudig worden aangepast.

Er zijn ook een aantal Unit Tests die ook vanuit de pio-omgeving kunnen worden uitgevoerd met `pio run -e native-test -t exec`. Dit werkt op elk platform en vereist geen extra instellingen.

### Debuggen

Om te debuggen vanuit Visual Studio Code en door de code te stappen, naar variabelen te gluren, breakpoints in te stellen enz. Bouw eerst de executable met de `make` methode hierboven die de .o objectbestanden in een `build` map plaatst en roep dan de debugger op (F5 op Windows).

Je kunt ook een VSC-taak aanmaken in het bestand `launch.json` om dit voor je te automatiseren, zoals toevoegen:

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

### WSL (een Linux-omgeving bouwen op Windows)

Onlangs moest ik mijn Linux WSL op Windows helemaal opnieuw opbouwen om EMS-ESP te bouwen en ik dacht ik deel de stappen die ik nam om het werkend te krijgen.

Maak een nieuwe WSL2-omgeving. Merk op dat een WSL2 instance tot 8GB RAM kan gebruiken, dus zorg er eerst voor dat je PC dit aankan.

- `wsl.exe -l -v` om huidige installaties te bekijken.
- `wsl.exe --list --online` om beschikbare installaties te bekijken.
- `wsl.exe -d <dist>` om de distro te starten. Gebruik in geval van twijfel `Ubuntu-24.04` omdat dit de nieuwste LTS is.
- `lsb_release -a` nadat het is geïnstalleerd om de versie te controleren.
- `do-release-upgrade` (optioneel) om te upgraden naar de nieuwste versie. Ik heb een upgrade uitgevoerd naar 24.10. Mogelijk moet u "Prompt=normal" instellen in het bestand `/etc/update-manager/release-upgrades`.
- `wsl.exe --setdefault <dist name>` om van deze installatie de standaardinstallatie te maken. U kunt `wsl.exe --terminate <dist name>` gebruiken om eventuele oude te verwijderen.

Ga naar de WSL-instantie (`wsl`) en stel het volgende in:

- `sudo apt install unzip make g++ python3-venv nodejs curl zsh`
- `sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"` (optioneel) om zsh te installeren
- `npm install -g npm-check-updates` voor het commando ncu
- `curl -fsSL https://bun.sh/install | bash` voor de mock-api

Om USB te usb installeren [usbipd](https://github.com/dorssel/usbipd-win/releases) vanuit een DOS Admin commando venster. In dat venster kun je `usbipd list` gebruiken om de COM-poort te vinden en dan bijvoorbeeld `usbipd bind -b 1-6` en `usbipd attach -w -b 1-6` om deze aan de WSL instance te koppelen. Hierdoor krijg je een `/dev/ttyUSB0` of `/dev/ttyACM0` apparaat.

Start Visual Studio Code op je Windows-omgeving en klik op "Connect to WSL" om verbinding te maken met de WSL-instantie. Je kunt dan de WSL terminal gebruiken om de firmware te bouwen. Je zult merken dat het bouwen en compileren van EMS-ESP 2-3 keer sneller gaat dan onder Windows.

### Een devcontainer gebruiken voor ontwikkeling

Je kunt de devcontainer lokaal gebruiken of een codespace starten op github.

Als je de devcontainer gebruikt en de standalone UI uitvoert, moet je het standalone-devcontainer script uitvoeren in plaats van het standaard standalone script. Anders is je vite-poort niet toegankelijk vanaf je machine.

```sh
% pnpm standalone-devcontainer
```

#### Codespace

Klik op "Code" en de "Create codespace on dev" om een codespace te starten die je kunt gebruiken om te ontwikkelen zonder lokaal iets te installeren.

![Codespace start](/media/screenshot/codespace_start.jpg)

### De partitiestructuur

| Naam | Type | Subtype | Offset | Grootte | Notities | Bestand |
|------------|------------|----------|---------------|--------------------|---------------------------------|---------------------------------|
| bootloader | | 0x0000/0x1000 | 0x8000 (32 KB) | ESP32-S3=0x1000, ESP32=0x1000 | bootloader*.bin |
| partities | | 0x8000 | 0x1000 (4 KB) | hetzelfde voor elk bord | partities*.bin |
| - | | | | | | |
| nvs | data | nvs | 0x9000 | 0x5000 (20 KB) | gereserveerd voor ESP32 | | |
| otadata | data | ota | 0xE000 | 0x2000 (8 KB) | hetzelfde voor elk bord | boot_app0*.bin |
| boot | app | fabriek | 0x10000 | 0x480000 (4,5 MB) | standaard opstartpartitie | EMS-ESP firmware *.bin/loader | |
| app0 | app | ota_0 | 0x290000 | 0x490000 (4,56 MB) | OTA cyclus 1 | EMS-ESP firmware *.bin |
| app1 | app | ota_1 | 0x510000 | 0x490000 (4,56 MB) | OTA cyclus 2 | EMS-ESP firmware *.bin |
| nvs1 | data | nvs | 0xAA0000 | 0x040000 (256 KB) | aangepast voor EMS-ESP | (gegenereerd door script) |
| spiffs | data | spiffs | 0xAA0000 | 0x200000 (2 MB) | voor LittleFS/EMS-ESP bestandssysteem | (niet gebruikt) |
| coredump | data | coredump | 0xCE0000 | 0x010000 (64 KB) | | | |

- Referentie: [ESP-IDF Partition Tables](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/partition-tables.html)
- Er zijn 3 plaatsen waar de EMS-ESP-firmware wordt opgeslagen:
  - `boot` wordt standaard gebruikt bij nieuwe installaties.
  - `app0` en `app1` zijn de firmwarepartities die worden gebruikt tijdens OTA-updates en wisselen tussen deze twee. De firmware wordt in een van deze niet-actieve partities geladen en vervolgens wordt het apparaat opnieuw opgestart.
- De bootloader (tweede trap genoemd) is de `bootloader_dio_80m.bin` executable en wordt gebruikt om de partitietabel op offset 0x8000 te lezen en te bepalen welke partities beschikbaar zijn. Merk op dat de offset van de bootloader verschilt per chiptype. ESP32 is [0x1000](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-guides/bootloader.html#bootloader) en ESP32-S3 is [0x0000](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/bootloader.html#bootloader). Dit wordt behandeld in ons script `upload.sh` voor elk modeltype in de parameter `bootloader_address`.
- De partitie `otadata` wordt gebruikt om een kleine applicatie te bevatten die gebruikt wordt om te bepalen welke partitie (boot, app0, app1) gebruikt moet worden. Deze bevraagt de gegevens die zijn opgeslagen in het blok `partitions`.
- EMS-ESP kan opnieuw worden opgestart naar andere partities met het commando `restart <boot|app0|app1>`.
- Het EMS-ESP Console/API commando `show system` toont de huidige partitie en de partitie die zal worden opgestart na een herstart.
- Bij alle board/chip types zijn de `boot_app0.bin` en `partitions.bin` hetzelfde bestand voor elke printplaat. Alleen de `bootloader.bin` is anders. Maar we bewaren lokale kopieën om alles netjes in één map te houden.
