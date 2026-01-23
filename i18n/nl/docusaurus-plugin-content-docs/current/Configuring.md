---
id: Configuring
---

# Configureren

## Eerste keer instellen

De standaard 'fabrieksconfiguratie' start een WiFi Access Point met de naam `ems-esp`. Maak hiermee verbinding met het WPA-wachtwoord `ems-esp-neo`. Wanneer om een inlogscherm (captive portal) wordt gevraagd, meld je je aan met de gebruikersnaam `admin` en wachtwoord `admin`. Deze kunnen later gewijzigd worden. Als je een Ethernetkaart hebt, kun je rechtstreeks verbinding maken met het IP-adres of via `http://ems-esp` of `http://ems-esp.local`.

Nu ben je klaar om de instellingen verder te configureren. Als je niet verbonden bent met je WiFi-netwerk, doe dit dan eerst via de pagina Instellingen->Netwerk. Je kunt dit ook doen via de Console als je verbonden bent met een Serial/USB-poort en de commando's `set wifi ssid` en `set wifi password` gebruikt.

Als je waarschuwingen ziet dat het niet gelukt is om verbinding te maken met de EMS-bus, of als er Tx- of Rx-fouten zijn, volg dan de [troubleshooting](Troubleshooting) handleiding.

:::note Als je 'Rx incomplete telegrammen' in het logboek ziet staan, raak dan niet in paniek. Sommige telegrammen kunnen gemist worden en dit wordt meestal veroorzaakt door ruis op de lijn.
:::

In de volgende sectie worden enkele belangrijke instellingen beschreven die kunnen worden aangepast via de WebUI, te vinden onder de sectie Instellingen. De meeste spreken voor zich, dus alleen de belangrijke worden hier beschreven.

## Toepassingsinstellingen

### Diensten

