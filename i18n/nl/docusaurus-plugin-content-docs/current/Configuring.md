---
id: Configuring
title: Configuring EMS-ESP
description: Complete guide to configuring EMS-ESP including first-time setup, WiFi, application settings, and customization options
---

# Configureren

## Eerste installatie

De standaard 'fabrieksinstelling' start een wifi-toegangspunt met de naam `ems-esp`. Maak hier verbinding mee met het WPA-wachtwoord `ems-esp-neo`. Wanneer er een inlogscherm (captive portal) verschijnt, log dan in met de gebruikersnaam `admin` en het wachtwoord `admin`. Deze gegevens kunnen later worden gewijzigd. Als u een ethernetkaart hebt, kunt u rechtstreeks verbinding maken met het IP-adres ervan of via `http://ems-esp` of `http://ems-esp.local`.

Nu bent u klaar om de instellingen verder te configureren. Als u nog geen verbinding hebt met uw wifi-netwerk, moet u dit eerst doen via de pagina Instellingen->Netwerk. U kunt dit ook via de console doen wanneer u bent aangesloten op een Serial/USB-poort en de commando’s `set wifi ssid` en `set wifi password` gebruikt.

Als je waarschuwingen krijgt dat er geen verbinding kon worden gemaakt met de EMS-bus, of als er Tx- of Rx-fouten optreden, volg dan de handleiding [troubleshooting](Troubleshooting).

:::note
Als je in het logboek de melding 'Rx incomplete telegrams' ziet staan, raak dan niet in paniek. Sommige telegrammen kunnen verloren gaan, wat meestal wordt veroorzaakt door ruis op de lijn.
:::

In het volgende gedeelte worden enkele belangrijke instellingen beschreven die via de WebUI kunnen worden aangepast; deze zijn te vinden onder het kopje ‘Instellingen’. De meeste spreken voor zich, dus worden hier alleen de belangrijkste beschreven.

## Toepassingsinstellingen

### Diensten

