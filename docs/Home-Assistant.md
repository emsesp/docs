![logo](_media/logo/home-assistant.png)

EMS-ESP has automatic integration with Home Assistant via the [MQTT Discovery](https://www.home-assistant.io/docs/mqtt/discovery/) protocol. To use this feature enable simply enable the Discovery option from the MQTT Settings page.

EMS-ESP will create retained MQTT messages prefixed with `homeassistant/` for each device and their values (called entities). For example "`EMS-ESP Thermostat`". You can view which ones have been created by going into Home Assistant's `Configuration->Integrations` and select the devices under `MQTT`.

To add this device and its values to a Home Assistant UI click on the "ADD TO LOVELACE" button.

![device](_media/screenshot/ha_device.png)

You can then add each of these devices to a new lovelace view using the "add to lovelace" button, and get something looking like:

![lovelace](_media/screenshot/ha_lovelace.png)

## Example Automations

### Alert when EMS-ESP boots

```yaml
alias: EMS-ESP booted
description: ''
trigger:
  - platform: mqtt
    topic: ems-esp/status
    payload: online
condition: []
action:
  - service: notify.notify
    data:
      message: EMS-ESP
      title: EMS-ESP has booted
mode: single
```

### Shower Integration

The below are additions to the HA files to show the state of the shower, if the setting `Shower Timer` is enabled in EMS-ESP.

The cold shot feature is available in EMS-ESP versions 3.7.0-dev.1 and above.

![Home Assistant Shower](_media/screenshot/ha_shower.jpg)

![Home Assistant iPhone notify](_media/screenshot/ha_notify.jpg)

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

Add directly to the `configuration.yaml` or merge into an existing `sensors.yaml` file:

```yaml
sensor:
  - platform: template
    sensors:
      last_shower_duration:
        friendly_name: Last shower duration
        value_template: "{{ int(states('sensor.ems_esp_shower_duration')) | timestamp_custom('%-M min %-S sec', false)}}"
      last_shower_time:
        friendly_name: Last shower timestamp
        value_template: '{{ as_timestamp(states.sensor.ems_esp_shower_duration.last_updated) | int | timestamp_custom("%-I:%M %p on %a %-d %b") }}'
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

(from @Glitter-ball)

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

(from @PhillyGilly)

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

### Showing the Boiler status based on the service code

(by @glitterball)

Use a template to translate the boiler service code into a string.

in `configuration.yaml`:

```yaml
template: !include template.yaml
```

and `template.yaml` contains:

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
