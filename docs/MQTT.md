---
title: MQTT Integration
id: MQTT
description: Complete guide to MQTT integration with EMS-ESP for home automation systems
---

# 📡 MQTT Integration

Connect EMS-ESP to your home automation system via MQTT.

## 📊 Published Data

When MQTT is enabled, EMS-ESP will publish MQTT topics for each device. The frequency can be configured from the WebUI to be either sent when data changes are detected or set to a specific period in seconds which is kinder on network traffic.

### 🔍 MQTT Discovery

When MQTT Discovery is enabled, EMS-ESP will automatically create special Discovery topics (with `/config`) for each EMS device entity that has received a valid value.

### 📋 Data Formats

The table below lists the topics being published. The format shown is the MQTT Format as defined in EMS-ESP's settings. Default format is `Nested` which uses a single topic to show multiple entries in the payload.

## 📋 MQTT Topics Reference

| Topic | Format | Description | Payload Example |
|-------|--------|-------------|-----------------|
| `status` | n/a | MQTT will and testament messages | `online` or `offline` |
| `info` | n/a | System information and events | `{"version":"3.7.3","hostname":"ems-esp"}` |
| `heartbeat` | all | System stats in JSON (default every minute) | `{"bus_status":"connected","uptime":"02:16:00"}` |
| `tapwater_active` | all | Boolean: hot tap water running (DHW) | - |
| `heating_active` | all | Boolean: heating is on | - |
| `boiler_data` | all | Non warm water data from Boiler device | `{"heatingactive":"off","curflowtemp":57.5}` |
| `thermostat_data` | nested | Thermostat data and Heating Circuits | `{"hc1":{"seltemp":15.0,"mode":"auto"}}` |
| `thermostat_data_hc<id>` | single | Individual heating circuit data | `{"seltemp":15,"mode":"auto"}` |
| `mixer_data` | nested | Mixer data with hc1-hc4 and wwc1, wwc2 | `{"hc1":{"flowTemp":55,"pumpStatus":"on"}}` |
| `shower_data` | all | Shower timer and alert toggles | `{"timer":"0","duration":"4m 32s"}` |
| `solar_data` | all | Solar Module data (if connected) | `{"collectorTemp":15.8,"energyToday":1792}` |
| `temperaturesensor_data` | nested | External Dallas temperature sensors | `{"28-233D-9497":{"temp":19.6}}` |
| `analogsensor_data` | nested | External analog sensors | `{"31":{"name":"analog31","value":0}}` |
| `custom_data` | nested | Custom entities | - |

## 📤 Using MQTT to Send Commands

Learn how to use MQTT to send commands to EMS-ESP for controlling your heating system.

[View Commands Guide](/Commands#mqtt)

## 📊 Monitoring MQTT Traffic

### 🔍 MQTT Explorer

For precise monitoring of MQTT traffic, I suggest using [MQTT Explorer](http://mqtt-explorer.com/). This tool provides a visual interface to monitor all MQTT topics and messages.

### 💻 Console Commands

Use the console command `show mqtt` to display the status of the MQTT service, topic subscriptions, and outbound publishing queue.

### 📈 WebUI Status

In the WebUI you can see the size of the queue and overall stats are available in the **Status** page.
