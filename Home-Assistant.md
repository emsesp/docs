![logo](_media/logo/home-assistant.png ':size=100')

EMS-ESP has automatic integration with Home Assistant via the [MQTT Discovery](https://www.home-assistant.io/docs/mqtt/discovery/) protocol. To use this feature make sure in EMS-ESP that MQTT is enabled and the `MQTT Format` setting is set to "`Home Assistant`". Also ensure your Home Assistant configuration is setup correctly and the prefix matches the setting in EMS-ESP under the MQTT Settings page.

EMS-ESP will create retained MQTT messages prefixed with `homeassistant/` for each device and their values (called entities). For example "`EMS-ESP Thermostat`". You can view which ones have been created by going into Home Assistant's `Configuration->Integrations` and select the devices under `MQTT`.

To add this device and its values to a Home Assistant UI click on the "ADD TO LOVELACE" button.

![device](_media/screenshot/ha_device.png ':size=100%')

You can then add each of these devices to a new lovelace view using the "add to lovelace" button, and get something looking like:

![lovelace](_media/screenshot/ha_lovelace.png ':size=100%')

## Example: Alerts

Below is an example using a trigger to notify when a shower has finished. This works when the setting `Shower Timer` is enabled in EMS-ESP.

![Home Assistant iPhone notify](_media/screenshot/ha_notify.jpg ':size=400')

Add to `configuration.yaml`:

```yaml
mqtt:
  sensor:
    - name: 'Last shower duration'
      state_topic: 'ems-esp/shower_data'
      value_template: '{{ value_json.duration }}'

template:
  - sensor:
      - name: 'Last shower time'
        state: '{{ as_timestamp(states.sensor.last_shower_duration.last_updated) | int | timestamp_custom("%H:%M on %a %-d %b") }}'
```

And `automations.yaml`:

```yaml
- id: 'shower_alert'
  alias: Shower Alert
  description: ''
  trigger:
    - platform: state
      entity_id: sensor.last_shower_duration
  condition: []
  action:
    - service: notify.notify
      data:
        title: Shower finished at {{ now().strftime("%H:%M") }}
        message: '{{ states.sensor.last_shower_duration.state }}'
  mode: single
```

Similarly, getting a notification when the thermostat set temperature is adjusted, also in `automations.yaml`:

```yaml
- id: 'thermostat set temp change'
  alias: Thermostat Alert
  description: ''
  trigger:
    - platform: state
      entity_id: number.thermostat_hc1_selected_room_temperature
  condition: []
  action:
    - service: notify.notify
      data:
        title: Thermostat alert
        message: Temperature set to {{ states('number.thermostat_hc1_selected_room_temperature') }} degrees
  mode: single
```

## Example: Activating one-time hot water charging DHW once using MQTT

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

## Example: Calculating values

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

## Example: Solar Pump Working Hours

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

## Example: Using HA's climate component to control Boiler temperatures

(example taken from 1.9.5)

```yaml
- platform: mqtt
  name: Warm Water
  modes:
    - 'auto'
    - 'off'
  min_temp: 40
  max_temp: 60
  temp_step: 1

  current_temperature_topic: 'ems-esp/boiler_data_ww'
  temperature_state_topic: 'ems-esp/boiler_data_ww'
  mode_state_topic: 'ems-esp/boiler_data_ww'

  current_temperature_template: '{{ value_json.wWCurTemp }}'
  temperature_state_template: '{{ value_json.wWSelTemp }}'
  mode_state_template: "{% if value_json.wWActivated == 'off' %} off {% else %} auto {% endif %}"

  temperature_command_topic: 'ems-esp/boiler'
  mode_command_topic: 'ems-esp/boiler'
```

## Example: Using HA's climate component to control Boiler temperatures, switch Boiler on/off and set the comfort mode

```yaml
- platform: mqtt
  name: boiler
  min_temp: 40
  max_temp: 70
  temp_step: 1
  current_temperature_topic: 'ems-esp/boiler_data_ww'
  temperature_state_topic: 'ems-esp/boiler_data_ww'
  temperature_command_topic: 'ems-esp/boiler'
  temperature_command_template: >
    {{ '{"cmd":"wwtemp","data":'}}
    {{ value }}
    {{ '}'}}
  current_temperature_template: '{{ value_json.wWCurTemp }}'
  temperature_state_template: '{{ value_json.wWSelTemp }}'
  mode_state_template: "{% if value_json.wWActivated == 'off' %} off {% else %} heat {% endif %}"
  mode_state_topic: 'ems-esp/boiler_data_ww'
  mode_command_topic: 'ems-esp/boiler'
  mode_command_template: >
    {{ '{"cmd":"wwactivated","data":"'}}
    {%- if value == 'off' -%}off{% else %}on{%- endif -%}
    {{'"}'}}
  modes:
    - 'heat'
    - 'off'
  # use fan mode as proxy to set comfort mode
  fan_mode_command_topic: 'ems-esp/boiler'
  fan_mode_command_template: >
    {{ '{"cmd":"comfort","data":"'}}
    {%- if value == 'Eco' -%}eco{%-elif value == 'Hot' -%}hot{%- else -%}intelligent{%- endif -%}
    {{'"}'}}
  fan_mode_state_topic: 'ems-esp/boiler_data_ww'
  fan_mode_state_template: '{{ value_json.wWComfort }}'
  fan_modes:
    - 'Eco'
    - 'Hot'
    - 'Intelligent'
```

## Example: Reading a value via the API

Although all the EMS-ESP data is available in Home Assistant as various sensor types you can optionally also call commands and read data using the REST API interface. For example in the script below which will trigger HA to fetch the MAC address when HA is restarted:

```yaml
sensor:
  - platform: rest
    resource: http://ems-esp.local/api/system
    name: emsesp_MAC
    value_template: '{{ value_json.Network.MAC }}'
```

## Example: Changing a value via the API

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

in the Automations:

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
      name: 'wwseltemp'
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

## Example: Showing the Boiler status based on the service code

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

## Example: Switching off hot water (simulating cold shot)

Create a REST API call for EMS-ESP in `configuration.yaml`:

```yaml
emsesp:
  url: http://ems-esp.local/api/{{device}}
  method: POST
  headers:
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWV9.2bHpWya2C7Q12WjNUBD6_7N3RCD7CMl-EGhyQVzFdDg'
  content_type: 'application/json'
  payload: '{"entity":"{{entity}}","value":"{{value}}"}'
```

make a `script` like:

```yaml
'coldshot':
  alias: Cold shot of water
  mode: single
  sequence:
    - service: rest_command.emsesp
      data:
        device: 'boiler'
        entity: 'wwtapactivated'
        value: 'off'
    - delay:
        seconds: 7
    - service: rest_command.emsesp
      data:
        device: 'boiler'
        entity: 'wwtapactivated'
        value: 'on'
```

and call it from a button or an automation.
