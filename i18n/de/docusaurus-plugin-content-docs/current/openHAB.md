---
id: openHAB
---

# openHAB

![logo](/media/logo/openhab-logo.png)

EMS-ESP kann auf verschiedene Weise in openHab integriert werden:

- HomeAssistant MQTT Components Binding (basierend auf dem Home Assistant-Erkennungsprotokoll)
- MQTT-Bindung (Generisches MQTT-Ding)

<figure> <img src="/media/screenshot/oh_dashboard.png" alt="Example Dashboard (items depend on heating system)" /> <figcaption>Beispiel Dashboard (Elemente hängen vom Heizungssystem ab)</figcaption> </figure>

:::note Es hängt von der Entität und dem Gerät ab, ob sie beschreibbar oder nur lesbar ist. Schauen Sie in die Liste der Entitäten [Entities](All-Entities) für alle verfügbaren Entitäten und zugehörigen Attribute.
:::

:::note Die Dokumentation wurde für openHab Version 3.x erstellt
:::

## HomeAssistant MQTT Komponenten Bindung

### Installation

EMS-ESP erstellt MQTT-Nachrichten mit dem Präfix `homeassistant/` für jedes Gerät und seine Werte (sogenannte Entitäten) auf der Grundlage des Home Assistant (HA) Discovery-Protokolls. Um die automatische Erkennung in openHAB zu ermöglichen, müssen [MQTT Binding](https://www.openhab.org/addons/bindings/mqtt/) und [HomeAssistant MQTT Components Binding](https://www.openhab.org/addons/bindings/mqtt.homeassistant/) installiert sein. Zusätzlich werden `JINJA` und `JSONPath` Transformationen benötigt, um alle Entitäten und Features abzubilden. In EMS-ESP aktivieren Sie die Option Discovery auf der Seite MQTT Settings.

Objekte in HA werden auf `Things`, Component+Node auf `ChannelGroup` und Component Features auf `Channels` abgebildet. Weitere Informationen finden Sie in der Spezifikation der Bindung.

### Entdeckung

Je nach Einstellung Ihrer Heizung sollten Sie `Things` in Ihrem Posteingang sehen

<figure> <img src="/media/screenshot/oh_inbox.png" alt="Inbox with EMS-ESP discovered Things" /> <figcaption>Posteingang mit EMS-ESP entdeckte Dinge</figcaption> </figure>

Nach dem Hinzufügen des `Things` können Sie alle `Channels` sehen, die für das spezifische Gerät verfügbar sind und die Sie in EMS-ESP für MQTT aktiviert haben.

<figure> <img src="/media/screenshot/oh_ex_thermostat.png" alt="Channels of a thermostat Thing" /> <figcaption>Kanäle eines Thermostat-Dings</figcaption> </figure>

### Beschränkungen

Derzeit gibt es einige Einschränkungen bei der Verwendung der Bindung. Eine davon betrifft auch die Integration von EMS-ESP in openHAB.

- Die HomeAssistant-Klimakomponenten werden noch nicht unterstützt (Sie werden diese `Channels` nicht in der Liste finden)

Es ist möglich, dass diese Entitäten in Zukunft je nach der weiteren Entwicklung der Bindung unterstützt werden.

## MQTT-Bindung

EMS-ESP bietet alle Informationen über den [**MQTT**](Commands#mqtt)-Basispfad `ems-esp/` unter Verwendung von Topics und Payloads an, die auf `Generic MQTT Things` und verwandtes `Channels` abgebildet werden können.

openHAB bietet verschiedene Konfigurationsmodelle an, um neue Geräte hinzuzufügen

- Datei-basiert
- UI-gesteuert (kann kombiniert werden)
  - yaml-basiert (Code-Editor)
  - UI-geführte Menüs

### Installation

Sie müssen den [MQTT Binding](https://www.openhab.org/addons/bindings/mqtt/) als Client für einen MQTT-Broker und den [JSONPath Transformation Service](https://www.openhab.org/addons/transformations/jsonpath/) zur Auswahl der spezifischen Kanäle in der mitgelieferten JSON-Struktur von EMS-ESP installieren.

### Dateibasierter Ansatz

#### Generisches MQTT-Ding

Es ist möglich, für jedes Gerät ein eigenes `Generic MQTT Thing` oder alle in einem zu erstellen. Im Folgenden wird ein Beispiel gegeben, das Sie an Ihr entsprechendes Setup und Ihre Wünsche anpassen können. Es ist ein üblicher Ansatz, ein separates Set-Topic zu haben, das verwendet wird, um Daten zurück an den Broker zu senden. stateTopic repräsentiert den Zustand der Sache und commandTopic wird verwendet, um einen Wert zu setzen. Sie finden alle relevanten Informationen über das Topic, an das Sie einen Befehl senden müssen, im [**Commands**](Commands#mqtt).

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

#### Artikel

Es ist sinnvoll, die `autoupdate`-Funktion zu verwenden. Anstatt den erwarteten Wert aus der Änderung des Elements zu verwenden, wartet openHAB auf eine Aktualisierung von EMS-ESP über MQTT.

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

#### Sitemap (optional)

```python title="sitemaps/home.sitemap"
Frame label="Heating" {
    Switch item=EMS_s_pvcooling
    Slider item=EMS_n_pvraiseheat
    Selection item=EMS_maxheatheat
}
```

<figure> <img src="/media/screenshot/oh_sitemap.png" alt="Example Sitemap (items depend on heating system)" /> <figcaption>Beispiel-Sitemap (Elemente hängen vom Heizungssystem ab)</figcaption> </figure>

### UI-basierter Ansatz

Es ist auch möglich, die Benutzeroberfläche von openHab und den integrierten Code-Editor zu verwenden, um die Integration von EMS-ESP zu implementieren. Hierfür müssen mehrere Schritte nacheinander durchgeführt werden.

1. Erstellen Sie einen MQTT-Broker mit (Dinge -> (+) Symbol -> MQTT-Bindung -> MQTT-Broker)
2. Bearbeiten Sie den erstellten MQTT-Broker und fügen Sie den unten stehenden Code ein. Ändern Sie die Attribute nach Bedarf oder ändern Sie sie in der Benutzeroberfläche. (Dinge -> -Ihr erstellter MQTT-Broker- -> Code-Registerkarte)

#### MQTT-Broker und generisches MQTT-Ding

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

1. Erstellen Sie ein `Generic MQTT Thing` (Things -> (+) Icon -> MQTT Binding -> Generic MQTT Thing)
2. Bearbeiten Sie das erstellte `Generic MQTT Thing` und fügen Sie den nachstehenden Code ein. Ändern Sie die Attribute nach Bedarf oder ändern Sie sie in der Benutzeroberfläche. (Dinge -> -Ihr erstelltes generisches MQTT-Ding- -> Registerkarte "Code")

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

#### Artikel

Wählen Sie in der Übersicht der Dinge Ihr erstelltes `Thing` und wählen Sie `Channels`. In der Liste der Kanäle können Sie auf `Add Link to Item` verwenden klicken und ein Element erstellen.

## Fehler

- Es kann vorkommen, dass mqtt immer den aktuellen Zustand als Wert sendet, anstatt den neuen. Eine mögliche Lösung könnte darin bestehen, den openHab-Dienst neu zu starten und zu prüfen, ob Sie eine Artikeldimension haben. Wenn es eine gibt, entfernen Sie die Dimension.
- Zurzeit gibt es keine Möglichkeit, den Status von `Thing` anzuzeigen, ohne eine Regel zu verwenden
