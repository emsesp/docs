---
title: Getting Started
id: Getting-Started
sidebar_label: Getting Started
sidebar_position: 1
description: Getting started with EMS-ESP. What you need, how to install and do initial configuration.
hide_table_of_contents: true
---

# 📦 Erste Schritte

## 🔧 Erforderliche Hardware

### 🔌 ESP32 Development Board

Die EMS-ESP-Firmware läuft auf einem ESP32-Modul von [Espressif](https://www.espressif.com/en/products/socs). Es werden die Chipsätze ESP32 S, S2, S3, C3 und C6 unterstützt. Firmware-Binaries sind für den ESP32 S 4MB, 16MB, 16MB mit PSRAM und den ESP32 S3 16MB mit PSRAM verfügbar. Für andere Versionen können Sie die Firmware aus dem Quellcode mit PlatformIO erstellen.

Siehe den Beitrag [here](https://github.com/emsesp/EMS-ESP32/discussions/839#discussioncomment-4493156) über die Entwicklungsboards, die wir getestet haben.

### 🔗 EMS-Schnittstellenkarte

EMS-ESP erfordert auch eine separate Schaltung zum Lesen und Schreiben auf dem EMS-Bus. Sie erwerben eine EMS-Gateway-Karte direkt bei BBQKees Electronics.

<div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start'}}> <img src="/media/images/EMS-Gateway-S3.png" alt="EMS Gateway S3" width="300" /> <img src="/media/images/EMS-Gateway-E32-V2.png" alt="EMS Gateway E32 V2" width="300" /> </div>

[visit BBQKees Electronics](https://bbqkees-electronics.nl)

## 💡 LED-Statusanzeigen

Wenn das EMS-ESP gestartet wird und läuft, zeigt die integrierte LED den Systemstatus an.

### 🔄 Während der Boot-Sequenz

**1 Blitzlicht (blau)**

Der EMS-Bus ist noch nicht angeschlossen. Wenn dies mehr als ein paar Sekunden dauert, überprüfen Sie den EMS-Tx-Modus und die physikalische Verbindung zum EMS-Bus.

**2 Blinkt (rot)**

Das Netzwerk (WiFi oder Ethernet) verbindet sich. Wenn das Problem weiterhin besteht, überprüfen Sie die EMS-ESP-Netzwerkeinstellungen. EMS-ESP verwendet nur 2.4GHz/WPA2.

**3 Blinksignale (rot, rot, blau)**

Sowohl der EMS-Bus als auch das Netzwerk versuchen immer noch, eine Verbindung herzustellen. Dies könnte auf eine falsche Einstellung des EMS-ESP-Boardprofils zurückzuführen sein.

### ✨ Im Normalbetrieb

Sofern die LED nicht in den Einstellungen deaktiviert wurde, zeigt die LED den Systemstatus an.

**Steady Light**

Gute Verbindung und EMS-Daten fließen ein.

**Slow Pulse**

Entweder das WiFi oder der EMS-Bus sind noch verbunden.

**Schneller Puls**

Das System wird hochgefahren und konfiguriert sich selbst.
