![logo](_media/logo/home-assistant.png ':size=100')

> [!NOTE]
> This section is being re-written to explain the MQTT Discovery options

Example: Alerts on an iOS/Android device using PushBullet, PushOver or any notification service would look like:

![Home Assistant iPhone notify](_media/home%20assistant/ha_notify.jpg ':size=400')



## Example: Activating one-time hot water charging DHW once (OneTimeWater) 

switch.yaml
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

scripts.yaml
```yaml
  one_time_water_on:
    sequence:
      - service: mqtt.publish
        data_template:
          topic: 'home/ems-esp/boiler_cmd_wwonetime'
          payload: '1'
          
  one_time_water_off:
    sequence:
      - service: mqtt.publish
        data_template:
          topic: 'home/ems-esp/boiler_cmd_wwonetime'
          payload: '0'
```

sensors.yaml
```yaml
  - platform: mqtt
    state_topic: 'home/ems-esp/boiler_data'
    name: 'one_time_water'
    value_template: '{{ value_json.wWOnetime }}'
```
