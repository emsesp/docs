---
id: Home-Assistant
title: Home Assistant Integration
description: Integrate EMS-ESP with Home Assistant using MQTT Discovery for automatic device setup and control
---

# Home Assistent

![logo](/media/logo/home-assistant.png)

EMS-ESP heeft automatische integratie met Home Assistant via het [MQTT Discovery](https://www.home-assistant.io/docs/mqtt/discovery/) protocol. Om deze functie te gebruiken, schakel je gewoon de optie Ontdekken in op de pagina MQTT-instellingen.

EMS-ESP maakt behouden MQTT-berichten aan met als prefix `homeassistant/` voor elk apparaat en hun waarden (entiteiten genoemd). Bijvoorbeeld "`EMS-ESP Thermostat`". Je kunt zien welke zijn aangemaakt door naar `Configuration->Integrations` in de Home Assistant te gaan en de apparaten onder `MQTT` te selecteren.

Om dit apparaat en zijn waarden toe te voegen aan een Home Assistant UI klik je op de knop "ADD TO LOVELACE".

![device](/media/screenshot/ha_device.png)

Vervolgens kun je elk van deze apparaten toevoegen aan een nieuwe lovelace-weergave met de knop "add to lovelace" (toevoegen aan lovelace), en dan krijg je iets dat er ongeveer zo uitziet:

![lovelace](/media/screenshot/ha_lovelace.png)

## Voorbeeld Automatiseringen

### Waarschuwing bij opstarten EMS-ESP

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

### Waarschuwing wanneer EMS-ESP offline gaat en weer verbinding maakt met het WiFi-netwerk

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

### Douche Integratie

Hieronder staan de toevoegingen aan de HA-bestanden om de toestand van de douche weer te geven als de instelling `Shower Timer` is ingeschakeld in EMS-ESP.

De functie koude opname is beschikbaar in EMS-ESP-versies 3.7.0 en hoger.

![Home Assistant Shower](/media/screenshot/ha_shower.jpg)

![Home Assistant iPhone notify](/media/screenshot/ha_notify.jpg)

Voeg toe aan `configuration.yaml` (zorg ervoor dat je het token wijzigt):

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

en zorg ervoor dat je de yaml-bestanden als volgt opneemt in je `configuration.yaml`-bestand:

```yaml
template: !include templates.yaml
automation: !include automations.yaml
script: !include scripts.yaml
scene: !include scenes.yaml
```

Toevoegen aan `scripts.yaml`:

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

Toevoegen aan `automations.yaml`:

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

Toevoegen aan `template.yaml`:

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

Je kunt de `timestamp_custom()` configureren in je eigen voorkeursindeling.

Een nieuwe kaart toevoegen aan een bestaand Dashboard. Ik gebruik aangepaste kaarten met de naam 'mushroom' die kunnen worden geïnstalleerd via de HACS-plugin. Zo'n kaart zou er als volgt uitzien

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

### Waarschuwing voor verandering van de ingestelde temperatuur van de thermostaat

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

### Eenmalig warm water laden DHW activeren met MQTT

Hieronder staat een voorbeeld van het aanroepen van een commando (OneTimeWater)

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

### Waarden berekenen

(van Glitterbal)

```yaml
- platform: template
  sensors:
    differential:
      friendly_name: 'Flow-Ret diff'
      unit_of_measurement: '°C'
      icon_template: 'mdi:format-align-middle'
      value_template: "{{ (states('sensor.flow_temperature') | float - state('sensor.return_temp') | float) | round(1) }}"
```

### Werkuren zonnepomp

(van PhillyGilly)

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

### Een waarde lezen via de API

Hoewel alle EMS-ESP-gegevens beschikbaar zijn in Home Assistant als verschillende sensortypes, kun je optioneel ook commando's oproepen en gegevens lezen via de REST API-interface. Bijvoorbeeld in het onderstaande script dat HA zal triggeren om het MAC-adres op te halen wanneer HA opnieuw wordt opgestart:

```yaml
sensor:
  - platform: rest
    resource: http://ems-esp.local/api/system
    name: emsesp_MAC
    value_template: '{{ value_json.Network.MAC }}'
```

### Een waarde wijzigen via de API

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

in de automatiseringen:

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

Voeg dan in de lovelace UI van je HA de entiteit `input_number.wwselected_temp` toe.

Nu kun je in HA de waarden dynamisch aanpassen. Zoals:

![Screenshot 2021-08-08 143712](https://user-images.githubusercontent.com/1230712/128632199-7815d649-40a8-4f11-99e3-eacc16bf53a4.png)

Controleer of het werkt door naar `http://ems-esp/api/boiler/wwseltemp` te gaan

### LoveLace doorsnedeweergave, tegels en waarden instellen via EMS-ESP

_(by oliof)_

Sinds HA2024.12 maakt lovelace standaard Sections views en genereert automatisch Tiles voor de meeste entiteiten. Hoewel Tiles slechts simpele display helpers lijken te zijn, kan hun functionaliteit uitgebreid worden aangepast door Features toe te voegen. Hier is een grafische handleiding om een soortgelijk besturingselement als hierboven te maken vanuit lovelace, zonder wijzigingen in `configuration.yaml`

1. Voeg in een Sectieweergave een tegel toe voor een instelbare waarde, bijvoorbeeld voor de geselecteerde warmwatertemperatuur. Entiteitsselectie ondersteunt automatisch aanvullen:

![image](https://github.com/user-attachments/assets/90ad3a45-e84e-497d-a975-f4313ad356c0)

1. Klik op het vinkje en 'Doorgaan'. Dit geeft een voorbeeld van de automatisch geselecteerde Tegel:

![image](https://github.com/user-attachments/assets/58da9622-9a5b-4df0-aeec-daabb0ba8f80)

1. Druk op Aan dashboard toevoegen. Hierdoor wordt de Tegel toegevoegd aan het dashboard in de standaardinstelling, die alleen de waarde van de entiteit weergeeft:

![image](https://github.com/user-attachments/assets/1be160cb-4527-4db4-bd12-04599eed84af)

1. Bewerk de Tegel om de grootte aan te passen en voeg een Eigenschap toe om de numerieke invoerfunctie te krijgen.

![image](https://github.com/user-attachments/assets/be44cc79-bdf1-4bff-b054-118d1b3c7382)

![image](https://github.com/user-attachments/assets/efb00a7b-4b92-4eaf-8aa4-6dcbc1b38a66)

Als je de voorkeur geeft aan een schuifregelaar boven de knoppen, kun je `SHOW CODE EDITOR` gebruiken en `style: buttons` verwijderen uit de definitie van de functie:

![image](https://github.com/user-attachments/assets/a47dfd30-d5b9-4387-b7a6-67e115ecf170)

Houd er rekening mee dat je met het Tegelcomponent van HA geen minimum- en maximumwaarden kunt instellen. Gebruik `numeric_input` zoals beschreven in het vorige gedeelte, of bekijk [Service Call Tiles on HACS](https://github.com/Nerwyn/service-call-tile-feature).

1. Klik op Opslaan en geniet van uw door de UI gegenereerde EMS-ESP controletegel:

![image](https://github.com/user-attachments/assets/f5a3ca3e-afa9-4f33-b004-254349b3806a)

### De status van de boiler weergeven op basis van de servicecode

(door glitterball)

Gebruik een sjabloon om de servicecode van de ketel te vertalen naar een string.

in `configuration.yaml`:

```yaml
template: !include templates.yaml
```

en `templates.yaml` bevat:

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
