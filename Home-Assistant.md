![logo](_media/logo/home-assistant.png ':size=100')

EMS-ESP has automatic integration with Home Assistant via the [MQTT Discovery](https://www.home-assistant.io/docs/mqtt/discovery/) protocol. To use this feature make sure in EMS-ESP that MQTT is enabled and the `MQTT Format` setting is set to "`Home Assistant`". Also ensure your Home Assistant configuration is setup correctly to use the prefix "homeassistant" which is the default.

EMS-ESP will create retained MQTT messages prefixed with `homeassistant/` for each device and their values (called entities). For example "`EMS-ESP Thermostat`". You can view which ones have been created by going into Home Assistant's `Configuration->Integrations` and select the devices under `MQTT`.

To add this device and its values to a Home Assistant UI click on the "ADD TO LOVELACE" button.

![device](_media/ha_device.PNG ':size=100%')

You can then add each of these devices to a new lovelace view using the "add to lovelace" button, and get something looking like:

![lovelace](_media/ha_lovelace.PNG ':size=100%')

## Example: Alerts

Below is an example using a trigger to notify when a shower has finished. This works when the setting `Shower Timer` is enabled.

![Home Assistant iPhone notify](_media/home%20assistant/ha_notify.jpg ':size=400')

```yaml
- id: boiler_shower
  alias: Alert shower time
  initial_state: true
  trigger:
    platform: state
    entity_id: sensor.last_shower_duration
  action:
    - service: notify.admin_notify
      data:
        title: Shower finished at {{states.sensor.time.state}}
        message: '{{ states.sensor.last_shower_duration.state }}'
```

and get notified when the thermostat is adjusted:

```yaml
- id: thermostat_temp_set
  alias: Thermostat Temp Set
  initial_state: true
  trigger:
    platform: state
    entity_id: sensor.current_set_temperature
  action:
    - service: notify.admin_notify
      data:
        title: Thermostat alert
        message: 'Temperature set to {{states.sensor.current_set_temperature.state}} degrees'
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

Since all the EMS-ESP data is exposed via the API, you can create Home Assistant entities by manually adding sensors and use the REST platform like the example below. Note HA will call this every 30 seconds. If you want a more on-demand approach then use `rest_command` below to trigger the fetch for example when HA starts up.

```yaml
sensor:
  - platform: rest
    resource: http://ems-esp.local/api/system/info
    name: emsesp_MAC
    value_template: '{{ value_json.Network.MAC }}'
```

## Example: Changing a value via the API

`configuration.yaml`:

```yaml
rest_command:
  emsesp:
    url: http://<IP address of EMS-ESP>/api/{{device}}
    method: POST
    headers:
      authorization: 'Bearer <Your Secure key from the UI>'
    content_type: 'application/json'
    payload: '{"name":"{{name}}","value":"{{value}}"}'

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
