---
id: Console
---
# Console

EMS-ESP heeft een telnetserver waarmee cliënten verbinding kunnen maken met een telnetclient zoals [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) of rechtstreeks via het OS zoals in dit voorbeeld met [Windows](https://www.technipages.com/windows-10-enable-telnet). De poort is 23.

Je hebt ook toegang tot de console via een seriële USB-poort, met baud 115200. Je moet op CTRL-D drukken om de seriële console te openen.

De console geeft je meer inzicht in het EMS busverkeer, MQTT wachtrijen en de volledige apparaatinformatie die wordt vastgelegd. Het gedraagt zich als een Unix/Linux shell. Enkele van de meest voorkomende commando's zijn:

- `help` of `F1` bevat de commando's en trefwoorden. Dit werkt in elke context.
- `exit` verlaat de console of verlaat de huidige context. `CTRL-D` doet hetzelfde.
- `CTRL-U` voor Ongedaan maken of de regel wissen.
- `<TAB>` voor automatisch aanvullen
- `system` om het systeemmenu te openen. Gebruik `exit` of CTRL-D om terug te keren.
- `su` schakelt over naar de "supergebruiker" of beheerdersmodus. Het standaard wachtwoord is `ems-esp-neo` en kan worden gewijzigd met `passwd` vanuit het systeemmenu of via de webinterface (geheim wachtwoord genoemd). In su-modus schakelt de opdrachtprompt van `- `su` schakelt over naar de "supergebruiker" of beheerdersmodus. Het standaard wachtwoord is `ems-esp-neo` en kan worden gewijzigd met `passwd` vanuit het systeemmenu of via de webinterface (geheim wachtwoord genoemd). In su-modus schakelt de opdrachtprompt van  naar `#`.
- Sommige instellingen kunnen in de console worden gewijzigd. Het commando `set` geeft ze weer.
- `show` of `F2` toont de gegevens die specifiek zijn voor de context waarin u zich bevindt. Vanaf de root toont het alle informatie over EMS-apparaten en eventuele externe Dallas-temperatuursensoren.
- `show commands` of `call` geeft een lijst van alle commando's die met het commando `call` kunnen worden opgeroepen. Zie [Commands](Commands).
- `log` stelt het logboekniveau in. `log off` schakelt het loggen uit. Gebruik `log debug` voor het debuggen van commando's en acties, `log all` omvat de telegrammen zoals `watch on`. Dit wordt de volgende keer dat de console wordt geopend gereset.
- `watch` stuurt de binnenkomende Rx-telegrammen rechtstreeks naar de console. U kunt ook een specifieke EMS apparaat-ID of telegram-ID of onbekende (nieuwe) telegrammen in de gaten houden. Kies er ook voor om de uitvoer als platte tekst of als ruwe gegevensbytes uit te voeren.

## Consoleopdrachten

Als u `help` typt, worden de beschikbare commando's opgesomd. Sommige beheerderscommando's zijn alleen actief nadat eerst een `su` commando is ingevoerd.

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

Merk op dat je eerst `su` moet hebben om toegang te krijgen tot alle `call` commando's.

![Console](/media/screenshot/console1.png)

### Apparaatwaarden weergeven

![Console](/media/screenshot/console0.png)

### Het EMS-verkeer bewaken

Met het commando `watch` kun je de binnenkomende EMS-telegrammen controleren.

De syntaxis is `watch on <ID>` waarbij ID een Telegram-ID en ook een Apparaat-ID is.

Merk op dat de CRC-byte uitgesloten is van het gegevenspakket.

Als je alleen telegrammen wilt zien die nog niet geregistreerd zijn, gebruik dan `watch unknown`

Als je de ruwe bytes inclusief CRC wilt zien zoals ze op de EMS-lijn zijn verzonden, gebruik dan `watch raw <ID>`.

![Console](/media/screenshot/console3.png)
