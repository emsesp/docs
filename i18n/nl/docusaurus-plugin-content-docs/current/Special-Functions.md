---
id: Special-Functions
title: Special Functions
description: Learn about EMS-ESP special features including shower timer, energy measurement, and calculated entities
---

# Speciale functies

Sommige entiteiten die in MQTT in kaart zijn gebracht, worden door EMS-ESP gegenereerd en worden niet uit de EMS-bus gelezen.

`heating_active` en `tapwater_active` worden berekend op basis van de instellingen voor de brander en valve/pump. Deze worden gebruikt door zowel de douchetimer als de energiemeting.

:::tip[Opmerking]
Beide entiteiten `heating_active` en `tapwater_active` kunnen alleen worden gebruikt op systemen zonder buffer.
Als je thuis een systeem met een reservetank hebt, zullen ze hoogstwaarschijnlijk niet naar behoren werken.
:::

## Douchetimer

Meet de tijd dat er warm water stroomt terwijl de brander aanstaat. Dit werkt alleen bij warmwatersystemen met doorstroom; bij warmwatersystemen met buffer is de tijd altijd gelijk aan de oplaadtijd van de buffer.
Als extra functie is er de ‘Shower Alert’, die na een ingestelde tijd een waarschuwing geeft en een stoot koud water activeert. De ‘coldshot’ wordt beheerd door de entiteit `boiler/tapactivated` en maakt gebruik van een aangepaste functie die de boiler in de ‘testmodus’ zet, de doorstroom van leidingwater inschakelt maar de brander uitschakelt.

## Verwarming uitschakelen

Sommige gebruikers regelen de ketel zonder thermostaat en willen de ketel uitschakelen zodra de gewenste temperatuur is bereikt. Het verzenden van `boiler/selflowtemp 0` naar de ketel moet elke minuut worden herhaald, anders keert de ketel terug naar de op het bedieningspaneel geselecteerde temperatuur.

De functie `boiler/forceheatingoff` herhaalt deze opdracht elke minuut, zodat de verwarming uit blijft. In de EMS-ESP-instellingen kan de waarde worden ingesteld waarbij `forceheatingoff` wordt ingeschakeld.

## De aanvoertemperatuur instellen zonder thermostaat

