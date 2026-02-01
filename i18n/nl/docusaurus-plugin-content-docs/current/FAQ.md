---
id: FAQ
title: Frequently Asked Questions
description: Common questions and answers about EMS-ESP including factory reset, EMS telegrams, and troubleshooting
---

# FAQ

## Hoe reset ik de EMS-ESP in de fabriek?

Als je een GPIO-knop hebt geconfigureerd (standaard ingeschakeld op alle BBQKees boards), voer je een fabrieksreset uit door deze 10 seconden ingedrukt te houden en los te laten. EMS-ESP zal opnieuw opstarten in Access Point-modus.

## Wat is een EMS Telegram?

Geschreven door MichaelDvP in [this article](https://github.com/emsesp/EMS-ESP32/discussions/1612#discussioncomment-8408868):

Het beste overzicht van bekende telegrammen is van [Norberts1](https://github.com/norberts1/hometop_HT3/blob/master/HT3/docu/HT_EMS_Bus_messages.pdf) en de [EMS-Wiki](https://emswiki.thefischer.net/doku.php). In het algemeen kunnen we zeggen:

- meetwaarden worden periodiek uitgezonden 10 sec / 1 min
- instellingen worden alleen uitgezonden na een wijziging
- het wijzigen van een instelling van een apparaat via de UI van thermostaat resulteert in een bericht thermostaat -w-> apparaat met alleen deze waarde
- sommige apparaten zenden snel veranderende waarden uit als enkele waarden
- gemeten temperaturen zijn normaal 2 bytes (SHORT) met factor 0,1 (bijv. 01 23 -> 0x0123 -> dez 291 -> 29,1°C)
- luchttemperatuurinstellingen zijn vaak factor 0,5 als enkele byte (INT) (bijv. 0x2D -> dez 45 -> 22,5°C)
- watertemperatuurinstellingen zijn meestal enkele bytes (UINT) (bijv. 0x3C -> 60°C), differentiële waarden (hysteresis in Kelvin) zijn getekend (INT)
- procentuele instellingen zijn enkele bytes (UINT) (0x64 -> 100%)
- on/off toestanden of instellingen kunnen een enkele byte zijn met on/off 0xFF/0x00, of 0x01/0x00 of een enkele bit in een byte samen met 7 andere toestanden
- tijden en energie is meestal 3 of 4 bytes met of zonder factor

Voor verschillende brands/devices gebruikt Bosch soms verschillende uitdrukkingen voor dezelfde waarde. Misschien wisselen ontwikkelaars of willen ze reverse engineering moeilijk maken!

Als je een instelling zoekt, log dan de telegrammen voor het apparaat (log all of kijk naar &lt;device-id&gt;) en verander de instelling op de thermostaat in een andere states/values. Zoek vervolgens naar deze waarden in het logboek. Als je een meting zoekt, log het apparaat en bekijk de waarde op de thermostaat en wacht op veranderingen, noteer old/new waarden en tijd. Controleer vervolgens het log voor deze tijdstempel (of 10 sec / 1 min later) en de waarde binnen een telegram. Het beste is om meer changes/values te hebben om zeker te zijn.

## Kan EMS-ESP een thermostaat simuleren?

Gedeeltelijk. Zoals de mensen van [OpenTherm Gateway (OTGW)](https://otgw.tclcode.com/standalone.html#intro) het mooi zeggen:

:::tip Waarom een thermostaat gebruiken?

    - De fabrikanten van thermostaten hebben jarenlang onderzoek gedaan naar de verwarmingskenmerken voor de meest efficiënte en comfortabele manier om een huis te verwarmen.
    - De thermostaat biedt een bedieningsinterface waarmee mensen vertrouwd zijn, zodat andere leden van het huishouden nog steeds de instelwaarde kunnen aanpassen.
    - Het biedt een handige behuizing voor de kamertemperatuursensor, die nodig is tenzij je een verwarmingscurve gebruikt die alleen gebaseerd is op de buitentemperatuur.

:::

Zoals **MichaelDvP** aangeeft _"is een thermostaat een slim elektronisch apparaat. Je kunt de gewenste kamertemperatuur invoeren en de thermostaat berekent aan de hand van een aantal parameters en metingen de benodigde flowtemp voor deze kamertemperatuur en stuurt deze naar de ketel. Dit gebeurt in een regelkring en wordt vaak bijgewerkt."_

En **mtc716** zei _"Een thermostaat maakt een warmtecurve die constant wordt aangepast aan de omgevingstemperaturen en die wordt gebruikt om in te schatten welke watertemperatuur nodig is om de kamertemperatuur omhoog te brengen. Er zijn enkele goede artikelen op het net te vinden over hoe je de warmtecurve correct instelt. De belangrijkste parameters die je nodig hebt zijn de "ontwerptemp", dat is de temperatuur van het verwarmingswater bij een minimale buitentemperatuur. Verder heb je de "comforttemp" nodig zoals eerder uitgelegd en de "temp-offset" die een parallelle verschuiving in de verwarmingscurve veroorzaakt."_

Bovendien, zoals **MichaelDvP** zegt "Als je een softwaregestuurde thermostaat wilt bouwen, kun je verschillende methoden gebruiken:"

- gecontroleerde buitentemperatuur: definieer een verwarmingscurve voor je gebouw. Dit is een lineaire interpolatie tussen een minimale buitentemperatuur voor jouw regio (typisch 11°C voor midden-Europa) met maximale flowtemp (designtemp ~76°C voor radiatoren, 40°C voor vloer) en het werkelijke setpoint voor de ruimte (bijv. 21°C) voor buiten en flowtemp. Je kunt een offset toevoegen. selfflowtemp = offset + setpoint + (designtemp- setpoint) * (setpoint - outdoortemp) / (setpoint - minoutdoor)
- kamergestuurd, geschakeld: meet de kamertemperatuur en schakel de ketel met verwarming uit voor kamertemperatuur > setpoint. Voeg een hysteresis toe om veel schakelen te voorkomen
- ruimtegestuurd, dynamisch Hier moet je een PID-regeling berekenen. Een beetje buiten het bereik van de ems-esp planner. Maar misschien wel mogelijk. Bij HA kun je kijken naar Een slimme thermostaat implementeren (met SAT). Zie [#2103](https://github.com/emsesp/EMS-ESP32/issues/2103)
- geregeld door slimme TRV's: Als je de opening van de TRV's kunt aflezen, maak dan een eenvoudige I-regeling. Als een TRV volledig open is: verhoog de flowtemp, als de meest open TRV onder 90% opening is: verlaag de flowtemp. Opwarmen is een langzaam proces, dus increase/decrease voorzichtig.

Lees meer over deze discussies:

- [Smart control a heating system with HA?](https://github.com/emsesp/EMS-ESP32/discussions/965)
- [Thermostat emulation](https://github.com/emsesp/EMS-ESP32/issues/151)
- [Changing the boiler heating directly](tips-and-tricks#verwarming-van-de-ketel-regelen)
- [Implementing a smart thermostat (using SAT)](https://github.com/emsesp/EMS-ESP32/issues/2103)

## Wat zijn busprotocollen en Tx-modi?

Protocol en timing zijn verschillende dingen, je kiest de tx-modus die het beste werkt.

HT3 is de elektronica van Junkers en het HT3-protocol is hetzelfde als EMS, alleen is in het eerste byte (verzender) het hoogste bit ingesteld. Elk telegram dat we versturen begint met 0B in een Buderus-systeem, maar met 8B in Junkers. Dit maakt de apparaten van de verschillende merken incompatibel. EMS-ESP controleert de bus bij het starten en selecteert automatisch het juiste protocol. Ook Junkers gebruikt een ander telegram numbers/orders. Bosch gelabelde modules gebruiken dezelfde telegramnummers als Buderus, maar een andere adressering dan Junkers, dus ook niet compatibel. Je kunt geen Junkers- of Buderus-modules aansluiten op een Bosch-verwarmingssysteem.

Tx-mode is de verzendtijd: De client-apparaten verzenden via stroommodulatie, de master via spanningsmodulatie. Dit maakt full duplex (hardwaremodus) mogelijk, maar afhankelijk van de lijnimpedantie beïnvloedt de stroomopname ook de spanning. Tijdens het verzenden herhaalt de master elke byte die door het apparaat is verzonden om deze naar de andere apparaten te publiceren. Met een Tx-modus van "EMS" wachten we op de master-byte voordat we de volgende verzenden. De oudere Junkers lijken een lagere time-out te hebben, dus we moeten de volgende byte starten voordat de master-echo is voltooid ("HT3"). "EMS+" is minder kritisch en we kunnen iets langer dan één byte wachten om de spanning te stabiliseren na het verzenden.

## Kun je meerdere instanties van EMS-ESP draaien?

Ja, dat kan. Houd rekening met de volgende instellingen:

- (Instellingen->MQTT Instellingen) MQTT `Entity ID format` is ingesteld op "Meerdere instanties, korte naam"
- (Instellingen->MQTT Instellingen) MQTT `Client ID` moet uniek zijn om conflicten in de MQTT broker te voorkomen
- (Instellingen->MQTT Instellingen) MQTT `Base` is uniek (wees er zeker van). Stel dit meestal in op de hostnaam.
- (Instellingen->Netwerkinstellingen) `Hostname` is uniek, om netwerkconflicten te voorkomen
- (Instellingen->Toepassingsinstellingen) `EMS BUS ID` zijn verschillend (niet beide 0x0B)

## Waarom hebben EMS-telegrammen in de modus `raw watch` een hoger type 0x100 dan in de modus `raw`?

Zie [this discussion](https://github.com/emsesp/EMS-ESP32/discussions/2025)

## Moet ik het minBurnPower verhogen naar 10-20% in koude winters, zodat er altijd een thermische basisvoorraad is?

(antwoord van [MichaelDvP](https://github.com/MichaelDvP))

Dat werkt niet. De ketel werkt met `selflowtemp` als doel en moduleert de brander om de `flowtemp` vast te houden. Als `flowtemp` hoger is dan het geselecteerde min. brandvermogen, schakelt de ketel uit, wacht de min. periode en `flowtemp` is gedaald tot `selflowtemp` - hysterese en begint opnieuw. Het verhogen van `burnminpower` zal alleen resulteren in meer on/off cycli in milde omstandigheden.
