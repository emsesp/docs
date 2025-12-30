---
title: MQTT Integration
id: MQTT
description: Complete guide to MQTT integration with EMS-ESP for home automation systems
---

# 📡 MQTT-Integration

Verbinden Sie EMS-ESP mit Ihrem Hausautomatisierungssystem über MQTT.

## 📊 Veröffentlichte Daten

Wenn MQTT aktiviert ist, veröffentlicht EMS-ESP MQTT-Themen für jedes Gerät. Die Häufigkeit kann über die WebUI so konfiguriert werden, dass sie entweder gesendet wird, wenn Datenänderungen erkannt werden, oder auf einen bestimmten Zeitraum in Sekunden eingestellt wird, der den Netzwerkverkehr schont.

### 🔍 MQTT Discovery

Wenn MQTT Discovery aktiviert ist, erstellt EMS-ESP automatisch spezielle Discovery Topics (mit `/config`) für jede EMS-Geräteeinheit, die einen gültigen Wert erhalten hat.

### 📋 Datenformate

In der folgenden Tabelle sind die zu veröffentlichenden Themen aufgeführt. Das angezeigte Format ist das MQTT-Format, wie es in den Einstellungen von EMS-ESP definiert ist. Das Standardformat ist `Nested`, das ein einzelnes Thema verwendet, um mehrere Einträge in der Nutzlast anzuzeigen.

## 📋 MQTT Themen Referenz

| Thema | Format | Beschreibung | Nutzdaten Beispiel |
|-------|--------|-------------|-----------------|
| `status` | n/a | MQTT-Testament-Nachrichten | `online` oder `offline` |
| `info` | n/a | Systeminformationen und Ereignisse | `{"version":"3.7.3","hostname":"ems-esp"}` |
| `heartbeat` | alle | Systemstatistiken in JSON (standardmäßig jede Minute) | `{"bus_status":"connected","uptime":"02:16:00"}` |
| `tapwater_active` | all | Boolean: warmes Leitungswasser läuft (DHW) | - |
| `heating_active` | all | Boolean: Heizung ist an | - |
| `boiler_data` | alle | Nicht-Warmwasserdaten vom Kesselgerät | `{"heatingactive":"off","curflowtemp":57.5}` |
| `thermostat_data` | verschachtelt | Thermostatdaten und Heizkreise | `{"hc1":{"seltemp":15.0,"mode":"auto"}}` |
| `thermostat_data_hc<id>` | einzeln | Individuelle Heizkreisdaten | `{"seltemp":15,"mode":"auto"}` |
| `mixer_data` | verschachtelt | Mischdaten mit hc1-hc4 und wwc1, wwc2 | `{"hc1":{"flowTemp":55,"pumpStatus":"on"}}` |
`shower_data` | alle | Duschtimer und Warnhinweise | `{"timer":"0","duration":"4m 32s"}` |
| `solar_data` | alle | Solarmodul-Daten (falls angeschlossen) | `{"collectorTemp":15.8,"energyToday":1792}` |
| `temperaturesensor_data` | verschachtelt | Externe Dallas-Temperatursensoren | `{"28-233D-9497":{"temp":19.6}}` |
| `analogsensor_data` | verschachtelt | Externe analoge Sensoren | `{"31":{"name":"analog31","value":0}}` |
| `custom_data` | verschachtelt | Benutzerdefinierte Einheiten | - |

## 📤 MQTT zum Senden von Befehlen verwenden

Erfahren Sie, wie Sie mit MQTT Befehle an EMS-ESP senden können, um Ihre Heizungsanlage zu steuern.

[View Commands Guide](/Commands#mqtt)

## 📊 Überwachung des MQTT-Verkehrs

### 🔍 MQTT Explorer

Zur genauen Überwachung des MQTT-Verkehrs empfehle ich [MQTT Explorer](http://mqtt-explorer.com/). Dieses Tool bietet eine visuelle Schnittstelle zur Überwachung aller MQTT-Themen und -Nachrichten.

### 💻 Konsolenbefehle

Verwenden Sie den Konsolenbefehl `show mqtt`, um den Status des MQTT-Dienstes, der Themenabonnements und der ausgehenden Veröffentlichungswarteschlange anzuzeigen.

### 📈 WebUI Status

In der WebUI können Sie die Größe der Warteschlange sehen und die Gesamtstatistiken sind auf der Seite **Status** verfügbar.
