---
id: Console
title: Console Access
description: Access EMS-ESP console via Telnet or USB Serial for advanced monitoring and command execution
---

# Console

EMS-ESP heeft een telnet server waarmee cliënten verbinding kunnen maken met een telnet client zoals [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) of direct via het OS zoals in dit voorbeeld met [Windows](https://www.technipages.com/windows-10-enable-telnet). De poort is 23.

Je hebt ook toegang tot de console via een seriële USB-poort, met baud 115200. Je moet op CTRL-D drukken om de seriële console te openen.

De console geeft je meer inzicht in het EMS busverkeer, MQTT wachtrijen en de volledige apparaatinformatie die wordt vastgelegd. Het gedraagt zich als een Unix/Linux shell. Enkele van de meest voorkomende commando's zijn:

- in `help` of `F1` staan de opdrachten en trefwoorden. Dit werkt in elke context.
- `exit` sluit de console af of verlaat de huidige context. `CTRL-D` doet hetzelfde.
- `CTRL-U` voor Ongedaan maken of de regel wissen.
- `<TAB>` voor automatisch aanvullen
- `system` om het systeemmenu te openen. Gebruik `exit` of CTRL-D om terug te keren.
- `su` schakelt over naar de "supergebruiker" of beheerdersmodus. Het standaard wachtwoord is `ems-esp-neo` en kan worden gewijzigd met `passwd` vanuit het systeemmenu of via de webinterface (geheim wachtwoord genoemd). In su-modus schakelt de opdrachtprompt van `- `su` schakelt over naar de "supergebruiker" of beheerdersmodus. Het standaard wachtwoord is `ems-esp-neo` en kan worden gewijzigd met `passwd` vanuit het systeemmenu of via de webinterface (geheim wachtwoord genoemd). In su-modus schakelt de opdrachtprompt van  naar `#`.
- Sommige instellingen kunnen in de console worden gewijzigd. De opdracht `set` geeft ze weer.
- `show` of `F2` toont de gegevens die specifiek zijn voor de context waarin je je bevindt. Vanuit de root worden alle EMS-apparaatgegevens en alle externe Dallas-temperatuursensoren getoond.
- `show commands` of `call` geeft een lijst met alle opdrachten die kunnen worden aangeroepen met de opdracht `call`. Zie [Commands](Commands).
- `log` stelt het logboekniveau in. `log off` schakelt het loggen uit. Gebruik `log debug` voor het debuggen van commando's en acties, `log all` bevat de telegrammen zoals `watch on`. Dit wordt de volgende keer dat de console wordt geopend gereset.
- `watch` voert de binnenkomende Rx-telegrammen rechtstreeks uit naar de console. Je kunt ook een specifieke EMS apparaat ID of telegram ID of onbekende (nieuwe) telegrammen in de gaten houden. Je kunt ook kiezen voor uitvoer als platte tekst of als ruwe gegevensbytes.

## Consoleopdrachten

Als je `help` typt, worden de beschikbare opdrachten opgesomd. Sommige beheeropdrachten zijn alleen actief nadat eerst een `su`-opdracht is ingevoerd.

```yaml
exit
help
log [level]
show [system | users | devices | log | ems | values | mqtt | commands
su
passwd
restart [partitionname]
wifi reconnect
set admin password
set wifi password
set hostname <name>
set wifi ssid <name>
set board_profile <name>
set bus_id <deviceID>
set tx_mode <n>
set service <ap | mqtt | ntp> <enable | disable>
scan [deep]
read <deviceID> <type ID> [offset] [length]
watch [off | on | raw | unknown] [ID]
call [device] [cmd] [data] [id|hc]
```

## Voorbeelden

### Een opdracht aanroepen om waarden te wijzigen

Merk op dat je eerst `su` moet hebben om toegang te krijgen tot alle `call`-opdrachten.

![Console](/media/screenshot/console1.png)

### Apparaatwaarden weergeven

![Console](/media/screenshot/console0.png)

### Het EMS-verkeer bewaken

Met het commando `watch` kun je de binnenkomende EMS-telegrammen controleren.

De syntaxis is `watch on <ID>` waarbij ID zowel een Telegram-ID als een Apparaat-ID is.

Merk op dat de CRC-byte uitgesloten is van het gegevenspakket.

Als je alleen telegrammen wilt zien die nog niet zijn geregistreerd, gebruik dan `watch unknown`

Als je de onbewerkte bytes inclusief CRC wilt zien zoals verzonden op de EMS-lijn, gebruik dan `watch raw <ID>`.

![Console](/media/screenshot/console3.png)
