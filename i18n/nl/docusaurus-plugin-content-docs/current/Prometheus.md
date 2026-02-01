---
id: Prometheus
title: Prometheus Monitoring
description: Export EMS-ESP metrics to Prometheus for monitoring and alerting
---

# Prometheus

![logo](/media/logo/prometheus-logo.png)

:::info Experimentele functie Deze functie wordt momenteel nog getest. De Prometheus API is beschikbaar vanaf EMS-ESP32 versie 3.7.3-dev_36.
:::

EMS-ESP stelt de eindpunten `/api/<device>/metrics` en `/api/system/metrics` beschikbaar voor integratie met Prometheus. Alle EMS-ESP metrics hebben als prefix `emsesp_`.

## Apparaatgegevens

Apparaatmetriek is toegankelijk via het eindpunt `/api/<device>/metrics`. De volgende waarden worden uitgevoerd:

- `number`
- `boolean` (toegewezen als 0 & 1)
- `enum` (weergegeven als getallen)

Details over de metrieken en enum-mappings kunnen worden bekeken in de Help-directive, zoals in het volgende voorbeeld:

```
# HELP emsesp_circmode enum, (0: off; 1: 1x3min; 2: 2x3min; 3: 3x3min; 4: 4x3min; 5: 5x3min; 6: 6x3min; 7: continuously), readable, writeable, visible
# TYPE emsesp_circmode gauge
emsesp_circmode{circuit="dhw"} 1
```

## Systeem statistieken

Systeemgegevens zijn toegankelijk via het eindpunt `/api/system/metrics`. Metrieken kunnen uit de volgende categorieën gelezen worden:

| Categorie | Metrisch voorvoegsel | Metrische labels |
|------------------------------|-------------------|-------------------------------|
| Systeem | emsesp_system_* | |
| Netwerk | emsesp_netwerk_* | |
| NTP | emsesp_ntp_* | |
| Toegangspunt | emsesp_ap_* | |
| MQTT | emsesp_mqtt_* | |
| Syslog | emsesp_syslog_* | |
| Temperatuur- & Analoge sensoren | emsesp_sensor_* |
| API | emsesp_api_* | |
| EMS-bus | emsesp_bus_* | |
| Systeeminstellingen | emsesp_settings_* | |
| EMS-apparaten | emsesp_device_* | type, naam, deviceid, versie |

Daarnaast wordt voor sommige categorieën ook een `*_info` metriek geleverd. Hier worden stringwaarden verzameld en uitgevoerd als labels. Bijvoorbeeld:

```
# HELP emsesp_bus_info info
# TYPE emsesp_bus_info gauge
emsesp_bus_info{busstatus="connected", busprotocol="Buderus"} 1
```

## Configuratie

De volgende voorbeeldconfiguratie kan worden gebruikt als `prometheus.yml`:

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

Om de Prometheus-metriek te visualiseren, zie ook: [Integrations: Grafana](Grafana.md). <br /> Meer informatie over het Prometheus Data model is te vinden in de [official documentation](https://prometheus.io/docs/concepts/data_model/).
