---
id: Home-Assistant
---
# Home Assistant

![logo](/media/logo/home-assistant.png)

EMS-ESP has automatic integration with Home Assistant via the [MQTT Discovery](https://www.home-assistant.io/docs/mqtt/discovery/) protocol. To use this feature enable simply enable the Discovery option from the MQTT Settings page.

EMS-ESP will create retained MQTT messages prefixed with `homeassistant/` for each device and their values (called entities). For example "`EMS-ESP Thermostat`". You can view which ones have been created by going into Home Assistant's `Configuration->Integrations` and select the devices under `MQTT`.

To add this device and its values to a Home Assistant UI click on the "ADD TO LOVELACE" button.

![device](/media/screenshot/ha_device.png)

You can then add each of these devices to a new lovelace view using the "add to lovelace" button, and get something looking like:

![lovelace](/media/screenshot/ha_lovelace.png)

## Example Automations

### Alert when EMS-ESP boots

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

### Alert when EMS-ESP goes offline and reconnects back to the WiFi network

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

### Shower Integration

Below are the additions to the HA files to show the state of the shower, if the setting `Shower Timer` is enabled in EMS-ESP.

The cold shot feature is available in EMS-ESP versions 3.7.0 and above.

![Home Assistant Shower](/media/screenshot/ha_shower.jpg)

![Home Assistant iPhone notify](/media/screenshot/ha_notify.jpg)

Add to `configuration.yaml` (make sure you change the token):

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

and make sure you include the yaml files in your `configuration.yaml` file like this:

```yaml
template: !include templates.yaml
automation: !include automations.yaml
script: !include scripts.yaml
scene: !include scenes.yaml
```

Add to `scripts.yaml`:

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

Add to `automations.yaml`:

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

Add to `template.yaml`:

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

Note you can configure the `timestamp_custom()` to your own preferred format.

Add a new card to an existing Dashboard. I'm using custom cards called 'mushroom' which can be installed via the HACS plugin. Such a card would look like:

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

### Alert change of thermostat set temperature

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

### Activating one-time hot water charging DHW once using MQTT

Below is an example of calling a command (OneTimeWater)

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

### Calculating values

(from Glitter-ball)

```yaml
- platform: template
  sensors:
    differential:
      friendly_name: 'Flow-Ret diff'
      unit_of_measurement: '°C'
      icon_template: 'mdi:format-align-middle'
      value_template: "{{ (states('sensor.flow_temperature') | float - state('sensor.return_temp') | float) | round(1) }}"
```

### Solar Pump Working Hours

(from PhillyGilly)

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

### Reading a value via the API

Although all the EMS-ESP data is available in Home Assistant as various sensor types you can optionally also call commands and read data using the REST API interface. For example in the script below which will trigger HA to fetch the MAC address when HA is restarted:

```yaml
sensor:
  - platform: rest
    resource: http://ems-esp.local/api/system
    name: emsesp_MAC
    value_template: '{{ value_json.Network.MAC }}'
```

### Changing a value via the API

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

in the automations:

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

Then in your HA's lovelace UI add then entity called `input_number.wwselected_temp`.

Now in HA you can dynamically adjust the values. Like:

![Screenshot 2021-08-08 143712](https://user-images.githubusercontent.com/1230712/128632199-7815d649-40a8-4f11-99e3-eacc16bf53a4.png)

Check if it's working by going to `http://ems-esp/api/boiler/wwseltemp`

### LoveLace Section View, Tiles and setting values via EMS-ESP

_(by oliof)_

Since HA2024.12, lovelace defaults to Sections views and auto generates Tiles for most entities.
While Tiles appear to be just simple display helpers, their functionality can be extensively modified by adding Features. Here is a graphical guide to create a similar control as above from within lovelace with no changes to `configuration.yaml`

1. In a Section View, add a tile for a settable value, for example for the selected hot water temperature. Entity selection supports auto-complete:

![image](https://github.com/user-attachments/assets/90ad3a45-e84e-497d-a975-f4313ad356c0)

1. Hit the checkmark and 'Continue'. This will yield a preview of the autoselected Tile:

![image](https://github.com/user-attachments/assets/58da9622-9a5b-4df0-aeec-daabb0ba8f80)

1. Hit add to dashboard. This will add the Tile to the dashboard in it's default setting, which just displays the value of the entity:

![image](https://github.com/user-attachments/assets/1be160cb-4527-4db4-bd12-04599eed84af)

1. Edit the Tile to adjust size and add a Feature to get the numeric input functionality.

![image](https://github.com/user-attachments/assets/be44cc79-bdf1-4bff-b054-118d1b3c7382)

![image](https://github.com/user-attachments/assets/efb00a7b-4b92-4eaf-8aa4-6dcbc1b38a66)

Optionally, if you prefer a slider over the buttons, hit `SHOW CODE EDITOR` and remove `style: buttons` from the feature definition:

![image](https://github.com/user-attachments/assets/a47dfd30-d5b9-4387-b7a6-67e115ecf170)

Do note that the Tile component that comes with HA does not allow you to set minimum and maximum values. Either use `numeric_input` as outlined in the previous section, or check out [Service Call Tiles on HACS](https://github.com/Nerwyn/service-call-tile-feature).

1. Hit Save and enjoy your UI-generated EMS-ESP control tile:

![image](https://github.com/user-attachments/assets/f5a3ca3e-afa9-4f33-b004-254349b3806a)

### Showing the Boiler status based on the service code

(by glitterball)

Use a template to translate the boiler service code into a string.

in `configuration.yaml`:

```yaml
template: !include templates.yaml
```

and `templates.yaml` contains:

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