- **De autorisatie via een toegangstoken bij API-aanroepen omzeilen**. Voor RESTful-schrijfopdrachten via HTTP POST is het toegangstoken vereist. Dit is om veiligheidsredenen, om te voorkomen dat iemand de apparaatinstellingen kan wijzigen. Als je deze vlag instelt, wordt de API vrij toegankelijk. Niet aanbevolen!
- **Telnet-console inschakelen**. Deze optie is standaard ingeschakeld en stelt gebruikers in staat verbinding te maken met de onbeveiligde Telnet-server op poort 23.
- **Modbus inschakelen**. Deze functie is standaard uitgeschakeld en stelt gebruikers in staat verbinding te maken met de Modbus TCP-server (standaardpoort 502). Vanwege beperkte geheugenruimte is deze functie alleen beschikbaar op kaarten met extra PSRAM.
- **Syslog inschakelen**:
  - **IP** is het IP-adres van een syslog-server voor het vastleggen van logbestanden op afstand. Laat dit veld leeg als u geen gebruik maakt van SysLog. Let op: EMS-ESP maakt gebruik van het standaard [RFC5424](https://datatracker.ietf.org/doc/html/rfc5424)-protocol. Zorg er dus voor dat uw syslog-server is geconfigureerd om deze berichten te verwerken en niet bijvoorbeeld RFC3164 (BSD Syslog).
  - **Poort** indien je een ander poortnummer gebruikt. De standaardwaarde is 514. Er wordt gebruikgemaakt van UDP (niet van TCP).
  - **Logniveau** bepaalt het maximale logniveau voor gerapporteerde berichten. Het hoogste niveau is DEBUG; hierbij worden veel loggegevens verzonden, dus wees voorzichtig bij het gebruik ervan.
  - **Mark Interval** verstuurt een speciaal `mark`-bericht naar de SysLog. Dit is handig voor het meten van de tijd tussen gebeurtenissen.

### Sensoren

- **Analoge sensoren inschakelen**. Hiermee kan elke GPIO signalen registreren, of het nu gaat om een digitale I/O, een pulsteller of een ADC die mV meet. Er zijn ook nog veel meer opties beschikbaar. Let op: `Factor` is een deler.
- **1-Wire-parasitaire voeding inschakelen**. Selecteer deze optie wanneer u (Dallas) temperatuursensoren met parasitaire voeding gebruikt.

### Opmaakopties

- **Taal**. Hiermee stel je de taal in die wordt gebruikt voor de namen van EMS-apparaatentiteiten, zoals weergegeven in de WebUI onder ‘Apparaten’ en op het dashboard, en ook voor MQTT-detectie. De standaardtaal is Engels. Wanneer u Home Assistant gebruikt en de taal wijzigt, moet u voor de zekerheid mogelijk de eerdere EMS-ESP MQTT-vermeldingen verwijderen (via HA’s Instellingen -> Apparaten & Diensten -> MQTT) en EMS-ESP opnieuw opstarten.
- **Dashboard voor Booleaanse formaten**. Zo worden Booleaanse waarden weergegeven in de WebUI en in MQTT-payloads.
- **Booleaanse notatie API/MQTT**. Zo worden booleaanse waarden weergegeven in de MQTT-payloads en de JSON-uitvoer van de API.
- **Enum-formaat API/MQTT**. Zo worden lijstwaarden weergegeven in de MQTT-payloads en de API-JSON: ofwel op basis van hun waarde, ofwel op basis van hun indexpositie binnen de lijst. Als je Home Assistant gebruikt, zie je voor sommige entiteiten echter geen waarden, maar gehele getallen; in plaats van bijvoorbeeld `off, hot, cold` wordt dan `0, 1, 2` weergegeven.
- **Temperatuurwaarden omrekenen naar Fahrenheit**. Voor onze Amerikaanse vrienden.
- **EMS-telegrammen in hexadecimale notatie vastleggen** zorgt ervoor dat de telegrammen overal in onbewerkte vorm als hexadecimale waarden worden opgeslagen.

### Hardware-instellingen

- **Boardprofiel**. Boardprofielen zijn vooraf geconfigureerde GPIO-instellingen voor een reeks veelgebruikte ESP32-ontwikkelingsboards en EMS Gateway-circuits. De volgende profielen zijn beschikbaar:

| `profile name` | `based on board` | `led` | `dallas` | `rx` | `tx` | `button` | `phy_type` | `eth_power` | `eth_phy_addr` | `eth_clock_mode` |
| -------------- | ---------------------- | ----- | -------- | ---- | ---- | -------- | ---------- | ----------- | -------------- | ---------------------------- |
| S32 | BBQKees Gateway S32    | 2     | 18 | 23   | 5    | 0 | | | | |
| E32 | BBQKees Gateway E32    | 2     | 4 | 5    | 17   | 33 | LAN8720    | 16 | 1 | ingang naar GPIO0 |
| E32V2 | BBQKees Gateway E32 V2 | 2     | 14 | 4    | 5    | 34 | LAN8720    | 15 | 0 | uitgang via GPIO0 |
| S32S3 | BBQKees Gateway S3     | 2     | 18 | 5    | 17   | 0 | | | | |
| MH-ET | MH-ET Live D1 Mini     | 2     | 18 | 23   | 5    | 0 | | | | |
| NODEMCU | NodeMCU 32S | 2     | 18 | 23   | 5    | 0 | | | | |
| LOLIN | Lolin D32 | 2     | 18 | 17   | 16   | 0 | | | | |
| OLIMEX | Olimex ESP32-EVB | 0     | 0 | 36   | 4    | 34 | LAN8720    | -1 | 0 | ingang naar GPIO0 |
| OLIMEXPOE | Olimex ESP32-POE | 0     | 0 | 36   | 4    | 34 | LAN8720    | 12 | 0 | uitgang via GPIO17, geïnverteerd |
| C3MINI | Lolin C3 Mini | 7     | 1 | 4    | 5    | 9 | | | | |
| S2MINI | Lolin S2 Mini | 15    | 7 | 11   | 12   | 0 | | | | |
| S3MINI | Liligo S3 | 17    | 18 | 8    | 5    | 0 | | | | |

Om een aangepast bord te configureren, moet je eerst `Developer mode` inschakelen. Als je `Custom` kiest, verschijnen de volgende extra instellingen waarmee je de GPIO’s handmatig kunt aanpassen aan je eigen bord. Je kunt ook op elk moment `Custom` selecteren om de huidige instellingen van het bordprofiel weer te geven, zonder deze op te slaan.

_Aangepaste instellingen voor het bord:_

- **Rx GPIO**. Dit is de GPIO-pin waaraan het Rx-signaal is toegewezen. Standaard is dit GPIO 23, maar het kan vrijwel elke vrije pin zijn. Sluit deze GPIO-pin aan op de RX-poort op de EMS-interfacekaart.
- **Tx GPIO**. Dit is de GPIO-pin waaraan het Tx-signaal is toegewezen. Standaard is dit GPIO 5, maar het kan vrijwel elke vrije pin zijn. Sluit deze GPIO-pin aan op de TX-poort op de EMS-interfacekaart.
- **GPIO-knop**. Dit is de GPIO-pin waaraan de knop is toegewezen. Het is een pull-up. De knop wordt voor verschillende functies gebruikt. Een enkele klik doet niets, een dubbele klik zorgt voor een wifi-reset en maakt opnieuw verbinding met het AP, 10 seconden lang ingedrukt houden en loslaten voert een fabrieksreset uit en zeer lang ingedrukt houden (minstens 20 seconden) zonder los te laten, start de EMS-ESP opnieuw op vanaf de initiële opstartpartitie.
- **Temperatuur-GPIO**. Dit is de pin waarop eventuele externe temperatuursensoren worden aangesloten. De Dallas-chips DS1822, DS18S20, DS18B20 en DS1825 worden ondersteund, inclusief hun parasitaire varianten, en kunnen ook in serie worden geschakeld op één enkele lijn, tot maximaal 100 sensoren.
- **LED GPIO**. Dit is de pin voor de LED; standaard is dit de ingebouwde LED op het ESP-ontwikkelingsbord.
- **Eth PHY-type**. Dit is het type Ethernet-chip dat wordt gebruikt.

:::note
Op ESP32-ontwikkelingsboards zijn vaak ook pinnen te vinden met de aanduiding RX en TX. Deze zijn echter meestal aangesloten op de USB-chip en kunnen niet worden gebruikt voor het EMS-interfacecircuit.
:::

- **EMS Tx-modus**. De Tx-modus is de modus waarin EMS-ESP telegrammen via de EMS-bus verzendt. Kies de modus die het beste bij uw systeem past en let op Tx-fouten in het webdashboard en `show ems` in de console. Het wijzigen van de waarde heeft onmiddellijk effect.
  - `EMS` is de standaardinstelling voor EMS1.0-systemen, maar is ook compatibel met de meeste andere busprotocollen.
  - `EMS+` is ontworpen om beter te werken op EMS2.0/EMS+-systemen.
  - `HT3` voor Heatronics3, voornamelijk gebruikt door Junkers.
  - `Hardware` maakt gebruik van de interne hardware van de ESP om het telegram te verzenden. Telegrammen worden onmiddellijk verzonden. Dit is de snelste en meest efficiënte methode, maar werkt alleen op bepaalde systemen.
  - `Auto` controleert de ontvangen bustelegrammen om het optimale tijdstip voor `EMS`, `EMS+` of `HT3` te bepalen.
- **EMS-bus-ID**. De EMS-ESP kan meerdere apparaten simuleren. Houd de standaardinstelling `Gateway 2 (0x49)` aan, tenzij je meer dan één EMS gateways/interface-kaart gebruikt of er conflicten zijn met andere EMS-apparaten. Het is belangrijk om te weten dat de servicesleutel (0x0B), die tot en met EMS-ESP-versie 3.8.1 als standaard wordt gebruikt, ook door gecertificeerde service/maintenance-technici wordt gebruikt bij het onderhoud van uw verwarmingssystemen en dat dit tot conflicten kan leiden. Zorg ervoor dat u de EMS-ESP uitschakelt vóór onderhoudswerkzaamheden of wijzig de EMS-bus-ID voordat de technici arriveren; anders kunnen zij geen verbinding maken en uw verwarmingssysteem niet onderhouden.
- **Schakel de alleen-lezenmodus in**. Hierdoor worden alle uitgaande Tx-schrijfopdrachten naar de EMS-bus uitgeschakeld, waardoor de EMS-ESP in feite in de luistermodus wordt gezet. Tx is echter wel nodig om EMS-apparaten te detecteren (aangezien het een Version-opdracht verstuurt). Als u EMS-ESP expliciet in een lees-only/sniffer-modus wilt zetten, gebruikt u `set tx_mode 0` vanaf de console.
- **LED verbergen**. Schakelt de LED uit in de normale bedrijfsmodus. De LED blijft branden tijdens het opstarten of wanneer er verbindingsproblemen zijn.
- **CPU-snelheid verlagen**. Verlaagt de kloksnelheid van de ESP naar 160 MHz, waardoor energie en warmte worden bespaard en de levensduur van de chip wordt verlengd, ten koste van de prestaties en de responstijd. EMS-ESP moet opnieuw worden opgestart.

### Speciale functies

- **Ontwikkelaarsmodus** schakelt geavanceerde functies in de WebUI in, zoals het commando ‘Read’ uit het systeemlogboek en het configureren van een aangepast bord.
- **Start de ketel met de geforceerde verwarming uitgeschakeld**.
- **Uitschakeling op afstand bij ontbrekende kamertemperatuur**. Dit is een veiligheidsfunctie die voorkomt dat de ketel start wanneer de gesimuleerde kamertemperatuursensor ontbreekt of niet werkt.
- **Douchetimer inschakelen**. Schakel deze functie in om bij te houden hoe lang het warme water stroomt; er wordt dan een MQTT-bericht verzonden met de duur. De timer start pas na minimaal 2 minuten.
- **Douchewaarschuwing inschakelen**. Deze functie is nog enigszins experimenteel en werkt mogelijk niet bij alle boilers. Na 7 minuten (instelbaar) warm water laten lopen, wordt er een waarschuwing gegeven door gedurende 10 seconden (ook instelbaar) koud water te laten stromen. De boiler schakelt hiervoor over naar de testmodus, dus wees voorzichtig bij het gebruik!

## Netwerkconfiguratie

Op de pagina ‘Netwerk’ kun je EMS-ESP verbinden met je thuisnetwerk. Je kunt kiezen tussen wifi en ethernet, mits de hardwarekaart dit ondersteunt. Let op: de wifi-standaard moet 2.4GHz/WPA2 zijn. Het apparaat maakt geen verbinding met een 5 GHz wifi-toegangspunt.

### CORS (Cross-Origin Resource Sharing)

Wanneer CORS is ingeschakeld, worden aan elk webverzoek nieuwe HTTP-headers toegevoegd, zodat de web-API `fetch`- en `XMLHttpRequest`-verzoeken over verschillende domeinen heen kan uitvoeren. Hiermee wordt de pre-flight-controle uitgeschakeld, die standaard het same-origin-beleid volgt. Zie [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) voor meer informatie. Er is ook een browser-add-on genaamd „CORS unblock“ die op dezelfde manier werkt.

Schakel deze functie in wanneer je via een VPN werkt of wanneer er andere servers (zoals Grafana) op andere domeinen draaien die verzoeken sturen naar de API van EMS-ESP.

## MQTT instellen

- **Adres van de broker**. Gebruik het IP-adres, niet een FQDN.
- **Poort**. De standaardwaarden zijn 1883 en 8883 voor SSL.
- **TLS inschakelen** versleutelt de verbinding met de broker. **Controleer de broker aan de hand van** een CA-certificaat of de SHA-1-vingerafdruk van het certificaat van de broker, zodat EMS-ESP alleen verbinding maakt met uw broker. Zie [Securing your gateway](Securing.md#mqtt).
- **Basis**. Alle onderwerpen worden voorafgegaan door `Base`, dus dit is belangrijk. Zorg ervoor dat dit uniek is wanneer je meer dan één EMS-ESP bij dezelfde broker gebruikt.
- **Client-ID**. Dit wordt intern gebruikt om EMS-ESP bij de broker te identificeren en is optioneel. Let op: aan MQTT-onderwerpen wordt de hostnaam (standaard `ems-esp`) toegevoegd, en niet de client-ID. Gebruik dit wanneer je meerdere apparaten hebt.
- **Gebruikersnaam** en **wachtwoord** zijn optioneel, maar worden om veiligheidsredenen aanbevolen. Standaard vereist de Mosquitto MQTT-broker een username/password, dus let hier goed op als je de Home Assistant-add-on gebruikt.
- **Schone sessie instellen**. Maakt een niet-permanente sessie aan wanneer deze optie is ingeschakeld. De standaard- en aanbevolen instelling is ‘uitgeschakeld’, zodat deze optie uitgeschakeld blijft bij het gebruik van domoticasystemen.
- **QoS**. Quality of Service, 0, 1 of 2. 0 is de standaardinstelling en geschikt voor de meeste situaties. Bij een waarde van 1 wordt gegarandeerd dat het bericht is verzonden, maar dit leidt tot iets meer netwerkverkeer en overhead.
- **Stel altijd de optie ‘Retain Flag’ in**. Schakel deze optie in als je alle berichten op de MQTT-broker wilt bewaren. Standaard is deze optie uitgeschakeld.
- **Opmaak**. De optie `Nested` groepeert alle apparaatgegevens in één enkel MQTT-onderwerp door gebruik te maken van ingebedde JSON-objecten, zoals `dhw` in `boiler_data`, `hc1` in `thermostat_data` enz. `As individual topics` splitst dit op in afzonderlijke MQTT-onderwerpen zonder ze te groeperen, zodat de MQTT-onderwerpen `boiler_data` en `boiler_data_dhw`, `thermostat_data` en `thermostat_data_hc1` enzovoort worden. Hetzelfde geldt voor de analoge en temperatuursensoren. De standaardinstelling is ‘genest’.
- **De uitvoer van een commando publiceren naar een 'response'-topic**. Hierbij wordt de uitvoer van een API-commando gebruikt om het resultaat te publiceren in een topic met de naam `response`.
- **Onderwerpen met één waarde publiceren bij wijzigingen**. Met deze optie worden het onderwerp en de payload voor elke bewerking onmiddellijk gepubliceerd; deze optie is alleen beschikbaar wanneer MQTT Discovery is uitgeschakeld.
- **MQTT Discovery inschakelen**: hiermee wordt de integratie via MQTT Discovery ingeschakeld, die volledig wordt ondersteund door Home Assistant en gedeeltelijk door Domoticz.
  - **Type detectie**. Kies tussen "Home Assistant" en twee protocollen voor "Domoticz". `Domoticz (latest)` maakt gebruik van Numbers, Switches, Select en andere moderne typen, terwijl `Domoticz` voor alles alleen Sensors gebruikt en bovendien alle voorwaarden in de sjablonen verwijdert.
  - **Indeling van de entiteits-ID**: Er zijn 3 opties. De eerste `single instance, long names` maakt gebruik van het oudere `< v3.5`-formaat. De standaard- en aanbevolen instelling voor alle nieuwe installaties is de tweede optie, genaamd `Single instance, short name`, die gebruikmaakt van de EMS-ESP-apparaatentiteitsnaam. Deze is vast en kan worden bekeken op de `Settings->Customization`-pagina. De laatste optie moet worden gebruikt wanneer er meer dan één versie van de EMS-ESP-firmware draait, omdat deze elke versie uniek maakt door alle MQTT-onderwerpen te voorzien van een voorvoegsel met de basisnaam.
  - **Invoerformaat voor getallen**: (alleen HA) Kies tussen de keuzelijst of de schuifbalk. Schuifbalken worden alleen gebruikt voor getallen met een bereik kleiner dan 100.
- **Verzendintervallen**. Dit gedeelte geldt per apparaat en bepaalt hoe vaak een MQTT-bericht wordt verzonden. Als deze waarde op 0 is ingesteld, verzendt EMS-ESP automatisch gegevens zodra er een merkbare verandering optreedt, wat al binnen enkele seconden kan gebeuren.

## NTP instellen

- De standaard **NTP-server** is `time.google.com`. Dit kan worden gewijzigd in een lokale NTP-server of een specifieke server, zoals `pool.ntp.org`.
- De standaard **tijdzone** is "Europe/Amsterdam". Deze kan worden gewijzigd in een van de [IANA Time Zone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)-tijdzones.

## Gebruikers en rollen beheren

Op de pagina ‘Beveiliging’ kun je het standaardwachtwoord voor het captive portal en de Telnet-CLI wijzigen. Daarnaast kun je hier HTTPS inschakelen voor het captive portal en de MQTT-broker.

Op de pagina ‘Gebruikers’ kun je extra gebruikers aanmaken voor het captive portal en de Telnet-CLI. De standaardgebruiker is `admin` met het wachtwoord `admin`.

Elke gebruiker heeft een uniek toegangstoken (te bekijken door op het sleutelpictogram te klikken) dat wordt gebruikt voor RESTful-schrijfopdrachten via HTTP POST. Dit is om veiligheidsredenen, om te voorkomen dat iemand de apparaatinstellingen kan wijzigen.

![Web](/media/screenshot/web_users.png)

## Analoge en temperatuursensoren toevoegen

Externe sensoren, zoals temperatuursensoren en analoge sensoren, kunnen worden aangesloten op verschillende GPIO-pinnen van de ESP32-chip. Als je een BBQKees Gateway-kaart gebruikt, beschikt deze al over een externe aansluiting voor Dallas-temperatuursensoren, die zonder verdere configuratie zichtbaar zijn in de WebUI. BBQKees-kaarten zijn CE-gecertificeerd en het aansluiten van sensoren op de GPIO's leidt tot het niet langer voldoen aan de EMC-normen. Als u op eigen risico analoge sensoren wilt aansluiten, kies dan een ander kaartprofiel of gebruik de ontwikkelaarsmodus om een aangepaste kaart te configureren.

Om analoge sensoren toe te voegen, klik je op `Add` en kies je tussen een normale digitale sensor in/out, een teller (die on/off pulsen telt), een ADC voor het meten van spanningen, een timer, een snelheidssensor en PWM 0-2. Let op: de tellerstand wordt opgeslagen en wordt bij het opnieuw opstarten niet gereset.

![Web](/media/screenshot/web_sensor.png)

:::warning
Let goed op bij het kiezen van een GPIO, zodat deze niet in conflict komt met de andere gebruikte GPIO's (je kunt het bordprofiel ‘CUSTOM’ selecteren om je huidige configuratie te bekijken).

    De EMS-ESP is aangesloten op de laagspanningsbus van uw verwarmingsinstallatie en eventuele overspanning kan de EMS-ESP-printplaat en mogelijk ook uw verwarmingsapparaten beschadigen. Sluit externe apparatuur nooit rechtstreeks aan op de EMS-ESP-printplaat.

    ESP32-ontwikkelingsboards verschillen qua beschikbare pinconfiguratie. Meestal kun je de pinnen 1, 6-11, 12, 14, 15, 20, 24, 28-31 en 40+ niet gebruiken. Zie deze links [here](https://diyprojects.io/esp32-how-to-use-gpio-digital-io-arduino-code/#.YFpVEq9KhjG) en [here](https://nodemcu.readthedocs.io/en/dev-esp32/modules/gpio/).

:::

De volgende GPIO's worden aanbevolen:

- digitale uitvoer: `13, 19, 21, 22, 27, 33, 37, 38`
- digitaal input/counter/timer/rate: `13, 19, 21, 22, 25, 26, 27, 33, 35, 37, 38, 39 (note no pullup on 35 & 39)`
- ADC-ingang: `13, 19, 21, 22, 25, 26, 27, 33, 35, 37, 38, 39`
- DAC-uitgang: `25, 26`
- PWM-uitgang: `13, 19, 21, 22, 25, 26, 27, 33, 37, 38`

Beperkingen:

- ADC: maximale ingangsspanning 3,3 V, wordt weergegeven in millivolt
- DAC 8-bits, waardebereik 0..255 voor een uitgang van 0 V tot 3,3 V, te configureren als `Digital out` op GPIO 25 of 26 (ESP32), 17, 18 (ESP32S2), niet beschikbaar voor ESP32S3, ESP32C3
- PWM 0-2: maximale frequentie 5000 Hz, resolutie 13 bits. Elk kanaal kan slechts voor één GPIO worden gebruikt.
- Pulse is een digitale uitgang voor een enkele puls met een instelbare duur. Wanneer via een commando de waarde `on` wordt ingesteld, gaat de sensor naar `off` zodra de puls is voltooid.
- Counter/timer/rate trigger: `high->low edge with 15 ms debounce. Only for low pulse rates < 30Hz.`
- Teller 0-2, Frequentie 0-2: hogesnelheidsingangen voor signalen van 1 Hz tot 100 kHz, geen ontdamping; gebruik een RC-filter bij ruisgevoelige signalen. Interruptgestuurd; elk kanaal kan slechts voor één GPIO worden gebruikt.

De tellerstanden worden opgeslagen in reboot/update en elk uur in nvs. Bij systeemstoringen of stroomuitval kan de waarde daarna lager zijn.

### Relais aansturen

Een veelvoorkomend gebruiksscenario is het aansturen van een relais om on/off een apparaat in of uit te schakelen. Dit kan worden gedaan door een digitale uitgangssensor toe te voegen en vervolgens een commando te maken om deze aan te sturen. Het commando kan aan het dashboard worden toegevoegd en zo worden ingepland dat het on/off op bepaalde tijdstippen wordt uitgevoerd.

Maak een analoge sensor aan met het type 'Digitale uitgang'.

De professionele manier is om een aparte relaiskaart met opto-isolatie en een flyback-diode te gebruiken. De relaiskaart wordt dan gevoed door een aparte voeding en het relais wordt aangesloten op de digitale uitgang van de EMS-ESP, zoals hierboven beschreven. De relaiskaart wordt vervolgens aangesloten op het apparaat dat je wilt aansturen. Op deze manier is het apparaat volledig geïsoleerd van de EMS-ESP en kan de relaiskaart de hogere spanning en stroom aan.

## Entiteiten aanpassen

Op de pagina ‘Aanpassing’ worden alle geregistreerde entiteiten weergegeven en kunt u commando’s en waarden uitsluiten van publicatie via MQTT/API of ze verwijderen uit WebUI-pagina’s. De secties ‘Apparaten’ en ‘Dashboard’ tonen alleen entiteiten met een waarde, terwijl de module ‘Aanpassing’ ze allemaal weergeeft. Als een entiteit geen waarde heeft, wordt deze wel ondersteund door EMS-ESP, maar niet door uw boiler/thermostat/etc en zal deze niet worden gepubliceerd of zichtbaar zijn voor integraties zoals Home Assistant.

![Web](/media/screenshot/web_customizations.png)

## Acties plannen

Gebruik de planner om op gezette tijden opdrachten uit te voeren. Enkele voorbeelden:

- stel de temperatuur van het warm water ’s ochtends en ’s avonds hoger in
- voer elke week een periodieke herstart van het systeem uit (hoewel dat eigenlijk niet nodig zou moeten zijn!) door `system/restart` in het veld ‘Command’ in te voeren
- stuur een bericht naar het logboek en MQTT met behulp van het commando `system/message`
- gebruik in combinatie met een aangepaste 'ram'-entiteit om gegevens op te halen via een andere API, zoals `{"url":"http://server.tld/path/file", "key":"nameofkey"}`, en gebruik dit als voorwaarde in de planner
- gegevens verzenden naar een externe API via een RESTful HTTP POST-commando, bijvoorbeeld `{"url":"http://192.168.0.100/cm?cmnd=power"} == {"power":"off"}`
- gebruik dit om een Home Assistant-script of -service aan te roepen wanneer aan een voorwaarde wordt voldaan, bijvoorbeeld `{ "url":"http://<ha ip>/api/services/script/my_script", "header":{"authorization":"Bearer <ha key>", "Content-Type":"application/json"} }`

:::waarschuwing[Gebruik van HTTPS in scheduler-opdrachten]
HTTPS wordt alleen ondersteund op de ESP32- en ESP32-S3-varianten met PSRAM bij gebruik van `url` naar een extern eindpunt. Het https-verkeer zal dan terugvallen op http en er kan een foutmelding worden weergegeven.
:::

Bij het aanmaken van een planneritem is de `name` optioneel, maar het is handig om er een naam aan toe te wijzen. Zo kun je het vervolgens via een commando (enable/disable) aansturen en de status bekijken in het MQTT-onderwerp `scheduler_data`.

![Web](/media/screenshot/web_scheduler.png)

De planner kan ook worden gebruikt om periodiek waarden in te stellen op basis van de waarde van een andere entiteit, of zelfs een door de gebruiker gedefinieerde aangepaste entiteit (variabele). Om bijvoorbeeld de aanvoertemperatuur van de ketel elke minuut in te stellen op basis van een door de gebruiker beheerde entiteit die extern wordt aangestuurd (bijvoorbeeld in Home Assistant), zou dat er als volgt uitzien:

![Web](/media/screenshot/web_scheduler_custom.png)
![Web](/media/screenshot/web_scheduler_flowtemp.png)

### Voorwaarden

De Scheduler, die in **versie 3.7** is geïntroduceerd, is uitgebreid met ondersteuning voor voorwaardelijke instructies en formules die kunnen worden gebruikt in de velden `Command` and/or `Value` voor de typen Timer, On Change en Condition.

Voorwaarden hebben een strikte syntaxis (zie hieronder) en worden elke 10 seconden geëvalueerd. De voorwaarde wordt alleen uitgevoerd wanneer de waarde ervan verandert van ‘false’ naar ‘true’. Dit is een krachtige nieuwe functie waarmee je bijvoorbeeld een schema kunt instellen op basis van een voorwaarde of een waarde kunt instellen op basis van een voorwaarde.

Houd rekening met de volgende regels:

- een voorwaarde moet een logische waarde `0` of `1` zijn; de voorwaarde is alleen `true` voor `1`; een rekenresultaat `1` wordt ook geïnterpreteerd als `true`
  schema-opdracht uitgevoerd voor `3 > 2, 3 - 2`
  schema-opdracht niet uitgevoerd voor `3 < 2`, `3 + 2`
- spaties zijn niet nodig, maar maken de formule wel overzichtelijker
- De EMS-ESP-waarden worden opgevraagd via `<device>/<entity>` of `<device>/<entity>/value`. De `<entity>` kan aanvullende voorvoegsels bevatten, zoals `<hc2>`.
- De instellingen van de gebruiker voor het Booleaanse formaat (`0/1`, `off/on`, `OFF/ON` of `false/true`) en het Enum-formaat (value/index) worden gebruikt bij het evalueren van booleaanse waarden en enums. Controleer de juiste waarde voordat u een schema instelt door rechtstreeks een verzoek aan de API te sturen. Ga bijvoorbeeld naar `http://ems-esp.local/api/thermostat` om te zien of de bouwfase „medium“ is, en maak vervolgens de regel aan met `thermostat/building == medium`.
- Teksten die speciale tekens bevatten, moeten tussen aanhalingstekens worden geplaatst. Bijvoorbeeld `boiler/pumpmode == "delta-P2"`, om een rekenfout bij delta minus P2 te voorkomen.
- alle tekenreeksen worden omgezet naar kleine letters (vóór v3.7.2)
- commando's die worden gevolgd door een scheidingsteken (`/`) moeten tussen haakjes worden geplaatst, bijvoorbeeld `(boiler/seltemp)/2`
- Het `condition`-commando wordt alleen uitgevoerd wanneer de voorwaarde verandert van `false` naar `true`. Als de voorwaarde waar blijft, wordt het commando niet herhaald
- De waarde van een commando kan ook een formule zijn
- toegestane bewerkingen:
  - rekenkunde: `+` `-` `*` `/` `%`
  - functies: `round` `abs` `int` `exp` `log` `sqrt` `pow`, `hex`
  - logica: `==` `!=` `<=` `>=` `<` `>` `&&` `||`
  - voorvoegsel: `!` (niet) en `-` (ontkenning)
  - voorwaardelijke bewerkingen: `<cond1> ? <expr1> : <expr2>` Voorbeelden:
    - (toegestaan vóór v3.7.2) `<cond> ? 5 + <expr1> : 5 + <expr2>`
    - (toegestaan sinds v3.7.2) `5 + (<cond> ? <expr1> : <expr2>)` en trapsgewijze voorwaarden `<cond1> ? <cond2> ? <expr1> : <expr2> : <cond3> ? <expr3> : <expr4>`

Een ‘On Change’-trigger is een lijst met entiteiten in de indeling `<device>/<entity>`, bijvoorbeeld `boiler/outdoortemp custom/setpoint`.
Aangezien entiteiten nooit tegelijkertijd veranderen, hebben logische bewerkingen zoals `&&` hier geen zin. Let op: het gebruik van `system` in plaats van `<device>` wordt niet ondersteund.

![Web](/media/screenshot/web_conditions_1.png)

![Web](/media/screenshot/web_conditions_2.png)

### HTTP/HTTPS-verzoeken

Het verzenden of ophalen van gegevens via HTTP/HTTPS-verzoeken is mogelijk door een JSON-object als Scheduler-commando of -waarde te verzenden.

Gebruik de notatie `{"url":"<url>", ["header":"<header>"], ["method":"<method>"], ["key":"<key>"], ["keys":"<keys>"]}`,

`url` is de URL van het eindpunt waarnaar gegevens moeten worden opgehaald of verzonden in de vorm `http://server.tld/path/file` en is verplicht. Zowel HTTP als HTTPS worden ondersteund.

`header` is standaard ingesteld op `{"content-type":application/json"}` wanneer de Scheduler `Value` een JSON-object is; anders is de waarde ingesteld op `{"content-type":"text/plain"}`. Dit kan worden overschreven met een aangepaste header of door een token zoals `{"content-type":"application/json", "token":"mytoken"}` in de header op te nemen.

`method` is standaard ingesteld op `GET`, maar kan worden overschreven met de methode `POST`, `PUT`, `DELETE` of `PATCH`. Als de Scheduler `Value` een JSON-object is, wordt deze automatisch ingesteld op `POST` bij het verzenden van de gegevens.

`key` en `keys` kunnen worden gebruikt om bij het uitvoeren van een GET-verzoek specifieke JSON-objecten uit de geretourneerde payload te halen.

#### Voorbeelden:

#### De nieuwste EMS-ESP-versies ophalen en deze opslaan in een veld voor aangepaste entiteiten

Opdracht: `custom/latest_version`
Waarde: `{"url":"https://emsesp.org/versions.json"}`

`latest_version` is de naam van de aangepaste entiteit waarin de nieuwste EMS-ESP-versie als RAM-waarde wordt opgeslagen.

#### De inhoud van een aangepaste entiteit naar de Pushover-meldingsdienst verzenden

Opdracht: `{"url":"https://api.pushover.net/1/messages.json"}`
Waarde: `{"user":"<user id>", "token":"<token>", "message":custom/<name>}`

Hierbij wordt de [Pushover](https://pushover.net)-API gebruikt om een bericht naar de Pushover-meldingsdienst te verzenden.

`<name>` is de naam van de aangepaste entiteit van het te verzenden bericht.

#### De status van een Tasmota-stekker uitlezen (GET)

Waarde: `{"url":"http://<tasmota IP>/cm?cmnd=Power", "key":"POWER"}`

#### Om te controleren of een Tasmota-stekker aan of uit staat (GET)

Waarde: `{"url":"http://<tasmota IP>/cm?cmnd=power", "key":"power"} == off`
of `{"url":"http://<tasmota IP>/cm?cmnd=power"} == {"power":"off"}`

#### De stroomstatus van een Tasmota-stekker instellen (GET)

Opdracht: `{"url":"http://<tasmota IP>/cm?cmnd=power%20on"}`

#### Een Shelly-relais inschakelen (GET)

Opdracht: `{"url":"http://<shelly IP>/relais/0?turn=on"}`

## Aangepaste entiteiten toevoegen

Aangepaste entiteiten vormen een geavanceerde en krachtige manier om EMS-ESP uit te breiden door je eigen EMS-entiteiten toe te voegen waarmee gegevens uit een specifiek EMS-telegram kunnen worden geëxtraheerd. Dit is handig wanneer EMS-ESP een specifieke entiteit nog niet ondersteunt, of wanneer je gegevens wilt extraheren uit een telegram dat nog niet wordt ondersteund. Een andere veelvoorkomende toepassing is het opsporen van fouten of het observeren van specifiek gedrag bij het wijzigen van parameters op een EMS-apparaat.

Een moderne warmtepomp kan bijvoorbeeld over nieuwe functies beschikken die niet in EMS-ESP zijn opgenomen. In dat geval zou u de `watch`-opdracht gebruiken om het inkomende EMS-verkeer te bekijken, in combinatie met het handmatig aanpassen van specifieke parameters. Zodra u het specifieke telegram en de offset hebt gevonden, maakt u een aangepaste entiteit aan om het type nauwkeurig af te stemmen en de waarde te verifiëren. Vervolgens vraagt u aan om dit op te nemen in de volgende update van EMS-ESP.

![Web](/media/screenshot/web_customentities.png)
