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
Wenn Sie zu Hause ein System mit einem Vorratsbehälter haben, werden sie höchstwahrscheinlich nicht wie erwartet funktionieren.
:::

## Dusch-Timer

Misst die Zeit, in der heißes Wasser bei eingeschaltetem Brenner fließt. Dies funktioniert nur bei Warmwasser-Durchflusssystemen; bei Warmwasser-Puffersystemen entspricht die Zeit immer der Ladezeit des Pufferspeichers.
Als zusätzliche Funktion gibt es den „Shower Alert“, der nach einer konfigurierten Zeit einen Alarm auslöst und einen kurzen Kaltwasserstrahl aktiviert. Der „Coldshot“ wird von der Entität `boiler/tapactivated` verwaltet und nutzt eine benutzerdefinierte Funktion, die den Warmwasserbereiter in den „Testmodus“ versetzt, den Leitungswasserfluss freigibt, aber den Brenner deaktiviert.

## Erzwungene Heizung aus

Manche Nutzer steuern den Heizkessel ohne Thermostat und möchten ihn ausschalten, sobald eine gewünschte Temperatur erreicht ist. Das Senden von `boiler/selflowtemp 0` an den Heizkessel muss jede Minute wiederholt werden, da der Heizkessel sonst auf die am Bedienfeld gewählte Temperatur zurückfällt.

Die Funktion `boiler/forceheatingoff` wiederholt diesen Befehl jede Minute, sodass die Heizung ausgeschaltet bleibt. In den EMS-ESP-Einstellungen kann der Wert für das Einschalten von `forceheatingoff` festgelegt werden.

## Einstellen der Vorlauftemperatur ohne Thermostat

