---
id: openHAB
---
# openHAB

![logo](/media/logo/openhab-logo.png)

EMS-ESP kan op verschillende manieren worden geïntegreerd in openHab:

- HomeAssistant MQTT Components Binding (gebaseerd op Home Assistant ontdekkingsprotocol)
- MQTT Binding (Generiek MQTT Ding)

<figure> <img src="/media/screenshot/oh_dashboard.png" alt="Example Dashboard (items depend on heating system)" /> <figcaption>Voorbeeld dashboard (items zijn afhankelijk van verwarmingssysteem)</figcaption> </figure>

:::note
Het hangt van de entiteit en het apparaat af of deze schrijfbaar of alleen leesbaar is. Kijk in de entiteitenlijst [Entities](All-Entities) voor alle beschikbare entiteiten en gerelateerde attributen.
:::

:::note
Documentatie is gemaakt voor openHab versie 3.x
:::

## HomeAssistant MQTT componenten binding

### Installatie

EMS-ESP creëert behouden MQTT-berichten voorafgegaan door `homeassistant/` voor elk apparaat en hun waarden (entiteiten genoemd) op basis van het Home Assistant (HA) Discovery-protocol. Om autodetectie in openHAB mogelijk te maken moeten de [MQTT Binding](https://www.openhab.org/addons/bindings/mqtt/) en de [HomeAssistant MQTT Components Binding](https://www.openhab.org/addons/bindings/mqtt.homeassistant/) worden geïnstalleerd. Daarnaast zijn `JINJA` en `JSONPath` transformaties nodig om alle entiteiten en kenmerken in kaart te brengen. Schakel in EMS-ESP de optie Discovery in op de pagina MQTT Settings.

Objecten in HA worden toegewezen aan `Things`, Component+Node aan `ChannelGroup` en Component Features aan `Channels`. Meer informatie is te vinden in de bindende specificatie.

### Ontdekking

U zou op basis van uw verwarmingsinstellingen gerelateerde `Things` in uw Postvak IN moeten zien

<figure> <img src="/media/screenshot/oh_inbox.png" alt="Inbox with EMS-ESP discovered Things" /> <figcaption>Inbox met EMS-ESP ontdekte dingen</figcaption> </figure>

Na het toevoegen van de `Things` kun je alle `Channels` zien die beschikbaar zijn voor het specifieke apparaat en die je hebt ingeschakeld in EMS-ESP voor MQTT.

<figure> <img src="/media/screenshot/oh_ex_thermostat.png" alt="Channels of a thermostat Thing" /> <figcaption>Channels of a thermostat Thing</figcaption> </figure>

### Beperkingen

Er zijn momenteel enkele beperkingen bij het gebruik van de binding. Een daarvan heeft ook invloed op de integratie van EMS-ESP in openHAB.

- De HomeAssistant Klimaatcomponenten worden nog niet ondersteund (je vindt deze `Channels` niet in de lijst)

Het is mogelijk dat deze entiteiten in de toekomst worden ondersteund, afhankelijk van de verdere ontwikkeling van de binding.

## MQTT Binding

EMS-ESP biedt alle informatie via het basis [**MQTT**](Commands#mqtt) pad `ems-esp/` met behulp van onderwerpen en payloads die kunnen worden toegewezen aan `Generic MQTT Things` en gerelateerde `Channels`.

openHAB biedt verschillende configuratiemodellen om nieuwe apparaten toe te voegen

- Bestand gebaseerd
- UI-gestuurd (kan worden gecombineerd)
  - gebaseerd op yaml (code-editor)
  - UI-geleide menu's

### Installatie

Je moet de [MQTT Binding](https://www.openhab.org/addons/bindings/mqtt/) installeren als client voor een MQTT broker en de [JSONPath Transformation Service](https://www.openhab.org/addons/transformations/jsonpath/) voor het selecteren van de specifieke kanalen in de meegeleverde JSON-structuur van EMS-ESP.

### Bestandsgebaseerde benadering

#### Algemeen MQTT ding

Het is mogelijk om voor elk apparaat een aparte `Generic MQTT Thing` te maken of alles in één. Hieronder wordt een voorbeeld gegeven dat kan worden aangepast aan uw overeenkomstige opstelling en wensen. Het is een gebruikelijke aanpak om een apart setonderwerp te hebben dat wordt gebruikt om gegevens terug te sturen naar de broker. stateTopic vertegenwoordigt de status van het ding en commandTopic wordt gebruikt om een waarde in te stellen. Je vindt alle relevante informatie over het onderwerp waarnaar je een commando moet sturen in de [**Commands**](Commands#mqtt).

```python title="things/mqtt.things"
Bridge mqtt:broker:broker "MQTT Bridge" [ host="127.0.0.1", secure=false ]{
    Thing topic ems-esp "Buderus Heating Pump" "gBoilerRoom" [availabilityTopic="ems-esp/status", payloadAvailable="online", payloadNotAvailable="offline"]{
    Channels:
       Type switch : EMS_s_pvcooling "Cooling only with PV" [stateTopic="ems-esp/boiler_data", commandTopic="ems-esp/boiler/pvcooling", ON="ON", OFF="OFF", transformationPattern="JSONPATH:$.pvcooling"]
       Type number : EMS_n_pvraiseheat "Raise Hot Water with PV by" [stateTopic="ems-esp/thermostat_data", commandTopic="ems-esp/thermostat/pvraiseheat", transformationPattern="JSONPATH:$.pvraiseheat"]
       Type string : EMS_maxheatheat "Auxilliary Heater Limit Heating" [stateTopic="ems-esp/boiler_data", commandTopic="ems-esp/boiler/maxheatheat", transformationPattern="JSONPATH:$.maxheatheat"]
    }
}
```

#### Artikelen

Het is zinvol om de `autoupdate` functie te gebruiken. In plaats van de verwachte waarde van het wijzigen van het item te gebruiken wacht OpenHAB op een update van EMS-ESP via MQTT.

```python title="items/ems-esp.items"
Switch           EMS_s_pvcooling
                 "Cooling only with PV"
                 <switch>
                 (gBoilerRoomHeatingHotWater)
                 ["Switch", "Water"]
                 {channel="mqtt:topic:broker:ems-esp:EMS_s_pvcooling", autoupdate="false"}

Number           EMS_n_pvraiseheat
                 "Raise Hot Water with PV by [%.1f K]"
                 <temperature>
                 (gBoilerRoomHeatingCircuit)
                 ["Setpoint","Temperature"]
                 {channel="mqtt:topic:broker:ems-esp:EMS_n_pvraiseheat", autoupdate="false", listWidget="oh-stepper-item"[min=0, max=5, step=1]}

String           EMS_maxheatheat
                 "Auxilliary Heater Limit Heating"
                 <heating>
                 (gBoilerRoomHeating)
                 ["Control", "Current"]
                 {channel="mqtt:topic:broker:ems-esp:EMS_maxheatheat", autoupdate="false", stateDescription=""[options="0=0 KW,1=2 kW,2=3 kW,3=4 kW,4=6 kW,5=9 kW"]}
```

#### Sitemap (optioneel)

```python title="sitemaps/home.sitemap"
Frame label="Heating" {
    Switch item=EMS_s_pvcooling
    Slider item=EMS_n_pvraiseheat
    Selection item=EMS_maxheatheat
}
```

<figure> <img src="/media/screenshot/oh_sitemap.png" alt="Example Sitemap (items depend on heating system)" /> <figcaption>Voorbeeld Sitemap (items zijn afhankelijk van verwarmingssysteem)</figcaption> </figure>

### Op UI gebaseerde benadering

Het is ook mogelijk om de UI van openHab en de geïntegreerde Code-Editor te gebruiken om de integratie van EMS-ESP te implementeren. Hiervoor moeten verschillende stappen achter elkaar worden uitgevoerd.

1. Maak een MQTT Broker door (Dingen -> (+) Icoon -> MQTT Binding -> MQTT Broker)
2. Bewerk de aangemaakte MQTT Broker en plak de onderstaande code. Wijzig de attributen waar nodig of pas ze aan in de UI. (Dingen -> -Je aangemaakte MQTT Broker- -> Code-Tab)

#### MQTT Broker & MQTT Algemeen Ding

```yaml title="MQTT Broker"
UID: mqtt:broker:broker
label: MQTT Bridge
thingTypeUID: mqtt:broker
configuration:
  lwtQos: 0
  publickeypin: true
  keepAlive: 60
  clientid: d825330e-3c51-4818-a43d-62778d379c83
  qos: 0
  reconnectTime: 60000
  host: 127.0.0.1
  secure: false
  certificatepin: true
  lwtRetain: true
  enableDiscovery: true
```

1. Maak een `Generic MQTT Thing` (Dingen -> (+) Pictogram -> MQTT Binding -> Generiek MQTT Ding)
2. Bewerk de aangemaakte `Generic MQTT Thing` en plak de onderstaande code. Wijzig de attributen waar nodig of pas ze aan in de UI. (Dingen -> -Uw aangemaakte generieke MQTT-ding- -> Code-tabblad)

```yaml title="Generic MQTT Thing"
UID: mqtt:topic:broker:ems-esp
label: Buderus Heating Pump
thingTypeUID: mqtt:topic
configuration:
  payloadNotAvailable: offline
  availabilityTopic: ems-esp/status
  payloadAvailable: online
bridgeUID: mqtt:broker:broker
location: gBoilerRoom
channels:
  - id: EMS_s_pvcooling
    channelTypeUID: mqtt:switch
    label: Cooling only with PV
    description: null
    configuration:
      retained: false
      postCommand: false
      formatBeforePublish: '%s'
      commandTopic: ems-esp/boiler/pvcooling
      stateTopic: ems-esp/boiler_data
      transformationPattern: JSONPATH:$.pvcooling
      off: off
      on: on
  - id: EMS_n_pvraiseheat
    channelTypeUID: mqtt:number
    label: Raise Hot Water with PV by
    description: null
    configuration:
      retained: false
      postCommand: false
      formatBeforePublish: '%s'
      commandTopic: ems-esp/thermostat/pvraiseheat
      step: 1
      stateTopic: ems-esp/thermostat_data
      transformationPattern: JSONPATH:$.pvraiseheat
  - id: EMS_maxheatheat
    channelTypeUID: mqtt:string
    label: Auxilliary Heater Limit Heating
    description: null
    configuration:
      commandTopic: ems-esp/boiler/maxheatheat
      retained: false
      postCommand: false
      formatBeforePublish: '%s'
      stateTopic: ems-esp/boiler_data
      transformationPattern: JSONPATH:$.maxheatheat
```

#### Artikelen

Selecteer in het overzicht Dingen je aangemaakte `Thing` en selecteer `Channels`. In de lijst met kanalen kunt u klikken op Gebruik de `Add Link to Item` en een item maken.

## Fouten

- Het kan gebeuren dat mqtt altijd de huidige status als waarde stuurt in plaats van de nieuwe. Een mogelijke oplossing zou kunnen zijn om de openHab service opnieuw te starten en te controleren of je een itemdimensie hebt. Als er een is, verwijder dan de dimensie.
- Er is momenteel geen manier om de status van de `Thing` weer te geven zonder een regel te gebruiken
