---
id: Prometheus
title: Prometheus Monitoring
description: Export EMS-ESP metrics to Prometheus for monitoring and alerting
---

# Prometheus

![logo](/media/logo/prometheus-logo.png)

:::info Experimentelle Funktion Diese Funktion wird derzeit noch getestet. Die Prometheus API ist ab EMS-ESP32 Version 3.7.3-dev_36 verfügbar.
:::

EMS-ESP stellt die `/api/<device>/metrics` & `/api/system/metrics` Endpunkte für die Integration mit Prometheus zur Verfügung. Alle EMS-ESP-Metriken sind mit dem Präfix `emsesp_` versehen.

## Geräte-Metriken

Gerätemetriken sind über den Endpunkt `/api/<device>/metrics` zugänglich. Folgende Wertetypen werden ausgegeben:

- `number`
- `boolean` (abgebildet als 0 & 1)
- `enum` (als Zahlen abgebildet)

Details zu den Metriken und Enum-Mappings können in der Hilfe-Richtlinie eingesehen werden, wie im folgenden Beispiel gezeigt:

```
# HELP emsesp_circmode enum, (0: off; 1: 1x3min; 2: 2x3min; 3: 3x3min; 4: 4x3min; 5: 5x3min; 6: 6x3min; 7: continuously), readable, writeable, visible
# TYPE emsesp_circmode gauge
emsesp_circmode{circuit="dhw"} 1
```

## System-Metriken

Systemmetriken sind über den Endpunkt `/api/system/metrics` zugänglich. Die Metriken können aus den folgenden Kategorien gelesen werden:

| Kategorie | Metrisches Präfix | Metrische Bezeichnungen |
|------------------------------|-------------------|-------------------------------|
| System | emsesp_system_* | |
| Netzwerk | emsesp_network_* | |
| NTP | emsesp_ntp_* | |
| Zugangspunkt | emsesp_ap_* | |
| MQTT | emsesp_mqtt_* | |
| Syslog | emsesp_syslog_* | |
| Temperatur- & Analogsensoren | emsesp_sensor_* | |
| API | emsesp_api_* | |
| EMS-Bus | emsesp_bus_* | |
| Systemeinstellungen | emsesp_settings_* | |
| EMS-Geräte | emsesp_device_* | typ, name, deviceid, version |

Darüber hinaus wird für einige Kategorien auch eine `*_info`-Metrik bereitgestellt. Dort werden String-Werte gesammelt und als Labels ausgegeben. Zum Beispiel:

```
# HELP emsesp_bus_info info
# TYPE emsesp_bus_info gauge
emsesp_bus_info{busstatus="connected", busprotocol="Buderus"} 1
```

## Konfiguration

Die folgende Beispielkonfiguration kann als `prometheus.yml` verwendet werden:

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

Zur Visualisierung der Prometheus Metriken siehe auch: [Integrations: Grafana](Grafana.md). <br /> Weitere Informationen über das Prometheus Datenmodell finden Sie im [official documentation](https://prometheus.io/docs/concepts/data_model/).
