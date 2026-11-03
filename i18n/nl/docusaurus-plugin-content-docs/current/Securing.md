---
id: Securing
title: Securing your gateway
description: How to keep EMS-ESP safe on your network, use it remotely without port forwarding, and protect MQTT, passwords and API access
---

# Je gateway beveiligen

EMS-ESP kan instellingen van je verwarmingssysteem wijzigen, dus behandel het als elk ander apparaat waarmee je je huis bedient. Het grootste deel van de webinterface, de API, MQTT en Telnet is niet versleuteld, dus het netwerk waarop ze draaien is van belang. Op deze pagina wordt uitgelegd hoe je dit veilig kunt instellen.

## Houd het van het internet af

Stuur nooit poorten door vanaf je router naar EMS-ESP, of het nu gaat om poort 80 (webinterface en API), 23 (telnet), 502 (Modbus) of welke andere poort dan ook. Iedereen op het internet zou het systeem dan kunnen bereiken, en de verbinding is niet versleuteld.

Als je EMS-ESP wilt gebruiken terwijl je niet thuis bent, gebruik dan in plaats daarvan een van de volgende opties:

- **Een VPN-verbinding met je thuisnetwerk.** Dit is de eenvoudigste en veiligste manier. Veel routers hebben er een ingebouwd (bijvoorbeeld een FRITZ!Box of UniFi-gateway), of maak gebruik van [WireGuard](https://www.wireguard.com/) of [Tailscale](https://tailscale.com/). Je telefoon of laptop maakt dan verbinding alsof hij thuis is.
- **Home Assistant.** Als je Home Assistant gebruikt in combinatie met [Home Assistant Cloud](https://www.nabucasa.com/) of je eigen beveiligde toegang op afstand, bedien EMS-ESP dan via Home Assistant in plaats van het apparaat zelf te openen.
- **Een reverse proxy met HTTPS.** Een proxy zoals [Caddy](https://caddyserver.com/), [Nginx Proxy Manager](https://nginxproxymanager.com/) of Traefik geeft je een `https://`-adres met een echt certificaat en stuurt dit door naar EMS-ESP op je netwerk. Voeg de hostnaam van de proxy toe onder **Instellingen > Netwerk > Toegestane hostnamen**, anders weigert EMS-ESP de verzoeken. Beveilig de proxy ook met een eigen login en houd de proxysoftware up-to-date.

## Zet het op een eigen netwerk

Als je router dit ondersteunt, plaats EMS-ESP dan op een apart netwerk voor slimme apparaten (een VLAN of een guest/IoT wifi-netwerk), apart van je computers en telefoons.

Sta dan alleen toe wat nodig is:

- Vanaf je computer of telefoon, en vanuit Home Assistant of andere integraties, naar EMS-ESP op poort 80. Voeg poort 502 toe als je Modbus gebruikt, en poort 23 alleen als je telnet gebruikt.
- Van EMS-ESP naar je MQTT-broker (1883, of 8883 met TLS), je NTP-server en je syslog-server, als je die gebruikt.
- Van EMS-ESP naar het internet via HTTPS (443), alleen als je wilt dat de webinterface de versie controleert en updates uit de versielijst installeert. Blokkeer de verbinding anders en upload in plaats daarvan de firmwarebestanden.

## Wachtwoorden en accounts

- Geef de beheerdersgebruiker een sterk wachtwoord dat je nergens anders gebruikt. Vanaf 3.10.0 moeten de standaardwachtwoorden worden gewijzigd voordat de webinterface kan worden gebruikt.
- Als er geen wifi-netwerk is ingesteld, start EMS-ESP zijn eigen toegangspunt. Geef dit ook een eigen wachtwoord.
- Maak alleen de gebruikers aan die je nodig hebt. Een gastgebruiker kan waarden bekijken, maar geen instellingen wijzigen.
- Integraties zoals Home Assistant, Node-RED of scripts moeten een **API-sleutel** gebruiken (**Instellingen > Beveiliging > API-sleutels**), en niet het wachtwoord van een gebruiker. Gebruik een „Lezen“-sleutel wanneer de integratie alleen waarden leest, en een „Lezen en schrijven“-sleutel alleen wanneer deze gegevens moet wijzigen. Trek sleutels in die u niet meer gebruikt.
- Een **systeemback-up** waarbij het vakje "Wachtwoorden en sleutels opnemen" is aangevinkt, bevat alle wachtwoorden. Bewaar deze op een veilige plek, of laat de optie uitgeschakeld.

## Schakel uit wat je niet gebruikt

Op de instellingenpagina's:

- **Telnet** is standaard uitgeschakeld vanaf 3.10.0. Laat het uitgeschakeld, tenzij je het nodig hebt, want Telnet is niet versleuteld.
- **API-aanroepen zonder toegangstoken toestaan** geeft iedereen op uw netwerk gastrechten. Gebruik in plaats daarvan API-sleutels.
- **CORS** is alleen nodig wanneer een webpagina op een ander adres de API aanroept. Als je dit inschakelt, moet je het exacte adres van die pagina opgeven, niet `*`.
- **Modbus** en **Syslog**, als je die niet gebruikt.
- In de **alleen-lezen-modus** stuurt EMS-ESP geen wijzigingen naar uw verwarmingssysteem. Gebruik deze modus als u alleen waarden wilt aflezen.

## MQTT

- Gebruik een gebruikersnaam en wachtwoord voor je MQTT-broker en geef EMS-ESP een eigen account.
- Als je broker TLS ondersteunt, schakel dan **TLS** in de MQTT-instellingen in (meestal poort 8883) en kies hoe EMS-ESP de broker controleert:
  - **CA-certificaat**: plak het certificaat van de certificeringsinstantie die het certificaat van de broker heeft ondertekend, als tekst (PEM). Gebruik dit voor certificaten van Let's Encrypt of je eigen certificeringsinstantie.
  - **Certificaatvingerafdruk**: de SHA-1-vingerafdruk van het eigen certificaat van de broker. Gebruik dit voor een zelfondertekend certificaat. Je kunt deze uitlezen met:

    ```bash
    openssl s_client -connect <broker>:8883 </dev/null 2>/dev/null | openssl x509 -noout -fingerprint -sha1
    ```

    Zodra de broker een nieuw certificaat ontvangt, moet je de vingerafdruk bijwerken.
  - **Niets, niet aangevinkt**: de verbinding is versleuteld, maar EMS-ESP controleert niet of er daadwerkelijk verbinding is met je broker. Op de pagina met MQTT-instellingen en in het logboek wordt hierover gewaarschuwd.
- Alles wat berichten kan versturen naar de MQTT-onderwerpen van EMS-ESP, kan je verwarmingsinstellingen wijzigen. Gebruik de toegangsbeheerlijsten van de broker om te beperken wie er berichten naar deze onderwerpen mag versturen.

## Firmware

- Installeer officiële builds via de [EMS-ESP releases](https://github.com/emsesp/EMS-ESP32/releases), via de versielijst in de webinterface of met de [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher). Op de pagina ‘Versie’ wordt bij deze builds ‘Officiële build’ weergegeven.
- Klik bij een aangepaste versie alleen op "Toch installeren" als je zeker weet dat de bron betrouwbaar is. Zie [Official and custom builds](FAQ#standaard--en-aangepaste-configuraties).
- Houd EMS-ESP up-to-date, want beveiligingsupdates worden in nieuwe versies uitgebracht.

## Fysieke toegang

Iedereen die bij de USB-poort van de gateway kan komen, kan de flashgeheugenlezen, andere firmware installeren of de seriële console gebruiken. De gateways worden geleverd zonder beveiligde opstartprocedure of flashversleuteling, zodat je altijd elke gewenste firmware kunt installeren. Bewaar de gateway op een plek waar anderen er niet gemakkelijk bij kunnen.

Voordat je een gateway verkoopt of weggeeft, moet je deze terugzetten naar de fabrieksinstellingen (via ‘Factory Reset’ op de versiepagina, met het `system/format`-commando of door de knop lang ingedrukt te houden). Vanaf 3.10.0 worden hiermee alle instellingen, inclusief wachtwoorden en sleutels, uit het flashgeheugen gewist.

## Een beveiligingsprobleem melden

Als je denkt dat je een beveiligingsprobleem in EMS-ESP hebt ontdekt, maak dan alsjeblieft geen openbare issue aan. Meld het privé op GitHub met [Report a vulnerability](https://github.com/emsesp/EMS-ESP32/security/advisories/new), of gebruik de [Contact Form](https://emsesp.org/About/#-contact). In [SECURITY.md](https://github.com/emsesp/EMS-ESP32/blob/dev/SECURITY.md) wordt uitgelegd wat je moet vermelden, welke versies beveiligingsupdates krijgen en hoe deze updates worden gepubliceerd.
