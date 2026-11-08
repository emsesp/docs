---
id: Commands
title: Commands and API Reference
description: Complete command reference for controlling EMS-ESP via Console, MQTT, and REST API
---

# Befehle

EMS-ESP verfügt über eine Befehls-API, mit der Werte auf dem EMS-Gerät gelesen und geschrieben sowie bestimmte Befehle aufgerufen werden können.

Es gibt drei Möglichkeiten, Befehle aufzurufen:

- über den [**Console**](#konsole) per Telnet oder serieller Schnittstelle
- über [**HTTP**](#http) mithilfe von RESTful-API-Aufrufen
- über [**MQTT**](#mqtt) über Themen und deren Inhalte

## Begriffsbestimmungen

:::info[Wichtige Definitionen]

- `<device>` ist die Kurzbezeichnung. Es kann sich dabei entweder um Folgendes handeln:
  - Ein EMS-Gerät und unterstützte Geräte sind unter anderem: `boiler` `thermostat` `mixer` `heatpump` `solar` `gateway` `switch` `controller` `pump` `generic` `heatsource` `ventilation`
    - das EMS-ESP-System selbst, das als `system` identifiziert wurde
    - die Dallas-Temperatursensoren als `temperaturesensor`
    - beliebige benutzerdefinierte Analogsensoren als `analogsensor`
    - alle benutzerdefinierten Entitäten in EMS-Telegrammen als `custom`
  - `<command>` ist entweder der Name von
    - ein allgemeiner Befehl oder
    - eine EMS-Geräteentität, die auch als `<entity>` bezeichnet wird. Eine vollständige Liste finden Sie auf der Seite [Supported Devices](All-Entities)
  - `<id>` ist ein optionaler Bezeichner und hat je nach Kontext unterschiedliche Bedeutungen
  - `<data>` wird verwendet, um den zu lesenden oder zu schreibenden Wert darzustellen. Dabei kann es sich entweder um einen einzelnen Wert beliebigen Typs (Ganzzahl, Gleitkommazahl, Zeichenkette oder Boolescher Wert) oder um eine JSON-Objekt-Zeichenkette {} handeln, die mehrere key/values-Paare enthält, wie zum Beispiel:
    - **„cmd“** ist das `<command>`. Der Schlüssel **„cmd“** kann auch durch **„entity“** ersetzt werden.
    - **„value“** ist der Wert und kann entweder eine Textzeichenfolge in Anführungszeichen, eine Ganzzahl, eine Gleitkommazahl oder ein Boolescher Wert sein. **„data“** ist ein Alias, der ebenfalls anstelle des Schlüssels verwendet werden kann.
    - **„hc“**, **„wwc“** und **„id“** werden alle verwendet, um einen Wert oder – im Zusammenhang mit einem EMS-Gerät – einen Heiz- oder Warmwasserkreislauf zu bezeichnen.

  - Ein boolescher Wert kann auf vielfältige Weise dargestellt werden:
    - als Wahrheitswert: „TRUE“, „yes“, true, „true“, „on“, 1
    - als „False“-Wert: „FALSE“, „no“, false, „false“, „off“, 0

  - Der API-Schlüssel dient zur Authentifizierung von HTTP-Anfragen. Erstellen Sie einen solchen Schlüssel auf der Seite `Settings->Security->API Keys` der WebUI: Ein „Lese“-Schlüssel ermöglicht das Auslesen von Werten und das Ausführen von Befehlen, die auch Gäste ausführen dürfen; ein „Lese- und Schreib“-Schlüssel ermöglicht darüber hinaus das Ändern von Werten und Einstellungen. Senden Sie ihn im HTTP-Header als `"Authorization: Bearer {API_KEY}"`. Ab 3.10.0 ist er für jeden Aufruf von `/api` erforderlich, auch für Lesevorgänge.

:::

## Konsole

- Befehle können mit dem Befehl `call` ausgeführt werden
- Um den Befehl `call` verwenden zu können, müssen Sie Administrator sein. Geben Sie zunächst `su` ein und geben Sie das Passwort ein.
- Eine Liste aller verfügbaren Befehle finden Sie unter `show commands`
- Die Syntax lautet `call <device> <command> [data] [id]`
- Eine vollständige Liste der Befehle finden Sie unter `call <device> commands`

Weitere Informationen zur Verwendung der Telnet-Konsole finden Sie im Abschnitt [**Console**](Console).

## HTTP

Zu beachten:

- Die REST-API folgt dem [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification)
- Der URL-Pfad beginnt immer mit `http://<hostname>/api/`
- `<hostname>` ist entweder eine IP-Adresse oder der mDNS-Name, dessen Standardwert `ems-esp.local` ist
- Für jeden Aufruf ist ein API-Schlüssel erforderlich, der in der Web-Benutzeroberfläche unter „Sicherheit“ → „API-Schlüssel“ erstellt wird und im HTTP-Header wie `"Authorization: Bearer {API_KEY}"` angegeben werden muss. Aufrufe ohne diesen Schlüssel führen zu einem HTTP-Fehler 401. Zum Ändern von Werten oder Einstellungen ist ein Schlüssel mit „Lese- und Schreibrechten“ erforderlich.
- Um einen Wert in einem Browser anzuzeigen, öffnen Sie dessen Adresse, zum Beispiel `http://ems-esp.local/api/boiler/curflowtemp`, und melden Sie sich mit Ihrem EMS-ESP-Benutzernamen und -Passwort an, wenn der Browser Sie dazu auffordert. Dabei werden nur Werte ausgelesen, auch für Administratoren. Tools, die nur einen Benutzernamen und ein Passwort unterstützen, können einen API-Schlüssel als Passwort verwenden, unabhängig vom Benutzernamen, zum Beispiel `http://user:emsesp_...@ems-esp.local/api/boiler`. Der Schlüssel behält dort seine Berechtigungen, außer im Browser, wo er nur Lesezugriff hat.
- Bei HTTP-POST-Befehlen kann ein HTTP-Body erforderlich sein. Dieser kann entweder als Klartext oder als JSON-Objekt `<data>` vorliegen; in beiden Fällen muss der Content-Type-Header auf `application/json` gesetzt sein.
- HTTPS mit selbstsignierten Zertifikaten wird noch nicht unterstützt
- Eine vollständige Liste der Befehle finden Sie unter `http://<hostname>/api/<device>/commands`
- Die Verwendung von GET-Befehlen im Stil der ems-esp v2-API wird weiterhin unterstützt (`http://<hostname>/api?device=<device>&id=<id>&cmd=<cmd>`)

### Lesen und Schreiben von EMS-Geräteinformationen

Der URL-Pfad lautet `http://<hostname>/api/<device>/`

| `endpoint` | `HTTP method` | `action` | `authentication required?` | `post body` |
| --------------- | ------------- | ------------------------------------------------------------------ | -------------------------- | ----------- |
| `info` | `GET` | gibt aktuelle EMS-Geräteinformationen im ausführlichen Modus aus | nein | |
| `values` | `GET` | gibt aktuelle EMS-Geräteinformationen im Kurzformat aus | nein | |
| _(empty)_ | `GET` | wie `values` oben | nein | |
| `commands` | `GET` | listet die verfügbaren Befehlsentitäten auf, die aufgerufen werden können | nein | |
| `entities` | `GET` | listet alle aktivierten Entitäten auf | nein | |
| `{entity}` | `GET` | gibt Details zu einer bestimmten Entität zur Lektüre aus | nein | |
| `{entity}/{hc}` | `GET` | entspricht dem obigen Befehl „read“, gilt jedoch für einen bestimmten Heizkreis  | nein | |
| `{entity}` | `POST` | aktualisiert einen Entitätswert beim Schreiben | ja | `<data>`    |
| `{entity}/{hc}` | `POST` | entspricht dem obigen Befehl „write“, gilt jedoch für einen bestimmten Heizkreis | ja | `<data>`    |

Beispiele:

| URL | Beitragstext | Aktion |
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `http://ems-esp.local/api/thermostat/seltemp`     | `22` | legt die gewählte Raumtemperatur des Hauptthermostats für Heizkreis 1 fest |
| `http://ems-esp.local/api/thermostat/hc2/seltemp` | `{"data":22}` | legt die gewählte Raumtemperatur des Hauptthermostats für Heizkreis 2 fest |
| `http://ems-esp.local/api/thermostat/mode` | `'auto'` | stellt den Thermostatmodus für den Heizkreis 1 auf „Auto“ ein |
| `http://ems-esp.local/api/thermostat` | `{"cmd":"mode", "data":"auto"}` | stellt den Thermostatmodus für den Heizkreis 1 auf „Auto“ ein |
| `http://ems-esp.local/api/thermostat` | `{"cmd":"seltemp", "data":23, "hc":3}` | stellt die ausgewählte Raumtemperatur für den Heizkreis 3 auf 23 Grad ein |
| `http://ems-esp.local/api/thermostat/hc2` | `{"cmd":"seltemp", "data":20.5}` | stellt die ausgewählte Raumtemperatur für den Heizkreis 2 auf 20,5 Grad ein |
| `http://ems-esp.local/api` | `{"device":"thermostat", "cmd":"seltemp", "data":23, "hc":3}` | legt die gewählte Raumtemperatur des Hauptthermostats für Heizkreis 3 fest |

### Abrufen und Schreiben von benutzerdefinierten Entitäten

Der URL-Pfad lautet `http://<hostname>/api/custom/`

| Endpunkt | HTTP-Methode | Aktion | Authentifizierung erforderlich? | POST-Inhalt |
| -------------------- | ----------- | -------------------------------------------------------- | ------------------------ | --------- |
| leer oder `info` | `GET` | gibt alle benutzerdefinierten Entitäten und deren Werte aus | nein | |
| `commands` | `GET` | listet die verfügbaren Befehle für benutzerdefinierte Entitäten auf | nein | |
| `<name>` | `GET` | gibt alle Eigenschaften einer bestimmten benutzerdefinierten Entität aus | nein | |
| `<name>/<attribute>` | `GET` | gibt ein Attribut einer bestimmten benutzerdefinierten Entität aus | nein | |
| `<name>` | `POST` | aktualisiert den Wert einer benutzerdefinierten Entität beim Schreiben | ja | `<data>`  |

### Abrufen von Informationen zum Temperatursensor

Der URL-Pfad lautet `http://<hostname>/api/temperaturesensor/`

| Endpunkt | HTTP-Methode | Aktion | Authentifizierung erforderlich? | POST-Inhalt |
| -------------- | ----------- | --------------------------------------------------------------- | ------------------------ | --------- |
| leer | `GET` | gibt die Namen und Messwerte der angeschlossenen Dallas-Temperatursensoren aus  | nein | |
| `info` | `GET` | gibt alle Details zu den angeschlossenen Dallas-Temperatursensoren aus | nein | |
| `<name>` | `GET` | gibt alle Eigenschaften für einen bestimmten Temperatursensor aus  | nein | |
| `<name>/value` | `GET` | gibt den Wert eines bestimmten Temperatursensors aus | nein | |

### Steuerung der analogen Sensoren

Der URL-Pfad lautet `http://<hostname>/api/analogsensor/`

| Endpunkt   | HTTP-Methode | Aktion | Authentifizierung erforderlich? | POST-Inhalt |
| ---------- | ----------- | ------------------------------------------------------------------ | ------------------------ | ------------------------------ |
| leer | `GET` | gibt analoge Sensoren und deren Messwerte aus | nein | |
| `info`     | `GET` | gibt alle Details zu den angeschlossenen analogen Sensoren aus | nein | |
| `<name>`   | `GET` | gibt alle Eigenschaften eines bestimmten analogen Sensors aus | nein | |
| `commands` | `GET` | listet die verfügbaren Systembefehle auf | nein | |
| `setvalue` | `POST` | Einstellung value/offset des Zähler- oder Ausgangspins, +/- Vorzeichen korrigiert den Wert | ja | `{"value":<val>, "id":<gpio>}` |
| `<name>`   | `POST` | Einstellung value/offset des Zähler- oder Ausgangspins, +/- Vorzeichen korrigiert den Wert | ja | `{"value":<val>}` |

### Systembefehle

Der URL-Pfad lautet `http://<hostname>/api/system/<endpoint>`

| Endpunkt | HTTP-Methode | Aktion | Authentifizierung erforderlich? | POST-Inhalt |
| ------------------------ | ----------- | ------------------------------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------- |
| `info` `values`oder leer  | `GET` | gibt aktuelle Systeminformationen aus | nein | |
| `fetch` | `GET` | Erzwingt beim Aktualisieren aller Gerätewerte | nein | |
| `restart` | `GET` | EMS-ESP neu starten | ja | |
| `format` | `GET` | EMS-ESP bei Werksrücksetzung | ja | |
| `commands` | `GET` | listet die verfügbaren Systembefehle auf | nein | |
| `send` | `POST` | Telegramm an den EMS-Bus senden | ja | `"XX XX...XX"` |
| `message` | `POST` | Eine Nachricht an das Protokoll und an MQTT senden. Die Nachricht kann auch ein Logikbefehl sein, wie er im Scheduler verwendet wird | ja | `".."` oder `'{"value":"system/settings/locale"}'` |
| `publish` | `POST` | MQTT-Veröffentlichung aller Werte sowie optionaler HA-Konfiguration oder gerätespezifischer Daten | nein | `[ha] \| [device]` |
| `watch` | `POST` | eingehende Telegramme überwachen | nein | `<on \|off \| raw \| <type-id(hex)>` |
| `values` | `GET` | gibt alle Werte im Kurzformat aus | nein | |
| `read` | `GET` | fragt ein bestimmtes EMS-Gerät und eine Typ-ID ab | ja | `<deviceID> <type ID> [offset] [length]` |
| `response` | `GET` | gibt die letzte Antwort von EMS-ESP aus | nein | |
| `entities` | `GET` | listet alle aktivierten Entitäten auf | nein | |
| `sendmail` | `POST` | E-Mail senden | ja | `{"to":"<email>", "subject":"<subject>", "body":"<body>"}` |
| `txpause` | `POST` | pause/resume die Übertragung des EMS-Busses | ja | `<bool>` |
| `led` | `POST` | LED-Muster | ja | `[color]:[pattern]` |
| `mqtt/enabled` | `GET` | enable/disable MQTT | ja | `<bool>` |
| `ap/enabled` | `GET` | enable/disable Zugangspunkt | ja | `<bool>` |
| `ntp/enabled` | `GET` | enable/disable NTP | ja | `<bool>` |
| `syslog/enabled` | `GET` | enable/disable Syslog | ja | `<bool>` |
| `settings/analogenabled` | `GET` | enable/disable Analogsensor | ja | `<bool>` |
| `settings/hideled` | `GET` | enable/disable LED | ja | `<bool>` |
| `settings/showeralert`   | `GET` | enable/disable Duschalarm | ja | `<bool>` |
| `settings/showertimer`   | `GET` | enable/disable Dusch-Timer | ja | `<bool>` |

### Beispiele

:::tip
In diesen Beispielen lautet die URL `http://ems-esp.local/api/`, passen Sie diese jedoch an Ihren tatsächlichen Hostnamen an. Ändern Sie außerdem den API-Schlüssel wie im Abschnitt [Definitions](#begriffsbestimmungen) beschrieben in Ihren eigenen.
:::

#### ...über die Befehlszeile

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

#### … mithilfe eines Python-Skripts

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

MQTT verwendet dasselbe Format wie die API, allerdings mit einigen Unterschieden. Beim **Topic** wird `<hostname>` durch den in den Einstellungen definierten MQTT-Basennamen ersetzt (Standard ist `ems-esp`). Das `<device>` folgt denselben Namen, wie sie oben auf dieser Seite aufgeführt sind. Zum Beispiel `ems-esp/thermostat/<entity>` oder `ems-esp/custom/<name>`.

Die MQTT-**Nutzlast** entspricht dem oben beschriebenen und in der API verwendeten `<data>` und kann ein JSON-Objekt oder eine Zeichenkette sein.

Was MQTT tun kann, wird in den MQTT-Einstellungen unter „Über MQTT empfangene Befehle“ festgelegt: „Aus, nur Werte lesen“, „Werte ändern und Befehle ausführen“ (Standardeinstellung) oder „Alles, auch Systembefehle“. Befehle wie `system/send` oder `system/restart` erfordern die Einstellung „Alles“. Ein Werksreset (`system/format`) und das Löschen des Absturz-Dumps (`system/coredump`) werden über MQTT niemals akzeptiert. Veröffentlichen Sie Befehle ohne das Retain-Flag; gespeicherte Befehle werden ignoriert.

Beispiele:

| Thema | Nutzdaten | Aktion |
| ------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| `ems-esp/system/send` | `XX XX...XX` | Ems-Befehl im Rohformat senden (erfordert „Alles, auch Systembefehle“) |
| `ems-esp/thermostat/seltemp`    | | ruft die Werte der Entität „seltemp“ ab und veröffentlicht sie im Thema `ems-esp/response`     |
| `ems-esp/thermostat/seltemp`    | `23` | Die ausgewählte Solltemperatur am Hauptthermostat „hc1“ auf 23 Grad ändern |
| `ems-esp/thermostat/mode` | `auto` | stellt den Thermostatmodus für hc1 auf „Auto“ ein |
| `ems-esp/thermostat` | `{"cmd":"mode","value":"heat","id":1}` | stellt den Thermostatmodus für hc1 auf „Heizen“ ein |
| `ems-esp/custom/myCustomEntity` | `7` | legt den Wert der benutzerdefinierten EMS-ESP-Entität mit dem Namen `myCustomEntity` auf 7 fest |

### Befehle zum Veröffentlichen

EMS-ESP abonniert über MQTT bestimmte Themen, je nach den angeschlossenen EMS-Geräten. Zum Beispiel `boiler`, `thermostat` usw.

Befehle können über diese MQTT-Themen im folgenden Payload-Format an EMS-ESP gesendet werden:

```json
{"cmd":"<cmd>", "data":<data>, "id":<n>}
```

wobei

- `cmd` ist einer der in [Commands](Commands) aufgeführten Befehle und **muss** als Zeichenkette in Anführungszeichen gesetzt werden. Anstelle von `cmd` kann auch der Schlüssel `entity` verwendet werden.
- `data` (oder `value`) enthält den Wert für den Befehl und kann entweder eine Zeichenkette oder ein numerischer Wert sein.
- `id` wird als generischer Bezeichner verwendet. `hc`, `wwc`, `ahs` und `hs` sind weitere unterstützte Aliase. Bei `hc` beispielsweise wird damit ein bestimmter Heizkreis bezeichnet. Es können sowohl numerische Werte als auch Zeichenfolgen verwendet werden.

Noch ein paar Beispiele:

| Thema | Nutzdaten | Aktion |
| --------------------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| `ems-esp/boiler` | `{"cmd":"heatingactivated", "data":"on"}` | Heizung im Heizkessel einschalten |
| `ems-esp/boiler/heatingactivated` | `{"data":"on"}` | Warmwasser-Desinfektion im Heizkessel aktivieren (entspricht dem obigen Befehl) |
| `ems-esp/boiler` | `{"cmd":"dhw.disinfecting", "data":"on"}` | Warmwasser-Desinfektion im Heizkessel aktivieren |

Unter „Status – Systemprotokoll“ können Sie im Protokoll nachsehen, ob der Befehl von EMS-ESP akzeptiert wurde.

Der erste Befehl in der obigen Tabelle war gültig und wurde daher akzeptiert:\
Thema:`ems-esp/boiler` Command/payload: `{"cmd":"heatingactivated", "data":"on"}`

```
[command] Called command boiler/heatingactivated (heating activated) with value on
```

Und der folgende ungültige Befehl wird nicht akzeptiert:\
Thema:`ems-esp/boiler` Command/payload: `{"cmd":"heatingactivated", "data":"5000"}`

```
[command] Command failed: no values in boiler
[mqtt] MQTT command failed with error no values in boiler (Error)
```

:::note
Mit [MQTT Explorer](https://www.mqtt-explorer.com) lassen sich die MQTT-Befehle ganz einfach testen. Stellen Sie einfach eine Verbindung zum MQTT-Broker her und veröffentlichen Sie die Nutzdaten unter dem entsprechenden Topic.
:::

Mit Home Assistant können auch Thermostatbefehle gesendet werden, um einzelne Heizkreise zu steuern, indem eine Moduszeichenfolge oder ein Temperaturwert an ein Thema `thermostat_hc<n>` gesendet wird.

Je nach MQTT-Einstellungen gibt es auch direkte Abonnements für jeden Wert wie `boiler/wwtemp`, `thermostat/hc1/daytemp` usw. Thermostate, die nur einen einzigen Heizkreis unterstützen, abonnieren `/thermostat/daytemp`.

Sie können MQTT auch verwenden, um eine bestimmte Leseanfrage zu senden; die Telegramm-Antwort wird dann in einem Topic namens `response` zurückgegeben. Wenn Sie beispielsweise die Nutzlast `{"cmd":"send", "data":"0B 88 19 19 02"}` an `ems-esp/system` senden, wird ein Topic `response` mit den Daten `{"src":"08","dest":"0B","type":"19","offset":"19","data":"7D 00","value":32000}` veröffentlicht.
