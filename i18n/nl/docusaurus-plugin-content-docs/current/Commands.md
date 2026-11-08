---
id: Commands
title: Commands and API Reference
description: Complete command reference for controlling EMS-ESP via Console, MQTT, and REST API
---

# Commando's

EMS-ESP beschikt over een commando-API waarmee waarden van het EMS-apparaat kunnen worden gelezen en er waarden naar kunnen worden geschreven, en waarmee specifieke commando’s kunnen worden uitgevoerd.

Er zijn 3 manieren waarop commando’s kunnen worden uitgevoerd:

- via de [**Console**](#console) via Telnet of een seriële verbinding
- via [**HTTP**](#http) met behulp van RESTful API-aanroepen
- via [**MQTT**](#mqtt) via onderwerpen en hun inhoud

## Definities

:::info[Belangrijke definities]

- `<device>` is de korte naam. Dit kan het volgende zijn:
  - een EMS-apparaat en ondersteunde apparaten zijn onder meer: `boiler` `thermostat` `mixer` `heatpump` `solar` `gateway` `switch` `controller` `pump` `generic` `heatsource` `ventilation`
    - het EMS-ESP-systeem zelf, geïdentificeerd als `system`
    - de temperatuursensoren van Dallas als `temperaturesensor`
    - eventuele aangepaste analoge sensoren als `analogsensor`
    - alle aangepaste entiteiten van EMS-telegrammen als `custom`
  - `<command>` is de naam van ofwel
    - een algemeen commando, of
    - een EMS-apparaatentiteit, ook wel aangeduid als `<entity>`. Zie de [Supported Devices](All-Entities)-pagina voor de volledige lijst
  - `<id>` is een optionele identificatie en heeft verschillende betekenissen, afhankelijk van de context
  - `<data>` wordt gebruikt om de waarde weer te geven die moet worden gelezen of geschreven. Dit kan een afzonderlijke waarde van elk type zijn (geheel getal, drijvende-kommagetal, tekenreeks of booleaanse waarde) of een JSON-object {} in de vorm van een tekenreeks die meerdere key/values-paren bevat, zoals:
    - **"cmd"** is de `<command>`. De sleutel **"cmd"** kan ook worden vervangen door **"entity"**.
    - **"value"** is de waarde en kan bestaan uit een tekstreeks tussen aanhalingstekens, een geheel getal, een drijvende-kommagetal of een booleaanse waarde. **"data"** is een alias die ook in plaats van de sleutel kan worden gebruikt.
    - **"hc"**, **"wwc"** en **"id"** worden allemaal gebruikt om een waarde aan te duiden of, in de context van een EMS-apparaat, een verwarmings- of warmwatercircuit.

  - Een booleaanse waarde kan op verschillende manieren worden weergegeven:
    - als een True-waarde: "TRUE", "yes", true, "true", "on", 1
    - als een 'False'-waarde: "FALSE", "no", false, "false", "off", 0

  - De API-sleutel dient voor de authenticatie van HTTP-verzoeken. Maak er een aan op de `Settings->Security->API Keys`-pagina van de WebUI: met een "Read"-sleutel kun je waarden lezen en commando’s uitvoeren die gasten ook mogen uitvoeren; met een "Read and Write"-sleutel kun je bovendien waarden en instellingen wijzigen. Verzend deze in de HTTP-header als `"Authorization: Bearer {API_KEY}"`. Vanaf 3.10.0 is deze vereist voor elke aanroep naar `/api`, inclusief leesverzoeken.

:::

## Console

- Commando's kunnen worden uitgevoerd met behulp van het `call`-commando
- Je moet beheerder zijn om het commando `call` te kunnen gebruiken. Voer eerst `su` in en voer vervolgens het wachtwoord in
- Voor een overzicht van alle beschikbare opdrachten kun je `show commands` gebruiken
- De syntaxis is `call <device> <command> [data] [id]`
- Gebruik `call <device> commands` voor een volledige lijst met opdrachten

Raadpleeg het gedeelte [**Console**](Console) voor meer informatie over het gebruik van de Telnet-console.

## HTTP

Belangrijke punten:

- De REST-API volgt de [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification)
- Het URL-pad begint altijd met `http://<hostname>/api/`
- `<hostname>` is ofwel een IP-adres ofwel de mDNS-naam; de standaardwaarde is `ems-esp.local`
- Voor elke aanroep is een API-sleutel nodig, die je kunt aanmaken in de WebUI onder Beveiliging -> API-sleutels, en die in de HTTP-header moet worden opgenomen, bijvoorbeeld als `"Authorization: Bearer {API_KEY}"`. Aanroepen zonder deze sleutel krijgen een HTTP 401-foutmelding. Voor het wijzigen van waarden of instellingen is een sleutel met "Lees- en schrijfrechten" vereist.
- Om een waarde in een browser te bekijken, open je het adres ervan, bijvoorbeeld `http://ems-esp.local/api/boiler/curflowtemp`, en log je in met je EMS-ESP-gebruikersnaam en wachtwoord wanneer de browser daarom vraagt. Hiermee kun je alleen waarden inzien, ook voor beheerders. Tools die alleen een gebruikersnaam en wachtwoord ondersteunen, kunnen een API-sleutel als wachtwoord gebruiken, in combinatie met een willekeurige gebruikersnaam, bijvoorbeeld `http://user:emsesp_...@ems-esp.local/api/boiler`. De sleutel behoudt daar zijn rechten, behalve in een browser, waar deze alleen leest
- Bij HTTP POST-commando's kan een HTTP-body vereist zijn. Deze kan de vorm aannemen van platte tekst of een JSON-object `<data>`; in beide gevallen moet de Content-Type-header worden ingesteld op `application/json`.
- HTTPS met zelfondertekende certificaten wordt nog niet ondersteund
- Gebruik `http://<hostname>/api/<device>/commands` voor een volledige lijst met opdrachten
- het gebruik van GET-commando's in de stijl van de ems-esp v2-api wordt nog steeds ondersteund (`http://<hostname>/api?device=<device>&id=<id>&cmd=<cmd>`)

### Informatie over EMS-apparaten lezen en schrijven

Het URL-pad is `http://<hostname>/api/<device>/`

| `endpoint` | `HTTP method` | `action` | `authentication required?` | `post body` |
| --------------- | ------------- | ------------------------------------------------------------------ | -------------------------- | ----------- |
| `info` | `GET` | geeft gedetailleerde informatie over het huidige EMS-apparaat weer | nee | |
| `values` | `GET` | geeft de huidige EMS-apparaatgegevens weer in beknopte vorm | nee | |
| _(empty)_ | `GET` | hetzelfde als `values` hierboven | nee | |
| `commands` | `GET` | geeft een overzicht van de beschikbare opdrachtentiteiten die kunnen worden aangeroepen | nee | |
| `entities` | `GET` | geeft een overzicht van alle ingeschakelde entiteiten | nee | |
| `{entity}` | `GET` | geeft details weer van een specifieke entiteit, ter informatie | nee | |
| `{entity}/{hc}` | `GET` | hetzelfde als het bovenstaande ‘read’-commando, maar dan voor een specifiek verwarmingscircuit  | nee | |
| `{entity}` | `POST` | werkt de waarde van een entiteit bij, voor het schrijven | ja | `<data>`    |
| `{entity}/{hc}` | `POST` | hetzelfde als het bovenstaande ‘write’-commando, maar dan voor een specifiek verwarmingscircuit | ja | `<data>`    |

Voorbeelden:

| URL | berichttekst | actie |
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `http://ems-esp.local/api/thermostat/seltemp`     | `22` | stelt de geselecteerde kamertemperatuur van de hoofdthermostaat op verwarmingscircuit 1 in |
| `http://ems-esp.local/api/thermostat/hc2/seltemp` | `{"data":22}` | stelt de geselecteerde kamertemperatuur van de hoofdthermostaat op verwarmingscircuit 2 in |
| `http://ems-esp.local/api/thermostat/mode` | `'auto'` | stelt de thermostaatmodus voor verwarmingscircuit 1 in op 'auto' |
| `http://ems-esp.local/api/thermostat` | `{"cmd":"mode", "data":"auto"}` | stelt de thermostaatmodus voor verwarmingscircuit 1 in op 'auto' |
| `http://ems-esp.local/api/thermostat` | `{"cmd":"seltemp", "data":23, "hc":3}` | stelt de geselecteerde kamertemperatuur in op 23 graden voor verwarmingscircuit 3 |
| `http://ems-esp.local/api/thermostat/hc2` | `{"cmd":"seltemp", "data":20.5}` | stelt de geselecteerde kamertemperatuur in op 20,5 graden voor verwarmingscircuit 2 |
| `http://ems-esp.local/api` | `{"device":"thermostat", "cmd":"seltemp", "data":23, "hc":3}` | stelt de geselecteerde kamertemperatuur van de hoofdthermostaat op verwarmingscircuit 3 in |

### Gegevens ophalen uit en opslaan in aangepaste entiteiten

Het URL-pad is `http://<hostname>/api/custom/`

| eindpunt | HTTP-methode | actie | authenticatie vereist? | post-body |
| -------------------- | ----------- | -------------------------------------------------------- | ------------------------ | --------- |
| leeg of `info` | `GET` | geeft alle aangepaste entiteiten en hun waarden weer | nee | |
| `commands` | `GET` | geeft een overzicht van de beschikbare commando's voor aangepaste entiteiten | nee | |
| `<name>` | `GET` | geeft alle kenmerken van een specifieke aangepaste entiteit weer | nee | |
| `<name>/<attribute>` | `GET` | geeft een attribuut van een specifieke aangepaste entiteit weer | nee | |
| `<name>` | `POST` | werkt de waarde van een aangepaste entiteit bij, voor het schrijven | ja | `<data>`  |

### Informatie over de temperatuursensor ophalen

Het URL-pad is `http://<hostname>/api/temperaturesensor/`

| eindpunt | HTTP-methode | actie | authenticatie vereist? | post-body |
| -------------- | ----------- | --------------------------------------------------------------- | ------------------------ | --------- |
| leeg | `GET` | geeft de namen en meetwaarden weer van aangesloten Dallas-temperatuursensoren  | nee | |
| `info` | `GET` | geeft alle gegevens weer van de aangesloten Dallas-temperatuursensoren | nee | |
| `<name>` | `GET` | geeft alle kenmerken van een specifieke temperatuursensor weer  | nee | |
| `<name>/value` | `GET` | geeft de waarde van een specifieke temperatuursensor weer | nee | |

### De analoge sensoren aansturen

Het URL-pad is `http://<hostname>/api/analogsensor/`

| eindpunt   | HTTP-methode | actie | authenticatie vereist? | post-body |
| ---------- | ----------- | ------------------------------------------------------------------ | ------------------------ | ------------------------------ |
| leeg | `GET` | geeft analoge sensoren en hun meetwaarden weer | nee | |
| `info`     | `GET` | geeft alle gegevens van de aangesloten analoge sensoren weer | nee | |
| `<name>`   | `GET` | geeft alle kenmerken van een specifieke analoge sensor weer | nee | |
| `commands` | `GET` | geeft een overzicht van de beschikbare systeemopdrachten | nee | |
| `setvalue` | `POST` | stel value/offset in voor de teller- of uitgangspen; het teken +/- corrigeert de waarde | ja | `{"value":<val>, "id":<gpio>}` |
| `<name>`   | `POST` | stel value/offset in voor de teller- of uitgangspen; het teken +/- corrigeert de waarde | ja | `{"value":<val>}` |

### Systeemopdrachten

Het URL-pad is `http://<hostname>/api/system/<endpoint>`

| eindpunt | HTTP-methode | actie | authenticatie vereist? | post-body |
| ------------------------ | ----------- | ------------------------------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------- |
| `info` `values`of leeg  | `GET` | geeft de huidige systeeminformatie weer | nee | |
| `fetch` | `GET` | dwingt bij het vernieuwen van alle apparaatwaarden | nee | |
| `restart` | `GET` | EMS-ESP opnieuw opstarten | ja | |
| `format` | `GET` | EMS-ESP na fabrieksreset | ja | |
| `commands` | `GET` | geeft een overzicht van de beschikbare systeemopdrachten | nee | |
| `send` | `POST` | een telegram naar de EMS-bus verzenden | ja | `"XX XX...XX"` |
| `message` | `POST` | een bericht naar het logboek en MQTT verzenden. Het bericht kan ook een logische opdracht zijn, zoals gebruikt in de Scheduler | ja | `".."` of `'{"value":"system/settings/locale"}'` |
| `publish` | `POST` | MQTT publiceert alle waarden, en optioneel de HA-configuratie of apparaatspecifieke gegevens | nee | `[ha] \| [device]` |
| `watch` | `POST` | inkomende telegrammen bekijken | nee | `<on \|off \| raw \| <type-id(hex)>` |
| `values` | `GET` | geeft alle waarden weer in beknopte vorm | nee | |
| `read` | `GET` | vraagt informatie op over een specifiek EMS-apparaat en een type-ID | ja | `<deviceID> <type ID> [offset] [length]` |
| `response` | `GET` | geeft het laatste antwoord van EMS-ESP weer | nee | |
| `entities` | `GET` | geeft een overzicht van alle ingeschakelde entiteiten | nee | |
| `sendmail` | `POST` | een e-mail sturen | ja | `{"to":"<email>", "subject":"<subject>", "body":"<body>"}` |
| `txpause` | `POST` | pause/resume de overdracht via de EMS-bus | ja | `<bool>` |
| `led` | `POST` | LED-patroon | ja | `[color]:[pattern]` |
| `mqtt/enabled` | `GET` | enable/disable MQTT | ja | `<bool>` |
| `ap/enabled` | `GET` | enable/disable Toegangspunt | ja | `<bool>` |
| `ntp/enabled` | `GET` | enable/disable NTP | ja | `<bool>` |
| `syslog/enabled` | `GET` | enable/disable Syslog | ja | `<bool>` |
| `settings/analogenabled` | `GET` | enable/disable analoge sensor | ja | `<bool>` |
| `settings/hideled` | `GET` | enable/disable LED | ja | `<bool>` |
| `settings/showeralert`   | `GET` | enable/disable douchewaarschuwing | ja | `<bool>` |
| `settings/showertimer`   | `GET` | enable/disable douchetimer | ja | `<bool>` |

### Voorbeelden

:::tip
In deze voorbeelden is de URL `http://ems-esp.local/api/`, maar pas deze aan aan je eigen hostnaam. Wijzig ook de API-sleutel in je eigen sleutel, zoals beschreven in de paragraaf [Definitions](#definities).
:::

#### ...via de opdrachtregel

```bash
# GETs need an API key too, a "Read" key is enough
% curl http://ems-esp.local/api/thermostat/seltemp -H 'Authorization: Bearer emsesp_...'

# POSTs (with -d) that change a value need a "Read and Write" key
% curl http://ems-esp.local/api/thermostat/seltemp \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer emsesp_...' \
  -d '{ "value" : 22.5 }'

# GET to restart EMS-ESP, needs a "Read and Write" key
curl http://ems-esp.local/api/system/restart -H 'Authorization: Bearer emsesp_...'

# This example will get the system info, via a GET request
curl -X GET -H "Authorization: Bearer ${emsesp_token}" ${emsesp_url}/api/system/info

# This example will execute a read command on product ID 8 and type ID 1
curl -X POST \
    -H "Authorization: Bearer ${emsesp_token}" \
    -H "Content-Type: application/json" \
    -d '{"data":"8 1"}' \
    ${emsesp_url}/api/system/read

# This example will export all values to a json file, including custom entities, sensors and schedules
curl -X POST \
    -H "Authorization: Bearer ${emsesp_token}" \
    -H "Content-Type: application/json" \
    -d '{"action":"export", "param":"allvalues"}' \
    ${emsesp_url}/rest/action

```

#### ...met behulp van een Python-script

```python
import requests
import json

url = "http://ems-esp.local/api/thermostat/temp"
token = "emsesp_..."  # a "Read and Write" API key
body = json.dumps({ "value": 22.5 })
headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }

response = requests.post(url, headers=headers, data=body, verify=False)

print(response.json())
```

## MQTT

MQTT gebruikt hetzelfde formaat als de API, maar met enkele verschillen. Voor het **topic** wordt `<hostname>` vervangen door de MQTT-basenaam zoals gedefinieerd in de instellingen (standaard is `ems-esp`). De `<device>` volgt dezelfde namen als vermeld bovenaan deze pagina. Bijvoorbeeld `ems-esp/thermostat/<entity>` of `ems-esp/custom/<name>`.

De MQTT **payload** is dezelfde als de hierboven beschreven `<data>` die in de API wordt gebruikt, en kan een JSON-object of een tekenreeks zijn.

Wat MQTT kan doen, wordt ingesteld in de MQTT-instellingen onder „Via MQTT ontvangen commando’s“: „Uit, alleen waarden lezen“, „Waarden wijzigen en commando’s uitvoeren“ (de standaardinstelling) of „Alles, ook systeemcommando’s“. `system/...`-commando’s, zoals `system/send` of `system/restart`, vereisen de instelling „Alles“. Een fabrieksreset (`system/format`) en het wissen van de crashdump (`system/coredump`) worden nooit via MQTT geaccepteerd. Publiceer commando's zonder de retain-vlag; bewaarde commando's worden genegeerd.

Voorbeelden:

| onderwerp | inhoud | actie |
| ------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| `ems-esp/system/send` | `XX XX...XX` | een onbewerkt ems-commando verzenden (hiervoor is "Alles, ook systeemcommando's" vereist) |
| `ems-esp/thermostat/seltemp`    | | haalt de waarden van de entiteit seltemp op en publiceert deze in het topic `ems-esp/response`     |
| `ems-esp/thermostat/seltemp`    | `23` | stel de geselecteerde insteltemperatuur op de hoofdthermostaat op hc1 in op 23 graden |
| `ems-esp/thermostat/mode` | `auto` | stelt de thermostaatmodus voor hc1 in op 'auto' |
| `ems-esp/thermostat` | `{"cmd":"mode","value":"heat","id":1}` | stelt de thermostaatmodus voor hc1 in op verwarmen |
| `ems-esp/custom/myCustomEntity` | `7` | stelt de waarde van de EMS-ESP-aangepaste entiteit met de naam `myCustomEntity` in op 7 |

### Opdrachten voor publiceren

EMS-ESP zal via MQTT een ‘subscribe’ uitvoeren op specifieke onderwerpen, afhankelijk van de aangesloten EMS-apparaten. Bijvoorbeeld `boiler`, `thermostat` enz.

Commando's kunnen via deze MQTT-onderwerpen naar EMS-ESP worden verzonden met behulp van het volgende payload-formaat:

```json
{"cmd":"<cmd>", "data":<data>, "id":<n>}
```

waarbij

- `cmd` is een van de commando’s die in [Commands](Commands) worden vermeld en **moet** als tekenreeks tussen aanhalingstekens worden geplaatst. In plaats van `cmd` kan ook de sleutel `entity` worden gebruikt.
- `data` (of `value`) bevat de waarde voor het commando en kan zowel een tekenreeks als een numerieke waarde zijn.
- `id` wordt gebruikt als algemene aanduiding. `hc`, `wwc`, `ahs` en `hs` zijn andere ondersteunde aliassen. Bijvoorbeeld: `hc` wordt gebruikt om een specifiek verwarmingscircuit aan te duiden. Er kan zowel een numerieke waarde als een tekenreeks worden gebruikt.

Nog enkele voorbeelden:

| onderwerp | inhoud | actie |
| --------------------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| `ems-esp/boiler` | `{"cmd":"heatingactivated", "data":"on"}` | verwarming in de ketel inschakelen |
| `ems-esp/boiler/heatingactivated` | `{"data":"on"}` | de desinfectie van warm water in de ketel inschakelen (komt overeen met het bovenstaande commando) |
| `ems-esp/boiler` | `{"cmd":"dhw.disinfecting", "data":"on"}` | de desinfectie van warm water in de ketel inschakelen |

Je kunt in Status - Systeemlogboek controleren of de opdracht door EMS-ESP is geaccepteerd.

Het eerste commando in de bovenstaande tabel was geldig en werd daarom geaccepteerd:\
Onderwerp:`ems-esp/boiler` Command/payload: `{"cmd":"heatingactivated", "data":"on"}`

```
[command] Called command boiler/heatingactivated (heating activated) with value on
```

En de volgende ongeldige opdracht wordt niet geaccepteerd:\
Onderwerp:`ems-esp/boiler` Command/payload: `{"cmd":"heatingactivated", "data":"5000"}`

```
[command] Command failed: no values in boiler
[mqtt] MQTT command failed with error no values in boiler (Error)
```

:::note
Je kunt de MQTT-commando's eenvoudig testen met [MQTT Explorer](https://www.mqtt-explorer.com). Maak gewoon verbinding met de MQTT-broker en publiceer de payload naar het topic.
:::

Met Home Assistant kunnen ook thermostaatopdrachten worden verzonden om afzonderlijke verwarmingscircuits te regelen door een modusreeks of een temperatuurwaarde naar een topic `thermostat_hc<n>` te sturen.

Afhankelijk van de MQTT-instellingen zijn er ook directe abonnementen voor elke waarde, zoals `boiler/wwtemp`, `thermostat/hc1/daytemp`, enz. Thermostaten die slechts één verwarmingscircuit ondersteunen, zullen zich abonneren op `/thermostat/daytemp`.

Je kunt MQTT ook gebruiken om een specifiek leesverzoek te versturen; het Telegram-antwoord wordt dan teruggestuurd in een topic met de naam `response`. Als je bijvoorbeeld de payload `{"cmd":"send", "data":"0B 88 19 19 02"}` naar `ems-esp/system` verstuurt, wordt er een topic `response` gepubliceerd met de gegevens `{"src":"08","dest":"0B","type":"19","offset":"19","data":"7D 00","value":32000}`.
