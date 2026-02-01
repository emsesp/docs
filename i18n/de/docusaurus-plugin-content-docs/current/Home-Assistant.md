---
id: Home-Assistant
title: Home Assistant Integration
description: Integrate EMS-ESP with Home Assistant using MQTT Discovery for automatic device setup and control
---

# Home Assistant

![logo](/media/logo/home-assistant.png)

EMS-ESP verfügt über eine automatische Integration mit Home Assistant über das [MQTT Discovery](https://www.home-assistant.io/docs/mqtt/discovery/)-Protokoll. Um diese Funktion zu nutzen, aktivieren Sie einfach die Option Discovery auf der Seite MQTT Settings.

EMS-ESP erstellt MQTT-Nachrichten mit dem Präfix `homeassistant/` für jedes Gerät und seine Werte (sogenannte Entitäten). Zum Beispiel "`EMS-ESP Thermostat`". Sie können sehen, welche Nachrichten erstellt wurden, indem Sie im Home Assistant `Configuration->Integrations` aufrufen und die Geräte unter `MQTT` auswählen.

Um dieses Gerät und seine Werte zu einem Home Assistant UI hinzuzufügen, klicken Sie auf die Schaltfläche "ADD TO LOVELACE".

![device](/media/screenshot/ha_device.png)

Sie können dann jedes dieser Geräte über die Schaltfläche "Zu Lovelace hinzufügen" zu einer neuen Lovelace-Ansicht hinzufügen und erhalten dann ein Ergebnis, das etwa so aussieht:

![lovelace](/media/screenshot/ha_lovelace.png)

## Beispiel Automatisierungen

### Alarm, wenn EMS-ESP startet

```yaml
alias: EMS-ESP booted
description: Notify when EMS-ESP boots
triggers:
  - topic: ems-esp/status
    payload: online
    trigger: mqtt
conditions: []
actions:
  - data:
      message: EMS-ESP
      title: EMS-ESP has booted
    action: notify.mobile_app_iphone
mode: single
```

### Warnung, wenn EMS-ESP offline geht und sich wieder mit dem WiFi-Netzwerk verbindet

```yaml
alias: EMS-ESP Wifi Reconnected
description: Notify when EMS-ESP reconnects
triggers:
  - entity_id:
      - sensor.system_wifireconnects
    trigger: state
conditions: []
actions:
  - data:
      message: EMS-ESP has reconnected!
      title: EMS-ESP
    action: notify.mobile_app_my_iphone
mode: single
```

### Integration der Dusche

Nachfolgend sind die Ergänzungen zu den HA-Dateien aufgeführt, um den Zustand der Dusche anzuzeigen, wenn die Einstellung `Shower Timer` im EMS-ESP aktiviert ist.

Die Cold-Shot-Funktion ist in den EMS-ESP-Versionen 3.7.0 und höher verfügbar.

![Home Assistant Shower](/media/screenshot/ha_shower.jpg)

![Home Assistant iPhone notify](/media/screenshot/ha_notify.jpg)

Hinzufügen zu `configuration.yaml` (achten Sie darauf, das Token zu ändern):

```yaml
rest_command:
  emsesp:
    url: 'http://ems-esp.local/api/{{device}}'
    method: POST
    headers:
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWV9.2bHpWya2C7Q12WjNUBD6_7N3RCD7CMl-EGhyQVzFdDg'
    content_type: 'application/json'
    payload: '{"entity":"{{entity}}","value":"{{value}}"}'
```

und stellen Sie sicher, dass Sie die yaml-Dateien wie folgt in Ihre `configuration.yaml`-Datei einfügen:

```yaml
template: !include templates.yaml
automation: !include automations.yaml
script: !include scripts.yaml
scene: !include scenes.yaml
```

Zu `scripts.yaml` hinzufügen:

```yaml
coldshot:
  alias: Cold shot of water
  mode: single
  sequence:
    - service: rest_command.emsesp
      data:
        device: 'boiler'
        entity: 'coldshot'
        value: 'on'
```

Zu `automations.yaml` hinzufügen:

```yaml
- id: shower_alert
  alias: Shower Alert
  description: Shower Alert
  trigger:
    - platform: state
      entity_id:
        - sensor.last_shower_duration
  condition: []
  action:
    - service: notify.notify
      data:
        message: "Duration: {{ states('sensor.last_shower_duration') }}"
        title: Shower finished at {{ now().strftime("%H:%M") }}
  mode: single
```

Zu `template.yaml` hinzufügen:

```yaml
- sensor:
    - default_entity_id: sensor.last_shower_duration
      name: Last shower duration
      state:
        "{% if has_value('sensor.ems_esp_shower_duration') %}
  {{ int(states('sensor.ems_esp_shower_duration'))
        | timestamp_custom('%-M min %-S sec', false)}}
{% else %}
  unknown
{% endif
        %}"

- sensor:
    - default_entity_id: sensor.last_shower_time
      name: Last shower timestamp
      state:
        "{% if has_value('sensor.ems_esp_shower_duration') %}
  {{ as_timestamp(states.sensor.ems_esp_shower_duration.last_updated)
        | int | timestamp_custom(\"%-I:%M %p on %a %-d %b\") }}
{% else %}
  unknown
{%
        endif %}"
```

Beachten Sie, dass Sie das `timestamp_custom()` in Ihrem eigenen bevorzugten Format konfigurieren können.

Hinzufügen einer neuen Karte zu einem bestehenden Dashboard. Ich verwende benutzerdefinierte Karten namens "mushroom", die über das HACS-Plugin installiert werden können. Eine solche Karte würde wie folgt aussehen:

```yaml
type: vertical-stack
cards:
  - type: custom:mushroom-title-card
    title: Shower
    subtitle: Shower details via EMS-ESP
  - type: horizontal-stack
    cards:
      - type: custom:mushroom-entity-card
        entity: binary_sensor.ems_esp_shower_active
        icon: mdi:shower
        icon_color: red
        primary_info: state
        secondary_info: none
  - type: horizontal-stack
    cards:
      - type: custom:mushroom-entity-card
        entity: sensor.last_shower_time
        primary_info: state
        secondary_info: last-updated
        icon_color: amber
        icon: mdi:calendar-month
  - type: horizontal-stack
    cards:
      - type: custom:mushroom-entity-card
        entity: sensor.last_shower_duration
        primary_info: state
        secondary_info: none
        icon_color: amber
        icon: mdi:camera-timer
  - show_name: true
    show_icon: true
    type: button
    name: Send cold shot of water
    tap_action:
    action: call-service
    service: script.coldshot
    show_state: false
    icon: mdi:snowflake-alert
    icon_height: 24px
```

### Warnung bei Änderung der Thermostat-Solltemperatur

```yaml
alias: Thermostat Alert
description: ''
trigger:
  - platform: state
    entity_id:
      - number.ems_esp_thermostat_hc1_seltemp
condition: []
action:
  - service: notify.notify
    data:
      title: Thermostat alert
      message: >-
        Temperature set to {{ states('number.ems_esp_thermostat_hc1_seltemp') }}
        degrees
mode: single
```

### Aktivierung der einmaligen Warmwasserladung DHW einmalig über MQTT

Nachfolgend ein Beispiel für den Aufruf eines Befehls (OneTimeWater)

`switch`:

```yaml
one_time_water:
  friendly_name: OneTimeWater
  value_template: "{{ is_state('sensor.one_time_water', 'on') }}"
  turn_on:
    service: script.turn_on
    entity_id: script.one_time_water_on
  turn_off:
    service: script.turn_on
    entity_id: script.one_time_water_off
```

`scripts`:

```yaml
one_time_water_on:
  sequence:
    - service: mqtt.publish
      data:
        topic: 'ems-esp/boiler'
        payload: '{"cmd":"wwonetime","data":1}'

one_time_water_off:
  sequence:
    - service: mqtt.publish
      data:
        topic: 'ems-esp/boiler'
        payload: '{"cmd":"wwonetime","data":0}'
```

### Berechnung der Werte

(aus Glitzerkugel)

```yaml
- platform: template
  sensors:
    differential:
      friendly_name: 'Flow-Ret diff'
      unit_of_measurement: '°C'
      icon_template: 'mdi:format-align-middle'
      value_template: "{{ (states('sensor.flow_temperature') | float - state('sensor.return_temp') | float) | round(1) }}"
```

### Betriebsstunden der Solarpumpe

(von PhillyGilly)

```yaml
- platform: mqtt
  state_topic: 'ems-esp/solar_data'
  name: 'Solar Pump working hours'
  unit_of_measurement: 'hr'
  value_template: >
    {% set mins = value_json.pumpWorkMin %}
    {% set hours = ((mins | int / 60) | string).split('.')[0] %}
    {{hours}}
  qos: 1
  payload_available: 'online'
  payload_not_available: 'offline'
```

### Lesen eines Wertes über die API

Obwohl alle EMS-ESP-Daten im Home Assistant als verschiedene Sensortypen verfügbar sind, können Sie optional auch Befehle aufrufen und Daten über die REST-API-Schnittstelle lesen. Zum Beispiel im folgenden Skript, das den HA dazu veranlasst, die MAC-Adresse abzurufen, wenn der HA neu gestartet wird:

```yaml
sensor:
  - platform: rest
    resource: http://ems-esp.local/api/system
    name: emsesp_MAC
    value_template: '{{ value_json.Network.MAC }}'
```

### Ändern eines Wertes über die API

`configuration.yaml`:

```yaml
rest_command:
  emsesp:
    url: http://ems-esp.local/api/{{device}}
    method: POST
    headers:
      authorization: 'Bearer <Your Secure key from the UI>'
    content_type: 'application/json'
    payload: '{"entity":"{{entity}}","value":"{{value}}"}'

input_number:
  wwselected_temp:
    name: WW Selected Temperature
    min: 30
    max: 60
    step: 1
    icon: mdi:coolant-temperature
```

in den Automatisierungen:

```yaml
- id: 'change_ww_seltemp'
  alias: 'change ww selected temp'
  trigger:
    platform: state
    entity_id: input_number.wwselected_temp
  action:
    service: rest_command.emsesp
    data:
      device: 'boiler'
      entity: 'wwseltemp'
      value: "{{ states('input_number.wwselected_temp') | int }}"

- id: 'set_ww_seltemp'
  alias: 'set ww selected temp'
  trigger:
    platform: state
    entity_id: sensor.thermostat_hc1_selected_room_temperature
  action:
    service: input_number.set_value
    target:
      entity_id: input_number.wwselected_temp
    data:
      value: "{{ states('sensor.boiler_ww_selected_temperature') | int }}"
```

Fügen Sie dann in der lovelace UI Ihres HA eine Entität namens `input_number.wwselected_temp` hinzu.

In HA können Sie nun die Werte dynamisch anpassen. Zum Beispiel:

![Screenshot 2021-08-08 143712](https://user-images.githubusercontent.com/1230712/128632199-7815d649-40a8-4f11-99e3-eacc16bf53a4.png)

Prüfen Sie, ob es funktioniert, indem Sie zu `http://ems-esp/api/boiler/wwseltemp` gehen

### LoveLace Section View, Kacheln und Einstellwerte über EMS-ESP

_(by oliof)_

Seit HA2024.12 verwendet lovelace standardmäßig Abschnittsansichten und generiert automatisch Kacheln für die meisten Entitäten. Während Kacheln auf den ersten Blick nur einfache Anzeigehilfen sind, kann ihre Funktionalität durch Hinzufügen von Features umfassend modifiziert werden. Hier ist eine grafische Anleitung zur Erstellung eines ähnlichen Steuerelements wie oben aus lovelace heraus ohne Änderungen an `configuration.yaml`

1. Fügen Sie in einer Abschnittsansicht eine Kachel für einen einstellbaren Wert hinzu, z. B. für die ausgewählte Warmwassertemperatur. Die Auswahl von Entitäten unterstützt die automatische Vervollständigung:

![image](https://github.com/user-attachments/assets/90ad3a45-e84e-497d-a975-f4313ad356c0)

1. Klicken Sie auf das Häkchen und "Weiter". Daraufhin wird eine Vorschau der automatisch ausgewählten Kachel angezeigt:

![image](https://github.com/user-attachments/assets/58da9622-9a5b-4df0-aeec-daabb0ba8f80)

1. Klicken Sie auf Zum Dashboard hinzufügen. Dadurch wird die Kachel dem Dashboard in der Standardeinstellung hinzugefügt, die nur den Wert der Entität anzeigt:

![image](https://github.com/user-attachments/assets/1be160cb-4527-4db4-bd12-04599eed84af)

1. Bearbeiten Sie die Kachel, um die Größe anzupassen und fügen Sie ein Feature hinzu, um die numerische Eingabefunktion zu erhalten.

![image](https://github.com/user-attachments/assets/be44cc79-bdf1-4bff-b054-118d1b3c7382)

![image](https://github.com/user-attachments/assets/efb00a7b-4b92-4eaf-8aa4-6dcbc1b38a66)

Wenn Sie einen Schieberegler den Schaltflächen vorziehen, können Sie `SHOW CODE EDITOR` wählen und `style: buttons` aus der Feature-Definition entfernen:

![image](https://github.com/user-attachments/assets/a47dfd30-d5b9-4387-b7a6-67e115ecf170)

Beachten Sie, dass die Kachelkomponente, die mit HA geliefert wird, keine Mindest- und Höchstwerte festlegen kann. Verwenden Sie entweder `numeric_input`, wie im vorherigen Abschnitt beschrieben, oder schauen Sie sich [Service Call Tiles on HACS](https://github.com/Nerwyn/service-call-tile-feature) an.

1. Klicken Sie auf Speichern und genießen Sie die von der Benutzeroberfläche erzeugte EMS-ESP-Kontrollkachel:

![image](https://github.com/user-attachments/assets/f5a3ca3e-afa9-4f33-b004-254349b3806a)

### Anzeige des Kesselstatus auf Basis des Servicecodes

(von glitterball)

Verwenden Sie eine Vorlage, um den Kesselservice-Code in eine Zeichenkette zu übersetzen.

in `configuration.yaml`:

```yaml
template: !include templates.yaml
```

und `templates.yaml` enthält:

```yaml
sensor:
  - name: 'Status'
    state: >
      {% set sc = states('sensor.boiler_service_code_number') %}
      {% if sc == '200' %} CH active
      {% elif sc == '201' %} HW active
      {% elif sc == '202' %} CH anti cycle
      {% elif sc == '203' %} Standby
      {% elif sc == '204' %} CH cooling
      {% elif sc == '208' %} Service test
      {% elif sc == '265' %} Low CH load
      {% elif sc == '268' %} Component test
      {% elif sc == '270' %} Power up
      {% elif sc == '283' %} Burner start
      {% elif sc == '284' %} Ignition
      {% elif sc == '305' %} HW anti cycle
      {% elif sc == '357' %} Air purge
      {% elif sc == '358' %} Valve kick
      {% else %} {{ sc }}
      {% endif %}
```
