---
id: Troubleshooting
---
# Problemen oplossen

Hieronder vind je antwoorden op enkele veelvoorkomende problemen.

## Problemen met de firmware-installatie

### Kan niet uploaden via de webinterface

Als u de firmware uploadt via de webinterface en u ziet de foutmelding "Invalid file extension or incompatible bin file" (Ongeldige bestandsextensie of incompatibel bin-bestand), controleer dan of u het juiste binaire firmwarebestand gebruikt dat overeenkomt met uw bord en ESP32-chipset. Als dat correct is, kan het zijn dat de firmware te groot is voor de opstartpartitie, wat het geval kan zijn als je in bepaalde situaties van 3.6.5 naar 3.7.0 gaat. De oplossing is om een van de flashtools te gebruiken.

### Web Interface toont oude gegevens of fouten in browser na een update

Dit wordt veroorzaakt doordat de browser de oude bestanden cacht. U kunt dit oplossen door de cache van de browser te wissen en de pagina opnieuw te laden. CTRL-R of CMD-R of F5 op de meeste browsers.

### EMS-ESP slaagt er niet in verbinding te maken met een verborgen WiFi-netwerk

Er is een bekend probleem met sommige WiFi-routers (bijv. Unifi) dat verborgen netwerken niet worden ondersteund met de ESP32. Probeer verbinding te maken met het netwerk via de BSSID-naam (soms het MAC-adres van het toegangspunt).

## Stabiliteit

### EMS-ESP kan geen verbinding maken met de WiFi

De EMS-ESP staat waarschijnlijk in Access Point-modus. Zoek naar een wifi SSID `ems-esp`, maak hiermee verbinding en open een browser naar 'http://192.168.4.1'. Als je een wifi-client hebt geconfigureerd, heeft je router een IP-adres toegewezen via DHCP. Je zou dan verbinding moeten kunnen maken via https://ems-esp of https://ems-esp.local.

Op borden met Ethernet wordt Ethernet uitgeschakeld als er een WiFi-SSID bestaat. Als je Ethernet wilt gebruiken, moet je deze instelling wissen.

### De LED knippert constant

Een snelle puls van de LED betekent dat het systeem aan het opstarten is of in de installatiemodus staat. Maak verbinding via WiFi met het Access Point (`ems-esp`) om de configuratie te voltooien.

Een langzame puls betekent dat er geen WiFi-verbinding is of dat EMS-ESP niet kan lezen van de EMS-bus. Ga in dit geval naar de webinterface en probeer een andere Tx Mode-instelling.

Zie meer informatie over wat de knipperende LED's betekenen in het gedeelte [Getting Started](Getting-Started.md).

### EMS-ESP start vaak opnieuw op

Een gezond gateway/interface bord met EMS-ESP zou lange tijd probleemloos moeten werken zonder spontaan opnieuw op te starten, dus als het jouwe met willekeurige tussenpozen opnieuw opstart, dan is er iets niet in orde.

Registreer hoe vaak het crasht en of er een verband is met activiteit op het netwerk (bijvoorbeeld wifi of mqtt die opnieuw verbinding maakt) of iets incoming/outgoing aan een van de EMS-apparaten. Een goede manier om dit te zien is om Home Assistant of een eenvoudige MQTT Verkenner te gebruiken om de up-tijd van het systeem te bekijken.

Dingen die je moet controleren:

#### Het kan stroomgerelateerd zijn