`boiler/selflowtemp` wordt als een normale thermostaatinstelwaarde naar de ketel gestuurd. Hoe de ketel hierop reageert, hangt af van de firmware en van het feit of de ingebouwde weerscompensatie (`boiler/curveon`) is ingeschakeld. Een Buderus GB172i (EMS 1.0, buitensensor op de ketel, geen thermostaat) gedraagt zich bijvoorbeeld als volgt ([#3447](https://github.com/emsesp/EMS-ESP32/discussions/3447)):

| `curveon` | `selflowtemp` | Resultaat |
| --------- | ------------- | ------ |
| uit | willekeurige waarde | Wordt genegeerd. De ketel draait op `heatingtemp` |
| op | boven de curvewaarde | Geaccepteerd, tot `heatingtemp` |
| op | onder de curvewaarde | Wordt genegeerd. De ketel behoudt zijn curvewaarde |

Als de curve is ingeschakeld, gebruikt de ketel de hoogste waarde van zijn eigen curve en `selflowtemp`. Je kunt dit gebruiken om de curve een paar graden onder je streefwaarde in te stellen als ondergrens, en de daadwerkelijke streefwaarde via `selflowtemp` door te geven, bijvoorbeeld vanuit Home Assistant. Hiervoor hoeven tijdens normaal bedrijf geen instellingen naar de ketel te worden geschreven.

:::warning[Geen time-out]
Bij deze ketel treedt er geen time-out op `selflowtemp`. De laatste waarde blijft actief totdat de ketel zijn curve opnieuw berekent, bijvoorbeeld wanneer een curveparameter of de buitentemperatuur verandert. Als EMS-ESP of uw domoticasysteem geen signalen meer verstuurt, kan de ketel nog lange tijd blijven verwarmen op basis van de laatste waarde. Andere ketels vallen na ongeveer een minuut terug op de instelling op het bedieningspaneel (zie ‘Verwarming geforceerd uitschakelen’ hierboven), dus controleer hoe uw ketel zich gedraagt voordat u op een van beide vertrouwt.
:::

## Energiemeting

Voor gas- en oliebranders meet Bosch het energieverbruik niet. EMS-ESP berekent het verbruik van elke ketel op basis van de brandermodulatie en het nominaal vermogen van de ketel. Bij sommige gasketels is het nominaal vermogen opgeslagen, bij andere niet.
Bovendien is het opgeslagen vermogen niet altijd correct; een ketel van hetzelfde type kan zijn uitgerust met verschillende branders of de branders kunnen zijn aangepast aan de grootte air/nozzle.
In deze gevallen kan het nominaal vermogen `boiler/nompower` worden gewijzigd en opgeslagen in EMS-ESP. Controleer de instelling voordat u de energiewaarden gebruikt.

## Thermostaten op afstand

Moderne thermostaten kunnen de buitentemperatuur gebruiken om de juiste aanvoertemperatuur van de ketel te berekenen. Een enkele thermostaat die in de ketel is geplaatst, kan dit voor verschillende verwarmingscircuits doen, maar dit verloopt traag en is onnauwkeurig. Als een kamerthermostaat meet dat de werkelijke temperatuur veel lager is, moet deze de aanvoertemperatuur verhogen tot een veel hogere waarde totdat de juiste temperatuur is bereikt. Dit wordt „buitensturing“ met „kamerinvloed“ genoemd en vereist doorgaans de aanwezigheid van een fysieke externe thermostaat in de kamer. EMS-ESP kan zo’n afstandsthermostaat simuleren. Dit gebeurt door het regelapparaat (`thermostat/hc<x>/control`) van de hoofdthermostaat in te stellen en de temperatuur en eventueel de luchtvochtigheid via `thermostat/hcx/remotetemp` en `thermostat/hcx/remotehum` te verzenden. De waarden worden vervolgens doorgestuurd naar de hoofdthermostaat.

Voor een hoofdthermostaat van het type RC30/RC35 wordt een RC20 geëmuleerd. Voor de BC400 zijn de opties RC100, RC100H en RT800. Voor een Junkers/Bosch FW120 en soortgelijke modellen wordt een FB10 of FB100 geëmuleerd. En voor RC100/RC200/RC3x0 kunt u kiezen om een RC100, RC200 of een RC100H te emuleren.

Volg deze stappen om de functie ‘Thermostaat op afstand’ te activeren:

- stel `thermostat/hc<x>/control` (of ‘Room Control’ in de WebUI) in op de externe thermostaat die je wilt bedienen
- stuur `thermostat/hc<x>/remotetemp` met de door jou gewenste temperatuur. Optioneel kun je voor een RC100H `thermostat/hc<x>/remotehum` sturen met een waarde voor de luchtvochtigheid

EMS-ESP zoekt de hoofdthermostaat en maakt een nieuwe thermostaat aan met entiteiten voor de kamertemperatuur en, indien gewenst, de luchtvochtigheid. Deze waarden worden automatisch bijgewerkt en gesynchroniseerd met de hoofdthermostaat.

Volg deze stappen om de functie te stoppen:

- `thermostat/hc<x>/remotetemp` verzenden met de waarde `-1`
- stel `thermostat/hc<x>/control` weer in op het modeltype ‘masterthermostaat’

De thermostaat op afstand blijft zichtbaar in het dashboard van het EMS-ESP-apparaat, maar bevat geen entiteiten.

:::tip[Opmerkingen]

- Als de regelaar is ingesteld op `roomthermostat` en de eerste temperatuurwaarde voor `remotetemp` niet binnen een minuut wordt verzonden, zal de hoofdthermostaat waarschijnlijk een foutmelding weergeven.
- De functie voor de afstandsbediening van de thermostaat werkt alleen als er een hoofdthermostaat is die afstandsbedieningen ondersteunt en er geen andere afstandsbedieningen actief zijn voor dit verwarmingscircuit.
- Alle EMS-apparaten hebben unieke apparaat-ID's, dus als er een thermostaat op afstand aanwezig is, kan die apparaat-ID niet worden gebruikt voor emulatie.
- Je kunt ook niet twee fysieke afstandsbedieningen aansluiten op één verwarmingscircuit.
- Om een afstandsbediening voor een thermostaat te emuleren, is een logbestand van een echte thermostaat nodig om de juiste commando's te kopiëren. Als dit niet werkt, probeer dan een andere optie voor de afstandsbediening. Als dat ook niet lukt, spijt het ons, maar dan kun je deze functie niet gebruiken.
  :::

:::warning[Disclaimer]
Door de luchtvochtigheid op afstand in te stellen, kunt u een warmtepomp zo instellen dat deze begint te koelen, zelfs wanneer de temperatuur onder het werkelijke dauwpunt ligt. Dit kan condensvorming op leidingen en de vloer veroorzaken, met schade aan het systeem tot gevolg. Gebruik op eigen risico!
:::

### Instellingen voor de temperatuurregeling

De EMS-ESP Scheduler kan worden gebruikt om de waarden van de thermostaat op afstand permanent vast te houden. De thermostaat wordt opnieuw aangemaakt zodra het commando is uitgevoerd en heeft dan een beginwaarde zoals hieronder weergegeven:

![EMS-SCHEDULE-EDIT](/media/screenshot/scheduler_a.jpg)

- `Timer` naar `00:00` om te activeren zodra de EMS-ESP wordt ingeschakeld
- `Command` staat voor `thermostat/hc1/remotetemp` voor verwarmingscircuit 1 (of `thermostat/hc1/remotehum` voor een RC100H)
- `Value` is de optimale kamertemperatuur voor je woning, of een opdracht (zie hieronder)
- `Name` is optioneel. Door er een naam aan te geven, kan het op afstand als commando worden ingesteld en wordt de activeringsstatus gepubliceerd in een MQTT-topic.

Als je een externe Dallas-temperatuursensor op de EMS-ESP hebt aangesloten, kun je de `value` op deze waarde instellen door `temperaturesensor/<dallas_id_or_name>` als `value` te gebruiken.

Als zowel de temperatuur als de luchtvochtigheid zijn ingesteld, zou de geëmuleerde RC100H er als volgt uitzien:

![EMS-SCHEDULE-MAIN](/media/screenshot/scheduler_b.jpg)

## De Message API gebruiken voor geavanceerde logische functies

Je kunt het API-eindpunt `message` van het systeem gebruiken om een bericht naar het logboek en MQTT te sturen, maar het bericht kan ook complexe logica bevatten, vergelijkbaar met die in de Scheduler. Bijvoorbeeld het verzenden van

```sh
curl -X POST \
    -H "Authorization: Bearer ${emsesp_token}" \
    -H "Content-Type: application/json" \
    -d '{"value":"system/settings/locale"}' \
    ${emsesp_url}/api/system/message
```

En voorbeelden waarbij de waarde wordt vervangen door:

- `(custom/test_seltemp - boiler/flowtempoffset) * 2.8 + 5"`
- `"boiler/storagetemp2 == null ? 'no' : 'yes'"`
