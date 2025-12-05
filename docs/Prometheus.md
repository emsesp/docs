![logo](_media/logo/prometheus-logo.png)

EMS-ESP exposes the `/api/<device>/metrics` endpoint for integration with Prometheus.
At this point, only numeric and boolean (as 0 & 1) values are returned by the api.
All EMS-ESP metrics are prefixed with `emsesp_`.

The following sample configuration can be used as `prometheus.yml`:
```YML
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'emsesp'
    static_configs:
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
To visualize the Prometheus metrics, see also: [Integrations: Grafana](Grafana.md)