- Schakel de gateway uit en controleer of de bedrading goed is aangesloten. Controleer of de ESP32, DC-DC converter en eventuele jumpers op de gateway goed op hun connectoren zitten.
- Probeer de gateway te voeden via de USB-aansluiting van de ESP32 (controleer de [wiki](https://bbqkees-electronics.nl/wiki/) voor hoe je dit op jouw specifieke gateway-model doet). Als de herstarts stoppen, dan heb je een probleem met de externe voedingsbron (BUS of service jack) of de DC-DC converter in de gateway.
- Als u WiFi gebruikt, probeer dan de WiFi Tx Power te verlagen naar 10 dBm op de `Network Settings` pagina en kijk of dat helpt.

#### Het kan met het geheugen te maken hebben

De ESP32 heeft zeer beperkt RAM, verdeeld tussen de run-time stack en de heap. De heap kan snel gefragmenteerd raken, waardoor de maximale grootte van een buffer afneemt, en we gebruiken HEEL VEEL buffers om al die mooie JSON-bestanden voor te bereiden voor verzending naar MQTT en het vullen van de webpagina's. Als de ESP32 niet meer beschikbaar is, start hij zichzelf gewoon opnieuw op. Dingen om te controleren:

- Als de WebUI toegankelijk is, ga dan naar `Status->Hardware` en kijk naar de Heap. Als het vrije geheugen lager is dan 90 KB of de maximale toewijzing lager dan 45 KB, dan kan dat een probleem zijn en moet u services uitschakelen, het opnieuw proberen en dit melden. Begin met het een voor een uitschakelen van mDNS en SysLog (indien actief) en kijk of dat helpt.
- Zorg ervoor dat de maximale buffergrootte van het systeemlogboek op `Status->System Log` op zijn laagst (25) staat.
- Elk netwerkprotocol (Ethernet, Wifi, AP) verbruikt geheugen. Als je alleen Ethernet gebruikt (bijvoorbeeld een BBQKees E32 Gateway) schakel dan WiFi en het Access Point uit (gebruik een lege WiFI ssid).
- Als u veel EMS-entiteiten hebt, gebruikt u de pagina Aanpassingen en stelt u alle ongebruikte entiteiten (weergegeven door een lege waarde) in op "verwijderen uit geheugen".

#### Het kan codegerelateerd zijn

- Ga naar `Status->System Log` en stel de `Log Level` in op `INFO`. Dit zorgt ervoor dat je bij de volgende herstart het logboek bovenaan ziet staan. Het laat iets zien dat lijkt op `2022-12-30 11:58:02.000    INFO 0:      [emsesp]     Last system reset reason Core0: Software reset CPU, Core1: Software reset CPU`.
- En tenslotte, als geen van bovenstaande werkt, dan is het probleem de core die de inkomende telegrammen verwerkt. Probeer wat logs op te vangen vlak voordat het crasht (SysLog gebruiken is hier goed voor) en post de informatie in een nieuw GitHub probleem.

### EMS-ESP reageert niet meer

Als de EMS-ESP niet meer reageert en je geen toegang krijgt tot de WebUI, volg dan deze stappen:

- Controleer je netwerkrouter om te zien of ems-esp nog actief is. Als je een Mesh van WiFi-toegangspunten gebruikt, kan het zijn dat deze naar een nieuwe locatie zijn verplaatst of van WiFi-kanaal zijn gewisseld. De work-around hiervoor is het instellen van een BSSID in EMS-ESP (alleen WiFI).
- Kijk naar de on-board LED, als je die niet hebt uitgeschakeld. Als de LED knippert of constant brandt, betekent dit dat EMS-ESP nog steeds actief is.
- Controleer vervolgens de EMS-ESP services. Kun je Telnet gebruiken op poort 25 om toegang te krijgen tot de Console? Worden er nog steeds MQTT-berichten verzonden, indien ingeschakeld?
- Als je de Ethernet-poort gebruikt, zie je dan de LED op de poort knipperen om verkeer in en uit te laten gaan?
- Als EMS-ESP zichzelf opnieuw heeft opgestart, controleer dan de systeemlogboeken voor de Reset Reden. Dit zal een van de eerste berichten zijn. Zie hierboven.
- Sluit het bord aan op een computer via USB, zonder opnieuw op te starten na het uitschakelen van EMS-ESP en ga naar de seriële console om te zien of er fouten zijn.
- Log tot slot een GitHub probleem in met de ondersteuningsinfo en details van je installatie.

### U bent het beheerderswachtwoord vergeten

Als u het beheerderswachtwoord vergeten bent, kunt u het opnieuw instellen via de console met het commando `set admin password`.

```sh
ems-esp:$ su
ems-esp:# set admin password
```

## EMS-gegevens en connectiviteit

### Niet alle EMS-apparaten worden herkend

Experimenteer met het wijzigen van de waarde Tx Mode op de pagina Instellingen. De standaard EMS werkt voor oudere EMS1.0 systemen, EMS2 of EMSPlus systemen en HT3 voor Junkers/Worcester die het Heatronics protocol gebruiken.

Als je EMS-apparaten hebt die mogelijk nog niet worden ondersteund door EMS-ESP, gebruik dan `scan` of `scan deep` in de console om hun details te achterhalen en plaats vervolgens een onderhoudsprobleem op GitHub. Onthoud dat het `su` wachtwoord standaard `ems-esp-neo` is, tenzij dit is gewijzigd via de console (`passwd`) of in de WebUI (`Security->Security Settings`). Bijvoorbeeld:

```sh
ems-esp:$ su
Password:
000+00:01:38.291 N 0: [shell] Admin session opened on console
ems-esp:# scan
000+00:01:41.034 N 1: [emsesp] Unrecognized EMS device (device ID 0x08, product ID 123). Please report on GitHub.
ems-esp:#
```

Als je de EMS-gegevens wilt zien binnenstromen, gebruik dan het `watch` commando. Zie [Console](Console#het-ems-verkeer-bewaken).

### Ik mis bepaalde gegevens van een EMS-apparaat

Als er gegevens ontbreken, hebben we uw hulp nodig om onze database uit te breiden. Probeer te achterhalen welk telegram de gegevens zou kunnen bevatten door de wijziging door te voeren op het apparaat (bijv. ketel of thermostaat) terwijl EMS-ESP actief is en kijk naar het systeemlogboek in de traceermodus om te zien welke commando's worden verzonden en wat de nieuwe waarden zijn van inkomende telegrammen.

Als je het telegram hebt gelokaliseerd, zoek dan de offset en gebruik de `Custom Entities` pagina in de WebUI om een nieuwe entiteit te maken die je vervolgens kunt testen. Let op de maateenheid. Maak dan een screenshot van dit scherm en post het in een nieuw GitHub issue, samen met een geschikte 'lange' naam en een 'korte' naam in het Engels en je moedertaal, zodat we het snel kunnen implementeren in de code.

Merk op dat niet alle EMS-apparaten toestaan dat hun gegevens worden gepubliceerd op de EMS-bus, bijvoorbeeld de slimme thermostaten zoals de Nefit Easy en Buderus Easy Control CT200 die alleen de huidige kamer- en setpointtemperaturen verzenden als alleen-lezen attributen.

Zie dit artikel op [Decoding EMS Telegrams](FAQ#wat-is-een-ems-telegram) voor meer informatie.

### Veel Rx-fouten

Het is heel gebruikelijk om een paar waarschuwingen in het logboek te zien over onvolledige telegrammen. Dit kan het gevolg zijn van interferentie op de lijn, onvoldoende vermogen of een verkeerde Tx Mode. De waarschuwingen zijn meestal onschuldig omdat EMS-ESP zal wachten op de volgende uitzending of zal blijven proberen om het telegram op te halen. Als je een Rx-kwaliteit van minder dan 80% ziet, probeer het dan:

- een andere Tx-modus, bijvoorbeeld schakelen tussen EMS+ en EMS.
- voeding van de EMS-ESP via USB of service-jack. We hebben voorbeelden gezien waarbij een ruisende of falende gelijkstroomvoeding RX Fail of onvolledige telegrammen kan veroorzaken en het proberen van USB-voeding (controleer hoe om te schakelen naar USB-voeding in de [BBQKees wiki](https://bbqkees-electronics.nl/wiki/)) kan helpen om dit op te sporen.
- storingen op de buslijn van emc, reflecties, andere apparaten verwijderen. Sluit de EMS-ESP aan op een ander apparaat op de bus. Over het algemeen is een niet eerder aangesloten bus-uitgang op een apparaat zoals MM100 beter dan een gesplitste aansluiting op een reeds gebruikte connector.

### EMS-bus maakt geen verbinding

Als je de EMS-draden gebruikt, is op sommige systemen de volgorde belangrijk. Probeer ze om te wisselen!

Een BBQKees Gateway is DCE en de ESP32's zijn DTE, dus je moet TX(esp)-TX(gateway) en RX-RX aansluiten. TX op de ESP32 is het verzenden van gegevens, TX op de gateway is de ingang voor het verzenden van gegevens naar de ems-bus. Let op: een gekruiste (nullmodem) verbinding wordt alleen gebruikt voor DTE-DTE verbindingen.

De meest voorkomende bedradingsfout is echter dat wanneer mensen het interfacebord aansluiten op een ESP32-module, ze het aansluiten op de pennen TX en RX op de ESP32-module. Als je niet zeker weet welke pinnen je moet gebruiken, ga dan naar EMS-ESP Settings, selecteer het Interface Board Profile voor je bord en selecteer 'Custom' om de standaard toegewezen GPIO's te bekijken.

### Een waarde wijzigen op een EMS-apparaat werkt niet

Als u merkt dat setting/writing een EMS-apparaatwaarde geen effect heeft, stel dan in de WebUI het System Log-niveau in op DEBUG en herhaal de actie, waarbij u eventuele fouten of waarschuwingen in het System Log opmerkt. Voor een grondiger analyse gebruik je de Telnet Console, `su`, dan `log debug` en herhaal je de actie met het `call` commando. Post de uitvoer naar een nieuw GitHub probleem zoals beschreven in de [Support Section](Support).

Merk op dat op sommige systemen met bijvoorbeeld een gateway of controller aangesloten, elke verandering zal worden gereset of overschreven. Dit is gewoon het gedrag van de andere mastercontrollers en we kunnen er niet veel aan doen.

### Een waarde wijzigen werkt eerst, maar wordt daarna teruggezet naar de oorspronkelijke waarde

In sommige scenario's kan het voorkomen dat EMS-wijzigingen worden overschreven of genegeerd door een ander aangesloten EMS-apparaat. Bijvoorbeeld bij gebruik van `heatingactivated` om de verwarming uit te schakelen. Een oplossing hiervoor is om elke paar seconden 0 te sturen naar `boiler/selflowtemp`.

Bepaalde ketels met handmatige temperatuur knobs/dials zullen alle EMS-ESP-instellingen opheffen. Als u een temperatuurwaarde wilt wijzigen via EMS-ESP, zorg er dan voor dat de waarde die u verstuurt lager is dan de waarde waarop de ketel psychisch is ingesteld via de draaiknop. De ketel stelt zichzelf elke 2 minuten opnieuw in op de ingestelde waarde, dus gebruik de Scheduler van EMS-ESP om de temperatuurwaarde elke minuut automatisch opnieuw in te stellen.

### Er worden onjuiste waarden van een specifiek apparaat weergegeven

Als je merkt dat bepaalde waarden onjuist worden weergegeven, hetzij in de WebUI, Console of MQTT, help ons dan dit te corrigeren door een GitHub probleem te loggen, samen met de verwachte waarde. Als er gevraagd wordt om debug-informatie te geven, ga dan naar de Telnet console en doe

```sh
% su
% log trace
```

en dan ofwel een `read` of `watch`, bijvoorbeeld `read 21 2D8` om alle gegevens van HC2 op een mengend MM100 weer te geven.

## Temperatuursensoren

### Ongebruikelijke sensorwaarden

Als je ongebruikelijke metingen van de Dallas-sensor ziet (gekke negatieve temperaturen, plotselinge pieken in de metingen enz:

- Bedrading naar de JST-connector op de gateway.
- Dat je de juiste voedingsmodus gebruikt voor je toepassing: parasitair of niet-parasitair
- Of voeding via USB het probleem verhelpt (de [wiki](https://bbqkees-electronics.nl/wiki/) legt uit hoe u to/from USB-voeding voor uw model gateway kunt omschakelen). Als dit het geval is, kan dit duiden op een probleem met de voeding naar de gateway vanaf de BUS- of serviceconnector.

## MQTT

### Berichten komen niet altijd binnen via MQTT

Als je merkt dat MQTT-berichten niet aankomen bij de MQTT broker/server probeer het dan:

- Controleer de logboeken van EMS-ESP op fouten. Als u "laag geheugen" fouten ziet, lees dan [It may be memory related](#het-kan-met-het-geheugen-te-maken-hebben) om te zien hoe u het geheugengebruik kunt verminderen
- Controleer de MQTT broker op fouten. Mogelijk heb je onjuiste referenties of dubbele Client ID's die een verbindingsconflict veroorzaken
- Stel het EMS-ESP-systeemlogniveau in op ALL (via web of console) en controleer het verkeer
- Gebruik de Telnet Console om een publicatie te forceren om te zien wat er gebeurt. (`log debug`, `su` en `publish`)
- Verhoog de publicatietijd. Misschien zijn er te veel berichten en wordt de wachtrij overspoeld
- Als het nog steeds mislukt, voer dan een lokale kopie van de MQTT mosquitto broker uit en controleer de uitvoer zoals:
  - download de nieuwste versie van Mosquitto van `https://mosquitto.org/download/`
  - een nieuw `mosquitto.conf` bestand maken of een bestaand bestand bijwerken met net:

  ```yaml
  listener 1883
  allow_anonymous true
  ```

  - uitvoeren met de -v vlag zodat je alle verbose berichten ziet, bijvoorbeeld op Windows its:

  ```txt
  "C:\Program Files\mosquitto\mosquitto.exe" -v -c "C:\Program Files\mosquitto\mosquitto.conf"
  ```

  Let op, draaien met allow_anonymous true wordt niet aangeraden voor productieomgevingen.

### Commando's verzonden via MQTT werken niet

Gebruik de Console om de commando's handmatig te testen, met inloggen. Probeer bijvoorbeeld als het wijzigen van de thermostaattemperatuur niet werkt:

```sh
ems-esp:$ su
ems-esp:# log debug
ems-esp:# call thermostat seltemp 15
```

Je zou een log statement in de console moeten zien verschijnen zoals `[thermostat] Setting thermostat temperature to 15.0 for heating circuit 1, mode auto` gevolgd door welke telegrammen worden verzonden. Als je logfouten ziet, maak dan een GitHub probleem aan (zie [Support](Support)).

### Integratie met Home Assistant verbreekt wanneer MQTT-broker opnieuw start

De integratie met Home Assistant gebruikt MQTT Discovery die 'bewaarde' topics zijn in de MQTT broker. Als de MQTT service stopt en opnieuw opstart en de MQTT server slaat de topics niet op in een database, dan gaan deze berichten uiteraard verloren en wordt de integratie met Home Assistant verwijderd. Om dit op te lossen voeg je persistance toe aan je MQTT service. Bijvoorbeeld met Mosquitto zou een `.conf` bestand er als volgt uitzien:

```
listener 1883
allow_anonymous false
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
```

Ga voor meer informatie naar [this article](https://pagefault.blog/2020/02/05/how-to-set-up-persistent-storage-for-mosquitto-mqtt-broker).

Een alternatieve optie zonder gebruik te maken van persistance op de MQTT server is om EMS-ESP te vertellen om alle Home Assistant MQTT topics opnieuw te publiceren. Je kunt dit doen via de EMS-ESP WebUI vanaf versie 3.4 en hoger.

## Home Assistent

### HA toont fouten zoals _"Bericht ontvangen over illegaal zoekonderwerp"_ of _"Waarschuwing sjabloonvariabele: 'dict object' heeft geen attribuut..."_

Dit kan gebeuren wanneer je een upgrade uitvoert vanaf een eerdere EMS-ESP-versie en sommige namen van entiteiten kunnen zijn veranderd. Gebruik een tool zoals MQTTExplorer om alle `homeassistant/sensor/ems-esp/*` en `homeassistant/*/ems-esp/*` onderwerpen van je MQTT broker te verwijderen en herstart EMS-ESP.

### HA heeft dubbele entiteiten, voorafgegaan door ##_2

Zie de oplossing van swa72 [here](https://github.com/swa72/home-assistant/blob/main/README-mqtt.md).

### HA heeft de namen van mijn entiteiten verknoeid

Dit gebeurt wanneer HA wijzigingen aanbrengt in MQTT Discovery. Er is een handige tool genaamd [homeassistant-entity-renamer](https://github.com/saladpanda/homeassistant-entity-renamer) die je kan helpen dit op te lossen.

## Specifieke EMS-instellingen

### Thermostaat Date/Time

De juiste indeling voor het instellen van de thermostaattijd is:

```
< NTP | dd.mm.yyyy-hh:mm:ss-day(0-6)-dst(0/1) >
```

De thermostaat heeft een instelling van weekdag en zomertijd nodig. Bosch dag-van-de-week is Mo-0, Su-6, in tegenstelling tot unix-tijd.

Als je NTP hebt ingeschakeld kun je gewoon "NTP" invoeren en wordt de ntp-tijd ingesteld op de thermostaat.

Met NTP ingeschakeld wordt de thermostaatklok ook automatisch ingesteld door EMS-ESP als deze afwijkt van de ntp-tijd.

Let op of je de zomertijd wel of niet wilt inschakelen. Dit moet overeenkomen met de instelling op je thermostaat.
