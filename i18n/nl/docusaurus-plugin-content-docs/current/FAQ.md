---
id: FAQ
title: Frequently Asked Questions
description: Common questions and answers about EMS-ESP including factory reset, EMS telegrams, and troubleshooting
---

# Veelgestelde vragen

## Hoe zet je de EMS-ESP terug naar de fabrieksinstellingen?

Als je een GPIO-knop hebt geconfigureerd (standaard ingeschakeld op alle BBQKees-kaarten), kun je door deze knop 10 seconden ingedrukt te houden en vervolgens los te laten een fabrieksreset uitvoeren. EMS-ESP start dan opnieuw op in de Access Point-modus.

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
- de procentuele instellingen zijn van één byte (UINT) (0x64 -> 100%)
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
  meet de kamertemperatuur en schakel de ketel in wanneer de verwarming is uitgeschakeld en de kamertemperatuur hoger is dan de instelwaarde. Voeg een hysterese toe om te veel schakelingen te voorkomen
- kamerregeling, dynamisch
  Hier moet je een PID-regeling berekenen. Dat valt een beetje buiten het toepassingsgebied van de ems-esp-scheduler. Maar misschien is het wel mogelijk. Op HA kun je het artikel ‘Implementing a smart thermostat (using SAT)’ raadplegen. Zie [#2103](https://github.com/emsesp/EMS-ESP32/issues/2103)
- aangestuurd door slimme thermostaatventielen (TRV’s):
  Als u de openingsgraad van de thermostaatkranen kunt aflezen, stel dan een eenvoudige I-regeling in. Als een thermostaatkraan volledig openstaat: verhoog de aanvoertemperatuur; als de meest geopende thermostaatkraan minder dan 90% openstaat: verlaag de aanvoertemperatuur. Verwarmen is een langzaam proces, dus increase/decrease zorgvuldig.

Lees voor meer informatie ook eens deze discussies:

- [Smart control a heating system with HA?](https://github.com/emsesp/EMS-ESP32/discussions/965)
- [Thermostat emulation](https://github.com/emsesp/EMS-ESP32/issues/151)
- [Changing the boiler heating directly](tips-and-tricks#de-verwarming-van-de-ketel-regelen)
- [Implementing a smart thermostat (using SAT)](https://github.com/emsesp/EMS-ESP32/issues/2103)

## Wat zijn busprotocollen en zendmodi?

Protocol en timing zijn twee verschillende zaken; je kiest de zendmodus die het beste werkt.

HT3 is de elektronica van Junkers en het HT3-protocol is hetzelfde als dat van EMS, alleen is in de eerste byte (afzender) het hoogste bit ingesteld. Elk telegram dat we verzenden, begint in een Buderus-systeem met 0B, maar bij Junkers met 8B. Hierdoor zijn de apparaten van de verschillende merken niet compatibel. EMS-ESP controleert de bus bij het opstarten en selecteert automatisch het juiste protocol. Ook gebruikt Junkers een ander telegram numbers/orders. Modules van het merk Bosch gebruiken dezelfde telegramnummers als Buderus, maar adresseren net als Junkers, waardoor ze eveneens incompatibel zijn. U kunt geen Junkers- of Buderus-modules aansluiten op een Bosch-verwarmingssysteem.

De Tx-modus bepaalt de verzendtiming: de client-apparaten verzenden via stroommodulatie, de master via spanningsmodulatie. Dit maakt full-duplex mogelijk (hardwaremodus), maar afhankelijk van de lijnimpedantie beïnvloedt de stroomopname ook de spanning. Tijdens het verzenden herhaalt de master elke byte die door het apparaat wordt verzonden, om deze naar de andere apparaten door te geven. Bij een Tx-modus van "EMS" wachten we op de master-byte voordat we de volgende verzenden. De oudere Junkers lijken een kortere time-out te hebben, dus moeten we met de volgende byte beginnen voordat de echo van de master is voltooid („HT3“). „EMS+“ is minder kritisch en we kunnen iets langer dan één byte wachten om het voltage na het verzenden te laten stabiliseren.

## Kun je meerdere exemplaren van EMS-ESP tegelijk draaien?

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

Dat gaat niet werken. De ketel werkt met `selflowtemp` als streefwaarde en regelt de brander zo dat de `flowtemp` wordt gehandhaafd. Als `flowtemp` hoger is dan de geselecteerde minimale verbrandingscapaciteit, schakelt de ketel uit, wacht de minimale periode af en als `flowtemp` is gedaald tot `selflowtemp` –   hysterese – en start hij opnieuw. Het verhogen van de `burnminpower` leidt onder milde omstandigheden alleen maar tot meer on/off-cycli.

## Hoe je energie kunt besparen op de ESP32-chip

Als je je zorgen maakt over het energieverbruik van de ESP32-chip en de warmteontwikkeling wilt verminderen, kun je enkele van deze instellingen toepassen:
- `Underclock CPU speed` in de **sectie Application Settings/Hardware**
- Als je wifi gebruikt, schakel dan `WiFi Sleep Mode` in, selecteer `use lower WiFi bandwidth` en verlaag het zendvermogen `Tx power` tot ongeveer 8,5 dBm in het **gedeelte Netwerk Settings/WiFi**
- Als je Ethernet gebruikt, schakel dan `Force 10Mbit half-duplex` in de **sectie Netwerk Settings/Ethernet** in

Let op: dit zal de prestaties van de ESP32-chip verminderen en kan stabiliteitsproblemen veroorzaken.

## De firmware bijwerken

Bij het upgraden of downgraden tussen verschillende EMS-ESP-versies zorgt EMS-ESP ervoor dat de instellingen worden gemigreerd, zodat de compatibiliteit met de nieuw geïnstalleerde versie gewaarborgd blijft.

Lees vóór het upgraden altijd de [ChangeLog](Version-Release-History.md) voor de release-opmerkingen en informatie over eventuele ingrijpende wijzigingen.

### Upgraden van 3.8.x naar 3.10.x

:::waarschuwing[Geen fabrieksreset nodig]

Wanneer je een 3.9.0-ontwikkelingsversie installeert via de webinterface van een 3.8.x-versie, wordt in het dialoogvenster aangegeven dat voor de upgrade een fabrieksreset nodig is. Dit is niet het geval, dus negeer dat deel van het bericht. Uw instellingen blijven behouden en worden overgezet. Bij het upgraden naar 3.10.0 verschijnt dit bericht niet.

:::

Voordat je de upgrade uitvoert:

1. **Maak een systeemback-up** via Instellingen > Download/Upload. Na de upgrade worden wachtwoorden in gehasht vorm opgeslagen en kan versie 3.8.x deze niet lezen. Om terug te gaan naar versie 3.8.x is deze back-up dus nodig; anders moet je het apparaat terugzetten naar de fabrieksinstellingen.
2. **Let op welke integraties gebruikmaken van de API**, zoals Home Assistant REST-sensoren, Node-RED of scripts. Hun toegangstokens werken na de upgrade niet meer.

Na de upgrade:

1. **Stel nieuwe wachtwoorden in als u nog steeds de standaardwachtwoorden gebruikt.** Een beheerder die zich aanmeldt met een standaardwachtwoord, moet een nieuw beheerderswachtwoord instellen voordat de webinterface kan worden gebruikt, en bovendien een nieuw wachtwoord voor het toegangspunt als er nog geen wifi-netwerk is ingesteld.
2. **Maak voor elke integratie een API-sleutel aan** onder Beveiliging > API-sleutels en verstuur deze als `Authorization: Bearer <key>`. Kies „Lezen” voor integraties die alleen waarden lezen, en „Lezen en schrijven” voor integraties die instellingen of waarden wijzigen.
3. **Controleer wat gastgebruikers mogen doen.** Alleen beheerders kunnen de Scheduler, Commands, Custom Entities en Modules wijzigen. Commands van vóór de upgrade kunnen nog steeds door gasten worden uitgevoerd; voor nieuwe Commands vink je "Gasten mogen deze command uitvoeren" aan als dat de bedoeling is.
4. **Controleer de Scheduler en Commands op vermeldingen die u niet zelf hebt aangemaakt.** Vóór 3.10.0 konden gastgebruikers en oproepen zonder token deze toevoegen, en deze zijn bij de upgrade behouden gebleven. Scheduler-vermeldingen worden uitgevoerd met beheerdersrechten. Verwijder alles wat u niet herkent en schakel bij opdrachten die gasten niet nodig hebben de optie "Gasten mogen deze opdracht uitvoeren" uit.

Je hoeft je back-up na de upgrade niet te uploaden. Bewaar deze voor het geval je terug wilt naar versie 3.8.x. De volledige lijst met ingrijpende wijzigingen vind je in de [ChangeLog](Version-Release-History.md).

### Standaard- en aangepaste configuraties

Vanaf 3.10.0 controleert EMS-ESP of de firmware een officiële build is wanneer je een firmwarebestand uploadt via de webinterface, een versie installeert vanuit de versielijst van de webinterface of een bestand uploadt via de Recovery-app. Officiële releases en ontwikkelingsversies van [GitHub](https://github.com/emsesp/EMS-ESP32/releases) zijn ondertekend door EMS-ESP en worden direct geïnstalleerd. Op de pagina ‘Versie’ wordt naast de versie ‘Officiële versie’ weergegeven.

Al het andere is een aangepaste build, bijvoorbeeld een die je zelf hebt samengesteld, een community-build, een versie die ouder is dan 3.10.0, of een bestandssysteem-image. De webinterface geeft dan de melding „Dit is geen officiële EMS-ESP-build“ weer voordat er iets wordt geïnstalleerd. Klik op „Toch installeren“ om het te installeren, of laat het staan als je dit niet had verwacht. Op de pagina „Versie“ wordt dan „Aangepaste build“ weergegeven.

Installeer een aangepaste versie alleen als je zeker weet dat deze uit een betrouwbare bron afkomstig is. Als je een officiële versie verwachtte, is het bestand mogelijk gewijzigd of beschadigd, bijvoorbeeld door een browser of downloadmanager. Download het dan opnieuw vanaf de releasepagina.

De optie ‘Flashen via USB met [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher) of esptool’ is niet aangevinkt.

Als je je eigen firmware bouwt, raadpleeg dan [Installing your own build](https://github.com/emsesp/EMS-ESP32/blob/dev/CONTRIBUTING.md#installing-your-own-build).

### Waarom wordt mij opnieuw om mijn wachtwoord gevraagd?

Vanaf 3.10.0 vraagt de webinterface opnieuw om je wachtwoord voordat wijzigingen worden doorgevoerd die de controle over het apparaat kunnen overnemen of je de toegang tot het apparaat kunnen ontzeggen:

- firmware uploaden of installeren, inclusief de Recovery-app, en overschakelen naar de andere firmwarepartitie
- een back-up terugzetten of er een downloaden met wachtwoorden en sleutels
- een fabrieksreset
- gebruikers en wachtwoorden toevoegen, wijzigen of verwijderen, en API-sleutels aanmaken of intrekken
- CORS inschakelen, toegestane hostnamen toevoegen, de API-bypass inschakelen of telnet inschakelen

Zodra je je gegevens hebt ingevoerd, hoef je deze in die browser gedurende 5 minuten niet opnieuw in te voeren. Dit wordt beëindigd als je je opnieuw aanmeldt of EMS-ESP opnieuw opstart.

Scripts die deze wijzigingen doorvoeren via een aanmelding via de webinterface, krijgen HTTP-status 428. Ze moeten het wachtwoord eerst verzenden met `POST /rest/confirmPassword` en de body met `{"password":"..."}`, waarbij hetzelfde token wordt gebruikt. Integraties met API-sleutels en MQTT ondervinden hier geen hinder van.

### Firmware installeren via een URL

Vanaf 3.10.0 kan firmware alleen worden geïnstalleerd via een URL van een EMS-ESP-release op GitHub, die begint met `https://github.com/emsesp/EMS-ESP32/releases/`. De versielijst van de webinterface maakt hier altijd gebruik van. Alle andere bestanden moet je downloaden en vervolgens via de webinterface uploaden.
