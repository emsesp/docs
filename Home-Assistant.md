![logo](_media/logo/home-assistant.png ':size=100')


When the MQTT Setting `MQTT Format` is set to "`Home Assistant`" EMS-ESP will send the data using HA's MQTT Discovery protocol.


> [!NOTE]
> MQTT Discovery is still being implemented and only supports Thermostat and Sensor devices in version 2.0.1.

## Thermostat data

The thermostat data is published using MQTT Discovery in the topic `homeassistant/climate/ems-esp/hc1/state`. An example payload may look like `{"hc1":{"seltemp":15,"currtemp":22.6,"mode":"auto"}}`. To use this data in the HA select the standard thermostat card and use the entity called `climate.hc1`.

## Solar data, Mixing data, Boiler data

These devices will use the same topics as described in the [MQTT](MQTT.md) section. So boiler information is in `ems-esp/boiler_data` for example.

For boiler data add these to your `sensors.yaml` and include from your `configuration.yaml` file.

```yaml
- platform: mqtt
  name: 'Tap Water'
  state_topic: 'ems-esp/tapwater_active'
  payload_on: "1"
  payload_off: "0"
  unique_id: ems_esp_warmwater

- platform: mqtt
  name: 'Heating'
  state_topic: 'ems-esp/heating_active'
  payload_on: "1"
  payload_off: "0"
  unique_id: ems_esp_heating

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Warm Water selected temperature'
  unit_of_measurement: '°C'
  value_template: '{{ value_json.wWSelTemp }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Warm Water current temperature'
  unit_of_measurement: '°C'
  value_template: '{{ value_json.wWCurTmp }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Warm Water tapwater flow rate'
  unit_of_measurement: 'l/min'
  value_template: '{{ value_json.wWCurFlow }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Warm Water activated'
  value_template: '{{ value_json.wWActivated }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Warm Water 3-way valve'
  value_template: '{{ value_json.wWHeat }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Current flow temperature'
  unit_of_measurement: '°C'
  value_template: '{{ value_json.curFlowTemp }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Return temperature'
  unit_of_measurement: '°C'
  value_template: '{{ value_json.retTemp }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Gas'
  value_template: '{{ value_json.burnGas }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Boiler pump'
  value_template: '{{ value_json.heatPmp }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Fan'
  value_template: '{{ value_json.fanWork }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Ignition'
  value_template: '{{ value_json.ignWork }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Circulation pump'
  value_template: '{{ value_json.wWCirc }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Burner max power'
  unit_of_measurement: '%'
  value_template: '{{ value_json.selBurnPow }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Burner max power'
  unit_of_measurement: '%'
  value_template: '{{ value_json.selBurnPow }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Burner current power'
  unit_of_measurement: '%'
  value_template: '{{ value_json.curBurnPow }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'System Pressure'
  unit_of_measurement: 'bar'
  value_template: '{{ value_json.sysPress }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Boiler temperature'
  unit_of_measurement: '°C'
  value_template: '{{ value_json.boilTemp }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Pump modulation'
  unit_of_measurement: '%'
  value_template: '{{ value_json.pumpMod }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'Boiler temperature'
  unit_of_measurement: '°C'
  value_template: '{{ value_json.boilTemp }}'

- platform: mqtt
  state_topic: 'ems-esp/boiler_data'
  name: 'one_time_water'
  value_template: '{{ value_json.wWOnetime }}'
```




## Heartbeat

The heartbeat is not part of the HA device yet, so still published under the topic `ems-esp/heartbeat`.

```yaml
## EMS-ESP status
- platform: mqtt
  state_topic: 'ems-esp/status'
  name: 'ems-esp status'
  unique_id: ems_esp_status
  
## EMS-ESP heartbeat  
- platform: mqtt
  state_topic: 'ems-esp/heartbeat'
  name: 'ems_esp_wifi'
  unit_of_measurement: '%'
  value_template: '{{ value_json.rssid }}'
  availability_topic: 'ems-esp/status'
  payload_not_available: "offline"
  unique_id: ems_esp_wifi

- platform: mqtt
  state_topic: 'ems-esp/heartbeat'
  name: 'ems_esp_freemem'
  unit_of_measurement: '%'
  value_template: '{{ value_json.freemem }}'
  availability_topic: 'ems-esp/status'
  payload_not_available: "offline"
  unique_id: ems_esp_freemem

- platform: mqtt
  state_topic: 'ems-esp/heartbeat'
  name: 'ems_esp_uptime'
  unit_of_measurement: 's'
  value_template: '{{ value_json.uptime }}'
  availability_topic: 'ems-esp/status'
  payload_not_available: "offline"
  unique_id: ems_esp_uptime

- platform: mqtt
  state_topic: 'ems-esp/heartbeat'
  name: 'ems_esp_mqttpublishfails'
  value_template: '{{ value_json.mqttpublishfails }}'
  availability_topic: 'ems-esp/status'
  payload_not_available: "offline"
  unique_id: ems_esp_mqttpublishfails

- platform: mqtt
  state_topic: 'ems-esp/heartbeat'
  name: 'ems_esp_txfails'
  value_template: '{{ value_json.txfails }}'
  availability_topic: 'ems-esp/status'
  payload_not_available: "offline"
  unique_id: ems_esp_txfails

- platform: mqtt
  state_topic: 'ems-esp/heartbeat'
  name: 'ems_esp_rxfails'
  value_template: '{{ value_json.rxfails }}'
  availability_topic: 'ems-esp/status'
  payload_not_available: "offline"
  unique_id: ems_esp_rxfails
```

## Dallas temperature sensors

The sensor details will be in the state called `sensor.ems_esp_sensor<n>` for each attached sensor. e.g. `sensor.ems_esp_sensor1`.

## Example Alerts

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

## Activating one-time hot water charging DHW once

Below is an example of calling a command (OneTimeWater)

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
          topic: 'ems-esp/boiler'
          payload: '{"cmd":wwonetime ,"data":1}'
          
  one_time_water_off:
    sequence:
      - service: mqtt.publish
        data_template:
          topic: 'ems-esp/boiler'
          payload: '{"cmd":wwonetime ,"data":0}'
```
