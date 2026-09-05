---
id: FAQ
title: Frequently Asked Questions
description: Common questions and answers about EMS-ESP including factory reset, EMS telegrams, and troubleshooting
---

# Veelgestelde vragen

## Hoe zet je de EMS-ESP terug naar de fabrieksinstellingen?

Als je een GPIO-knop hebt geconfigureerd (standaard ingeschakeld op alle BBQKees-kaarten), kun je door deze knop 10 seconden ingedrukt te houden en vervolgens los te laten een fabrieksreset uitvoeren. EMS-ESP start dan opnieuw op in de Access Point-modus.

## Wat zijn EMS-telegrammen?

Geschreven door MichaelDvP in [this article](https://github.com/emsesp/EMS-ESP32/discussions/1612#discussioncomment-8408868):

Het beste overzicht van bekende telegrammen is te vinden in [Norberts1](https://github.com/norberts1/hometop_HT3/blob/master/HT3/docu/HT_EMS_Bus_messages.pdf) en [EMS-Wiki](https://emswiki.thefischer.net/doku.php). In het algemeen kunnen we zeggen:

- de meetwaarden worden periodiek uitgezonden (om de 10 seconden / om de 1 minuut)
- instellingen worden pas verzonden nadat er een wijziging is aangebracht
- als je een instelling van een apparaat wijzigt via de gebruikersinterface van de thermostaat, verschijnt er een bericht van de thermostaat naar het apparaat met alleen deze waarde
- sommige apparaten verzenden snel veranderende waarden als afzonderlijke waarden
- gemeten temperaturen zijn doorgaans 2 bytes (SHORT) met een factor 0,1 (bijv. 01 23 -> 0x0123 -> dez 291 -> 29,1 °C)
- instellingen voor de luchttemperatuur worden vaak weergegeven als een factor 0,5 in de vorm van een enkele byte (INT) (bijv. 0x2D -> dez 45 -> 22,5 °C)
- De instellingen voor de watertemperatuur zijn doorgaans van één byte (UINT) (bijv. 0x3C -> 60 °C), terwijl de differentiaalwaarden (hysterese in Kelvin) met teken worden weergegeven (INT)
- de procentuele instellingen bestaan uit één byte (UINT) (0x64 -> 100%)
- on/off-toestanden of -instellingen kunnen bestaan uit één byte met on/off, 0xFF/0x00 of 0x01/0x00, of uit één bit in een byte in combinatie met 7 andere toestanden
- de tijd en energie bedragen doorgaans 3 of 4 bytes, met of zonder factor

Voor verschillende brands/devices gebruikt Bosch soms verschillende uitdrukkingen voor dezelfde waarde. Misschien wisselen ze van ontwikkelaars, of willen ze reverse engineering juist bemoeilijken!

Als je een instelling zoekt, log dan de telegrammen voor het apparaat (alles loggen of &lt;device-id&gt; in de gaten houden) en wijzig de instelling op de thermostaat naar een andere states/values. Zoek vervolgens naar deze waarden in het logboek. Als je naar een meting zoekt, registreer dan het apparaat, bekijk de waarde op de thermostaat en wacht op wijzigingen; noteer de old/new-waarden en de tijd. Controleer vervolgens het logboek op dit tijdstempel (of 10 sec / 1 min later) en de waarde in een telegram. Voor de zekerheid kun je het beste meerdere changes/values-waarden noteren.

## Kan EMS-ESP een thermostaat simuleren?

Gedeeltelijk. Zoals de mensen van [OpenTherm Gateway (OTGW)](https://otgw.tclcode.com/standalone.html#intro) het zo treffend verwoordden:

:::tip[Waarom een thermostaat gebruiken?]

    - De fabrikanten van thermostaten hebben jarenlang onderzoek gedaan om de verwarmingskenmerken te bepalen die zorgen voor de meest efficiënte en comfortabele manier om een huis te verwarmen.
    - De thermostaat heeft een bedieningsinterface waarmee mensen vertrouwd zijn, zodat andere leden van het huishouden het instelpunt nog steeds kunnen aanpassen.
    - Het biedt een handige behuizing voor de kamertemperatuursensor, die nodig is tenzij je een verwarmingscurve gebruikt die uitsluitend op de buitentemperatuur is gebaseerd.

:::

Zoals **MichaelDvP** opmerkt: _"Een thermostaat is een slim elektronisch apparaat. Je kunt de gewenste kamertemperatuur instellen, waarna het apparaat op basis van bepaalde parameters en metingen de benodigde aanvoertemperatuur voor die kamertemperatuur berekent en deze naar de ketel doorgeeft. Dit gebeurt in een regelkring en wordt regelmatig bijgewerkt."_

En **mtc716** zei: _"Een thermostaat stelt een verwarmingscurve op die voortdurend wordt aangepast aan de buitentemperatuur en die wordt gebruikt om te bepalen welke watertemperatuur nodig is om de kamertemperatuur te verhogen. Er zijn op internet een aantal goede artikelen te vinden over hoe je de verwarmingscurve correct instelt. De belangrijkste parameters die je nodig hebt, zijn de ‘ontwerptemperatuur’, dat is de temperatuur van het verwarmingswater bij de laagste buitentemperatuur. Verder heb je de ‘comforttemperatuur’ nodig, zoals eerder uitgelegd, en de ‘temperatuurofset’, die zorgt voor een parallelle verschuiving in de verwarmingscurve.”_

Bovendien zegt **MichaelDvP**: "Als je een softwaregestuurde thermostaat wilt bouwen, kun je verschillende methoden gebruiken:"

- op basis van de buitentemperatuur:
  stel een verwarmingscurve in voor uw gebouw. Dit is een lineaire interpolatie tussen een minimale buitentemperatuur voor uw regio (doorgaans -11 °C voor Midden-Europa) en de maximale aanvoertemperatuur (ontwerptemperatuur ~76 °C voor radiatoren, 40 °C voor vloerverwarming) en de actuele kamerstelwaarde (bijv. 21 °C) voor de buitentemperatuur en de aanvoertemperatuur. U kunt een offset toevoegen.
  selflowtemp = offset + instelwaarde + (ontwerptemperatuur - instelwaarde) * (instelwaarde - buitentemperatuur) / (instelwaarde - minimale buitentemperatuur)
- kamerregeling, schakelregeling:
  meet de kamertemperatuur en schakel de ketel in, waarbij ‘verwarming uit’ wordt geactiveerd als de kamertemperatuur hoger is dan de instelwaarde. Voeg een hysterese toe om te veel schakelen te voorkomen
- kamergestuurd, dynamisch
  Hiervoor moet je een PID-regeling berekenen. Dat valt een beetje buiten het toepassingsgebied van de ems-esp-scheduler. Maar misschien is het wel mogelijk. Op HA kun je het artikel ‘Een slimme thermostaat implementeren (met SAT)’ raadplegen. Zie [#2103](https://github.com/emsesp/EMS-ESP32/issues/2103)
- aangestuurd door slimme thermostaatventielen (TRV’s):
  Als u de openingsgraad van de thermostaatkranen kunt aflezen, maak dan een eenvoudige I-regeling. Als een thermostaatkraan volledig openstaat: verhoog de aanvoertemperatuur; als de meest geopende thermostaatkraan minder dan 90% openstaat: verlaag de aanvoertemperatuur. Verwarmen is een langzaam proces, dus increase/decrease zorgvuldig.

Lees voor meer informatie ook eens deze discussies:

- [Smart control a heating system with HA?](https://github.com/emsesp/EMS-ESP32/discussions/965)
- [Thermostat emulation](https://github.com/emsesp/EMS-ESP32/issues/151)
- [Changing the boiler heating directly](tips-and-tricks#de-verwarming-van-de-ketel-regelen)
- [Implementing a smart thermostat (using SAT)](https://github.com/emsesp/EMS-ESP32/issues/2103)

## Wat zijn busprotocollen en verzendmodi?

Protocol en timing zijn twee verschillende zaken; je kiest de zendmodus die het beste werkt.

HT3 is de elektronica van Junkers en het HT3-protocol is hetzelfde als dat van EMS, alleen is in de eerste byte (afzender) het hoogste bit ingesteld. Elk telegram dat we verzenden, begint in een Buderus-systeem met 0B, maar bij Junkers met 8B. Hierdoor zijn de apparaten van de verschillende merken niet compatibel. EMS-ESP controleert de bus bij het opstarten en selecteert automatisch het juiste protocol. Ook gebruikt Junkers een ander telegram numbers/orders. Modules van het merk Bosch gebruiken dezelfde telegramnummers als Buderus, maar adresseren net als Junkers, waardoor ze eveneens incompatibel zijn. U kunt geen Junkers- of Buderus-modules aansluiten op een Bosch-verwarmingssysteem.

De Tx-modus bepaalt de verzendtiming: de client-apparaten verzenden via stroommodulatie, de master via spanningsmodulatie. Dit maakt full-duplex mogelijk (hardwaremodus), maar afhankelijk van de lijnimpedantie beïnvloedt de stroomopname ook de spanning. Tijdens het verzenden herhaalt de master elke byte die door het apparaat wordt verzonden, om deze naar de andere apparaten door te geven. Bij een Tx-modus van "EMS" wachten we op de master-byte voordat we de volgende verzenden. De oudere Junkers-modellen lijken een kortere time-out te hebben, dus moeten we met de volgende byte beginnen voordat de echo van de master is voltooid („HT3“). „EMS+“ is minder kritisch en we kunnen iets langer dan één byte wachten, zodat de spanning na het verzenden kan stabiliseren.

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

Dat gaat niet werken. De ketel werkt met `selflowtemp` als streefwaarde en regelt de brander zo dat de `flowtemp` wordt gehandhaafd. Als `flowtemp` hoger is dan de geselecteerde minimale verbrandingscapaciteit, schakelt de ketel uit, wacht de minimale periode af en als `flowtemp` is gedaald tot `selflowtemp` –  hysterese – en start hij opnieuw. Het verhogen van de `burnminpower` zal bij milde omstandigheden alleen maar leiden tot meer on/off-cycli.

## Hoe je energie kunt besparen met de ESP32-chip

Als je je zorgen maakt over het energieverbruik van de ESP32-chip en de warmteontwikkeling wilt verminderen, kun je enkele van deze instellingen toepassen:
- `Underclock CPU speed` in de **sectie Application Settings/Hardware**
- Als je wifi gebruikt, schakel dan `WiFi Sleep Mode` in, selecteer `use lower WiFi bandwidth` en verlaag het zendvermogen `Tx power` tot ongeveer 8,5 dBm in het **gedeelte Netwerk Settings/WiFi**
- Als je Ethernet gebruikt, schakel dan `Force 10Mbit half-duplex` in de **sectie Netwerk Settings/Ethernet** in

Let op: dit zal de prestaties van de ESP32-chip verminderen en kan stabiliteitsproblemen veroorzaken.

## De firmware bijwerken

Bij het upgraden of downgraden tussen verschillende versies van EMS-ESP zorgt EMS-ESP ervoor dat de instellingen worden gemigreerd, zodat de compatibiliteit met de nieuw geïnstalleerde versie gewaarborgd blijft.

Lees vóór het upgraden altijd de [ChangeLog](Version-Release-History.md) voor de release-opmerkingen en informatie over eventuele ingrijpende wijzigingen.

:::warning
### Overstappen naar versie 3.9
:::

In versie 3.9 van de EMS-ESP-firmware hebben we de ESP32-kern geoptimaliseerd en een efficiënter bestandssysteem geïmplementeerd. Dit betekent helaas dat u de instellingen na voltooiing van de installatie handmatig moet uploaden. Het is belangrijk dat u eerst een back-up van uw instellingen en aanpassingen downloadt voordat u de upgrade start. Dit kun je doen via de pagina Download/Upload in de WebUI, waarna er één voor mensen leesbaar JSON-bestand wordt aangemaakt. 

Wanneer de EMS-ESP opstart, wordt deze teruggezet naar de standaard fabrieksinstellingen. U moet dan uw opgeslagen instellingen handmatig uploaden door het zojuist aangemaakte JSON-back-upbestand te selecteren en dit te uploaden op de pagina Download/Upload. Als u wifi gebruikt, maak dan verbinding met het EMS-ESP-toegangspunt en open een browser naar http://192.168.4.1.

