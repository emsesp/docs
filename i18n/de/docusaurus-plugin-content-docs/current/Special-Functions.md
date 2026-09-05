---
id: Special-Functions
title: Special Functions
description: Learn about EMS-ESP special features including shower timer, energy measurement, and calculated entities
---

# Sonderfunktionen

Einige in MQTT abgebildete Entitäten werden von EMS-ESP generiert und nicht vom EMS-Bus gelesen.

`heating_active` und `tapwater_active` werden anhand der Einstellungen für den Brenner und valve/pump berechnet. Diese Werte werden sowohl vom Dusch-Timer als auch von der Energiemessfunktion verwendet.

:::tip[Hinweis]
Die beiden Entitäten `heating_active` und `tapwater_active` können nur auf Systemen ohne Puffer verwendet werden.
Wenn Sie zu Hause ein System mit Pufferspeicher haben, werden sie höchstwahrscheinlich nicht wie erwartet funktionieren.
:::

## Dusch-Timer

Misst die Zeit, in der Warmwasser bei eingeschaltetem Brenner fließt. Dies funktioniert nur bei Warmwasserstromsystemen; bei Warmwassersystemen mit Pufferspeicher entspricht die Zeit immer der Ladezeit des Pufferspeichers.
Als zusätzliche Funktion gibt es den „Shower Alert“, der nach einer konfigurierten Zeit einen Alarm auslöst und einen kurzen Kaltwasserstrahl aktiviert. Der „Coldshot“ wird von der Entität `boiler/tapactivated` verwaltet und nutzt eine benutzerdefinierte Funktion, die den Heizkessel in den „Testmodus“ versetzt, den Leitungswasserfluss freigibt, aber den Brenner deaktiviert.

## Zwangsweise Ausschaltung der Heizung

Manche Nutzer steuern den Heizkessel ohne Thermostat und möchten ihn ausschalten, sobald eine gewünschte Temperatur erreicht ist. Das Senden von `boiler/selflowtemp 0` an den Heizkessel muss jede Minute wiederholt werden, da der Heizkessel sonst auf die am Bedienfeld gewählte Temperatur zurückfällt.

Die Funktion `boiler/forceheatingoff` wiederholt diesen Befehl jede Minute, sodass die Heizung ausgeschaltet bleibt. In den EMS-ESP-Einstellungen kann der Wert für das Einschalten von `forceheatingoff` festgelegt werden.

## Energiemessung

Bei Gas- und Ölbrennern misst Bosch den Energieverbrauch nicht. EMS-ESP berechnet den Verbrauch für jede Kesselmeldung anhand der Brennermodulation und der Nennleistung des Kessels. Bei einigen Gaskesseln ist die Nennleistung gespeichert, bei anderen nicht.
Zudem ist die gespeicherte Leistung nicht immer korrekt, da ein Kessel desselben Typs mit unterschiedlichen Brennern ausgestattet sein oder dessen Brenner um die Größe air/nozzle angepasst sein können.
In diesen Fällen kann die Nennleistung `boiler/nompower` geändert und in EMS-ESP gespeichert werden. Überprüfen Sie die Einstellung, bevor Sie die Energiewerte verwenden.

## Fernbedienbare Thermostate

Moderne Thermostate können anhand der Außentemperatur die geeignete Vorlauftemperatur des Heizkessels berechnen. Ein einzelner Thermostat im Inneren des Heizkessels kann dies zwar für verschiedene Heizkreise leisten, allerdings ist dieses Verfahren langsam und ungenau. Wenn ein Raumthermostat misst, dass die Ist-Temperatur deutlich niedriger ist, sollte er die Vorlauftemperatur auf einen deutlich höheren Wert anheben, bis die richtige Temperatur erreicht ist. Dies wird als „außentemperaturgesteuert“ mit „Raumeinfluss“ bezeichnet und erfordert in der Regel einen physischen Fernthermostat im Raum. EMS-ESP kann einen solchen Fernthermostat simulieren. Dies geschieht durch die Einstellung des Steuergeräts (`thermostat/hc<x>/control`) des Master-Thermostats und die Übertragung der Temperatur sowie optional der Luftfeuchtigkeit über `thermostat/hcx/remotetemp` und `thermostat/hcx/remotehum`. Die Werte werden dann an den Master-Thermostat weitergeleitet.

Bei einem Hauptthermostat vom Typ RC30/RC35 wird ein RC20 emuliert. Für den BC400 stehen die Optionen RC100, RC100H und RT800 zur Verfügung. Für ein Junkers/Bosch FW120 und ähnliche Modelle wird ein FB10 oder FB100 emuliert. Und für RC100/RC200/RC3x0 können Sie wählen, ob Sie einen RC100, RC200 oder einen RC100H emulieren möchten.

