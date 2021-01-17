![logo](_media/logo/home-assistant.png ':size=100')

EMS-ESP has automatic integration with Home Assistant via the [MQTT Discovery](https://www.home-assistant.io/docs/mqtt/discovery/) protocol. To use this feature make sure in EMS-ESP that MQTT is enabled and the `MQTT Format` setting is set to "`Home Assistant`". Also ensure your Home Assistant configuration is setup correctly to use the prefix "homeassistant".
```yaml
# Example configuration.yaml entry
mqtt:
  discovery: true # this is default in 0.117.0 and higher
  discovery_prefix: homeassistant
```

EMS-ESP will create retained MQTT messages prefixed with `homeassistant/` for each device and their values (called entities). For example "`EMS-ESP Thermostat`". You can view which ones have been created by going into Home Assistant's `Configuration->Integrations` and select the devices under `MQTT`.

To add this device and its values to a Home Assistant UI click on the "ADD TO LOVELACE" button. 

![device](_media/ha_device.PNG ':size=100%')

You can then add each of these devices to a new lovelace view using the "add to lovelace" button, and get something looking like:

![lovelace](_media/ha_lovelace.PNG ':size=100%')

## Heartbeat

The Heartbeat has more details stored in the entity's state as individual attributes. You can expose these by adding a new card to the lovelace UI like:

```yaml
type: entities
title: EMS-ESP Status
entities:
  - entity: sensor.ems_esp_status
    type: attribute
    attribute: uptime
    name: Uptime
    icon: 'mdi:timer-outline'
  - entity: sensor.ems_esp_status
    type: attribute
    attribute: rssi
    name: RSSI
    suffix : '%'
    icon: 'mdi:wifi'
  - entity: sensor.ems_esp_status
    type: attribute
    attribute: freemem
    name: Free Memory
    suffix: '%'
    icon: 'mdi:gauge'
  - entity: sensor.ems_esp_status
    type: attribute
    attribute: txfails
    name: Tx Errors
    icon: 'mdi:alert-circle-outline'
  - entity: sensor.ems_esp_status
    type: attribute
    attribute: rxfails
    name: Rx Errors
    icon: 'mdi:alert-circle-outline'
```

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
    data_template:
      title: Shower finished at {{states.sensor.time.state}}
      message: "{{ states.sensor.last_shower_duration.state }}"
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
    data_template:
      title: Thermostat alert
      message: "Temperature set to {{states.sensor.current_set_temperature.state}} degrees"   
```

## Example: Activating one-time hot water charging DHW once

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
        data_template:
          topic: 'ems-esp/boiler'
          payload: '{"cmd":"wwonetime","data":1}'
          
  one_time_water_off:
    sequence:
      - service: mqtt.publish
        data_template:
          topic: 'ems-esp/boiler'
          payload: '{"cmd":"wwonetime","data":0}'
```

## Example: Calculating values

(from @Glitter-ball in https://github.com/proddy/EMS-ESP/issues/519)

```yaml
- platform: template
  sensors:
    differential:
      friendly_name: "Flow-Ret diff"
      unit_of_measurement: '°C'
      icon_template: 'mdi:format-align-middle'
      value_template: "{{ (states('sensor.flow_temperature') | float - states('sensor.return_temp') | float) | round(1) }}"
```

## Example: Solar Pump Working Hours

(from @PhillyGilly in Gitter)

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
  payload_available: "online"
  payload_not_available: "offline"
```

## Example: Using HA's climate component to control Boiler temperatures

(example taken from 1.9.5)

```yaml
- platform: mqtt
  name: Warm Water
  modes:
    - "auto"
    - "off"
  min_temp: 40
  max_temp: 60
  temp_step: 1
  
  current_temperature_topic: "ems-esp/boiler_data_ww"
  temperature_state_topic: "ems-esp/boiler_data_ww"
  mode_state_topic: "ems-esp/boiler_data_ww"

  current_temperature_template: "{{ value_json.wWCurTemp }}"
  temperature_state_template: "{{ value_json.wWSelTemp }}"
  mode_state_template: "{% if value_json.wWActivated == 'off' %} off {% else %} auto {% endif %}"

  temperature_command_topic: "ems-esp/boiler"
  mode_command_topic: "ems-esp/boiler"
  ```
