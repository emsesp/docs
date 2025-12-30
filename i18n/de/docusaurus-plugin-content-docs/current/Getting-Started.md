---
title: Erste Schritte
id: Getting-Started
sidebar_label: Erste Schritte
sidebar_position: 1
description: Erste Schritte mit EMS-ESP. Was Sie benötigen, wie Sie installieren und die Erstkonfiguration durchführen.
hide_table_of_contents: true
---

# 📦 Erste Schritte

## 🔧 Erforderliche Hardware

### 🔌 ESP32 Development Board

Die EMS-ESP-Firmware läuft auf einem ESP32-Modul von [Espressif](https://www.espressif.com/en/products/socs). Es werden die Chipsätze ESP32-S, ESP32-S2, ESP32-S3 und ESP32-C3 unterstützt.

Siehe den Beitrag [here](https://github.com/emsesp/EMS-ESP32/discussions/839#discussioncomment-4493156) über die Entwicklungsboards, die wir getestet haben.

![ESP32 Development Boards](/media/images/esp32-dev-boards.jpg)

### 🔗 EMS-Schnittstellenkarte

EMS-ESP erfordert auch eine separate Schaltung zum Lesen und Schreiben auf dem EMS-Bus. Sie können entweder [build your own](EMS-Circuit) oder ein EMS-Gateway-Board direkt von BBQKees Electronics kaufen.

![EMS Gateway S3](/media/images/EMS-Gateway-S3.png) ![EMS Gateway E32 V2](/media/images/EMS-Gateway-E32-V2.png)

[Visit BBQKees Electronics](https://bbqkees-electronics.nl)

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
