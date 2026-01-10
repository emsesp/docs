---
title: Aan de slag
id: Getting-Started
sidebar_label: Aan de slag
sidebar_position: 1
description: Aan de slag met EMS-ESP. Wat u nodig heeft, hoe u installeert en de initiële configuratie uitvoert.
hide_table_of_contents: true
---

# Aan de slag

## Vereiste hardware

### 🔌 ESP32 Ontwikkelbord

De EMS-ESP-firmware draait op een ESP32-module van [Espressif](https://www.espressif.com/en/products/socs). De chipsets ESP32-S, ESP32-S2, ESP32-S3 en ESP32-C3 worden ondersteund.

Zie de post [here](https://github.com/emsesp/EMS-ESP32/discussions/839#discussioncomment-4493156) over met welke ontwikkelborden we hebben getest.

![ESP32 Development Boards](/media/images/esp32-dev-boards.jpg)

### 🔗 EMS-interfacekaart

EMS-ESP vereist ook een apart circuit om te lezen en te schrijven naar de EMS-bus. Je kunt een EMS Gateway board rechtstreeks bij BBQKees Electronics kopen.

![EMS Gateway S3](/media/images/EMS-Gateway-S3.png)
![EMS Gateway E32 V2](/media/images/EMS-Gateway-E32-V2.png)

[Visit BBQKees Electronics](https://bbqkees-electronics.nl)

## LED-statusindicatoren

Wanneer de EMS-ESP opstart en actief is, geeft de LED op het bord de systeemstatus weer.

### Tijdens opstartprocedure

**1 Flash (blauw)**

De EMS-bus is nog niet aangesloten. Als dit meer dan een paar seconden duurt, controleer dan de EMS Tx Mode en de fysieke verbinding met de EMS-bus.

**2 Knippert (rood)**

Netwerk (WiFi of Ethernet) maakt verbinding. Als dit aanhoudt, controleer dan de netwerkinstellingen van EMS-ESP. EMS-ESP gebruikt alleen 2.4GHz/WPA2.

**3 Knipperingen (rood, rood, blauw)**

Zowel de EMS-bus als het netwerk proberen nog steeds verbinding te maken. Dit kan te wijten zijn aan een verkeerde instelling van het EMS-ESP Board Profile.

### Tijdens normaal gebruik

Tenzij de LED is uitgeschakeld in de instellingen, geeft de LED de systeemstatus weer.

**Steady Light**

Er is een goede verbinding en er stromen EMS-gegevens binnen.

**Slow Pulse**

Ofwel maakt de WiFi of de EMS-bus nog steeds verbinding.

**Snelle pols**

Het systeem start op en configureert zichzelf.
