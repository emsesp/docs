---
id: Special-Functions
title: Special Functions
description: Learn about EMS-ESP special features including shower timer, energy measurement, and calculated entities
---

# Besondere Funktionen

Einige in MQTT abgebildete Entitäten werden von EMS-ESP generiert und nicht vom EMS-Bus gelesen.

`heating_active` und `tapwater_active` werden aus den Einstellungen von Brenner und valve/pump berechnet. Diese werden sowohl von der Duschzeituhr als auch von der Energiemessung verwendet.

## Duschzeitschaltuhr

Misst die Zeit, in der das Warmwasser bei eingeschaltetem Brenner läuft. Dies funktioniert nur bei Durchflusssystemen; bei gepufferten Durchflusssystemen ist die Zeit immer die Ladezeit des Puffers. Als zusätzliche Funktion gibt es den Duschalarm, der nach einer konfigurierten Zeit einen Kaltwasserstoß auslöst. Der "Coldshot" wird von der Entität `boiler/tapactivated` verwaltet und verwendet eine benutzerdefinierte Funktion, die den Kessel in den "Testmodus" versetzt, den Leitungswasserfluss aktiviert und den Brenner deaktiviert.

## Heizung ausschalten

Einige Benutzer steuern den Heizkessel ohne Thermostat und möchten den Heizkessel ausschalten, wenn eine gewünschte Temperatur erreicht ist. Das Senden von `boiler/selflowtemp 0` an den Heizkessel muss jede Minute wiederholt werden, da der Heizkessel sonst auf die auf dem Bedienfeld eingestellte Temperatur zurückfällt.

Die Funktion `boiler/forceheatingoff` wiederholt diesen Befehl jede Minute, so dass die Heizung ausgeschaltet bleibt. In den EMS-ESP Einstellungen ist es möglich, den Einschaltwert von `forceheatingoff` einzustellen.

## Energiemessung

Bei Gas- und Ölbrennern misst Bosch den Energieverbrauch nicht. EMS-ESP berechnet den Verbrauch jeder Kesselmeldung anhand der Brennermodulation und der Kesselnennleistung. Bei einigen Gaskesseln ist die Nennleistung gespeichert, bei anderen nicht. Auch die gespeicherte Leistung ist nicht immer korrekt, ein Kessel desselben Typs könnte mit unterschiedlichen Brennern ausgestattet sein oder seine Brenner um die Größe air/nozzle eingestellt haben. In diesen Fällen kann die Nennleistung `boiler/nompower` geändert und in EMS-ESP gespeichert werden. Überprüfen Sie die Einstellung, bevor Sie die Energiewerte verwenden.

## Ferngesteuerte Thermostate

Moderne Thermostate können die Außentemperatur zur Berechnung der geeigneten Kesselvorlauftemperatur verwenden. Ein einzelner Thermostat, der im Kessel angebracht ist, kann dies für verschiedene Heizkreise tun, ist jedoch langsam und ungenau. Wenn ein Raumthermostat misst, dass die tatsächliche Temperatur viel niedriger ist, sollte er die Vorlauftemperatur auf einen viel höheren Wert anheben, bis die richtige Temperatur erreicht ist. Dies wird als "außengesteuert" mit "Raumeinfluss" bezeichnet und erfordert in der Regel einen physischen Fernthermostat im Raum. EMS-ESP kann einen solchen Fernthermostaten simulieren. Dazu wird das Steuergerät des Master-Thermostats (`thermostat/hc<x>/control`) eingestellt und die Temperatur und optional die Luftfeuchtigkeit über `thermostat/hcx/remotetemp` und `thermostat/hcx/remotehum` gesendet. Dieser sendet dann die Werte an den Master-Thermostat weiter.

Für einen Master-Thermostat des Typs RC30/RC35 wird ein RC20 emuliert. Für den BC400 sind die Optionen RC100, RC100H und RT800. Für einen Junkers/Bosch FW120 und ähnliche wird ein FB10 oder FB100 emuliert. Und für RC100/RC200/RC3x0 können Sie wählen, ob ein RC100, RC200 oder RC100H emuliert werden soll.

