---
id: Commands
---
# Commands

EMS-ESP heeft een commando-API die gebruikt kan worden om waarden te lezen en te schrijven naar het EMS-apparaat en om specifieke commando's op te roepen.

Er zijn 3 methoden waarop commando's kunnen worden aangeroepen:

- via de [**Console**](#console) met Telnet of Serieel
- via [**HTTP**](#http) met behulp van RESTful API-aanroepen
- via [**MQTT**](#mqtt) via onderwerpen en hun payloads

## Definities

:::info
Belangrijke definities
    - `<device>` is de korte naam. Deze kan zijn:
    - een EMS-apparaat en ondersteunde apparaten zijn onder andere: `boiler` `thermostat` `mixer` `heatpump` `solar` `gateway` `switch` `controller` `pump` `generic` `heatsource` `ventilation`
        *de EMS-ESP-systeem zelf geïdentificeerd als `system`
        * de Dallas-temperatuursensoren als `temperaturesensor`
        *eventuele aangepaste analoge sensoren als `analogsensor`
        * eventuele aangepaste EMS-telegramentiteiten als `custom`
    - `<command>` is de naam van *een algemene opdracht of* een EMS-apparaatentiteit waarnaar ook wordt verwezen als een `<entity>`. Zie de pagina [Supported Devices](All-Entities) voor de volledige lijst
    - `<id>` is een optionele identificatie en heeft verschillende betekenissen afhankelijk van de context
    - `<data>` wordt gebruikt om de te lezen of te schrijven waarde weer te geven. Het kan een enkele waarde zijn van elk type (geheel getal, zweven, tekenreeks of booleaans) of een JSON-object {} tekenreeks die meerdere key/values paren bevat zoals:

        * **"cmd"** is de `<command>`. De sleutel **"cmd"** kan ook worden vervangen door **"entity"**. * **"value"** is de waarde en kan een tekststring tussen aanhalingstekens, een geheel getal, een float of een booleaans zijn. **"data"** is een alias die ook kan worden gebruikt in plaats van de sleutel. * **"hc"**, **"wwc"** en **"id"** worden allemaal gebruikt om een waarde weer te geven of in de context van een EMS-apparaat een verwarmings- of warmwatercircuit.

    - Een booleaanse waarde kan in vele vormen worden weergegeven:

        * als een True waarde, "TRUE", "ja", true, "true", "aan", 1 * als een False waarde, "FALSE", "nee", false, "false", "uit", 0

    - Het bearer Access Token (JWT) wordt gebruikt om HTTP-verzoeken te verifiëren en kan worden verkregen via de `Settings->Security->Manage Users` pagina van de WebUI en vervolgens te klikken op het sleutelpictogram voor de gebruiker die beheerdersrechten heeft (`is Admin` ingesteld). Het token wordt gegenereerd met behulp van een combinatie van de gebruikersnaam en een geheime sleutel die het supergebruikerswachtwoord (su) is dat te vinden is op de pagina `Settings->Security->Security Settings` van de WebUI. Deze 152 tekens lange string moet worden opgenomen in de HTTP-header als `"Authorization: Bearer {ACCESS_TOKEN}"`. Het token heeft geen vervaldatum.

:::

## Console

- Commando's kunnen worden uitgevoerd met het commando `call`
- Je moet admin zijn om het commando `call` te gebruiken. Eerst `su` en voer het wachtwoord in
- Voor een lijst met alle beschikbare commando's kun je `show commands` gebruiken
- De syntaxis is `call <device> <command> [data] [id]`
- Gebruik `call <device> commands` voor een volledige lijst met commando's

Zie de sectie [**Console**](Console) voor meer informatie over het gebruik van de Telnet Console.

## HTTP

Dingen om op te merken:

- De REST API volgt de [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification)
- Het URL-pad begint altijd met `http://<hostname>/api/`
- `<hostname>` is ofwel een IP-adres of de mDNS-naam, die standaard `ems-esp.local` is
- Sommige commando's vereisen beveiligingsauthenticatie, tenzij deze is uitgeschakeld via een EMS-ESP-instelling. De authenticatie is in de vorm van een Access Token die wordt gegenereerd via de WebUI's Security->Manage Users en dan te klikken op de key knop voor de admin gebruiker. De 152 tekens lange string moet worden opgenomen in de HTTP-header zoals `"Authorization: Bearer {ACCESS_TOKEN}"`. De tokens hebben geen vervaldatum
- Bij HTTP POST-commando's kan een HTTP-body nodig zijn. Dit kan zijn in de vorm van platte tekst of als een JSON-object `<data>`, de Content-Type-header moet in beide gevallen worden ingesteld op `application/json`.
- HTTPS met zelfondertekende certificaten worden nog niet ondersteund
- Gebruik `http://<hostname>/api/<device>/commands` voor een volledige lijst met commando's
- het gebruik van GET-commando's in ems-esp v2-api-stijl wordt nog steeds ondersteund (`http://<hostname>/api?device=<device>&id=<id>&cmd=<cmd>`)

### EMS-apparaatinformatie lezen en schrijven

Het URL-pad is `http://<hostname>/api/<device>/`

| `endpoint` | `HTTP method` | `action` | `authentication required?` | `post body` |
| --------------- | ----------- | ------------------------------------------------------------------ | ------------------------ | --------- |
| Voer de huidige informatie over het EMS-apparaat uit in verbose
| `values` | `GET` | voert huidige EMS-apparaatinformatie in kort formaat uit | no | |
| *(leeg)* | `GET` | hetzelfde als `values` hierboven | no | |
| `commands` | `GET` | somt de beschikbare commando-entiteiten op om op te roepen | no | |
| `entities` | `GET` | somt alle ingeschakelde entiteiten op | no | |
| `{entity}` | `GET` | voert details van een specifieke entiteit uit, om te lezen | no | |
| `{entity}/{hc}` `GET` Hetzelfde als de bovenstaande leesopdracht, maar dan voor een specifiek verwarmingscircuit
| `{entity}` | `POST` | werkt een entiteitswaarde bij, om te schrijven | ja | `<data>` |
| `{entity}/{hc}` | `POST` | hetzelfde als de bovenstaande schrijfopdracht, maar dan voor een specifiek verwarmingscircuit | ja | `<data>` |

Voorbeelden:

| URL | berichttekst | actie |
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `http://ems-esp.local/api/thermostat/seltemp` | `22` | stelt de geselecteerde ruimtetemperatuur van de hoofdthermostaat in op verwarmingscircuit 1 |
| `http://ems-esp.local/api/thermostat/hc2/seltemp` | `{"data":22}` | stelt de geselecteerde ruimtetemperatuur van de hoofdthermostaat in op verwarmingscircuit 2 |
| `http://ems-esp.local/api/thermostat/mode` | `'auto'` | zet de thermostaatmodus op auto voor verwarmingscircuit 1 |
| `http://ems-esp.local/api/thermostat` | `{"cmd":"mode", "data":"auto"}` | zet de thermostaatmodus op auto voor verwarmingscircuit 1 |
| `http://ems-esp.local/api/thermostat` | `{"cmd":"seltemp", "data":23, "hc":3}` | stelt de geselecteerde kamertemperatuur in op 23 graden voor verwarmingscircuit 3 |
| `http://ems-esp.local/api/thermostat/hc2` | `{"cmd":"seltemp", "data":20.5}` | stelt de geselecteerde kamertemperatuur in op 20,5 graden voor verwarmingscircuit 2 |
| `http://ems-esp.local/api` | `{"device":"thermostat", cmd":"seltemp", "data":23, "hc":3}` | stelt de geselecteerde ruimtetemperatuur van de hoofdthermostaat in op verwarmingscircuit 3 |

### Aangepaste entiteiten ophalen en schrijven

Het URL-pad is `http://<hostname>/api/custom/`

| Eindpunt: HTTP-methode: actie: Verificatie vereist? | post body |
| -------------------- | ----------- | -------------------------------------------------------- | ------------------------ | --------- |
| Leeg of `info` `GET` voert alle aangepaste entiteiten en hun waarden uit
| `commands` | `GET` | geeft een lijst weer van de beschikbare aangepaste entiteitcommando's | no | |
| `<name>` | `GET` | voert alle kenmerken uit voor een specifieke aangepaste entiteit | no | |
| `<name>/<attribute>` | `GET` | uitvoer voor een kenmerk van een specifieke aangepaste entiteit | no | |
| `<name>` | `POST` | werkt een aangepaste entiteitswaarde bij, om te schrijven | ja | `<data>` |

### Informatie over temperatuursensor ophalen

Het URL-pad is `http://<hostname>/api/temperaturesensor/`

| Eindpunt | HTTP-methode | Actie | Verificatie vereist? | post body |
| -------------- | ----------- | --------------------------------------------------------------- | ------------------------ | --------- |
| Uitgangen aangesloten Dallas temperatuursensor namen en waarden | no |
| `info` | `GET` | voert alle details uit over de aangesloten Dallas temperatuursensoren | no | |
| `<name>` | `GET` | voert alle kenmerken uit voor een specifieke temperatuursensor | no | |
| `<name>/value` | `GET` | voert de waarde van een specifieke temperatuursensor uit | no | |

### De analoge sensoren besturen

Het URL-pad is `http://<hostname>/api/analogsensor/`

| Eindpunt | HTTP-methode | Actie | Verificatie vereist? | post body |
| ---------- | ----------- | ------------------------------------------------------------------ | ------------------------ | ------------------------------ |
| Voert analoge sensoren en hun meetwaarden uit
| `info` | `GET` | voert alle details uit over de aangesloten analoge sensoren | no | |
| `<name>` | `GET` | voert alle kenmerken uit voor een specifieke analoge sensor | no | |
| `commands` | `GET` | toont de beschikbare systeemcommando's | no | |
| `setvalue` | `POST` | stel value/offset van teller of uitgangspen in, +/- teken corrigeert waarde | ja | | `{"value":<val>, "id":<gpio>}` |
| `<name>` | `POST` | stel value/offset van teller of uitgangspen in, +/- teken corrigeert waarde | ja | | `{"value":<val>}` |

### Systeemopdrachten

Het URL-pad is `http://<hostname>/api/system/<endpoint>`

| Eindpunt | HTTP-methode | Actie | Verificatie vereist? | post body |
| ------------------------ | ----------- | ------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------ |
| `info` of leeg | `GET` | voert huidige systeeminformatie uit | no | |
| `fetch` | `GET` | forceert bij het vernieuwen van alle apparaatwaarden | no | | |
| `restart` | `GET` | herstart EMS-ESP | ja | | |
| `format` `GET` EMS-ESP in de fabriek gereset | ja | |
| `commands` | `GET` | toont de beschikbare systeemcommando's | no | |
| `send` | `POST` | telegram naar de EMS-bus sturen | ja | | `"XX XX...XX"` |
| `message` | `POST` | een bericht naar het logboek en MQTT sturen. Het bericht kan ook een logisch commando zijn zoals gebruikt in de Scheduler | ja | `".."` of `'{"value":"system/settings/locale"}'` |
| `publish` | `POST` | MQTT publiceert alle waarden en optionele HA-configuratie of specifiek voor een apparaat | no | `[ha] \| [device]` |
| `watch` | `POST` | inkomende telegrammen bekijken | no | `<on \|off \| raw \| <type-id(hex)>` |
| `values` | `GET` | voert alle waarden in kort formaat uit | no | |
| `read` | `GET` | vraagt een specifiek EMS-apparaat en een typeID | ja | `<deviceID> <type ID> [offset] [length]` | op
| `response` | `GET` | voert het laatste antwoord van EMS-ESP uit | no | |
| `entities` | `GET` | somt alle ingeschakelde entiteiten op | no | |
| `mqtt/enabled` | `GET` | enable/disable MQTT | ja | `<bool>` |
| `ap/enabled` | `GET` | enable/disable Toegangspunt | ja | `<bool>` |
| `settings/analogenabled` | `GET` | enable/disable analoge sensor | ja | `<bool>` |
| `settings/hideled` | `GET` | enable/disable LED | ja | `<bool>` |
| `settings/showeralert` | `GET` | enable/disable douche waarschuwing | ja | `<bool>` |
| `settings/showertimer` | `GET` | enable/disable douchetimer | ja | `<bool>` |
| `syslog/enabled` | `GET` | enable/disable syslog | ja | `<bool>` |

### Voorbeelden

:::tip
Opmerking In deze voorbeelden is de URL `http://ems-esp.local/api/`, maar pas deze aan naar je eigen hostnaam. Wijzig ook het toegangstoken voor de drager in je eigen token zoals beschreven in de sectie [Definities](#definities).
:::

#### ...via de opdrachtregel

```bash
# Most GETs do not need authentication
% curl http://ems-esp.local/api/thermostat/seltemp

# POSTs (with -d) need authentication tokens
% curl http://ems-esp.local/api/thermostat/seltemp \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsInZlcnNpb24iOiIzLjEuMWIwIn0.qeGT53Aom4rDYeIT1Pr4BSMdeWyf4_zN9ue2c51ZnM0' \
  -d '{ "value" : 22.5 }'

# GET with authentication using query parameter with token
% curl http://ems-esp.local/api/system/publish\?access_token\="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsInZlcnNpb24iOiIzLjEuMWIwIn0.qeGT53Aom4rDYeIT1Pr4BSMdeWyf4_zN9ue2c51ZnM0"

# GET to restart EMS-ESP
curl http://ems-esp.local/api/system/restart -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsInZlcnNpb24iOiIzLjEuMWIwIn0.qeGT53Aom4rDYeIT1Pr4BSMdeWyf4_zN9ue2c51ZnM0'

# This example will get the system info, via a GET request
curl -X GET ${emsesp_url}/api/system/info

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
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsInZlcnNpb24iOiIzLjEuMWIwIn0.qeGT53Aom4rDYeIT1Pr4BSMdeWyf4_zN9ue2c51ZnM0"
body = json.dumps({ "value": 22.5 })
headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }

response = requests.post(url, headers=headers, data=body, verify=False)

print(response.json())
```

## MQTT

MQTT gebruikt hetzelfde formaat als de API, maar met een paar verschillen. Voor het **onderwerp** wordt de `<hostname>` vervangen door de MQTT Basisnaam zoals gedefinieerd in de Instellingen (standaard is `ems-esp`). De `<device>` volgt dezelfde namen als bovenaan deze pagina. Bijvoorbeeld `ems-esp/thermostat/<entity>` of `ems-esp/custom/<name>`.

De MQTT **payload** is hetzelfde als de `<data>` zoals hierboven beschreven en gebruikt in de API, en kan een JSON object of een string zijn.

Voorbeelden:

| onderwerp | lading | actie |
| ------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| `ems-esp/system/send` | `XX XX...XX` | onbewerkt ems-commando verzenden |
| Haalt de waarden van de seltemp-entiteit op en publiceert deze in het onderwerp `ems-esp/response` |
| Verander de geselecteerde insteltemperatuur naar 23 graden op de hoofdthermostaat op hc1
| `ems-esp/thermostat/mode` | `auto` | zet de thermostaatmodus op auto voor hc1 |
| `ems-esp/thermostat` | `{"cmd":"mode","value":"heat","id":1}` | zet de thermostaatmodus op verwarmen voor hc1 |
| `ems-esp/custom/myCustomEntity` | `7` | stelt de waarde van de EMS-ESP Custom Entity met de naam `myCustomEntity` in op 7 |

### Publicatieopdrachten

EMS-ESP zal MQTT 'abonneren' op specifieke onderwerpen, afhankelijk van de aangesloten EMS-apparaten. Bijvoorbeeld `boiler`, `thermostat` enz.

Commando's kunnen naar EMS-ESP gestuurd worden via deze MQTT topics door gebruik te maken van het payload formaat:

```json
{"cmd":"<cmd>", "data":<data>, "id":<n>}
```

waarbij

- `cmd` is een van de commando's die in de [Commands](Commands) staan en ***moet*** tussen aanhalingstekens staan als een String. De sleutel `entity` mag ook worden gebruikt in plaats van `cmd`.
- `data` (of `value`) bevat de waarde voor het commando en kan een String of numerieke waarde zijn.
- `id` wordt gebruikt als algemene indicator. `hc`, `wwc`, `ahs` en `hs` zijn andere ondersteunde aliassen. Bijvoorbeeld met `hc` wordt een specifiek verwarmingscircuit aangegeven. Er kan zowel een numerieke waarde als een tekenreeks worden gebruikt.

Nog een paar voorbeelden:

| onderwerp | lading | actie |
| --------------------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| `ems-esp/boiler` | `{"cmd":"heatingactivated", "data":"on"}` | verwarming ingeschakeld in ketel |
| `ems-esp/boiler/heatingactivated` | `{"data":"on"}` | DHW desinfecteren in boiler inschakelen (gelijk aan bovenstaande opdracht) |
| `ems-esp/boiler` | `{"cmd":"dhw.disinfecting", "data":"on"}` | DHW desinfecteren in boiler inschakelen |

Je kunt in Status - System Log controleren of de opdracht door EMS-ESP is geaccepteerd.

Het eerste commando in de bovenstaande tabel was geldig en werd dus geaccepteerd:`ems-esp/boiler` Command/payload: `{"cmd":"heatingactivated", "data":"on"}`

```
[command] Called command boiler/heatingactivated (heating activated) with value on
```

En het volgende valse commando wordt niet geaccepteerd:`ems-esp/boiler` Command/payload: `{"cmd":"heatingactivated", "data":"5000"}`

```
[command] Command failed: no values in boiler
[mqtt] MQTT command failed with error no values in boiler (Error)
```

:::note
Je kunt de MQTT-commando's eenvoudig testen met [MQTT Explorer](https://www.mqtt-explorer.com). Maak gewoon verbinding met de MQTT broker en publiceer de payload naar het onderwerp.
:::

Met Home Assistant kunnen thermostaatcommando's ook worden verzonden om individuele verwarmingscircuits te regelen via het verzenden van een modustring of temperatuurnummer naar een onderwerp `thermostat_hc<n>`.

Afhankelijk van de mqtt-instellingen zijn er ook directe abonnementen voor elke waarde zoals `boiler/wwtemp`, `thermostat/hc1/daytemp`, enz. Thermostaten die slechts één verwarmingscircuit ondersteunen, abonneren zich op `/thermostat/daytemp`.

Je kunt MQTT ook gebruiken om een specifiek leesverzoek te sturen en het telegramantwoord wordt teruggestuurd in een topic met de naam `response`. Als je bijvoorbeeld de payload `{"cmd":"send", "data":"0B 88 19 19 02"}` naar `ems-esp/system` stuurt, wordt er een topic `response` gepubliceerd met de gegevens `{"src":"08","dest":"0B","type":"19","offset":"19","data":"7D 00","value":32000}`.
