---
id: Special-Functions
---
# Speciale functies

Sommige entiteiten die in MQTT in kaart worden gebracht, worden gegenereerd door EMS-ESP en niet gelezen van de EMS-bus.

`heating_active` en `tapwater_active` worden berekend op basis van de brander en valve/pump instellingen. Deze worden gebruikt door de functies Douche Timer en Energiemeting.

## Douche Timer

Meet de tijd dat heet water loopt met brander aan. Dit werkt alleen voor dhw flowsystemen; in gebufferde dhw-systemen is de tijd altijd de oplaadtijd van de buffer. Als extra functie is er de Shower Alert, die waarschuwt en een uitbarsting van koud water activeert na een geconfigureerde tijd. De 'coldshot' wordt beheerd door de entiteit `boiler/tapactivated` en gebruikt een aangepaste functie die de ketel in de 'testmodus' zet, de kraanwaterstroom inschakelt maar de brander uitschakelt.

## Verwarming forceren uit

Sommige gebruikers regelen de ketel zonder thermostaat en willen de ketel uitschakelen wanneer een gewenste temperatuur is bereikt. Het verzenden van `boiler/selflowtemp 0` naar de ketel moet elke minuut worden herhaald, anders valt de ketel terug naar de geselecteerde temperatuur op het paneel.

De functie `boiler/forceheatingoff` herhaalt dit commando elke minuut, zodat de verwarming uit blijft. In de EMS-ESP-instellingen is het mogelijk om de inschakelwaarde van `forceheatingoff` in te stellen.

## Energiemeting

Voor gas- en oliebranders meet Bosch het energieverbruik niet. EMS-ESP berekent het verbruik van elk ketelbericht aan de hand van de brandermodulatie en het nominale ketelvermogen. Bij sommige gasketels is het nominale vermogen opgeslagen, bij andere niet. Ook is het opgeslagen vermogen niet altijd correct, een ketel van hetzelfde type kan zijn uitgerust met verschillende branders of kan zijn branders hebben aangepast met een air/nozzle maat. In deze gevallen kan het nominale vermogen `boiler/nompower` worden gewijzigd en opgeslagen in EMS-ESP. Controleer de instelling voordat u de energiewaarden gebruikt.

## Afstandsbediening

Moderne thermostaten kunnen de buitentemperatuur gebruiken om de juiste aanvoertemperatuur van de ketel te berekenen. Een enkele thermostaat in de ketel kan dit doen voor verschillende verwarmingscircuits, maar het is traag en onnauwkeurig. Als een kamerthermostaat meet dat de werkelijke temperatuur veel lager is, moet hij de aanvoertemperatuur verhogen tot een veel hogere waarde totdat de juiste temperatuur is bereikt. Dit wordt "buitengestuurd" met "ruimte-invloed" genoemd en vereist meestal een fysieke thermostaat op afstand in de ruimte. EMS-ESP kan zo'n thermostaat simuleren. Dit wordt gedaan door het regelapparaat van de hoofdthermostaat (`thermostat/hc<x>/control`) in te stellen en de temperatuur en optioneel de vochtigheid te verzenden via `thermostat/hcx/remotetemp` en `thermostat/hcx/remotehum`. Deze stuurt dan de waarden door naar de masterthermostaat.

Voor een masterthermostaat van het type RC30/RC35 wordt een RC20 geëmuleerd. Voor de BC400 zijn de opties RC100, RC100H en RT800. Voor een Junkers/Bosch FW120 en vergelijkbaar wordt een FB10 of FB100 geëmuleerd. En voor RC100/RC200/RC3x0 kun je kiezen om een RC100, RC200 of een RC100H te emuleren.

Volg deze stappen om de functie Thermostaat op afstand te activeren:

- stel `thermostat/hc<x>/control` (of Room Control in de WebUI) in op de thermostaat op afstand die u wilt bedienen
- stuur `thermostat/hc<x>/remotetemp` met de gewenste temperatuur. Optioneel voor een RC100H stuur `thermostat/hc<x>/remotehum` met een waarde voor de vochtigheid

EMS-ESP zal zoeken naar de masterthermostaat en een nieuwe thermostaat aanmaken met entiteiten voor kamertemperatuur en optioneel vochtigheid. Deze waarden worden automatisch bijgewerkt en gesynchroniseerd met de masterthermostaat.

Volg deze stappen om de functie te stoppen:

- stuur `thermostat/hc<x>/remotetemp` met een waarde van `-1`
- stel `thermostat/hc<x>/control` terug in op het type hoofdthermostaat

De thermostaat op afstand blijft in het EMS-ESP apparaatdashboard, maar heeft geen entiteiten.

Let op, als de regeling is ingesteld op `roomthermostat` en de eerste temperatuurwaarde voor `remotetemp` niet binnen een minuut wordt verzonden, zal de hoofdthermostaat waarschijnlijk een foutmelding geven.

:::warning
Disclaimer: Met het op afstand instellen van de luchtvochtigheid kunt u een warmtepomp instellen om te gaan koelen, zelfs als het onder het werkelijke dauwpunt is, wat condensatie op leidingen en de vloer kan veroorzaken en vervolgens het systeem kan beschadigen. Gebruik op eigen risico!
:::

### Temperatuurinstellingen plannen

De EMS-ESP Scheduler kan worden gebruikt om de waarden van de thermostaat op afstand permanent te handhaven. De thermostaat wordt opnieuw aangemaakt zodra de opdracht is gegeven en heeft een beginwaarde zoals hieronder getoond:

![EMS-SCHEDULE-EDIT](/media/screenshot/scheduler_a.jpg)

- `Timer` naar `00:00` voor activering zodra EMS-ESP wordt ingeschakeld
- `Command` is `thermostat/hc1/remotetemp` voor verwarmingscircuit 1 (of `thermostat/hc1/remotehum` voor een RC100H)
- `Value` is de optimale kamertemperatuur voor uw huis, of een commando (zie hieronder)
- `Name` is optioneel. Door het een naam te geven kan het op afstand worden ingesteld als een commando en wordt de activeringstoestand gepubliceerd in een MQTT topic.

Als u een externe Dallas-temperatuursensor op de EMS-ESP hebt aangesloten, kunt u de `value` op deze waarde instellen door `temperaturesensor/<dallas_id_or_name>` als `value` te gebruiken.

Met zowel een temperatuur- als vochtigheidswaarde ingesteld, zou de geëmuleerde RC100H er als volgt uitzien:

![EMS-SCHEDULE-MAIN](/media/screenshot/scheduler_b.jpg)

## De Message API gebruiken voor geavanceerde logische functies

Je kunt het systeem-API eindpunt `message` gebruiken om een bericht naar het logboek en MQTT te sturen, maar het bericht kan ook complexe logica bevatten, vergelijkbaar met wat je ziet in de Scheduler. Bijvoorbeeld het verzenden van

```sh
curl -X POST \
    -H "Authorization: Bearer ${emsesp_token}" \
    -H "Content-Type: application/json" \
    -d '{"value":"system/settings/locale"}' \
    ${emsesp_url}/api/system/message
```

En voorbeelden die de waarde vervangen door:

- `(custom/test_seltemp - boiler/flowtempoffset) * 2.8 + 5"`
- `"boiler/storagetemp2 == null ? 'no' : 'yes'"`
