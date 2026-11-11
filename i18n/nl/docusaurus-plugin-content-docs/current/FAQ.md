---
id: FAQ
title: Frequently Asked Questions
description: Common questions and answers about EMS-ESP including factory reset, EMS telegrams, and troubleshooting
---

# Veelgestelde vragen

## Hoe zet je de EMS-ESP terug naar de fabrieksinstellingen?

Bij een fabrieksreset worden alle EMS-ESP-instellingen gewist. EMS-ESP start vervolgens opnieuw op in de Access Point-modus, waarin u zich aanmeldt met de fabrieksgebruiker `admin`.

- In de webinterface, als beheerder: klik op **Fabrieksinstellingen herstellen** op de pagina **Instellingen > Versie**.
- Typ in de console, als beheerder: `call system format`.
- Met de GPIO-knop (standaard ingeschakeld op alle BBQKees-kaarten), op kaarten waarop de [Recovery App](#herstel-app) is geïnstalleerd: houd de knop ongeveer 10 seconden ingedrukt en laat hem vervolgens los. De gateway start opnieuw op en opent de Recovery-app. Meld je daar aan en klik op **Factory Reset**.

Geen van deze opties werkt als de fabrieksreset is uitgeschakeld in de EMS-ESP-instellingen.

## Wat is een EMS-telegram?

Geschreven door MichaelDvP in [this article](https://github.com/emsesp/EMS-ESP32/discussions/1612#discussioncomment-8408868):

Het beste overzicht van bekende telegrammen is afkomstig van [Norberts1](https://github.com/norberts1/hometop_HT3/blob/master/HT3/docu/HT_EMS_Bus_messages.pdf) en [EMS-Wiki](https://emswiki.thefischer.net/doku.php). In het algemeen kunnen we zeggen:

- de meetwaarden worden periodiek uitgezonden (om de 10 seconden / om de 1 minuut)
- instellingen worden pas doorgegeven nadat er een wijziging is aangebracht
- Als je een instelling van een apparaat wijzigt via de gebruikersinterface van de thermostaat, verschijnt er een bericht van de thermostaat naar het apparaat met alleen deze waarde
- sommige apparaten verzenden snel veranderende waarden als afzonderlijke waarden
- gemeten temperaturen zijn doorgaans 2 bytes (SHORT) met een factor 0,1 (bijv. 01 23 -> 0x0123 -> dez 291 -> 29,1 °C)
- instellingen voor de luchttemperatuur worden vaak weergegeven als een factor 0,5 in de vorm van een enkel byte (INT) (bijv. 0x2D -> dez 45 -> 22,5 °C)
- instellingen voor de watertemperatuur zijn doorgaans van één byte (UINT) (bijv. 0x3C -> 60 °C), terwijl differentiaalwaarden (hysterese in Kelvin) met teken worden weergegeven (INT)
- De procentuele instellingen zijn van één byte (UINT) (0x64 -> 100%)
- on/off-toestanden of -instellingen kunnen bestaan uit één byte met on/off, 0xFF/0x00 of 0x01/0x00, of uit één bit in een byte in combinatie met 7 andere toestanden
- de tijd en energie bedragen doorgaans 3 of 4 bytes, met of zonder factor

Voor verschillende brands/devices gebruikt Bosch soms verschillende uitdrukkingen voor dezelfde waarde. Misschien is er een wisseling van ontwikkelaars geweest, of willen ze reverse engineering juist bemoeilijken!

Als je een instelling zoekt, registreer dan de telegrammen voor het apparaat (alles registreren of <device-id> in de gaten houden) en wijzig de instelling op de thermostaat naar een andere states/values. Zoek vervolgens naar deze waarden in het logboek. Als je naar een meting zoekt, registreer dan het apparaat, bekijk de waarde op de thermostaat en wacht op veranderingen; noteer de old/new-waarden en de tijd. Controleer vervolgens het logboek op dit tijdstempel (of 10 sec / 1 min later) en de waarde in een telegram. Het is het beste om meer changes/values te hebben om zeker te zijn.

## Kan EMS-ESP een thermostaat simuleren?

Gedeeltelijk. Zoals de mensen van [OpenTherm Gateway (OTGW)](https://otgw.tclcode.com/standalone.html#intro) het zo treffend verwoordden:

:::tip[Waarom een thermostaat gebruiken?]

    - De fabrikanten van thermostaten hebben jarenlang onderzoek gedaan om de verwarmingskenmerken te bepalen die zorgen voor de meest efficiënte en comfortabele manier om een huis te verwarmen.
    - De thermostaat beschikt over een bedieningsinterface waarmee mensen vertrouwd zijn, zodat andere leden van het huishouden de ingestelde temperatuur nog steeds kunnen aanpassen.
    - Het biedt een handige behuizing voor de kamertemperatuursensor, die nodig is tenzij je een verwarmingscurve gebruikt die uitsluitend op de buitentemperatuur is gebaseerd.

:::

Zoals **MichaelDvP** opmerkt: _"Een thermostaat is een slim elektronisch apparaat. Je kunt de gewenste kamertemperatuur instellen, waarna het apparaat op basis van bepaalde parameters en metingen de benodigde aanvoertemperatuur voor die kamertemperatuur berekent en deze naar de ketel doorgeeft. Dit gebeurt in een regelkring en wordt regelmatig bijgewerkt."_

En **mtc716** zei: _"Een thermostaat stelt een verwarmingscurve op die voortdurend wordt aangepast aan de buitentemperatuur en die wordt gebruikt om te bepalen welke watertemperatuur nodig is om de kamertemperatuur te verhogen. Er zijn op internet een aantal goede artikelen te vinden over hoe je de verwarmingscurve correct instelt. De belangrijkste parameters die je nodig hebt, zijn de „ontwerptemperatuur“, dat is de temperatuur van het verwarmingswater bij de laagste buitentemperatuur. Verder heb je de „comforttemperatuur“ nodig, zoals eerder uitgelegd, en de „temperatuurofset“, die zorgt voor een parallelle verschuiving in de verwarmingscurve.“_

Bovendien zegt **MichaelDvP**: "Als je een softwaregestuurde thermostaat wilt bouwen, kun je verschillende methoden gebruiken:"

- op basis van de buitentemperatuur:
  stel een verwarmingscurve in voor uw gebouw. Dit is een lineaire interpolatie tussen een minimale buitentemperatuur voor uw regio (doorgaans -11 °C voor Midden-Europa) en de maximale aanvoertemperatuur (ontwerptemperatuur ~76 °C voor radiatoren, 40 °C voor vloerverwarming) en de werkelijke kamerstreefwaarde (bijv. 21 °C) voor de buitentemperatuur en de aanvoertemperatuur. U kunt een offset toevoegen.
  selflowtemp = offset + instelpunt + (ontwerptemperatuur - instelpunt) * (instelpunt - buitentemperatuur) / (instelpunt - minimale buitentemperatuur)
- kamergestuurd, geschakeld:
  meet de kamertemperatuur en schakel de ketel in, waarbij ‘verwarming uit’ wordt geactiveerd als de kamertemperatuur hoger is dan de instelwaarde. Voeg een hysterese toe om veelvuldig schakelen te voorkomen
- kamerregeling, dynamisch
  Hier moet je een PID-regeling berekenen. Dat valt een beetje buiten het toepassingsgebied van de ems-esp-scheduler. Maar misschien is het wel mogelijk. Op HA kun je het artikel „Implementing a smart thermostat (using SAT)” raadplegen. Zie [#2103](https://github.com/emsesp/EMS-ESP32/issues/2103)
- aangestuurd door slimme thermostaatventielen (TRV’s):
  Als u de openingsgraad van de thermostaatkranen kunt aflezen, maak dan een eenvoudige I-regeling. Als een thermostaatkraan volledig openstaat: verhoog de aanvoertemperatuur; als de meest geopende thermostaatkraan minder dan 90% openstaat: verlaag de aanvoertemperatuur. Verwarmen is een langzaam proces, dus increase/decrease zorgvuldig.

Lees voor meer informatie ook eens deze discussies:

- [Smart control a heating system with HA?](https://github.com/emsesp/EMS-ESP32/discussions/965)
- [Thermostat emulation](https://github.com/emsesp/EMS-ESP32/issues/151)
- [Changing the boiler heating directly](tips-and-tricks#de-verwarming-van-de-ketel-regelen)
- [Implementing a smart thermostat (using SAT)](https://github.com/emsesp/EMS-ESP32/issues/2103)

## Wat zijn busprotocollen en zendmodi?

Protocol en timing zijn twee verschillende zaken; je kiest de verzendmodus die het beste werkt.

HT3 is de elektronica van Junkers en het HT3-protocol is hetzelfde als dat van EMS, alleen is in de eerste byte (afzender) het hoogste bit ingesteld. Elk telegram dat we verzenden, begint in een Buderus-systeem met 0B, maar bij Junkers met 8B. Hierdoor zijn de apparaten van de verschillende merken niet compatibel. EMS-ESP controleert de bus bij het opstarten en selecteert automatisch het juiste protocol. Ook gebruikt Junkers een ander telegram numbers/orders. Modules van het merk Bosch gebruiken dezelfde telegramnummers als Buderus, maar adresseren net als Junkers, waardoor ze eveneens incompatibel zijn. U kunt geen Junkers- of Buderus-modules aansluiten op een Bosch-verwarmingssysteem.

De Tx-modus bepaalt de verzendtiming: de client-apparaten verzenden via stroommodulatie, de master via spanningsmodulatie. Dit maakt full-duplex mogelijk (hardwaremodus), maar afhankelijk van de lijnimpedantie beïnvloedt de stroomopname ook de spanning. Tijdens het verzenden herhaalt de master elke byte die door het apparaat wordt verzonden, om deze naar de andere apparaten door te geven. Bij een Tx-modus van "EMS" wachten we op de master-byte voordat we de volgende verzenden. De oudere Junkers-modellen lijken een kortere time-out te hebben, dus moeten we met de volgende byte beginnen voordat de echo van de master is voltooid („HT3“). „EMS+“ is minder kritisch en we kunnen iets langer dan één byte wachten, zodat de spanning zich na het verzenden kan stabiliseren.

## Kun je meerdere exemplaren van EMS-ESP draaien?

Ja, dat kan. Houd rekening met de volgende instellingen:

- (Instellingen->MQTT-instellingen) MQTT `Entity ID format` is ingesteld op "Meerdere instanties, korte naam"
- (Instellingen->MQTT-instellingen) MQTT `Client ID` moet uniek zijn om conflicten met de MQTT-broker te voorkomen
- (Instellingen->MQTT-instellingen) MQTT `Base` is uniek (zorg daar maar voor). Stel dit meestal in op de hostnaam.
- (Instellingen->Netwerkinstellingen) `Hostname` is uniek, om netwerkconflicten te voorkomen
- (Instellingen -> Toepassingsinstellingen) `EMS BUS ID` zijn verschillend (niet beide 0x0B)

## Waarom hebben EMS-telegrammen in de `raw watch`-modus een type 0x100 dat hoger is dan in de `raw`-modus?

Zie [this discussion](https://github.com/emsesp/EMS-ESP32/discussions/2025)

## Moet ik de minBurnPower in koude winters verhogen tot tussen de 10 en 20%, zodat er altijd een minimale warmtetoevoer is?

(antwoord van [MichaelDvP](https://github.com/MichaelDvP))

Dat gaat niet werken. De ketel werkt met `selflowtemp` als streefwaarde en regelt de brander zo dat de `flowtemp` wordt gehandhaafd. Als `flowtemp` hoger is dan de geselecteerde minimale verbrandingscapaciteit, schakelt de ketel uit, wacht de minimale periode af en als `flowtemp` is gedaald tot `selflowtemp` – hysterese – start hij opnieuw. Het verhogen van de `burnminpower` leidt alleen maar tot meer on/off-cycli bij milde omstandigheden.

## Hoe je energie kunt besparen op de ESP32-chip

Als je je zorgen maakt over het energieverbruik van de ESP32-chip en de warmteontwikkeling wilt verminderen, kun je enkele van deze instellingen toepassen:

- `Underclock CPU speed` in de **sectie Application Settings/Hardware**
- Als je wifi gebruikt, schakel dan `WiFi Sleep Mode` in, selecteer `use lower WiFi bandwidth` en verlaag het zendvermogen `Tx power` tot ongeveer 8,5 dBm in het **gedeelte Netwerk Settings/WiFi**
- Als je Ethernet gebruikt, schakel dan `Force 10Mbit half-duplex` in de **sectie Netwerk Settings/Ethernet** in

Let op: dit zal de prestaties van de ESP32-chip verminderen en kan stabiliteitsproblemen veroorzaken.

## De firmware bijwerken

Bij het upgraden of downgraden tussen EMS-ESP-versies zorgt EMS-ESP ervoor dat de instellingen worden gemigreerd om de compatibiliteit met de nieuw geïnstalleerde versie te waarborgen. Het teruggaan van 3.10.0 naar een oudere versie vormt hierop een uitzondering; zie [Going back to an older version](#teruggaan-naar-een-oudere-versie).

Lees vóór het upgraden altijd de [ChangeLog](Version-Release-History.md) voor de release-opmerkingen en informatie over eventuele ingrijpende wijzigingen.

### Upgraden naar 3.10.x

:::warning[Geen fabrieksinstellingen nodig]

Wanneer je een ontwikkelingsversie 3.9.0 of hoger installeert via de webinterface van een 3.8.x-versie, wordt in het dialoogvenster aangegeven dat voor de upgrade een fabrieksreset nodig is. Dit is niet het geval, dus negeer dat deel van het bericht. Uw instellingen blijven behouden en worden overgezet. Bij een upgrade naar 3.10.0 verschijnt dit bericht niet.

Houd er ook rekening mee dat het MAC-adres zal veranderen en dat het door DHCP toegewezen IP-adres waarschijnlijk ook zal veranderen. Gebruik mDNS (`name.local`) of je router om het nieuwe adres te achterhalen.

:::

Voordat je de upgrade uitvoert:

1. **Maak een systeemback-up** via Instellingen > Download/Upload. Na de upgrade worden wachtwoorden in gehashte vorm opgeslagen en kunnen oudere versies deze niet lezen; daarom is deze back-up nodig als je terug wilt gaan naar 3.8.x of 3.9.x.
2. **Let op welke integraties gebruikmaken van de API**, zoals Home Assistant REST-sensoren, Prometheus, Node-RED, dashboards of scripts, inclusief die welke alleen waarden uitlezen zonder token. Na de upgrade is voor elke aanroep naar `/api` een API-sleutel vereist, en werken toegangstokens niet meer.

Na de upgrade:

1. **Stel nieuwe wachtwoorden in als u nog steeds de standaardwachtwoorden gebruikt.** Een beheerder die zich aanmeldt met een standaardwachtwoord, moet een nieuw beheerderswachtwoord instellen voordat de webinterface kan worden gebruikt, en bovendien een nieuw wachtwoord voor het toegangspunt als er nog geen wifi-netwerk is ingesteld.
2. **Maak voor elke integratie een API-sleutel aan** onder Beveiliging > API-sleutels en verstuur deze als `Authorization: Bearer <key>`. Kies "Lezen" voor integraties die alleen waarden lezen, en "Lezen en schrijven" voor integraties die instellingen of waarden wijzigen. Om een waarde in een browser te lezen, opent u het `/api`-adres en meldt u zich aan wanneer de browser daarom vraagt.
3. **Controleer wat gastgebruikers mogen doen.** Alleen beheerders kunnen de Scheduler, Commands, Custom Entities en Modules wijzigen. Commands van vóór de upgrade kunnen nog steeds door gasten worden uitgevoerd; voor nieuwe Commands vink je "Gasten mogen deze command uitvoeren" aan als dat de bedoeling is.
4. **Controleer de Scheduler en Commands op vermeldingen die u niet zelf hebt aangemaakt.** Vóór 3.10.0 konden gastgebruikers en oproepen zonder token deze toevoegen, en deze zijn bij de upgrade behouden gebleven. Scheduler-vermeldingen worden uitgevoerd met beheerdersrechten. Verwijder alles wat u niet herkent en schakel bij opdrachten die gasten niet nodig hebben de optie "Gasten mogen deze opdracht uitvoeren" uit.

#### Home Assistant

Entiteiten die Home Assistant via MQTT Discovery detecteert, blijven gewoon werken; daar hoeft niets aan veranderd te worden. Alleen de delen van je configuratie die `/api` rechtstreeks aanroepen, zoals `rest`-sensoren en `rest_command`, hebben een API-sleutel nodig:

1. Maak onder Beveiliging > API-sleutels een sleutel aan voor Home Assistant. Kies "Lezen" als je alleen `rest`-sensoren gebruikt, en "Lezen en schrijven" als je ook `rest_command` gebruikt om waarden te wijzigen.
2. Voeg de sleutel toe als header aan elke `rest`-sensor en `rest_command` die EMS-ESP aanroept, ook aan degenen die alleen lezen:

   ```yaml
   headers:
     authorization: 'Bearer emsesp_...'
   ```

3. Verwijder alle `?access_token=...` uit de URL’s; een token in de URL werkt niet meer.
4. Start Home Assistant opnieuw op, of laad de REST-entiteiten opnieuw in.

Zie [Home Assistant](Home-Assistant#een-waarde-ophalen-via-de-api) voor volledige voorbeelden.

#### ioBroker

De [ioBroker ems-esp adapter](https://github.com/tp1de/ioBroker.ems-esp) (7.0.8 en oudere versies) leest waarden zonder een sleutel te verzenden, en verzendt het token pas wanneer een waarde verandert. De API-sleutel is op twee plaatsen nodig:

1. Maak onder Beveiliging > API-sleutels een sleutel met "Lees- en schrijftoegang" aan voor ioBroker.
2. Wijzig in de instellingen van de adapter het EMS-ESP-adres zodanig dat het de sleutel bevat, bijvoorbeeld `http://iobroker:emsesp_...@192.168.1.10`. De naam vóór de `:` kan willekeurig zijn. Hierdoor kan de adapter waarden uitlezen.
3. Plak dezelfde sleutel in het veld ‘EMS-ESP-toegangstoken’ van de adapter en vervang daarmee het oude toegangstoken. Hierdoor kan de adapter waarden wijzigen.
4. Sla de instellingen op en start de adapterinstantie opnieuw op.

Je hoeft je back-up na de upgrade niet te uploaden. Bewaar deze voor het geval je terug wilt naar versie 3.8.x of 3.9.x. De volledige lijst met ingrijpende wijzigingen vind je in de [ChangeLog](Version-Release-History.md).

### Teruggaan naar een oudere versie

Vanaf 3.10.0 worden wachtwoorden in gehasht vorm opgeslagen. Oudere versies interpreteren de opgeslagen hash alsof het het wachtwoord zelf is, dus als je teruggaat naar 3.8.x of 3.9.x, werkt je gebruikelijke wachtwoord niet meer.

#### 1. Installeer de oudere versie

Download de `.bin` voor je bord via de [release page](https://github.com/emsesp/EMS-ESP32/releases) en upload deze via Instellingen > Versie, of via de [Recovery App](#herstel-app). Versies ouder dan 3.10.0 zijn niet ondertekend, dus EMS-ESP geeft de melding "Dit is geen officiële EMS-ESP-build": klik op "Toch installeren", zie [Official and custom builds](#standaard--en-aangepaste-configuraties). Je kunt het ook via USB flashen met de [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher).

#### 2. Meld je opnieuw aan

**Met de systeemback-up die je vóór de upgrade hebt gemaakt.** Deze moet zijn gemaakt op versie 3.8.x of 3.9.x. Een back-up die is gemaakt op 3.10.0 helpt niet, omdat deze geen wachtwoorden bevat of alleen de gehashte versies ervan.

1. Voer een fabrieksreset uit. Je kunt nog geen aanmelding uitvoeren via de webinterface, dus gebruik een van de volgende methoden:
   - in versie 3.9.x met de [Recovery App](#herstel-app) (16 MB-kaarten): de Recovery-app 1.1.0 blijft geïnstalleerd wanneer je teruggaat en accepteert nog steeds je gebruikelijke beheerderswachtwoord. Houd de GPIO-knop ongeveer 10 seconden ingedrukt om het programma te starten, log in en klik op **Factory Reset**.
   - bij versie 3.8.x: houd de GPIO-knop ongeveer 10 seconden ingedrukt, waarna het apparaat onmiddellijk naar de fabrieksinstellingen wordt teruggezet.
   - de seriële console: `su` met het wachtwoord `ems-esp-neo` (zie hieronder), en vervolgens `call system format`.
2. Maak verbinding met het EMS-ESP-toegangspunt, log in met de standaardgebruikersnaam `admin` en het standaardwachtwoord `admin`, en upload de back-up via Instellingen > Download/Upload.

**Als je die back-up niet hebt, of als je je instellingen wilt behouden zonder de fabrieksinstellingen te herstellen**, log dan in via de seriële console via USB; zie [Console](Console.md):

1. Maak verbinding met de seriële console op 115200 baud, druk op CTRL-D en typ `su`. Het wachtwoord is `ems-esp-neo`, aangezien 3.10.0 het Super User-wachtwoord uit de instellingen heeft verwijderd.
2. Typ `show users`. Het wachtwoord van elke gebruiker wordt weergegeven als een lange tekst die begint met `$pbkdf2-sha2562. Typ `show users`. Het wachtwoord van elke gebruiker wordt weergegeven als een lange tekst die begint met .
3. Log in op de webinterface met die gebruikersnaam en de volledige tekst als wachtwoord, van `$pbkdf2-sha2563. Log in op de webinterface met die gebruikersnaam en de volledige tekst als wachtwoord, van  tot het einde. Kopieer en plak de tekst; deze bestaat uit ongeveer 120 tekens.
4. Stel onder Beveiliging > Gebruikers voor elke gebruiker een nieuw wachtwoord in en wijzig onder Beveiliging > Instellingen het wachtwoord van de supergebruiker, aangezien `ems-esp-neo` algemeen bekend is.

Anders kun je met een fabrieksreset weer toegang krijgen, maar worden alle instellingen gewist.

#### 3. Verbind je integraties opnieuw

Oudere versies beschikken niet over API-sleutels. Voor integraties zoals Home Assistant REST-sensoren, Node-RED of scripts is opnieuw een toegangstoken nodig: klik in Beveiliging > Gebruikers op het sleutelpictogram naast een gebruiker en gebruik dat token in plaats van de API-sleutel. Maak de tokens aan nadat je het wachtwoord van de supergebruiker hebt gewijzigd, aangezien de bestaande tokens na deze wijziging niet meer werken.

:::warning[Oudere versies hebben bekende beveiligingsproblemen]

In versies vóór 3.10.0 zijn de beveiligingsproblemen verholpen die in 3.10.0 zijn opgelost. Ga alleen terug als dat echt nodig is, schakel Telnet uit en voer zo snel mogelijk weer een upgrade uit.

:::

### Standaard- en aangepaste configuraties

Vanaf 3.10.0 controleert EMS-ESP of de firmware een officiële build is wanneer je een firmwarebestand uploadt via de webinterface, een versie installeert vanuit de versielijst van de webinterface of een bestand uploadt via de Recovery-app. Officiële releases en ontwikkelingsversies van [GitHub](https://github.com/emsesp/EMS-ESP32/releases) zijn ondertekend door EMS-ESP en worden direct geïnstalleerd. Op de pagina ‘Versie’ wordt naast de versie ‘Officiële versie’ weergegeven.

Al het andere is een aangepaste build, bijvoorbeeld een die je zelf hebt samengesteld, een community-build, een versie die ouder is dan 3.10.0, of een bestandssysteem-image. De webinterface geeft dan de melding „Dit is geen officiële EMS-ESP-build“ weer voordat er iets wordt geïnstalleerd. Klik op „Toch installeren“ om het te installeren, of laat het staan als je dit niet had verwacht. Op de versiepagina wordt dan „Aangepaste build“ weergegeven.

Installeer een aangepaste versie alleen als je zeker weet dat deze uit een betrouwbare bron afkomstig is. Als je een officiële versie verwachtte, is het bestand mogelijk gewijzigd of beschadigd, bijvoorbeeld door een browser of downloadmanager. Download het dan opnieuw vanaf de releasepagina.

De optie ‘Flashen via USB met de [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher) of esptool’ is niet aangevinkt.

Als je je eigen firmware bouwt, raadpleeg dan [Installing your own build](https://github.com/emsesp/EMS-ESP32/blob/dev/CONTRIBUTING.md#installing-your-own-build).

### Waarom wordt mij opnieuw om mijn wachtwoord gevraagd?

Vanaf 3.10.0 vraagt de webinterface opnieuw om je wachtwoord voordat wijzigingen worden doorgevoerd die de controle over het apparaat kunnen overnemen of je de toegang tot het apparaat kunnen ontzeggen:

- firmware uploaden of installeren, inclusief de Recovery-app, en overschakelen naar de andere firmwarepartitie
- een back-up terugzetten of er een downloaden met wachtwoorden en sleutels
- een fabrieksreset
- gebruikers en wachtwoorden toevoegen, wijzigen of verwijderen, en API-sleutels aanmaken of intrekken
- CORS inschakelen, toegestane hostnamen toevoegen of telnet inschakelen

Zodra je je gegevens hebt ingevoerd, wordt er gedurende 5 minuten niet opnieuw om gevraagd in die browser. Als je je opnieuw aanmeldt of EMS-ESP opnieuw opstart, wordt dit beëindigd.

Scripts die deze wijzigingen doorvoeren via een aanmelding via de webinterface, krijgen HTTP-status 428. Ze moeten het wachtwoord eerst verzenden met `POST /rest/confirmPassword` en de body met `{"password":"..."}`, waarbij hetzelfde token wordt gebruikt. Integraties met API-sleutels en MQTT ondervinden hier geen hinder van.

### Firmware installeren via een URL

Vanaf 3.10.0 kan firmware alleen worden geïnstalleerd via een URL van een EMS-ESP-release op GitHub, die begint met `https://github.com/emsesp/EMS-ESP32/releases/`. De versielijst van de webinterface maakt hier altijd gebruik van. Alle andere bestanden moet je downloaden en vervolgens via de webinterface uploaden.

### Firmware terugzetten

Vanaf 3.9.1 wordt een nieuw geïnstalleerde firmware pas behouden als deze 2 minuten heeft gedraaid. Als de firmware eerder crasht of opnieuw opstart, keert de gateway terug naar de firmware die daarvoor draaide. Als er geen firmware aanwezig is, starten kaarten met de [Recovery App](#herstel-app) in plaats daarvan de Recovery App. Dit werkt op alle kaarten, ook die met 4 MB, aangezien EMS-ESP altijd twee firmwarepartities heeft (`app0` en `app1`).

Dit geldt voor firmware die wordt geïnstalleerd terwijl EMS-ESP of de Recovery App actief is: het uploaden van een bestand via de webinterface, het installeren van een versie uit de versielijst van de webinterface of het uploaden via de Recovery App. Het flashen via USB met de [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher) of esptool wordt niet gecontroleerd; die firmware blijft direct behouden.

Elke herstart binnen de eerste 2 minuten telt mee, ook als je zelf op ‘Herstarten’ klikt, dus wacht tot de firmware is bevestigd. Er zijn twee uitzonderingen:

- wanneer EMS-ESP de instellingen uit een oudere versie overzet en opnieuw opstart om ze toe te passen, wordt de nieuwe firmware als eerste behouden
- als je binnen de eerste 2 minuten andere firmware installeert, blijft de firmware die op dat moment actief is, eerst behouden

Het systeemlogboek laat zien wat er gebeurt:

| Bericht | Betekenis |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `New firmware, it will be confirmed after running for 120 seconds` | wordt bij het opstarten weergegeven; de nieuwe firmware is in de proefperiode |
| `New firmware confirmed as working` | de 2 minuten zijn verstreken, de firmware blijft behouden |
| `Firmware in partition app1 failed to start and was rolled back`   | de firmware in `app1` (of `app0`) hield het nog geen 2 minuten vol; de gateway schakelde weer over naar de andere |

De controle wordt uitgevoerd door de bootloader, het kleine programmaatje aan het begin van het flashgeheugen dat bepaalt welke firmware wordt opgestart. Bij het installeren van firmware via de webinterface wordt de bootloader nooit vervangen; dat gebeurt alleen bij het flashen via USB. Gateways die via USB zijn geflashed met 3.9.0 hebben een bootloader zonder rollback-functie. Ze blijven normaal werken, maar een mislukte update wordt niet teruggedraaid. Als je het eerste bericht niet ziet na het installeren van nieuwe firmware via de webinterface, flash dan 3.9.1 of nieuwer één keer via USB om een bootloader met rollback te krijgen.

Nadat de firmware is geverifieerd, houdt EMS-ESP crashes in de gaten: op kaarten met de Recovery App wordt deze gestart nadat er vijf keer achter elkaar een crash is opgetreden, zie [When it starts](#wanneer-het-begint).

## Herstel-app

Vanaf 3.9.0 kan op printplaten met 16 MB of 32 MB flashgeheugen de EMS-ESP Recovery App worden geïnstalleerd. Het is een kleine, afzonderlijke firmware die in een eigen deel van het flashgeheugen (de `boot`-partitie) staat, naast de twee partities waarop EMS-ESP staat (`app0` en `app1`). Als EMS-ESP niet meer opstart of als een firmware-update mislukt is, kun je met de Recovery App de gateway via een browser weer aan de praat krijgen, zonder hem via USB aan te sluiten. De 4 MB-kaarten hebben hier geen ruimte voor.

EMS-ESP 3.9.0 wordt geleverd met de Recovery App 1.0.0, en 3.10.0 met de Recovery App 1.1.0. Voor functies gemarkeerd met **[3.10.0]** is de Recovery App 1.1.0 vereist, zie [What's new in 3.10.0](#wat-is-er-nieuw-in-3100).

### Wat het kan doen

Nadat je je hebt aangemeld, toont de Recovery-app een dashboard waarop je het volgende kunt doen:

- **Firmware uploaden**: installeer een EMS-ESP-firmware-`.bin`-bestand in een van de EMS-ESP-partities. Standaard wordt eerst een lege partitie gekozen, vervolgens een partitie waarvan de firmware niet kon worden opgestart, en anders de partitie met de oudste firmware, zodat een werkende firmware als back-up behouden blijft. U kunt ook zelf de partitie kiezen. U kunt het `.md5`-bestand ook eerst uploaden om de firmware te controleren.
  - **[3.10.0]** Net als in de webinterface wordt een officiële build direct geïnstalleerd, terwijl bij een aangepaste build eerst om toestemming wordt gevraagd; zie [Official and custom builds](#standaard--en-aangepaste-configuraties).
- **Firmware starten**: start het systeem opnieuw op met een van de geïnstalleerde EMS-ESP-firmwareversies. De tabel toont de versie en de installatiedatum van elke firmwareversie en geeft een waarschuwing als een firmwareversie eerder niet kon worden gestart.
- **Fabrieksinstellingen herstellen**: alle EMS-ESP-instellingen wissen. Deze optie wordt niet weergegeven als het herstellen van de fabrieksinstellingen is uitgeschakeld in de EMS-ESP-instellingen.
  - **[3.10.0]** De volledige bestandssysteempartitie en de crashdump worden eveneens gewist, zodat oude wachtwoorden en sleutels niet meer uit het flashgeheugen kunnen worden uitgelezen.
- **[3.10.0] Crash-dump**: de dump van de laatste crash downloaden of wissen; zie [Reporting a crash](#een-crash-melden). Dit gedeelte wordt alleen weergegeven als er een dump is.

Daarnaast wordt ook weergegeven waarom het is gestart, welke chip het bevat, met welk netwerk het is verbonden en welke firmwareversies er zijn geïnstalleerd.

De Recovery-app leest alleen de EMS-ESP-instellingen; deze worden nooit gewijzigd, behalve bij een fabrieksreset. De app kan geen bestandssysteemimage installeren of een back-up terugzetten.

### Installeren en bijwerken

Open **Instellingen > Versie** in de EMS-ESP-webinterface. Op kaarten die dit ondersteunen, is er een rij **Recovery App** met de geïnstalleerde versie, of "Niet geïnstalleerd". Klik op de installatieknop om de nieuwste versie van GitHub te downloaden. **[3.10.0]** Wanneer er een nieuwere versie beschikbaar is, kun je deze via dezelfde knop bijwerken en wordt in de regel aangegeven of de geïnstalleerde Recovery App een officiële build is. Je kunt het `EMS-ESP-Recovery-<version>-<chip>-16MB[+].bin`-bestand ook downloaden via de [release page](https://github.com/emsesp/EMS-ESP32/releases) en het uploaden zoals normale firmware. Het installeren van de Recovery App zorgt er niet voor dat EMS-ESP opnieuw opstart en heeft geen invloed op je instellingen of de geïnstalleerde EMS-ESP-firmware.

De Recovery-app kan alleen via EMS-ESP worden geïnstalleerd, niet vanuit de Recovery-app zelf.

### Wanneer het begint

De Recovery-app start:

- wanneer je op **Opnieuw opstarten in de Recovery-app** klikt op de pagina **Instellingen > Versie**
- wanneer je de GPIO-knop ongeveer 10 seconden ingedrukt houdt, tenzij de fabrieksreset is uitgeschakeld in de EMS-ESP-instellingen
- automatisch, wanneer EMS-ESP na het opnieuw opstarten vijf keer achter elkaar crasht
- automatisch, wanneer een nieuw geïnstalleerde firmware binnen de eerste 2 minuten vastloopt of opnieuw opstart en er geen eerdere firmwareversie is om naar terug te keren, zie [Firmware rollback](#firmware-terugzetten)

### Verbinding maken

De Recovery-app maakt gebruik van de netwerkinstellingen die door EMS-ESP zijn opgeslagen:

- Het maakt verbinding via Ethernet als dit op je bord is ingesteld, anders via wifi, waarbij het statische IP-adres wordt gebruikt als je dat hebt ingesteld. Open het in een browser met het gebruikelijke IP-adres of `http://<hostname>.local`.
- er wordt ook altijd een toegangspunt gestart, dat is vernoemd naar je EMS-ESP-toegangspunt met de toevoeging `-recovery`, bijvoorbeeld `ems-esp-recovery`, met hetzelfde wachtwoord als dat van het toegangspunt. Maak hier verbinding mee en open `http://192.168.4.1`, of het IP-adres van het toegangspunt dat je in EMS-ESP hebt ingesteld.

Meld u aan met een bestaande EMS-ESP-beheerdersgebruikersnaam en wachtwoord. Gastgebruikers kunnen zich niet aanmelden. Als de instellingen niet kunnen worden gelezen, bijvoorbeeld na een fabrieksreset, gebruik dan de fabrieksaanmelding `admin`. In dat geval is een fabrieksreset niet mogelijk.

**[3.10.0]** Na een aantal mislukte inlogpogingen vraagt de Recovery-app je om een paar minuten te wachten voordat je het opnieuw probeert.

### Terug naar EMS-ESP

Door de gateway opnieuw op te starten of uit en weer in te schakelen, blijft deze in de Recovery-app. Om de app te verlaten, klik je op **Start Firmware** naast een werkende EMS-ESP-firmware, of upload je een nieuwe firmware, die na het uploaden wordt gestart.

### Wat is er nieuw in 3.10.0

De Recovery-app 1.1.0, uitgebracht samen met EMS-ESP 3.10.0, biedt de volgende extra functies:

- een controle of de geüploade firmware een officiële EMS-ESP-build is, met de optie "Toch installeren" voor een aangepaste build
- het gedeelte **Crash Dump**, met een overzicht van de crash en knoppen om de dump te downloaden of te wissen
- ondersteuning voor de gehashte wachtwoorden van 3.10.0
- een limiet op het aantal mislukte inlogpogingen
- een fabrieksreset waarbij ook de volledige bestandssysteempartitie en de crashdump worden gewist
- firmware-uploads die nooit opstartbaar blijven als ze een controle niet doorstaan

:::warning[Werk de Recovery-app bij na het upgraden naar 3.10.0]

Vanaf 3.10.0 slaat EMS-ESP wachtwoorden op in gehasht vorm. De Recovery App 1.0.0 van 3.9.0 kan deze niet lezen, dus je gebruikelijke beheerderswachtwoord werkt daar niet meer. Nadat u EMS-ESP hebt geüpgraded naar 3.10.0, moet u de Recovery App bijwerken via **Instellingen > Versie**.

Als je niet kunt inloggen op de Recovery App 1.0.0, gebruik dan de volledige opgeslagen hash, beginnend met `$pbkdf2-sha256Als je niet kunt inloggen op de Recovery App 1.0.0, gebruik dan de volledige opgeslagen hash, beginnend met , als wachtwoord. Het consolecommando `show users` in EMS-ESP geeft dit weer, zie [Going back to an older version](#teruggaan-naar-een-oudere-versie). Als EMS-ESP helemaal niet opstart, flash het dan via USB met de [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher).

:::

## Wat te doen als EMS-ESP vastloopt

Vanaf 3.10.0 slaat de ESP32, wanneer EMS-ESP crasht (een paniekfout, `abort()`, stackoverflow of watchdog), een crashdump op in het flashgeheugen voordat het apparaat opnieuw opstart. De dump blijft na de herstart behouden en wordt bewaard totdat deze bij de volgende crash wordt vervangen, of totdat je deze wist.

Alleen kaarten met 16 MB of 32 MB flashgeheugen bieden ruimte voor een crashdump; de kaarten met 4 MB hebben die ruimte niet. Bij een spanningsdaling, een stroomstoring of een normale herstart wordt er geen dump opgeslagen.

### Een crash melden

Na de herstart schrijft EMS-ESP `Crash dump found: ...` naar het systeemlogboek, en `/api/system/info` toont hetzelfde overzicht als `coredump` in de sectie `system`. Bijvoorbeeld:

```text
task=async_tcp pc=0x400d1234 cause=28 vaddr=0x00000000 bt=0x400d1234 0x400d5678 0x400e9abc sha=1a2b3c4d5 reason=LoadProhibited
```

Kopieer deze regel naar een [GitHub issue](https://github.com/emsesp/EMS-ESP32/issues), samen met de EMS-ESP-versie en je bord, en beschrijf wat er vlak voor de crash gebeurde. De ontwikkelaars kunnen aan de hand van de adressen achterhalen op welke plek in de code de crash plaatsvond.

Voeg, indien mogelijk, ook de volledige crashdump toe aan het probleem. Download deze als beheerder:

- in EMS-ESP: **Instellingen > Download/Upload**, knop **Crash Dump**. Deze wordt alleen weergegeven als er een dump is. Scripts kunnen `GET /rest/coredump` gebruiken.
- in de EMS-ESP Recovery: het gedeelte **Crash Dump** op het dashboard, nadat je bent ingelogd. Hier wordt ook de samenvattingsregel weergegeven. Dit is handig wanneer EMS-ESP zo vaak is gecrasht dat het bord in plaats daarvan de Recovery-modus heeft gestart.

Beide slaan een `coredump.bin`-bestand op.

Wis vervolgens de dump, zodat de volgende crash duidelijk een nieuwe is: voer `call system coredump` uit in de console, of stuur `POST /api/system/coredump` als beheerder.

| Veld    | Betekenis |
| -------- | -------------------------------------------------------------------------------- |
| `task`   | de taak die vastliep |
| `pc`     | het adres in de firmware waar het programma is vastgelopen |
| `cause`  | de oorzaak van de uitzondering op de ESP32, bijv. 28 = LoadProhibited, 29 = StoreProhibited |
| `vaddr`  | het geheugenadres waartoe toegang is verkregen; een waarde dicht bij 0 duidt meestal op een null-pointer |
| `bt`     | de backtrace, met eerst de functie die de crash veroorzaakte en daarna de functies die deze hebben aangeroepen |
| `sha`    | het begin van de SHA256-hash van de firmware die is gecrasht |
| `reason` | de reden voor de paniek, bijvoorbeeld het `abort()`- of watchdog-bericht |

Op de C3 en C6 is er geen backtrace, alleen `ra` (retouradres), `mcause` en `mtval`.

### Zelf een crashdump ontcijferen

Voor het decoderen is het `firmware.elf`-bestand van de exacte build nodig die is gecrasht. Als je EMS-ESP zelf bouwt, wordt van elke build een gzipped kopie bewaard als `build/elf/<variant>-<sha>.elf.gz`, waarbij `<sha>` overeenkomt met het `sha`-bestand in het crashverslag. Pak het uit met `gunzip -k`. Deze bestanden zijn elk ongeveer 20 MB groot, dus verwijder af en toe de oude bestanden.

Zet de adressen uit het overzicht om in functie, bestand en regel:

```bash
# ESP32, use xtensa-esp32s3-elf-addr2line for the S3 and xtensa-esp32s2-elf-addr2line for the S2
~/.platformio/packages/toolchain-xtensa-esp-elf/bin/xtensa-esp32-elf-addr2line -pfiaC \
  -e .pio/build/s_16M_P/firmware.elf 0x400d1234 0x400d5678 0x400e9abc

# C3/C6, pass the pc and ra
~/.platformio/packages/toolchain-riscv32-esp/bin/riscv32-esp-elf-addr2line -pfiaC \
  -e .pio/build/c3_mini_4M/firmware.elf 0x42001234 0x42005678
```

Decodeer voor de stacks en registers van elke taak de gedownloade `coredump.bin` met de `firmware.elf`:

```bash
~/.platformio/penv/bin/esp-coredump info_corefile -t raw -c coredump.bin .pio/build/s_16M_P/firmware.elf
```

Of sluit het bord aan via USB en laat `esp-coredump` de dump in één stap lezen en decoderen:

```bash
~/.platformio/penv/bin/esp-coredump --port /dev/ttyUSB0 info_corefile .pio/build/s_16M_P/firmware.elf
```

Of sla de dump via USB op in een bestand en decodeer dat later:

```bash
# 16MB layout: 0xFF0000, 32MB layout: 0x1FF0000
~/.platformio/penv/bin/esptool.py --port /dev/ttyUSB0 read_flash 0xFF0000 0x10000 coredump.bin
~/.platformio/penv/bin/esp-coredump info_corefile -t raw -c coredump.bin .pio/build/s_16M_P/firmware.elf
```

Gebruik `dbg_corefile` in plaats van `info_corefile` om de dump in GDB te openen. Voor andere partitie-indelingen moet je de offset van de `coredump`-partitie met behulp van `python gen_esp32part.py .pio/build/<env>/partitions.bin` opzoeken.

De paniekhandler geeft ook de backtrace weer via de seriële poort. Bij een crash die moeilijk te reproduceren is, kun je een seriële monitor laten loggen naar een bestand; hierin wordt ook weergegeven wat er vlak voor de crash gebeurde:

```bash
pio device monitor -e s_16M_P -f esp32_exception_decoder -f log2file
```
