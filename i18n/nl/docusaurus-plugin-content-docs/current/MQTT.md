---
title: MQTT Integration
id: MQTT
description: Complete guide to MQTT integration with EMS-ESP for home automation systems
---

# 📡 MQTT-integratie

Verbind EMS-ESP met je domoticasysteem via MQTT.

## Gepubliceerde gegevens

Wanneer MQTT is ingeschakeld, zal EMS-ESP MQTT topics publiceren voor elk apparaat. De frequentie kan worden geconfigureerd vanuit de WebUI om te worden verzonden wanneer er gegevenswijzigingen worden gedetecteerd of om te worden ingesteld op een specifieke periode in seconden die vriendelijker is voor het netwerkverkeer.

### 🔍 MQTT-ontdekking

Wanneer MQTT Discovery is ingeschakeld, zal EMS-ESP automatisch speciale Discovery topics aanmaken (met `/config`) voor elke EMS apparaatentiteit die een geldige waarde heeft ontvangen.

### Gegevensindelingen

In de onderstaande tabel staan de onderwerpen die gepubliceerd worden. Het getoonde formaat is het MQTT-formaat zoals gedefinieerd in de instellingen van EMS-ESP. Het standaardformaat is `Nested` dat een enkel onderwerp gebruikt om meerdere items in de payload te tonen.

## 📋 MQTT Onderwerpen Referentie

| Onderwerp | Formaat | Beschrijving | Payload Voorbeeld |
|-------|--------|-------------|-----------------|
| `status` | n/a | MQTT testamentberichten | `online` of `offline` |
| `info` | n/a | Systeeminformatie en gebeurtenissen `{"version":"3.7.3","hostname":"ems-esp"}` |
| `heartbeat` | all | Systeemstatistieken in JSON (standaard elke minuut) | `{"bus_status":"connected","uptime":"02:16:00"}` |
| Booleaans: warm tapwater loopt (DHW)
| Booleaans: verwarming staat aan
| `boiler_data` | all | Niet-warmwatergegevens van ketelapparaat | `{"heatingactive":"off","curflowtemp":57.5}` |
| `thermostat_data` | genest | thermostaatgegevens en verwarmingscircuits | `{"hc1":{"seltemp":15.0,"mode":"auto"}}` |
| `thermostat_data_hc<id>` | single | gegevens over afzonderlijk verwarmingscircuit | `{"seltemp":15,"mode":"auto"}` |
| `mixer_data` | genest | Mixergegevens met hc1-hc4 en wwc1, wwc2 | `{"hc1":{"flowTemp":55,"pumpStatus":"on"}}` |
| `shower_data` | all | Shower timer and alert toggles | `{"timer":"0","duration":"4m 32s"}` |
| Gegevens van de zonnemodule (indien aangesloten) `solar_data` | all | Gegevens van de zonnemodule (indien aangesloten) `{"collectorTemp":15.8,"energyToday":1792}` |
| Externe Dallas-temperatuursensoren `temperaturesensor_data` | Nested | Externe Dallas-temperatuursensoren `{"28-233D-9497":{"temp":19.6}}` |
| `analogsensor_data` | genest | Externe analoge sensoren | `{"31":{"name":"analog31","value":0}}` |
| `custom_data` | genest | aangepaste entiteiten | - |

## 📤 MQTT gebruiken om opdrachten te versturen

Leer hoe je MQTT kunt gebruiken om commando's naar EMS-ESP te sturen om je verwarmingssysteem te regelen.

[View Commands Guide](/Commands#mqtt)

## 📊 MQTT-verkeer monitoren

### 🔍 MQTT Verkenner

Voor het nauwkeurig monitoren van MQTT verkeer stel ik voor om [MQTT Explorer](http://mqtt-explorer.com/) te gebruiken. Deze tool biedt een visuele interface om alle MQTT onderwerpen en berichten te controleren.

### 💻 Consoleopdrachten

Gebruik het consolecommando `show mqtt` om de status van de MQTT-service, onderwerpabonnementen en uitgaande publicatiewachtrij weer te geven.

### Status WebUI

In de WebUI kun je de grootte van de wachtrij zien en algemene statistieken zijn beschikbaar op de **Status** pagina.