Gehen Sie wie folgt vor, um die Fernthermostatfunktion zu aktivieren:

- setzen Sie `thermostat/hc<x>/control` (oder Room Control in der WebUI) auf den Fernthermostat, den Sie steuern möchten
- senden Sie `thermostat/hc<x>/remotetemp` mit Ihrer gewünschten Temperatur. Optional für ein RC100H senden Sie `thermostat/hc<x>/remotehum` mit einem Wert für die Luftfeuchtigkeit

EMS-ESP sucht nach dem Master-Thermostat und erstellt einen neuen Thermostat mit Entitäten für Raumtemperatur und optional Luftfeuchtigkeit. Diese Werte werden automatisch aktualisiert und mit dem Master-Thermostat synchronisiert.

Um die Funktion zu beenden, gehen Sie wie folgt vor:

- `thermostat/hc<x>/remotetemp` mit einem Wert von `-1` senden
- setzen Sie `thermostat/hc<x>/control` zurück auf das Modell des Hauptthermostats

Der entfernte Thermostat bleibt im EMS-ESP-Geräte-Dashboard, hat aber keine Entitäten.

Hinweis: Wenn die Steuerung auf `roomthermostat` eingestellt ist und der erste Temperaturwert für `remotetemp` nicht innerhalb einer Minute gesendet wird, zeigt der Master-Thermostat wahrscheinlich eine Fehlermeldung an.

:::warning Haftungsausschluss Mit der Ferneinstellung der Luftfeuchtigkeit können Sie eine Wärmepumpe so einstellen, dass sie auch dann zu kühlen beginnt, wenn der tatsächliche Taupunkt unterschritten ist, was zu Kondenswasserbildung an Rohren und auf dem Boden führen und das System beschädigen kann. Verwendung auf eigene Gefahr!
:::

### Terminierung der Temperatureinstellungen

Der EMS-ESP Scheduler kann verwendet werden, um die Werte des Fernthermostats dauerhaft zu erhalten. Der Thermostat wird neu erstellt, sobald der Befehl ausgeführt wird und hat einen Anfangswert wie unten gezeigt:

![EMS-SCHEDULE-EDIT](/media/screenshot/scheduler_a.jpg)

- `Timer` bis `00:00` für die Auslösung, sobald das EMS-ESP eingeschaltet wird
- `Command` ist `thermostat/hc1/remotetemp` für Heizkreis 1 (oder `thermostat/hc1/remotehum` für einen RC100H)
- `Value` ist die optimale Raumtemperatur für Ihre Wohnung, oder ein Befehl (siehe unten)
- `Name` ist optional. Durch die Vergabe eines Namens kann es aus der Ferne als Befehl gesetzt werden und der Aktivierungsstatus wird in einem MQTT-Topic veröffentlicht.

Wenn Sie einen externen Dallas-Temperatursensor an das EMS-ESP angeschlossen haben, können Sie den `value` auf diesen Wert setzen, indem Sie `temperaturesensor/<dallas_id_or_name>` als `value` verwenden.

Wenn sowohl ein Temperatur- als auch ein Luftfeuchtigkeitswert eingestellt sind, würde der emulierte RC100H folgendermaßen aussehen:

![EMS-SCHEDULE-MAIN](/media/screenshot/scheduler_b.jpg)

## Verwendung der Nachrichten-API für erweiterte logische Funktionen

Sie können den System-API-Endpunkt `message` verwenden, um eine Nachricht an das Protokoll und an MQTT zu senden. Die Nachricht kann jedoch auch eine komplexe Logik enthalten, ähnlich wie im Scheduler. Zum Beispiel das Senden

```sh
curl -X POST \
    -H "Authorization: Bearer ${emsesp_token}" \
    -H "Content-Type: application/json" \
    -d '{"value":"system/settings/locale"}' \
    ${emsesp_url}/api/system/message
```

Und Beispiele, die den Wert durch ersetzen:

- `(custom/test_seltemp - boiler/flowtempoffset) * 2.8 + 5"`
- `"boiler/storagetemp2 == null ? 'no' : 'yes'"`