Um die Funktion „Fernbedienung für den Thermostat“ zu aktivieren, gehen Sie wie folgt vor:

- Stellen Sie `thermostat/hc<x>/control` (oder „Raumsteuerung“ in der WebUI) auf den Fernthermostat ein, den Sie steuern möchten.
- Senden Sie `thermostat/hc<x>/remotetemp` mit der gewünschten Temperatur. Optional können Sie für ein RC100H-Gerät `thermostat/hc<x>/remotehum` mit einem Wert für die Luftfeuchtigkeit senden.

EMS-ESP sucht nach dem Hauptthermostat und legt einen neuen Thermostat mit Entitäten für die Raumtemperatur und optional für die Luftfeuchtigkeit an. Diese Werte werden automatisch aktualisiert und mit dem Hauptthermostat synchronisiert.

Um die Funktion zu beenden, gehen Sie wie folgt vor:

- `thermostat/hc<x>/remotetemp` mit dem Wert `-1` senden
- `thermostat/hc<x>/control` wieder auf den Modelltyp „Hauptthermostat“ zurücksetzen

Der Fernthermostat bleibt im Dashboard des EMS-ESP-Geräts erhalten, weist jedoch keine Entitäten auf.

:::tip[Anmerkungen]

- Wenn der Regler auf `roomthermostat` eingestellt ist und der erste Temperaturwert für `remotetemp` nicht innerhalb einer Minute gesendet wird, zeigt der Hauptthermostat wahrscheinlich eine Fehlermeldung an.
- Die Fernbedienungsfunktion des Thermostats funktioniert nur, wenn ein Hauptthermostat vorhanden ist, das die Fernbedienung unterstützt, und keine anderen Fernbedienungen für diesen Heizkreis aktiv sind.
- Alle EMS-Geräte verfügen über eindeutige Geräte-IDs. Ist also ein Fernthermostat vorhanden, kann diese Geräte-ID nicht zur Emulation verwendet werden.
- Außerdem können Sie nicht zwei physische Fernbedienungen an einen Heizkreis anschließen.
  :::

:::warning[Haftungsausschluss]
Durch die Fernsteuerung der Luftfeuchtigkeit können Sie eine Wärmepumpe so einstellen, dass sie auch dann mit dem Kühlen beginnt, wenn die Luftfeuchtigkeit unter dem tatsächlichen Taupunkt liegt. Dies kann zu Kondenswasserbildung an Rohrleitungen und auf dem Boden führen und in der Folge das System beschädigen. Die Nutzung erfolgt auf eigene Gefahr!
:::

### Temperatureinstellungen für die Zeitplanung

Mit dem EMS-ESP-Scheduler lassen sich die Werte des Fernthermostats dauerhaft beibehalten. Der Thermostat wird nach Ausführung des Befehls neu erstellt und erhält einen Anfangswert wie unten dargestellt:

![EMS-SCHEDULE-EDIT](/media/screenshot/scheduler_a.jpg)

- `Timer` zu `00:00`, damit die Funktion sofort nach dem Einschalten des EMS-ESP ausgelöst wird
- `Command` steht für `thermostat/hc1/remotetemp` für Heizkreis 1 (bzw. `thermostat/hc1/remotehum` für einen RC100H)
- `Value` ist die optimale Raumtemperatur für Ihr Zuhause oder ein Befehl (siehe unten)
- `Name` ist optional. Durch die Vergabe eines Namens kann es per Fernsteuerung als Befehl gesetzt werden, und der Aktivierungsstatus wird in einem MQTT-Thema veröffentlicht.

Wenn Sie einen externen Dallas-Temperatursensor an das EMS-ESP angeschlossen haben, können Sie den Wert `value` auf diesen Wert einstellen, indem Sie `temperaturesensor/<dallas_id_or_name>` als `value` verwenden.

Wenn sowohl ein Temperatur- als auch ein Feuchtigkeitswert eingestellt sind, würde der emulierte RC100H wie folgt aussehen:

![EMS-SCHEDULE-MAIN](/media/screenshot/scheduler_b.jpg)

## Verwendung der Message-API für erweiterte Logikfunktionen

Sie können den System-API-Endpunkt `message` verwenden, um eine Nachricht an das Protokoll und an MQTT zu senden; die Nachricht kann jedoch auch komplexe Logik enthalten, ähnlich wie im Scheduler. Beispielsweise das Senden von

```sh
curl -X POST \
    -H "Authorization: Bearer ${emsesp_token}" \
    -H "Content-Type: application/json" \
    -d '{"value":"system/settings/locale"}' \
    ${emsesp_url}/api/system/message
```

Und Beispiele, bei denen der Wert durch Folgendes ersetzt wird:

- `(custom/test_seltemp - boiler/flowtempoffset) * 2.8 + 5"`
- `"boiler/storagetemp2 == null ? 'no' : 'yes'"`
