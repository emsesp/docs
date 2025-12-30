---
id: Commands
---

# Befehle

EMS-ESP verfügt über eine Befehls-API, die zum Lesen und Schreiben von Werten in das EMS-Gerät und zum Aufrufen bestimmter Befehle verwendet werden kann.

Es gibt 3 Methoden, mit denen Befehle aufgerufen werden können:

- über den [**Console**](#konsole) mittels Telnet oder seriell
- über [**HTTP**](#http) mit RESTful-API-Aufrufen
- über [**MQTT**](#mqtt) über Themen und ihre Nutzlasten

## Definitionen

:::info Wichtige Definitionen - `<device>` ist der Kurzname. Er kann entweder sein:

    - ein EMS-Gerät und folgende Geräte werden unterstützt: `boiler` `thermostat` `mixer` `heatpump` `solar` `gateway` `switch` `controller` `pump` `generic` `heatsource` `ventilation` * das EMS-ESP-System selbst als `system` * die Dallas-Temperatursensoren als `temperaturesensor` * alle benutzerdefinierten Analogsensoren als `analogsensor` * alle benutzerdefinierten EMS-Telegramm-Entitäten als `custom`
    - `<command>` ist der Name entweder * eines generischen Befehls oder * einer EMS-Geräteeinheit, die auch als `<entity>` bezeichnet wird. Siehe die Seite [Supported Devices](All-Entities) für die vollständige Liste
    - `<id>` ist ein optionaler Bezeichner und hat je nach Kontext unterschiedliche Bedeutungen
    - `<data>` wird verwendet, um den zu lesenden oder zu schreibenden Wert darzustellen. Es kann entweder ein einzelner Wert beliebigen Typs (Integer, Float, String oder Boolean) oder ein JSON-Objekt {} String mit mehreren key/values-Paaren sein:

        * **"cmd "** ist der `<command>`. Der Schlüssel **"cmd "** kann auch durch **"entity "** ersetzt werden. * **"value "** ist der Wert und kann entweder ein Textstring in Anführungszeichen, eine Ganzzahl, ein Float oder ein Boolean sein. ***"data "** ist ein Alias, der auch anstelle des Schlüssels verwendet werden kann. **"hc "**, **"wwc "** und **"id "** werden alle verwendet, um einen Wert oder im Zusammenhang mit einem EMS-Gerät einen Heiz- oder Warmwasserkreislauf darzustellen.

    - Ein boolescher Wert kann in vielen Formen dargestellt werden:

        * als wahrer Wert, "TRUE", "ja", wahr, "wahr", "ein", 1 * als falscher Wert, "FALSE", "nein", falsch, "falsch", "aus", 0

    - Das Bearer Access Token (JWT) wird zur Authentifizierung von HTTP-Anfragen verwendet und kann von der Seite `Settings->Security->Manage Users` der WebUI abgerufen werden, indem man auf das Schlüsselsymbol für den Benutzer klickt, der über Administratorrechte verfügt (`is Admin`-Set). Das Token wird aus einer Kombination des Benutzernamens und eines geheimen Schlüssels generiert, der dem Superuser-Passwort (su) entspricht, das auf der Seite `Settings->Security->Security Settings` der WebUI zu finden ist. Diese 152 Zeichen lange Zeichenkette muss als `"Authorization: Bearer {ACCESS_TOKEN}"` in den HTTP-Header aufgenommen werden. Beachten Sie, dass das Token kein Verfallsdatum hat.

:::

## Konsole

- Die Befehle können mit dem Befehl `call` ausgeführt werden
- Sie müssen Administrator sein, um den Befehl `call` zu verwenden. Zuerst `su` und geben Sie das Passwort ein
- Für eine Liste aller verfügbaren Befehle können Sie `show commands` verwenden
- Die Syntax lautet `call <device> <command> [data] [id]`
- Für eine vollständige Liste der Befehle verwenden Sie `call <device> commands`

Weitere Informationen über die Verwendung der Telnet-Konsole finden Sie im Abschnitt [**Console**](Console).

## HTTP

Zu beachtende Punkte:

- Die REST-API folgt dem [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification)
- Der URL-Pfad beginnt immer mit `http://<hostname>/api/`
- `<hostname>` ist entweder eine IP-Adresse oder der mDNS-Name, der standardmäßig `ems-esp.local` lautet
- Für einige Befehle ist eine Sicherheitsauthentifizierung erforderlich, sofern sie nicht über eine EMS-ESP-Einstellung deaktiviert wurde. Die Authentifizierung erfolgt in Form eines Zugriffstokens, der über die WebUI unter Sicherheit->Benutzer verwalten und dann durch Anklicken der Schaltfläche "Schlüssel" für den Admin-Benutzer generiert wird. Die 152 Zeichen lange Zeichenfolge muss in den HTTP-Header wie `"Authorization: Bearer {ACCESS_TOKEN}"` aufgenommen werden. Die Token haben kein Verfallsdatum
- Bei HTTP-POST-Befehlen kann ein HTTP-Body erforderlich sein. Dieser kann entweder in Form von einfachem Text oder als JSON-Objekt `<data>` vorliegen, der Content-Type-Header muss in beiden Fällen auf `application/json` gesetzt werden.
- HTTPS mit selbstsignierten Zertifikaten wird noch nicht unterstützt
- Für eine vollständige Liste der Befehle verwenden Sie `http://<hostname>/api/<device>/commands`
- die Verwendung von GET-Befehlen im Stil der ems-esp v2-api wird weiterhin unterstützt (`http://<hostname>/api?device=<device>&id=<id>&cmd=<cmd>`)

### Lesen und Schreiben von EMS-Geräteinformationen

Der URL-Pfad lautet `http://<hostname>/api/<device>/`

| `endpoint` | `HTTP method` | `action` | `authentication required?` | `post body` |
| --------------- | ----------- | ------------------------------------------------------------------ | ------------------------ | --------- |
| `info` | `GET` | gibt aktuelle EMS-Geräteinformationen in ausführlicher Form aus | no | |
| `values` | `GET` | gibt aktuelle EMS-Geräteinformationen im Kurzformat aus | nein | |
| _(leer)_ | `GET` | wie `values` oben | nein | |
| `commands` | `GET` | listet die verfügbaren Befehlsentitäten zum Aufrufen auf | no | |
| `entities` | `GET` | listet alle aktivierten Entitäten auf | nein | |
| `{entity}` | `GET` | gibt Details zu einer bestimmten Einheit aus, zum Lesen | nein | |
| `{entity}/{hc}` | `GET` | wie der Lesebefehl oben, aber für einen bestimmten Heizkreis | nein | |
| `{entity}` | `POST` | aktualisiert einen Entitätswert, zum Schreiben | ja | `<data>` |
| `{entity}/{hc}` | `POST` | wie der Schreibbefehl oben, aber für einen bestimmten Heizkreis | ja | `<data>` |

Beispiele:

| URL | Post Body | Aktion |
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `http://ems-esp.local/api/thermostat/seltemp` | `22` | stellt die gewählte Raumtemperatur des Masterthermostats auf Heizkreis 1 ein |
| `http://ems-esp.local/api/thermostat/hc2/seltemp` | `{"data":22}` | stellt die gewählte Raumtemperatur des Hauptthermostats auf Heizkreis 2 ein |
| `http://ems-esp.local/api/thermostat/mode` | `'auto'` | setzt den Thermostatmodus auf Auto für Heizkreis 1 |
| `http://ems-esp.local/api/thermostat` | `{"cmd":"mode", "data":"auto"}` | setzt den Thermostatmodus auf Auto für Heizkreis 1 |
| `http://ems-esp.local/api/thermostat` | `{"cmd":"seltemp", "data":23, "hc":3}` | setzt die gewählte Raumtemperatur auf 23 Grad für Heizkreis 3 |
| `http://ems-esp.local/api/thermostat/hc2` | `{"cmd":"seltemp", "data":20.5}` | setzt die gewählte Raumtemperatur auf 20,5 Grad für Heizkreis 2 |
| `http://ems-esp.local/api` | `{"device":"thermostat", cmd":"seltemp", "data":23, "hc":3}` | stellt die gewählte Raumtemperatur des Hauptthermostats auf Heizkreis 3 ein |

### Abrufen und Schreiben in benutzerdefinierte Entitäten

Der URL-Pfad lautet `http://<hostname>/api/custom/`

| Endpunkt | HTTP-Methode | Aktion | Authentifizierung erforderlich? | post body |
| -------------------- | ----------- | -------------------------------------------------------- | ------------------------ | --------- |
| leer oder `info` | `GET` | gibt alle benutzerdefinierten Elemente und ihre Werte aus | nein | |
| `commands` | `GET` | listet die verfügbaren Befehle für benutzerdefinierte Entitäten auf | nein | |
| `<name>` | `GET` | gibt alle Merkmale für eine bestimmte benutzerdefinierte Einheit aus | nein | |
| `<name>/<attribute>` | `GET` | Ausgaben für ein Attribut einer bestimmten benutzerdefinierten Einheit | nein | |
| `<name>` | `POST` | aktualisiert einen benutzerdefinierten Entity-Wert, zum Schreiben | ja | `<data>` |

### Abruf von Temperatursensor-Informationen

Der URL-Pfad lautet `http://<hostname>/api/temperaturesensor/`

| Endpunkt | HTTP-Methode | Aktion | Authentifizierung erforderlich? | post body |
| -------------- | ----------- | --------------------------------------------------------------- | ------------------------ | --------- |
| leer | `GET` | Ausgänge verbunden Dallas Temperatursensornamen und Messwerte | nein | |
| `info` | `GET` | gibt alle Details zu den angeschlossenen Dallas-Temperatursensoren aus | nein | |
| `<name>` | `GET` | gibt alle Merkmale für einen bestimmten Temperatursensor aus | nein | |
| `<name>/value` | `GET` | gibt den Wert eines bestimmten Temperatursensors aus | nein | |

### Steuerung der analogen Sensoren

Der URL-Pfad lautet `http://<hostname>/api/analogsensor/`

| Endpunkt | HTTP-Methode | Aktion | Authentifizierung erforderlich? | post body |
| ---------- | ----------- | ------------------------------------------------------------------ | ------------------------ | ------------------------------ |
| leer | `GET` | gibt analoge Sensoren und deren Messwerte aus | nein | |
| `info` | `GET` | gibt alle Details zu den angeschlossenen analogen Sensoren aus | nein | |
| `<name>` | `GET` | gibt alle Merkmale für einen bestimmten analogen Sensor aus | nein | |
| `commands` | `GET` | listet die verfügbaren Systembefehle auf | no | |
| `setvalue` | `POST` | value/offset des Zählers oder des Ausgangspins setzen, +/- Zeichen korrigiert Wert | ja | `{"value":<val>, "id":<gpio>}` |
| `<name>` | `POST` | value/offset des Zählers oder des Ausgangspins setzen, +/- Zeichen korrigiert Wert | ja | `{"value":<val>}` |

### System-Befehle

Der URL-Pfad lautet `http://<hostname>/api/system/<endpoint>`

| Endpunkt | HTTP-Methode | Aktion | Authentifizierung erforderlich? | post body |
| ------------------------ | ----------- | ------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------ |
| `info` oder leer | `GET` | gibt aktuelle Systeminformationen aus | nein | |
| `fetch` | `GET` | erzwingt die Aktualisierung aller Gerätewerte | nein | | |
| `restart` | `GET` | startet EMS-ESP neu | ja | |
| `format` | `GET` | EMS-ESP auf Werkseinstellungen zurücksetzen | ja | |
| `commands` | `GET` | listet die verfügbaren Systembefehle auf | no | |
| `send` | `POST` | Telegramm auf den EMS-Bus senden | ja | `"XX XX...XX"` |
| `message` | `POST` | eine Nachricht an das Protokoll und MQTT senden. Die Nachricht kann auch ein logischer Befehl sein, wie er im Scheduler verwendet wird | ja | `".."` oder `'{"value":"system/settings/locale"}'` |
| `publish` | `POST` | MQTT veröffentlichen alle Werte, und optional HA-Konfiguration oder spezifisch für ein Gerät | no | `[ha] \| [device]` |
| `watch` | `POST` | eingehende Telegramme beobachten | nein | `<on \|off \| raw \| <type-id(hex)>` |
| `values` | `GET` | gibt alle Werte im Kurzformat aus | nein | |
| `read` | `GET` | fragt ein bestimmtes EMS-Gerät und eine TypeID ab | ja | `<deviceID> <type ID> [offset] [length]` |
| `response` | `GET` | gibt die letzte Antwort von EMS-ESP aus | nein | |
| `entities` | `GET` | listet alle aktivierten Entitäten auf | nein | |
| `mqtt/enabled` | `GET` | enable/disable MQTT | ja | `<bool>` |
| `ap/enabled` | `GET` | enable/disable Zugangspunkt | ja | `<bool>` |
| `settings/analogenabled` | `GET` | enable/disable analoger Sensor | ja | `<bool>` |
| `settings/hideled` | `GET` | enable/disable LED | ja | `<bool>` |
| `settings/showeralert` | `GET` | enable/disable shower alert | yes | `<bool>` |
| `settings/showertimer` | `GET` | enable/disable shower timer | yes | `<bool>` |
| `syslog/enabled` | `GET` | enable/disable syslog | ja | `<bool>` |

### Beispiele

:::tip Anmerkung: In diesen Beispielen ist die URL `http://ems-esp.local/api/`, aber passen Sie sie an Ihren tatsächlichen Hostnamen an. Ändern Sie auch das Zugriffstoken des Trägers in Ihr eigenes, wie im Abschnitt [Definitions](#definitionen) beschrieben.
:::

#### ...über die Befehlszeile

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

#### ...unter Verwendung eines Python-Skripts

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

MQTT verwendet das gleiche Format wie die API, jedoch mit einigen Unterschieden. Für das **Topic** wird `<hostname>` durch den MQTT-Basisnamen ersetzt, wie er in den Einstellungen definiert ist (Standard ist `ems-esp`). Das `<device>` folgt den gleichen Namen wie oben auf dieser Seite aufgeführt. Zum Beispiel `ems-esp/thermostat/<entity>` oder `ems-esp/custom/<name>`.

Der MQTT **Payload** ist derselbe wie der oben beschriebene und in der API verwendete `<data>` und kann ein JSON-Objekt oder ein String sein.

Beispiele:

| Thema | Nutzlast | Aktion |
| ------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| `ems-esp/system/send` | `XX XX...XX` | send raw ems-command |
| `ems-esp/thermostat/seltemp` | | holt die seltemp Entitätswerte und veröffentlicht sie im Thema `ems-esp/response` |
| `ems-esp/thermostat/seltemp` | `23` | Ändern der gewählten Solltemperatur auf 23 Grad am Hauptthermostat auf hc1 |
| `ems-esp/thermostat/mode` | `auto` | setzt den Thermostatmodus auf auto für hc1 |
| `ems-esp/thermostat` | `{"cmd":"mode","value":"heat","id":1}` | stellt den Thermostatmodus auf Heizen für hc1 |
| `ems-esp/custom/myCustomEntity` | `7` | setzt den Wert des EMS-ESP Custom Entity namens `myCustomEntity` auf 7 |

### Veröffentlichungsbefehle

EMS-ESP "abonniert" über MQTT bestimmte Themen, die von den angeschlossenen EMS-Geräten abhängen. Zum Beispiel `boiler`, `thermostat` usw.

Über diese MQTT-Themen können unter Verwendung des Payload-Formats Befehle an EMS-ESP gesendet werden:

```json
{"cmd":"<cmd>", "data":<data>, "id":<n>}
```

wobei

- `cmd` ist einer der in [Commands](Commands) aufgeführten Befehle und **_muss_** als String in Anführungszeichen gesetzt werden. Der Schlüssel `entity` kann auch anstelle von `cmd` verwendet werden.
- `data` (oder `value`) enthält den Wert für den Befehl und kann entweder ein String oder ein numerischer Wert sein.
- `id` wird als allgemeiner Indikator verwendet. `hc`, `wwc`, `ahs` und `hs` sind weitere unterstützte Aliasnamen. Mit `hc` wird zum Beispiel ein bestimmter Heizkreislauf angegeben. Es kann sowohl ein numerischer Wert als auch ein String verwendet werden.

Einige weitere Beispiele:

| Thema | Nutzlast | Aktion |
| --------------------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| `ems-esp/boiler` | `{"cmd":"heatingactivated", "data":"on"}` | Heizung einschalten im Kessel aktiviert |
| `ems-esp/boiler/heatingactivated` | `{"data":"on"}` | Einschalten der Warmwasserdesinfektion im Kessel (entspricht dem obigen Befehl) |
| `ems-esp/boiler` | `{"cmd":"dhw.disinfecting", "data":"on"}` | Einschalten der Warmwasserdesinfektion im Kessel |

Ob der Befehl von EMS-ESP akzeptiert wurde, können Sie im Protokoll unter Status - System Log nachsehen.

Der erste Befehl in der obigen Tabelle war gültig und wurde daher akzeptiert:\ Thema:`ems-esp/boiler` Command/payload: `{"cmd":"heatingactivated", "data":"on"}`

```
[command] Called command boiler/heatingactivated (heating activated) with value on
```

Und der folgende gefälschte Befehl wird nicht akzeptiert:\ Thema:`ems-esp/boiler` Command/payload: `{"cmd":"heatingactivated", "data":"5000"}`

```
[command] Command failed: no values in boiler
[mqtt] MQTT command failed with error no values in boiler (Error)
```

:::note Sie können die MQTT-Befehle einfach mit [MQTT Explorer](https://www.mqtt-explorer.com) testen. Verbinden Sie sich einfach mit dem MQTT-Broker und veröffentlichen Sie die Nutzlast im Thema.
:::

Mit Home Assistant können Thermostatbefehle auch zur Steuerung einzelner Heizkreise gesendet werden, indem ein Modus-String oder eine Temperaturnummer an ein Thema `thermostat_hc<n>` gesendet wird.

Je nach mqtt-Einstellungen gibt es auch direkte Abonnements für jeden Wert wie `boiler/wwtemp`, `thermostat/hc1/daytemp`, usw. Thermostate, die nur einen einzigen Heizkreis unterstützen, abonnieren `/thermostat/daytemp`.

Sie können auch MQTT verwenden, um eine spezifische Leseanforderung zu senden, und die Telegrammantwort wird in einem Topic namens `response` zurückgegeben. Wenn Sie zum Beispiel die Nutzdaten `{"cmd":"send", "data":"0B 88 19 19 02"}` an `ems-esp/system` senden, wird ein Topic `response` mit den Daten `{"src":"08","dest":"0B","type":"19","offset":"19","data":"7D 00","value":32000}` veröffentlicht.
