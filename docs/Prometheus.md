---
id: Prometheus
title: Prometheus Monitoring
description: Export EMS-ESP metrics to Prometheus for monitoring and alerting
---
# Prometheus

![logo](/media/logo/prometheus-logo.png)

:::info Experimental Feature
    This feature is currently still being tested. The Prometheus API is available starting with EMS-ESP32 version 3.7.3-dev_36.
:::

EMS-ESP exposes the `/api/<device>/metrics` & `/api/system/metrics` endpoints for integration with Prometheus. All EMS-ESP metrics are prefixed with `emsesp_`.

## Device Metrics

Device metrics are accessible at the endpoint `/api/<device>/metrics`.
Following value types are outputted:

- `number`
- `boolean` (mapped as 0 & 1)
- `enum` (mapped as numbers)

Details about the metrics and enum-mappings can be viewed in the Help-directive, as shown in the following example:

```
# HELP emsesp_circmode enum, (0: off; 1: 1x3min; 2: 2x3min; 3: 3x3min; 4: 4x3min; 5: 5x3min; 6: 6x3min; 7: continuously), readable, writeable, visible
# TYPE emsesp_circmode gauge
emsesp_circmode{circuit="dhw"} 1
```

## System Metrics

System metrics are accessible at the endpoint `/api/system/metrics`. Metrics can be read from the following categories:

| Category                     | Metric prefix     | Metric labels                 |
|------------------------------|-------------------|-------------------------------|
| System                       | emsesp_system_*   |                               |
| Network                      | emsesp_network_*  |                               |
| NTP                          | emsesp_ntp_*      |                               |
| Access Point                 | emsesp_ap_*       |                               |
| MQTT                         | emsesp_mqtt_*     |                               |
| Syslog                       | emsesp_syslog_*   |                               |
| Temperature- & Analogsensors | emsesp_sensor_*   |                               |
| API                          | emsesp_api_*      |                               |
| EMS Bus                      | emsesp_bus_*      |                               |
| System settings              | emsesp_settings_* |                               |
| EMS Devices                  | emsesp_device_*   | type, name, deviceid, version |

In addition, an `*_info` metric is also provided for some categories. String values are collected and output as labels there. For example:

```
# HELP emsesp_bus_info info
# TYPE emsesp_bus_info gauge
emsesp_bus_info{busstatus="connected", busprotocol="Buderus"} 1
```

## Configuration

The following sample configuration can be used as `prometheus.yml`:

```YML
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'emsesp'
    static_configs:
      - targets: ['ems-esp.local']
        labels:
          device: system
      - targets: ['ems-esp.local']
        labels:
          device: boiler
      - targets: ['ems-esp.local']
        labels:
          device: thermostat
#     - some other device ...

    relabel_configs:
      - source_labels: [device]
        target_label: __metrics_path__
        regex: (.*)
        replacement: /api/$1/metrics
```

To visualize the Prometheus metrics, see also: [Integrations: Grafana](Grafana.md).
<br />
More information about the Prometheus Data model can be found in the [official documentation](https://prometheus.io/docs/concepts/data_model/).