- **Omzeil toegangstoken-autorisatie op API-aanroepen**. Voor RESTful schrijfopdrachten via HTTP POST is het toegangstoken vereist. Dit is om veiligheidsredenen om te voorkomen dat iemand apparaatinstellingen wijzigt. Het instellen van deze vlag maakt de API open. Niet aanbevolen!
- **Telnetconsole inschakelen**. Dit staat standaard aan en stelt gebruikers in staat om verbinding te maken met de onveilige Telnet-server op poort 23.
- **Modbus inschakelen**. Dit staat standaard uit en stelt gebruikers in staat om verbinding te maken met de Modbus TCP-server (standaard poort 502). Vanwege geheugenbeperkingen is deze functie alleen beschikbaar op kaarten met extra PSRAM.
- **Syslog inschakelen**:
  - **IP** is het IP-adres van een syslogserver voor het vastleggen van logs op afstand. Laat leeg als u SysLog niet gebruikt. Opmerking EMS-ESP gebruikt het standaard [RFC5424](https://datatracker.ietf.org/doc/html/rfc5424) protocol, dus zorg ervoor dat je syslog server is ingesteld om deze berichten te verwerken en niet bijvoorbeeld RFC3164 (BSD Syslog).
  - **Port** als u een ander poortnummer gebruikt. De standaardinstelling is 514. En het gebruikt UDP (niet TCP).
  - **Log Level** stelt het maximale logniveau in voor gerapporteerde berichten. Het hoogste niveau is DEBUG, dat veel loggegevens verstuurt, dus wees voorzichtig.
  - **Mark Interval** stuurt een speciaal `mark` bericht naar de SysLog. Dit is handig voor het timen van gebeurtenissen.

### Sensoren

- **Analoge sensoren inschakelen**. Hiermee kan elke GPIO signalen verzamelen, of het nu een digitale I/O, een pulsteller of een ADC is die mv meet. Er zijn nog veel meer opties beschikbaar. Merk op dat de `Factor` een verdeler is.
- **Schakel 1-draads parasitaire voeding in**. Selecteer deze optie bij gebruik van (Dallas) temperatuursensoren met parasitaire voeding.

### Opmaakopties

- **Language**. Dit stelt de taal in die gebruikt moet worden voor de EMS apparaatnamen, zoals weergegeven in de WebUI Apparaten en Dashboard, en ook voor MQTT Discovery. De standaardtaal is Engels. Als je Home Assistant gebruikt en de taal wijzigt, kan het nodig zijn om de vorige EMS-ESP MQTT entries te verwijderen (van HA's Instellingen->Devices & Services->MQTT) en EMS-ESP voor de zekerheid te herstarten.
- **Boolean Format Dashboard**. Dit is hoe booleaanse waarden worden weergegeven in de WebUI en MQTT payloads.
- **Boolean Formaat API/MQTT**. Dit is hoe booleaanse waarden worden geschreven in de MQTT payloads en API JSON uitvoer.
- **Enum Formaat API/MQTT**. Dit is hoe lijstwaarden worden gepresenteerd in de MQTT payloads en API JSON, ofwel door de waarde of de indexpositie binnen de lijst. Als je Home Assitant gebruikt, zie je niet de waarden maar gehele getallen voor sommige entiteiten, bijvoorbeeld in plaats van `off, hot, cold` wordt `0, 1, 2` weergegeven.
- **Temperatuurwaarden omrekenen naar Fahrenheit**. Voor onze vrienden in de VS.
- **Log EMS telegrammen in hexadecimaal** zal de telegrammen in onbewerkt formaat overal wegschrijven als hexadecimale waarden.

### Hardware-instellingen

- **Boardprofiel**. Board Profiles zijn vooraf geconfigureerde GPIO-instellingen voor een set veelgebruikte ESP32-ontwikkelborden en EMS Gateway-schakelingen. De volgende profielen zijn beschikbaar:

| `profile name` | `based on board` | `led` | `dallas` | `rx` | `tx` | `button` | `phy_type` | `eth_power` | `eth_phy_addr` | `eth_clock_mode` |
| ------------ | ---------------------- | --- | ------ | --- | --- | ------ | -------- | --------- | ------------ | ---------------------------- |
| S32 | BBQKees Gateway S32 | 2 | 18 | 23 | 5 | 0 | | | | | | |
| E32 | BBQKees Gateway E32 | 2 | 4 | 5 | 17 | 33 | LAN8720 | 16 | 1 | ingang naar GPIO0 |
| E32V2 | BBQKees Gateway E32 V2 | 2 | 14 | 4 | 5 | 34 | LAN8720 | 15 | 0 | uitgang van GPIO0 |
| S32S3 Gateway S3 2 18 5 17 0
| MH-ET Live D1 Mini Mini 2 18 23 5 0
| NODEMCU 32S 2 18 23 5 0
| LOLIN D32 2 18 17 16 0
| OLIMEX ESP32-EVB 0 0 36 4 34 LAN8720 -1 0 Ingang naar GPIO0
| OLIMEXPOE | Olimex ESP32-POE | 0 | 0 | 36 | 4 | 34 | LAN8720 | 12 | 0 | uitgang van GPIO17, geïnverteerd |
| C3MINI Lolin C3 Mini 7 1 4 5 9
| S2MINI Lolin S2 Mini 15 7 11 12 0
| S3MINI Liligo S3 17 18 8 5 0

Om een aangepast bord te configureren, moet je eerst `Developer mode` inschakelen. Als je `Custom` kiest, worden de volgende extra instellingen weergegeven om de GPIO's handmatig te configureren voor je eigen bord. Je kunt ook op elk moment `Custom` kiezen om de huidige instellingen van het bordprofiel weer te geven, zonder op te slaan.

*Aangepaste bordinstellingen:*

- **Rx GPIO**. Dit is de GPIO-pin waaraan het Rx-signaal is toegewezen. Standaard is dit GPIO 23, maar het kan bijna elke vrije pin zijn. Verbind deze GPIO-pin met de RX-poort op het EMS-interfacebord.
- **Tx GPIO**. Dit is de GPIO-pin waaraan het Tx-signaal wordt toegewezen. Standaard is dit GPIO 5, maar het kan bijna elke vrije pin zijn. Verbind deze GPIO-pin met de TX-poort op het EMS interfacebord.
- **Knop GPIO**. Dit is de GPIO-pin waaraan de knop is toegewezen. Het is een pull-up. De knop wordt gebruikt voor verschillende functies. Een enkele klik doet niets, een dubbele klik voert een WiFi-reset uit en maakt opnieuw verbinding met het AP, 10 seconden lang indrukken en loslaten voert een fabrieksreset uit en heel lang indrukken gedurende ten minste 20 seconden zonder los te laten herstart de EMS-ESP naar de initiële opstartpartitie.
- **Temperatuur GPIO**. Dit is de pin waarop externe temperatuursensoren worden aangesloten. De Dallas chips DS1822, DS18S20, DS18B20, DS1825 worden ondersteund, inclusief hun parasitaire varianten en kunnen ook doorgelust worden op een enkele lijn, tot 100 sensoren.
- **LED GPIO**. Dit is de pin voor de LED, standaard ingesteld op de onboard LED op het ESP dev board.
- **Eth PHY Type**. Dit is het type Ethernet-chip dat wordt gebruikt.

:::note Op ESP32-ontwikkelboards zijn er vaak ook pinnen gemarkeerd met RX en TX. Deze zijn echter meestal verbonden met de USB-chip en kunnen niet worden gebruikt voor het EMS-interfacecircuit.
:::

- **EMS Tx-modus**. Tx Mode is de modus waarin EMS-ESP telegrammen verstuurt over de EMS-bus. Kies de modus die het beste werkt voor je systeem en let op Tx-fouten in het Web Dashboard en `show ems` in de Console. Het wijzigen van de waarde heeft onmiddellijk effect.
  - `EMS` is de standaard voor EMS1.0-systemen, maar is ook compatibel met de meeste andere busprotocollen.
  - `EMS+` is ontworpen om beter te werken voor EMS2.0/EMS+ systemen.
  - `HT3` voor Heatronics3, voornamelijk gebruikt door Junkers.
  - `Hardware` gebruikt de interne hardware van de ESP om het telegram te verzenden. Telegrammen worden onmiddellijk verzonden. Dit is de snelste en meest efficiënte methode, maar werkt alleen op sommige systemen.
- **EMS Bus ID**. De EMS-ESP kan meerdere apparaten simuleren. Houd de standaard `Service Key (0x0B)` aan, tenzij u meer dan één EMS gateways/interface-kaart gebruikt. Het is belangrijk om op te merken dat de Service Key ook wordt gebruikt door gecertificeerde service/maintenance technici bij het onderhoud van uw verwarmingssystemen, dus zorg ervoor dat u de EMS-ESP uitschakelt voordat ze arriveren, anders kunnen ze geen verbinding maken met de EMS-bus.
- **Enable Read only mode**. Dit schakelt alle uitgaande Tx-schrijfopdrachten naar de EMS-bus uit, waardoor de EMS-ESP in feite in luistermodus wordt gezet. Tx is echter nodig om EMS-apparaten te detecteren (omdat het een Version-commando verstuurt). Als je EMS-ESP expliciet in een lees-only/sniffer modus wilt zetten, gebruik dan `set tx_mode 0` vanaf de console.
- **Verberg LED**. Hiermee wordt de LED uitgeschakeld in de normale bedrijfsmodus. De LED wordt nog steeds weergegeven tijdens het opstarten of bij verbindingsproblemen.
- **CPU-snelheid onderklokken**. Onderklokt de ESP naar 160Mhz, waardoor stroom en warmte worden bespaard en de levensduur van de chip wordt verlengd ten koste van de prestaties en responstijd. EMS-ESP moet opnieuw worden opgestart.

### Speciale functies

- **Developer Mode** schakelt geavanceerde functies in de WebUI in, zoals de opdracht Lezen uit het systeemlogboek en het configureren van een aangepast bord.
- **Start ketel met geforceerde verwarming uit**.
- **Afstandsbediening uitschakelen bij ontbrekende kamertemperatuur**. Dit is een veiligheidsfunctie om te voorkomen dat de ketel start als de gesimuleerde kamertemperatuursensor ontbreekt of niet werkt.
- **Douche timer inschakelen**. Inschakelen om te timen hoe lang het warme water loopt en er wordt een MQTT-bericht verstuurd met de duur. De timer start na minimaal 2 minuten looptijd.
- **Douchewaarschuwing inschakelen**. Dit is enigszins experimenteel en werkt mogelijk niet op alle boilers. Na 7 minuten (instelbaar) warm water te hebben laten lopen, geeft de ketel een waarschuwing door gedurende 10 seconden koud water te sturen (ook instelbaar). De ketel gaat in testmodus om deze handeling uit te voeren, dus wees voorzichtig!

## Netwerk instellen

Op de Netwerk pagina kun je de EMS-ESP verbinden met je thuisnetwerk. Je kunt kiezen tussen WiFi en Ethernet als de hardware dit ondersteunt. Let op WiFi moet 2.4GHz/WPA2 zijn. Het zal geen verbinding maken met een 5GHz Wifi-toegangspunt.

### CORS (Cross-Origin Resource Sharing)

CORS voegt, indien ingeschakeld, nieuwe HTTP-headers toe aan elk webverzoek zodat de web-API `fetch`- en `XMLHttpRequest`-verzoeken kan doen op verschillende domeinen. Hiermee wordt de controle vooraf, die standaard hetzelfde oorsprongsbeleid volgt, uitgeschakeld. Zie [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) voor meer details. Er is ook een browseruitbreiding "CORS deblokkeren" die op dezelfde manier werkt.

Schakel deze functie in als je in VPN's draait of als je andere servers hebt draaien (zoals Grafana) op andere domeinen die aanroepen doen naar de API van EMS-ESP.

## MQTT-instelling

- **Brokeradres**. Gebruik het IP-adres, geen FQDN.
- **Port**. De standaardinstelling is 1883 en 8883 voor SSL.
- **Basis**. Alle onderwerpen worden voorafgegaan door `Base`, dus dit is belangrijk. Zorg ervoor dat dit uniek is als je meer dan één EMS-ESP met dezelfde broker gebruikt.
- **Cliënt ID**. Dit wordt intern gebruikt om EMS-ESP te identificeren met de broker en is optioneel. Merk op dat MQTT topics worden gepostfixed met de hostnaam (standaard `ems-esp`) en niet met de client ID. Gebruik dit wanneer je meerdere apparaten hebt.
- **Gebruikersnaam** en **Wachtwoord** zijn optioneel maar aanbevolen voor de veiligheid. Standaard heeft de Mosquitto MQTT broker een username/password nodig, dus let op als je de Home Assistant Add-On hier gebruikt.
- **Set Clean Session**. Creëert een niet-persistente sessie indien ingeschakeld. Standaard en aanbevolen instelling is uitgeschakeld om het uitgeschakeld te houden bij gebruik van domoticasystemen.
- **QoS**. Quality of Service, 0, 1 of 2. 0 is de standaardwaarde en geschikt voor meer scenario's. Een waarde van 1 geeft de garantie dat het bericht is verzonden, maar zorgt voor iets meer netwerkverkeer en overhead.
- **Altijd vlag behouden** instellen. Schakel deze optie in als je alle berichten op de MQTT broker wilt bewaren. De standaardinstelling is uitgeschakeld.
- **Opmaak**. De `Nested` optie groepeert alle apparaatgegevens in een enkel MQTT topic door ingesloten JSON objecten te gebruiken zoals `dhw` in `boiler_data`, `hc1` in `thermostat_data` enz. `As individual topics` splitst dit op in afzonderlijke MQTT-onderwerpen zonder groepering, dus MQTT-onderwerpen worden `boiler_data` en `boiler_data_dhw`, `thermostat_data` en `thermostat_data_hc1` enzovoort. Hetzelfde geldt voor de Analoge en Temperatuursensoren. De standaardinstelling is genest.
- **Publiceer opdrachtuitvoer naar een 'antwoord'-onderwerp'**. Dit neemt de uitvoer van een API commando en publiceert het resultaat in een onderwerp genaamd `response`.
- **Publiceer topics met één waarde bij verandering**. Deze optie publiceert onmiddellijk het onderwerp en de payload voor elke bewerking en is alleen beschikbaar wanneer MQTT Discovery is uitgeschakeld.
- **Enable MQTT Discovery** schakelt de integratie in met behulp van MQTT Discovery, volledig ondersteund met Home Assistant en gedeeltelijk met Domoticz.
  - **Ontdekkingstype**. Kies tussen "Home Assistant" en twee protocollen voor "Domoticz". `Domoticz (latest)` gebruikt getallen, schakelaars, selecties en andere moderne typen, terwijl `Domoticz` alleen sensoren voor alles gebruikt en ook alle templatingvoorwaarden verwijdert.
  - **Entity ID-formaat**: Er zijn 3 opties. De eerste `single instance, long names` gebruikt de oudere `< v3.5`-indeling. De standaard en aanbevolen instelling voor alle nieuwe installaties is de 2e optie genaamd `Single instance, short name` die de entiteitnaam van het EMS-ESP-apparaat gebruikt. De laatste optie moet worden gebruikt als er meer dan één versie van de EMS-ESP firmware wordt gebruikt, omdat het elke versie uniek maakt door alle MQTT topics vooraf te laten gaan door de basisnaam.
  - **Invoer getalformaat**: (alleen HA) Selecteer box- of schuifmodus. Schuifbalken worden alleen gebruikt voor getalentiteiten met een bereik van minder dan 100.
- **Publiceer intervallen**. Dit gedeelte is per apparaat en stelt in hoe vaak een MQTT-bericht wordt verzonden. Wanneer ingesteld op 0 zal EMS-ESP automatisch gegevens versturen wanneer er een merkbare verandering is, wat binnen een paar seconden kan zijn.

## NTP instellen

- De standaard **NTP-server** is `time.google.com`. Dit kan worden gewijzigd in een lokale NTP-server of een specifieke server, zoals `pool.ntp.org`.
- De standaard **tijdzone** is "Europe/Amsterdam". Dit kan worden gewijzigd in een van de [IANA Time Zone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) tijdzones.

## Gebruikers en rollen beheren

Op de Beveiliging pagina kun je het standaard wachtwoord voor de captive portal en Telnet CLI wijzigen. Je kunt ook HTTPS inschakelen voor de captive portal en MQTT broker.

Op de pagina Users kun je extra gebruikers aanmaken voor de captive portal en Telnet CLI. De standaardgebruiker is `admin` met wachtwoord `admin`.

Elke gebruiker heeft een uniek toegangstoken (te zien door op het sleutelpictogram te klikken) dat wordt gebruikt voor RESTful schrijfopdrachten via HTTP POST. Dit is om veiligheidsredenen om te voorkomen dat iemand apparaatinstellingen wijzigt.

![Web](/media/screenshot/web_users.png)

## Analoge en temperatuursensoren toevoegen

Externe sensoren, zoals temperatuur en analoge sensoren, kunnen worden aangesloten op een reeks GPIO-pinnen op de ESP32-chip. Als je een BBQKees Gateway board gebruikt, heeft deze al een externe plug voor Dallas temperatuursensoren die zichtbaar zijn in de WebUI zonder extra configuratie. BBQKees boards zijn CE-gecertificeerd en het toevoegen van sensoren aan gpios zal de EMC-conformiteit doorbreken. Als je op eigen risico analoge sensoren wilt toevoegen, kies dan een ander bordprofiel of gebruik de ontwikkelaarsmodus om een aangepast bord te configureren.

Om analoge sensoren toe te voegen klik je op `Add` en kies je tussen een normale Digitale in/out, een Teller (telt on/off pulsen), ADC voor het meten van spanningen, Timer, Rate en PWM 0-2. Let op, de tellerwaarde blijft behouden en wordt niet gereset bij opnieuw opstarten.

![Web](/media/screenshot/web_sensor.png)

:::warning Wees voorzichtig bij het kiezen van een GPIO zodat deze niet botst met de andere gebruikte GPIO's (u kunt CUSTOM board profile selecteren om uw huidige configuratie te bekijken).

    EMS-ESP is aangesloten op de laagspanningsbus van uw verwarming en elke overspanning kan het EMS-ESP-bord en mogelijk uw verwarmingsapparaten beschadigen. Sluit nooit externe apparatuur rechtstreeks aan op het EMS-ESP-bord.

    ESP32-ontwikkelborden variëren in hun beschikbare pinconfiguratie. Meestal kun je 1, 6-11, 12, 14, 15, 20, 24, 28-31 en 40+ niet gebruiken. Zie deze links [here](https://diyprojects.io/esp32-how-to-use-gpio-digital-io-arduino-code/#.YFpVEq9KhjG) en [here](https://nodemcu.readthedocs.io/en/dev-esp32/modules/gpio/).

:::

De volgende GPIO's worden aanbevolen:

- digitale uitgang: `13, 19, 21, 22, 27, 33, 37, 38`
- digitaal input/counter/timer/rate: `13, 19, 21, 22, 25, 26, 27, 33, 35, 37, 38, 39 (note no pullup on 35 & 39)`
- ADC-ingang: `13, 19, 21, 22, 25, 26, 27, 33, 35, 37, 38, 39`
- DAC-uitgang: `25, 26`
- PWM-uitgang: `13, 19, 21, 22, 25, 26, 27, 33, 37, 38`

Grenzen:

- ADC: max. ingang 3,3V, leest als milliVolts
- DAC 8bit, waardebereik 0..255 voor 0V-3,3V uitgang, configureren als `Digital out` op gpio 25 of 26 (ESP32), 17, 18 (ESP32S2), niet beschikbaar voor ESP32S3, ESP32C3
- PWM 0-2: maximale frequentie 5000Hz, resolutie 13bits. Elk kanaal kan maar voor één gpio worden gebruikt.
- Puls is een digitale uitgang voor een enkele puls met instelbare lengte. Als de sensor op commando wordt ingesteld op `on`, gaat hij naar `off` nadat de puls is voltooid.
- Counter/timer/rate trigger: `high->low edge with 15 ms debounce. Only for low pulse rates < 30Hz.`
- Teller 0-2, Frequ 0-2: snelle ingangen voor 1 Hz tot 100kHz signalen, geen debounce, gebruik RC-filter voor ruisige signalen. Interruptgestuurd, elk kanaal kan maar voor één gpio worden gebruikt.

Tellers worden opgeslagen op reboot/update en elk uur naar nvs gestuurd. In geval van crashes, stroomstoringen kan de waarde daarna lager zijn.

### Relais besturen

Een veelgebruikte toepassing is het aansturen van een relais om on/off een apparaat te schakelen. Dit kan worden gedaan door een digitale uitgangssensor toe te voegen en vervolgens een commando te maken om het te besturen. Het commando kan worden toegevoegd aan het dashboard en worden ingepland om on/off op bepaalde tijden te schakelen.

Maak een analoge sensor met het type 'Digital Out'.

De professionele manier is om een aparte relaisprintplaat met opto-isolatie en een flybackdiode te gebruiken. De relaisprint wordt dan gevoed door een aparte voeding en het relais wordt aangesloten op de digitale uitgang van de EMS-ESP zoals hierboven beschreven. De relaisprintplaat wordt vervolgens aangesloten op het apparaat dat je wilt besturen. Op deze manier is het apparaat volledig geïsoleerd van de EMS-ESP en kan de relaisprintplaat de hogere spanning en stroom aan.

## Entiteiten aanpassen

De Customization-pagina toont alle geregistreerde entiteiten en biedt de mogelijkheid om commando's en waarden uit te sluiten van publicatie via MQTT/API of ze te verwijderen uit WebUI-pagina's. De Apparaten en het Dashboard tonen alleen entiteiten met een waarde, terwijl de module Aanpassingen ze allemaal toont. Als een entiteit geen waarde heeft, wordt deze ondersteund door EMS-ESP, maar niet door uw boiler/thermostat/etc en wordt deze niet gepubliceerd of zichtbaar voor integraties zoals Home Assistant.

![Web](/media/screenshot/web_customizations.png)

## Acties plannen

Gebruik de planner om commando's op specifieke intervallen aan te roepen. Een paar voorbeelden:

- de warmwatertemperatuur 's ochtends en 's avonds op een hogere waarde instellen
- voer elke week een periodieke systeemherstart uit (hoewel dat niet nodig zou moeten zijn!) met `system/restart` in het opdrachtveld
- stuur een bericht naar het logboek en mqtt met de opdracht `system/message`
- gebruik in combinatie met een aangepaste 'ram'-entiteit om gegevens op te halen via een andere API zoals `{"url":"http://server.tld/path/file", "key":"nameofkey"}` en gebruik dit als voorwaarde in de planner
- gegevens verzenden naar een externe API, via een RESTful HTTP POST-commando, bijvoorbeeld `{"url":"http://192.168.0.100/cm?cmnd=power"} == {"power":"off"}`
- gebruiken om een Home Assistant-script of -service aan te roepen wanneer een voorwaarde wordt geactiveerd, bijv. `{ "url":"http://<ha ip>/api/services/script/my_script", "header":{"authorization":"Bearer <ha key>", "Content-Type":"application/json"} }`

:::warning HTTPS gebruiken in scheduleropdrachten HTTPS wordt alleen ondersteund op de ESP32- en ESP32-S3-varianten met PSRAM bij gebruik met `url` naar een extern eindpunt. De https zal terugvallen op het gebruik van http en kan een fout melden.
:::

Bij het maken van een scheduler-item is de `name` optioneel, maar het is handig om een naam toe te kennen en dan kun je het besturen via een commando (enable/disable) en de status zien in het MQTT topic `scheduler_data`.

![Web](/media/screenshot/web_scheduler.png)

De planner kan ook worden gebruikt om periodiek waarden in te stellen op basis van een andere entiteitswaarde of zelfs een door de gebruiker gedefinieerde aangepaste entiteit (variabele). Om bijvoorbeeld de aanvoertemperatuur van de ketel elke minuut in te stellen op basis van een door de gebruiker beheerde entiteit die extern wordt bestuurd (bijv. in Home Assistant), zou het er als volgt uitzien:

![Web](/media/screenshot/web_scheduler_custom.png) ![Web](/media/screenshot/web_scheduler_flowtemp.png)

### Voorwaarden

Geïntroduceerd in **versie 3.7**, is de Scheduler uitgebreid met ondersteuning voor voorwaardelijke verklaringen en formules die kunnen worden gebruikt in de `Command` and/or `Value` velden voor Timer, On Change en Condition types.

Voorwaarden hebben een strikte syntaxis (zie hieronder) en worden elke 10 seconden geëvalueerd. De voorwaarde wordt alleen uitgevoerd als de voorwaarde verandert van onwaar in waar. Dit is een krachtige nieuwe functie waarmee bijvoorbeeld een schema kan worden ingesteld op basis van een voorwaarde of een waarde kan worden ingesteld op basis van een voorwaarde.

Let op de volgende regels:

- een voorwaarde moet een logische waarde `0` of `1` zijn, de voorwaarde is `true` alleen voor `1`, een rekenkundig resultaat `1` wordt ook geïnterpreteerd als `true` planningsopdracht uitgevoerd voor `3 > 2, 3 - 2` planningsopdracht niet uitgevoerd voor `3 < 2`, `3 + 2`
- spaties zijn niet nodig, maar maken de formule leesbaarder
- EMS-ESP-waarden hebben toegang tot `<device>/<entity>` of `<device>/<entity>/value`. De `<entity>` kan extra voorvoegsels bevatten, zoals `<hc2>`.
- De instellingen voor Boolean Format (`0/1`, `off/on`, `OFF/ON` of `false/true`) en Enum Format (value/index) van de gebruiker worden gebruikt bij het evalueren van bool en enums. Controleer de juiste waarde voordat je een schema instelt door de API rechtstreeks te raadplegen. Ga bijvoorbeeld naar `http://ems-esp.local/api/thermostat` om te zien of het gebouw "medium" is en maak dan de regel met `thermostat/building == medium`.
- reeksen met speciale tekens moeten worden aangehaald. Bijvoorbeeld `boiler/pumpmode == "delta-P2"`, om een rekenfout bij delta min P2 te voorkomen.
- alle tekenreeksen worden geconverteerd naar kleine letters (vóór v3.7.2)
- opdrachten gevolgd door een scheidingsteken (`/`) moeten tussen haakjes worden gezet, bijvoorbeeld `(boiler/seltemp)/2`
- conditieopdracht wordt alleen uitgevoerd bij een wijziging van de conditie van `false` naar `true`. Als de voorwaarde waar blijft, wordt de opdracht niet herhaald
- een opdracht Waarde kan ook een formule zijn
- toegestane bewerkingen:
  - rekenen: `+` `-` `*` `/` `%`
  - functies: `round` `abs` `int` `exp` `log` `sqrt` `pow`, `hex`
  - logica: `==` `!=` `<=` `>=` `<` `>` `&&` `||`
  - voorvoegsel: `!` (niet) en `-` (ontkenning)
  - voorwaardelijke bewerkingen: `<cond1> ? <expr1> : <expr2>` Voorbeelden:
    - (toegestaan vóór v3.7.2) `<cond> ? 5 + <expr1> : 5 + <expr2>`
    - (toegestaan sinds v3.7.2) `5 + (<cond> ? <expr1> : <expr2>)` en cascadevoorwaarden `<cond1> ? <cond2> ? <expr1> : <expr2> : <cond3> ? <expr3> : <expr4>`

Een On Change-trigger is een lijst met entiteiten in de indeling `<device>/<entity>`, bijvoorbeeld `boiler/outdoortemp custom/setpoint`. Omdat entiteiten nooit tegelijkertijd veranderen, zijn logische bewerkingen zoals `&&` hier niet bruikbaar. Let op, het gebruik van `system` als `<device>` wordt niet ondersteund.

![Web](/media/screenshot/web_conditions_1.png)

![Web](/media/screenshot/web_conditions_2.png)

### Webopdrachten

Het verzenden of ophalen van gegevens via een webverzoek kan worden gebruikt in een json-commando:

- GET een waarde van webserver: `{"url":"http://server.tld/path/file"}`
- GET een json-waarde van de webserver en selecteer de sleutel: `{"url":"http://server.tld/path/file", "key":"nameofkey"}`
- een waarde instellen met POST: Opdracht: `{"url":"http://server.tld/path/file", "header":{"content-type":"text/plain", "token":"mytoken"}` Waarde: het postbericht, als het een json is, is de content-type header ingesteld in de header, deze hoef je niet in te stellen.

Voorbeelden:

- energiestatus krijgen van een tasmota plug voorbeeld: `{"url":"http://192.168.0.100/cm?cmnd=power", "key":"power"} == off` is identiek aan `{"url":"http://192.168.0.100/cm?cmnd=power"} == {"power":"off"}`
- een tasmoto-stekker instellen: `{"url":"http://192.168.0.100/cm?cmnd=power%20on"}`

### Kennisgeving

Met webcommando's kan een service als [pushover](https://pushover.net) worden gebruikt om een push-bericht over gebeurtenissen te versturen. Om een ander bericht te verzenden, maak je een aangepaste entiteit in RAM met de naam `message`, of wat je maar wilt. Maak een schema On Change dat de verandering van dit bericht triggert en het pushbericht verstuurt.

![grafik](https://github.com/user-attachments/assets/570576b5-b382-4ab2-bff3-4468291334a3)

Nu kun je andere schema's maken met de opdracht `custom/message` en afzonderlijke tekst als gegevens gebruiken.

## Aangepaste entiteiten toevoegen

Custom Entities is een geavanceerde en krachtige manier om EMS-ESP uit te breiden door je eigen EMS entiteiten toe te voegen die gegevens uit een specifiek EMS telegram halen. Dit is handig wanneer EMS-ESP een specifieke entiteit nog niet ondersteunt, of wanneer je gegevens uit een telegram wilt halen dat nog niet wordt ondersteund. Een ander veelvoorkomend gebruik is het debuggen of bekijken van specifiek gedrag bij het veranderen van parameters op een EMS-apparaat.

Een moderne warmtepomp kan bijvoorbeeld nieuwe functies hebben die niet in EMS-ESP zijn opgenomen. Hier zou je het `watch` commando kunnen gebruiken om het inkomende EMS-verkeer te bekijken in combinatie met het handmatig aanpassen van specifieke parameters en wanneer je het specifieke telegram en de offset hebt gevonden, een Custom Entity maken om het type te fine-tunen en de waarde te verifiëren. Vraag vervolgens of het wordt opgenomen in de volgende EMS-ESP release update.

![Web](/media/screenshot/web_customentities.png)