`boiler/selflowtemp` wird als normaler Thermostat-Sollwert an den Heizkessel gesendet. Wie der Heizkessel darauf reagiert, hängt von seiner Firmware ab und davon, ob die integrierte Wetterkompensation (`boiler/curveon`) aktiviert ist. Ein Buderus GB172i (EMS 1.0, Außensensor am Heizkessel, kein Thermostat) verhält sich beispielsweise wie folgt ([#3447](https://github.com/emsesp/EMS-ESP32/discussions/3447)):

| `curveon` | `selflowtemp` | Ergebnis |
| --------- | ------------- | ------ |
| aus | beliebiger Wert | Wird ignoriert. Der Heizkessel läuft bei `heatingtemp` |
| auf | oberhalb des Kurvenwerts | Akzeptiert, bis zu `heatingtemp` |
| bei | unterhalb des Kurvenwerts | Wird ignoriert. Der Kessel behält seinen Kurvenwert bei |

Wenn die Kurve aktiviert ist, verwendet der Heizkessel den höheren Wert aus seiner eigenen Kurve und `selflowtemp`. Sie können dies nutzen, um die Kurve als Untergrenze einige Grad unter Ihrem Sollwert festzulegen und den tatsächlichen Sollwert über `selflowtemp` zu übermitteln, beispielsweise von Home Assistant. Dazu sind im Normalbetrieb keine Schreibzugriffe auf die Einstellungen des Heizkessels erforderlich.

:::warning[Kein Timeout]
Bei diesem Heizkessel tritt kein Timeout auf. Der letzte Wert bleibt aktiv, bis der Heizkessel seine Kurve neu berechnet, beispielsweise wenn sich ein Kurvenparameter oder die Außentemperatur ändert. Wenn EMS-ESP oder Ihre Hausautomation keine Signale mehr senden, kann der Heizkessel noch lange Zeit mit dem letzten Wert weiterheizen. Andere Heizkessel fallen nach etwa einer Minute auf die Bedienfeld-Einstellung zurück (siehe „Heizung zwangsweise ausschalten“ oben). Prüfen Sie daher, wie sich Ihr Heizkessel verhält, bevor Sie sich auf eine der beiden Möglichkeiten verlassen.
:::

## Energiemessung

Bei Gas- und Ölbrennern misst Bosch den Energieverbrauch nicht. EMS-ESP berechnet den Verbrauch jeder Kesselmeldung anhand der Brennermodulation und der Nennleistung des Kessels. Bei einigen Gaskesseln ist die Nennleistung gespeichert, bei anderen nicht.
Zudem ist die gespeicherte Leistung nicht immer korrekt, da ein Kessel desselben Typs mit unterschiedlichen Brennern ausgestattet sein oder dessen Brenner um air/nozzle angepasst sein können.
In diesen Fällen kann die Nennleistung `boiler/nompower` geändert und in EMS-ESP gespeichert werden. Überprüfen Sie die Einstellung, bevor Sie die Energiewerte verwenden.

## Fernbedienbare Thermostate

Moderne Thermostate können anhand der Außentemperatur die geeignete Vorlauftemperatur des Heizkessels berechnen. Ein einzelner, im Heizkessel installierter Thermostat kann dies zwar für verschiedene Heizkreise leisten, ist dabei jedoch langsam und ungenau. Wenn ein Raumthermostat misst, dass die Ist-Temperatur deutlich niedriger ist, sollte er die Vorlauftemperatur auf einen deutlich höheren Wert anheben, bis die richtige Temperatur erreicht ist. Dies wird als „außentemperaturgesteuert“ mit „Raumeinfluss“ bezeichnet und erfordert in der Regel einen physischen Fernthermostat im Raum. EMS-ESP kann einen solchen Fernthermostaten simulieren. Dies geschieht durch die Einstellung des Steuergeräts (`thermostat/hc<x>/control`) des Master-Thermostats und die Übertragung der Temperatur sowie optional der Luftfeuchtigkeit über `thermostat/hcx/remotetemp` und `thermostat/hcx/remotehum`. Die Werte werden dann an den Master-Thermostat weitergeleitet.

Bei einem Hauptthermostat vom Typ RC30/RC35 wird ein RC20 emuliert. Für den BC400 stehen die Optionen RC100, RC100H und RT800 zur Verfügung. Für ein Junkers/Bosch FW120 und ähnliche Modelle wird ein FB10 oder FB100 emuliert. Und für RC100/RC200/RC3x0 können Sie wählen, ob Sie einen RC100, RC200 oder einen RC100H emulieren möchten.

Um die Funktion „Fernbedienung für den Thermostat“ zu aktivieren, gehen Sie wie folgt vor:

- Stellen Sie `thermostat/hc<x>/control` (oder „Raumsteuerung“ in der WebUI) auf den Fernthermostat ein, den Sie steuern möchten.
- Senden Sie `thermostat/hc<x>/remotetemp` mit der gewünschten Temperatur. Optional können Sie für ein RC100H-Gerät `thermostat/hc<x>/remotehum` mit einem Wert für die Luftfeuchtigkeit senden.

EMS-ESP sucht nach dem Hauptthermostat und legt einen neuen Thermostat mit Entitäten für die Raumtemperatur und optional für die Luftfeuchtigkeit an. Diese Werte werden automatisch aktualisiert und mit dem Hauptthermostat synchronisiert.

Um die Funktion zu beenden, gehen Sie wie folgt vor:

- `thermostat/hc<x>/remotetemp` mit dem Wert `-1` senden
- `thermostat/hc<x>/control` wieder auf den Modelltyp „Master-Thermostat“ zurücksetzen

Der Fernthermostat bleibt im Dashboard des EMS-ESP-Geräts erhalten, weist jedoch keine Entitäten auf.

:::tip[Anmerkungen]

- Wenn der Regler auf `roomthermostat` eingestellt ist und der erste Temperaturwert für `remotetemp` nicht innerhalb einer Minute gesendet wird, zeigt der Hauptthermostat wahrscheinlich eine Fehlermeldung an.
- Die Fernbedienungsfunktion des Thermostats funktioniert nur, wenn ein Hauptthermostat vorhanden ist, das die Fernbedienung unterstützt, und keine anderen Fernbedienungen für diesen Heizkreis aktiv sind.
- Alle EMS-Geräte verfügen über eindeutige Geräte-IDs. Ist also ein Fernthermostat vorhanden, kann diese Geräte-ID nicht zur Emulation verwendet werden.
- Außerdem können Sie nicht zwei physische Fernbedienungen an einen Heizkreis anschließen.
- Zur Emulation eines Fernbedienungsthermostats wird ein Protokoll eines echten Thermostats benötigt, um die richtigen Befehle zu kopieren. Falls dies nicht funktioniert, probieren Sie eine andere Fernbedienungsoption aus. Sollte auch diese nicht funktionieren, können Sie die Funktion leider nicht nutzen.
  :::

:::warning[Haftungsausschluss]
Durch die Fernsteuerung der Luftfeuchtigkeit können Sie eine Wärmepumpe so einstellen, dass sie auch dann mit dem Kühlen beginnt, wenn die Temperatur unter dem tatsächlichen Taupunkt liegt. Dies kann zu Kondenswasserbildung an Rohrleitungen und auf dem Boden führen und in der Folge Schäden am System verursachen. Die Nutzung erfolgt auf eigene Gefahr!
:::

### Temperatureinstellungen für die Zeitplanung

Mit dem EMS-ESP-Scheduler lassen sich die Werte des Fernthermostats dauerhaft beibehalten. Der Thermostat wird nach Ausführung des Befehls neu erstellt und weist einen Anfangswert auf, wie unten dargestellt:

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
