---
title: Getting Started
id: Getting-Started
sidebar_label: Getting Started
sidebar_position: 1
description: Getting started with EMS-ESP. What you need, how to install and do initial configuration.
hide_table_of_contents: true
---

# Aan de slag

## Vereiste hardware

### 🔌 ESP32 Ontwikkelbord

De EMS-ESP-firmware draait op een ESP32-module van [Espressif](https://www.espressif.com/en/products/socs). De chipsets ESP32 S, S2, S3, C3 en C6 worden ondersteund. Firmware binaries zijn beschikbaar voor de ESP32 S 4MB, 16MB, 16MB met PSRAM en de ESP32 S3 16MB met PSRAM. Voor andere versies kun je de firmware vanaf de broncode bouwen met PlatformIO.

Zie het bericht [here](https://github.com/emsesp/EMS-ESP32/discussions/839#discussioncomment-4493156) over met welke ontwikkelborden we hebben getest.

### 🔗 EMS-interfacekaart

EMS-ESP heeft ook een apart circuit nodig om te lezen en te schrijven naar de EMS-bus. Je koopt een EMS Gateway board rechtstreeks bij BBQKees Electronics.

<div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start'}}> <img src="/media/images/EMS-Gateway-S3.png" alt="EMS Gateway S3" width="300" /> <img src="/media/images/EMS-Gateway-E32-V2.png" alt="EMS Gateway E32 V2" width="300" /> </div>

[visit BBQKees Electronics](https://bbqkees-electronics.nl)

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

Ofwel de WiFi ofwel de EMS-bus maakt nog steeds verbinding.

**Snelle pols**

Het systeem start op en configureert zichzelf.
