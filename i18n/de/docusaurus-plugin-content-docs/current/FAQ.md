---
id: FAQ
title: Frequently Asked Questions
description: Common questions and answers about EMS-ESP including factory reset, EMS telegrams, and troubleshooting
---

# Häufig gestellte Fragen

## Wie setzt man das EMS-ESP auf die Werkseinstellungen zurück?

Durch ein Zurücksetzen auf die Werkseinstellungen werden alle EMS-ESP-Einstellungen gelöscht. EMS-ESP wird anschließend im Access-Point-Modus neu gestartet, in dem Sie sich mit dem werkseitig voreingestellten Benutzer `admin` anmelden.

- Klicken Sie in der Web-Benutzeroberfläche als Administrator auf der Seite **Einstellungen > Version** auf **Werkseinstellungen zurücksetzen**.
- Geben Sie in der Konsole als Administrator `call system format` ein.
- Bei Verwendung der GPIO-Taste (standardmäßig auf allen BBQKees-Boards aktiviert) und auf Boards, auf denen [Recovery App](#wiederherstellungs-app) installiert ist: Halten Sie die Taste etwa 10 Sekunden lang gedrückt und lassen Sie sie dann los. Das Gateway startet neu und wechselt in die Recovery-App. Melden Sie sich dort an und klicken Sie auf **Werkseinstellungen zurücksetzen**.

Keine dieser Methoden funktioniert, wenn die Werksrücksetzung in den EMS-ESP-Einstellungen deaktiviert ist.

## Was ist ein EMS-Telegramm?

Verfasst von MichaelDvP in [this article](https://github.com/emsesp/EMS-ESP32/discussions/1612#discussioncomment-8408868):

Den besten Überblick über bekannte Telegramme bieten [Norberts1](https://github.com/norberts1/hometop_HT3/blob/master/HT3/docu/HT_EMS_Bus_messages.pdf) und [EMS-Wiki](https://emswiki.thefischer.net/doku.php). Generell lässt sich sagen:

- Die Messwerte werden in regelmäßigen Abständen von 10 Sekunden bzw. 1 Minute übertragen.
- Einstellungen werden erst nach einer Änderung übertragen
- Wenn eine Einstellung eines Geräts über die Benutzeroberfläche des Thermostats geändert wird, erscheint die Meldung „Thermostat -w-> Gerät“ mit ausschließlich diesem Wert.
- Manche Geräte senden sich schnell ändernde Werte als Einzelwerte
- Die gemessenen Temperaturen werden normalerweise als 2 Bytes (SHORT) mit dem Faktor 0,1 angegeben (z. B. 01 23 -> 0x0123 -> dez 291 -> 29,1 °C)
- Lufttemperaturwerte werden oft mit dem Faktor 0,5 als Einzelbyte (INT) angegeben (z. B. 0x2D -> Dez. 45 -> 22,5 °C)
- Die Einstellungen für die Wassertemperatur sind in der Regel ein Byte (UINT) (z. B. 0x3C -> 60 °C), Differenzwerte (Hysterese in Kelvin) sind vorzeichenbehaftet (INT)
- Prozentangaben werden als Einzelbyte (UINT) angegeben (0x64 -> 100 %)
- on/off-Zustände oder -Einstellungen können aus einem einzelnen Byte bestehen, das on/off, 0xFF/0x00 oder 0x01/0x00 enthält, oder aus einem einzelnen Bit in einem Byte zusammen mit 7 weiteren Zuständen
- Zeit und Energie betragen in der Regel 3 oder 4 Byte, mit oder ohne Faktor

Bei verschiedenen brands/devices verwendet Bosch manchmal unterschiedliche Bezeichnungen für denselben Wert – vielleicht wechseln die Entwickler oder sie möchten das Reverse Engineering erschweren!

Wenn Sie nach einer Einstellung suchen, protokollieren Sie die Telegramme für das Gerät (alle protokollieren oder &lt;Geräte-ID&gt; überwachen) und ändern Sie die Einstellung am Thermostat auf einen anderen Wert für states/values. Suchen Sie anschließend im Protokoll nach diesen Werten. Wenn Sie nach einem Messwert suchen, protokollieren Sie das Gerät, zeigen Sie den Wert am Thermostat an und warten Sie auf Änderungen; notieren Sie sich die old/new-Werte und die Uhrzeit. Überprüfen Sie anschließend das Protokoll auf diesen Zeitstempel (oder 10 Sekunden / 1 Minute später) und den Wert in einem Telegramm. Am besten sollten Sie mehrere changes/values haben, um sicherzugehen.

## Kann EMS-ESP einen Thermostat simulieren?

Zum Teil. Wie die Leute von [OpenTherm Gateway (OTGW)](https://otgw.tclcode.com/standalone.html#intro) es treffend formuliert haben:

:::tip[Warum einen Thermostat verwenden?]

    - Die Thermostathersteller haben jahrelange Forschungsarbeit geleistet, um die Heizcharakteristika für die effizienteste und komfortabelste Art der Beheizung eines Hauses zu ermitteln.
    - Der Thermostat verfügt über eine Bedienoberfläche, mit der die Nutzer vertraut sind, sodass auch andere Haushaltsmitglieder den Sollwert weiterhin einstellen können.
    - Es bietet eine praktische Unterbringung für den Raumtemperatursensor, der erforderlich ist, sofern Sie keine Heizkurve verwenden, die ausschließlich auf der Außentemperatur basiert.

:::

Wie **MichaelDvP** betont: _„Ein Thermostat ist ein cleveres elektronisches Gerät. Man gibt die gewünschte Raumtemperatur ein, und das Gerät berechnet anhand verschiedener Parameter und Messwerte die für diese Raumtemperatur erforderliche Vorlauftemperatur und übermittelt diese an den Heizkessel. Dies geschieht in einem Regelkreis und wird regelmäßig aktualisiert.“_

Und **mtc716** sagte: „Ein Thermostat erstellt eine Heizkurve, die ständig an die Umgebungstemperaturen angepasst wird und dazu dient, abzuschätzen, welche Wassertemperatur erforderlich ist, um die Raumtemperatur zu erhöhen. Im Internet gibt es einige gute Artikel darüber, wie man die Heizkurve richtig einstellt. Die wichtigsten Parameter, die du benötigst, sind die „Auslegungstemperatur“, also die Heizwassertemperatur bei minimaler Außentemperatur. Außerdem benötigst du die „Komforttemperatur“, wie zuvor erläutert, und den „Temperaturversatz“, der eine parallele Verschiebung der Heizkurve bewirkt.“_

Außerdem sagt **MichaelDvP**: „Wenn Sie einen softwaregesteuerten Thermostat bauen möchten, stehen Ihnen verschiedene Methoden zur Verfügung:“

- Außentemperaturgesteuert:
  Legen Sie eine Heizkurve für Ihr Gebäude fest. Dabei handelt es sich um eine lineare Interpolation zwischen einer Mindestaußentemperatur für Ihre Region (typischerweise -11 °C für Mitteleuropa) mit maximaler Vorlauftemperatur (Auslegungstemperatur ~76 °C für Heizkörper, 40 °C für Fußbodenheizungen) und dem tatsächlichen Raum-Sollwert (z. B. 21 °C) für Außentemperatur und Vorlauftemperatur. Sie können einen Offset hinzufügen.
  selflowtemp = Offset + Sollwert + (Auslegungstemperatur – Sollwert) * (Sollwert – Außentemperatur) / (Sollwert – minimale Außentemperatur)
- raumgesteuert, geschaltet:
  Die Raumtemperatur messen und den Heizkessel einschalten, wobei die Heizungsabschaltung aktiviert ist, wenn die Raumtemperatur den Sollwert überschreitet. Um häufiges Ein- und Ausschalten zu vermeiden, eine Hysterese einbauen.
- raumgesteuert, dynamisch
  Hier muss eine PID-Regelung berechnet werden. Das geht etwas über den Rahmen des ems-esp-Schedulers hinaus. Aber vielleicht ist es möglich. Bei HA kannst du unter „Implementierung eines intelligenten Thermostats (mit SAT)“ nachlesen. Siehe [#2103](https://github.com/emsesp/EMS-ESP32/issues/2103)
- Steuerung über intelligente Thermostatventile (TRVs):
  Wenn Sie den Öffnungsgrad der Thermostatventile ablesen können, richten Sie eine einfache I-Regelung ein. Ist ein Thermostatventil vollständig geöffnet: Erhöhen Sie die Vorlauftemperatur; liegt der Öffnungsgrad des am weitesten geöffneten Thermostatventils unter 90 %: Verringern Sie die Vorlauftemperatur. Das Aufheizen ist ein langsamer Prozess, gehen Sie daher increase/decrease vorsichtig vor.

Wenn Sie mehr darüber erfahren möchten, schauen Sie sich diese Diskussionen an:

- [Smart control a heating system with HA?](https://github.com/emsesp/EMS-ESP32/discussions/965)
- [Thermostat emulation](https://github.com/emsesp/EMS-ESP32/issues/151)
- [Changing the boiler heating directly](tips-and-tricks#steuerung-der-heizkesselheizung)
- [Implementing a smart thermostat (using SAT)](https://github.com/emsesp/EMS-ESP32/issues/2103)

## Was sind Busprotokolle und Übertragungsmodi?

Protokoll und Timing sind zwei verschiedene Dinge; man wählt den Übertragungsmodus, der am besten funktioniert.

HT3 ist die Elektronik von Junkers, und das HT3-Protokoll entspricht dem EMS-Protokoll, nur dass im ersten Byte (Absender) das höchste Bit gesetzt ist. Jedes von uns gesendete Telegramm beginnt in einem Buderus-System mit 0B, bei Junkers hingegen mit 8B. Dies führt dazu, dass die Geräte der verschiedenen Marken nicht miteinander kompatibel sind. EMS-ESP überprüft den Bus beim Start und wählt automatisch das richtige Protokoll aus. Außerdem verwendet Junkers ein anderes Telegramm numbers/orders. Module der Marke Bosch verwenden zwar dieselben Telegrammnummern wie Buderus, adressieren jedoch wie Junkers, sind also ebenfalls nicht kompatibel. Sie können keine Junkers- oder Buderus-Module an eine Bosch-Heizungsanlage anschließen.

Der Tx-Modus bestimmt das Sende-Timing: Die Client-Geräte senden mittels Strommodulation, der Master mittels Spannungsmodulation. Dies ermöglicht Vollduplex (Hardware-Modus), allerdings beeinflusst der je nach Leitungsimpedanz aufgenommene Strom auch die Spannung. Beim Senden wiederholt der Master jedes vom Gerät gesendete Byte, um es an die anderen Geräte weiterzugeben. Im Tx-Modus „EMS“ warten wir auf das Master-Byte, bevor wir das nächste senden. Die älteren Junkers-Geräte scheinen eine kürzere Zeitüberschreitung zu haben, daher müssen wir mit dem nächsten Byte beginnen, bevor das Master-Echo abgeschlossen ist („HT3“). „EMS+“ ist weniger kritisch, und wir können etwas länger als ein Byte warten, damit sich die Spannung nach dem Senden stabilisieren kann.

## Kann man mehrere Instanzen von EMS-ESP ausführen?

Ja, das geht. Beachten Sie dabei bitte die folgenden Einstellungen:

- (Einstellungen -> MQTT-Einstellungen) MQTT `Entity ID format` ist auf „Mehrere Instanzen, Kurzname“ eingestellt
- (Einstellungen -> MQTT-Einstellungen) MQTT `Client ID` muss eindeutig sein, um Konflikte im MQTT-Broker zu vermeiden
- (Einstellungen -> MQTT-Einstellungen) MQTT `Base` ist eindeutig (vergewissern Sie sich bitte). In der Regel wird hier der Hostname angegeben.
- (Einstellungen -> Netzwerkeinstellungen) `Hostname` ist eindeutig, um Netzwerkkonflikte zu vermeiden
- (Einstellungen -> Anwendungseinstellungen) `EMS BUS ID` sind unterschiedlich (nicht beide 0x0B)

## Warum haben EMS-Telegramme im `raw watch`-Modus einen um 0x100 höheren Typ als im `raw`-Modus?

Siehe [this discussion](https://github.com/emsesp/EMS-ESP32/discussions/2025)

## Sollte ich den Wert „minBurnPower“ in kalten Wintern auf 10–20 % erhöhen, damit stets eine Grundwärmeversorgung gewährleistet ist?

(Antwort von [MichaelDvP](https://github.com/MichaelDvP))

Das wird nicht funktionieren. Der Heizkessel arbeitet mit `selflowtemp` als Sollwert und regelt den Brenner so, dass die `flowtemp` gehalten wird. Wenn `flowtemp` höher ist als der bei minimaler Brennerleistung gewählte Wert, schaltet sich der Kessel ab, wartet die Mindestzeit ab und wartet, bis `flowtemp` auf `selflowtemp` gesunken ist – Hysterese – und startet dann erneut. Eine Erhöhung von `burnminpower` führt unter milden Bedingungen lediglich zu mehr on/off-Zyklen.

## So sparen Sie Energie beim ESP32-Chip

Wenn Sie Bedenken hinsichtlich des Energieverbrauchs des ESP32-Chips haben und die Wärmeabgabe reduzieren möchten, können Sie einige der folgenden Einstellungen vornehmen:

- `Underclock CPU speed` im **Abschnitt „Anwendung Settings/Hardware“**
- Wenn Sie WLAN nutzen, aktivieren Sie `WiFi Sleep Mode`, wählen Sie `use lower WiFi bandwidth` aus und senken Sie die Sendeleistung `Tx power` im **Abschnitt „Netzwerk Settings/WiFi“** auf etwa 8,5 dBm.
- Wenn Sie Ethernet verwenden, aktivieren Sie `Force 10Mbit half-duplex` im **Abschnitt „Netzwerk Settings/Ethernet“**

Beachten Sie, dass dies die Leistung des ESP32-Chips beeinträchtigt und zu Stabilitätsproblemen führen kann.

## Aktualisierung der Firmware

Bei einem Upgrade oder Downgrade zwischen verschiedenen EMS-ESP-Versionen übernimmt EMS-ESP die Migration der Einstellungen, um die Kompatibilität mit der neu installierten Version zu gewährleisten. Eine Rückkehr von 3.10.0 zu einer älteren Version bildet hier eine Ausnahme; siehe [Going back to an older version](#zurück-zu-einer-älteren-version).

Lesen Sie vor einem Upgrade stets den [ChangeLog](Version-Release-History.md) mit den Versionshinweisen und Informationen zu etwaigen kompatibilitätsbeeinträchtigenden Änderungen.

### Upgrade auf 3.10.x

:::warning[Kein Zurücksetzen auf die Werkseinstellungen erforderlich]

Wenn Sie über die Web-Benutzeroberfläche einer Version 3.8.x einen Entwicklungs-Build 3.9.0 oder höher installieren, wird im Dialogfeld angezeigt, dass für das Upgrade ein Zurücksetzen auf die Werkseinstellungen erforderlich ist. Dies ist jedoch nicht der Fall, ignorieren Sie diesen Teil der Meldung daher bitte. Ihre Einstellungen bleiben erhalten und werden migriert. Beim Upgrade auf 3.10.0 wird diese Meldung nicht angezeigt.

Beachten Sie außerdem, dass sich die MAC-Adresse ändert und sich wahrscheinlich auch die vom DHCP zugewiesene IP-Adresse ändert. Verwenden Sie mDNS (`name.local`) oder Ihren Router, um die neue Adresse zu ermitteln.

:::

Bevor Sie das Upgrade durchführen:

1. **Erstellen Sie eine Systemsicherung** unter „Einstellungen“ > Download/Upload. Nach dem Upgrade werden Passwörter in gehashter Form gespeichert und können von älteren Versionen nicht gelesen werden. Für einen Rückfall auf Version 3.8.x oder 3.9.x ist diese Sicherung daher erforderlich.
2. **Beachten Sie, welche Integrationen die API nutzen**, wie z. B. Home Assistant-REST-Sensoren, Prometheus, Node-RED, Dashboards oder Skripte, einschließlich solcher, die Werte nur ohne Token auslesen. Nach dem Upgrade ist für jeden Aufruf von `/api` ein API-Schlüssel erforderlich, und Zugriffstoken funktionieren nicht mehr.

Nach dem Upgrade:

1. **Legen Sie neue Passwörter fest, falls Sie noch die werkseitigen Passwörter verwenden.** Ein Administrator, der sich mit einem werkseitigen Passwort anmeldet, muss ein neues Administratorpasswort festlegen, bevor die Web-Benutzeroberfläche genutzt werden kann, sowie ein neues Passwort für den Zugangspunkt, falls noch kein WLAN-Netzwerk eingerichtet ist.
2. **Erstellen Sie für jede Integration einen API-Schlüssel** unter „Sicherheit“ > „API-Schlüssel“ und senden Sie diesen als `Authorization: Bearer <key>`. Wählen Sie „Lesen“ für Integrationen, die nur Werte auslesen, und „Lesen und Schreiben“ für solche, die Einstellungen oder Werte ändern. Um einen Wert in einem Browser auszulesen, öffnen Sie die `/api`-Adresse und melden Sie sich an, wenn der Browser Sie dazu auffordert.
3. **Prüfen Sie, welche Aktionen Gastbenutzer ausführen dürfen.** Nur Administratoren können den Scheduler, Befehle, benutzerdefinierte Entitäten und Module ändern. Befehle, die bereits vor dem Upgrade vorhanden waren, können weiterhin von Gastbenutzern ausgeführt werden; bei neuen Befehlen aktivieren Sie das Kontrollkästchen „Gastbenutzer dürfen diesen Befehl ausführen“, falls dies gewünscht ist.
4. **Überprüfen Sie den Scheduler und die Befehle auf Einträge, die Sie nicht erstellt haben.** Vor 3.10.0 konnten Gastbenutzer und Aufrufe ohne Token solche Einträge hinzufügen, und diese bleiben nach dem Upgrade erhalten. Planer-Einträge werden mit Administratorrechten ausgeführt. Löschen Sie alle Einträge, die Sie nicht erkennen, und deaktivieren Sie bei Befehlen, die Gäste nicht benötigen, die Option „Gäste dürfen diesen Befehl ausführen“.

#### Home Assistant

Geräte, die Home Assistant über MQTT Discovery erkennt, funktionieren weiterhin – hier sind keine Änderungen erforderlich. Lediglich die Teile Ihrer Konfiguration, die `/api` direkt aufrufen, wie beispielsweise `rest`-Sensoren und `rest_command`, benötigen einen API-Schlüssel:

1. Erstellen Sie unter „Sicherheit > API-Schlüssel“ einen Schlüssel für Home Assistant. Wählen Sie „Lesen“, wenn Sie nur `rest`-Sensoren verwenden, und „Lesen und Schreiben“, wenn Sie auch `rest_command` zum Ändern von Werten nutzen.
2. Fügen Sie den Schlüssel als Header zu jedem `rest`-Sensor und jedem `rest_command` hinzu, der EMS-ESP aufruft, auch zu denen, die nur lesen:

   ```yaml
   headers:
     authorization: 'Bearer emsesp_...'
   ```

3. Entfernen Sie alle `?access_token=...`-Angaben aus den URLs, da ein solches Token in der URL nicht mehr funktioniert.
4. Starten Sie Home Assistant neu oder laden Sie die REST-Entitäten neu.

Vollständige Beispiele finden Sie unter [Home Assistant](Home-Assistant#einen-wert-über-die-api-auslesen).

#### ioBroker

Der [ioBroker ems-esp adapter](https://github.com/tp1de/ioBroker.ems-esp) (7.0.8 und ältere Versionen) liest Werte aus, ohne einen Schlüssel zu senden, und sendet das Token erst, wenn sich ein Wert ändert. Der API-Schlüssel wird an zwei Stellen benötigt:

1. Erstellen Sie unter „Sicherheit > API-Schlüssel“ einen Schlüssel mit „Lese- und Schreibzugriff“ für ioBroker.
2. Ändern Sie in den Adapter-Einstellungen die EMS-ESP-Adresse so, dass sie den Schlüssel enthält, zum Beispiel `http://iobroker:emsesp_...@192.168.1.10`. Der Name vor dem `:` kann beliebig sein. Dadurch kann der Adapter Werte auslesen.
3. Fügen Sie denselben Schlüssel in das Feld „EMS-ESP-Zugriffstoken“ des Adapters ein und ersetzen Sie damit das alte Zugriffstoken. Dadurch kann der Adapter Werte ändern.
4. Speichern Sie die Änderungen und starten Sie die Adapterinstanz neu.

Sie müssen Ihr Backup nach dem Upgrade nicht hochladen. Bewahren Sie es auf, falls Sie wieder auf 3.8.x oder 3.9.x zurückwechseln möchten. Die vollständige Liste der kompatibilitätsbrechenden Änderungen finden Sie unter [ChangeLog](Version-Release-History.md).

### Zurück zu einer älteren Version

Ab 3.10.0 werden Passwörter in gehashtem Format gespeichert. Ältere Versionen interpretieren den gespeicherten Hash so, als wäre er das Passwort selbst. Daher funktioniert Ihr übliches Passwort nach einem Downgrade auf 3.8.x oder 3.9.x nicht mehr.

Der einfachste Weg zurück ist, die vor dem Upgrade erstellte Systemsicherung wiederherzustellen: Installieren Sie die ältere Version, führen Sie einen Werksreset durch, melden Sie sich mit dem werkseitigen `admin`-Benutzer an und laden Sie die Sicherung unter „Einstellungen“ > Download/Upload hoch.

Wenn Sie keine solche Sicherung haben oder Ihre Einstellungen ohne Zurücksetzen auf die Werkseinstellungen beibehalten möchten, melden Sie sich über die serielle Konsole (USB) an:

1. Stellen Sie eine Verbindung zur seriellen Konsole her und geben Sie `su` ein. Das Passwort lautet `ems-esp-neo`, da 3.10.0 das Superuser-Passwort aus den Einstellungen entfernt hat.
2. Geben Sie `show users` ein. Das Passwort jedes Benutzers wird als langer Text angezeigt, der mit `$pbkdf2-sha2562. Geben Sie `show users` ein. Das Passwort jedes Benutzers wird als langer Text angezeigt, der mit  beginnt.
3. Melden Sie sich mit diesem Benutzernamen und dem gesamten Text – von `$pbkdf2-sha2563. Melden Sie sich mit diesem Benutzernamen und dem gesamten Text – von  bis zum Ende – als Passwort bei der Web-Benutzeroberfläche an.
4. Legen Sie unter „Sicherheit > Benutzer“ für jeden Benutzer ein neues Passwort fest und ändern Sie unter „Sicherheit > Einstellungen“ das Superuser-Passwort.

Andernfalls können Sie durch ein Zurücksetzen auf die Werkseinstellungen wieder Zugriff erhalten, dabei werden jedoch alle Einstellungen gelöscht.

:::warning[Ältere Versionen weisen bekannte Sicherheitslücken auf]

In den Versionen vor 3.10.0 wurden die in 3.10.0 behobenen Sicherheitslücken bereits behoben. Führen Sie ein Downgrade nur durch, wenn es unbedingt erforderlich ist, deaktivieren Sie Telnet und führen Sie so bald wie möglich wieder ein Upgrade durch.

:::

### Offizielle und benutzerdefinierte Builds

Ab 3.10.0 prüft EMS-ESP, ob es sich bei der Firmware um einen offiziellen Build handelt, wenn Sie eine Firmware-Datei über die Web-Benutzeroberfläche hochladen, eine Version aus der Versionsliste der Web-Benutzeroberfläche installieren oder diese über die Recovery-App hochladen. Offizielle Releases und Entwicklungsversionen von [GitHub](https://github.com/emsesp/EMS-ESP32/releases) sind von EMS-ESP signiert und werden sofort installiert. Auf der Seite „Version“ wird neben der Versionsnummer „Offizieller Build“ angezeigt.

Alles andere ist ein benutzerdefinierter Build, zum Beispiel einer, den Sie selbst erstellt haben, ein Community-Build, eine Version, die älter ist als 3.10.0, oder ein Dateisystem-Image. Die Web-Benutzeroberfläche zeigt dann vor der Installation die Meldung „Dies ist kein offizieller EMS-ESP-Build“ an. Klicken Sie auf „Trotzdem installieren“, um die Installation fortzusetzen, oder lassen Sie es sein, wenn Sie dies nicht erwartet haben. Auf der Seite „Version“ wird dann „Benutzerdefinierte Version“ angezeigt.

Installieren Sie eine benutzerdefinierte Version nur, wenn Sie der Quelle vertrauen. Wenn Sie eine offizielle Version erwartet haben, wurde die Datei möglicherweise verändert oder beschädigt, beispielsweise durch einen Browser oder einen Download-Manager. Laden Sie sie erneut von der Release-Seite herunter.

Die Option „Flashen über USB mit [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher) oder esptool“ ist nicht aktiviert.

Wenn Sie Ihre eigene Firmware erstellen, lesen Sie bitte [Installing your own build](https://github.com/emsesp/EMS-ESP32/blob/dev/CONTRIBUTING.md#installing-your-own-build).

### Warum werde ich erneut nach meinem Passwort gefragt?

Bei 3.10.0 fordert die Web-Benutzeroberfläche Sie erneut zur Eingabe Ihres Passworts auf, bevor Änderungen vorgenommen werden, die die Kontrolle über das Gerät übernehmen oder Sie aus dem Gerät aussperren könnten:

- das Hochladen oder Installieren von Firmware, einschließlich der Recovery-App, sowie das Wechseln zur anderen Firmware-Partition
- ein Backup wiederherstellen oder eines mit Passwörtern und Schlüsseln herunterladen
- ein Zurücksetzen auf die Werkseinstellungen
- Hinzufügen, Ändern oder Entfernen von Benutzern und Passwörtern sowie Erstellen oder Widerrufen von API-Schlüsseln
- CORS aktivieren, zulässige Hostnamen hinzufügen oder Telnet aktivieren

Nach der Eingabe werden Sie in diesem Browser 5 Minuten lang nicht erneut dazu aufgefordert. Eine erneute Anmeldung oder ein Neustart von EMS-ESP beendet diesen Vorgang.

Skripte, die diese Änderungen über eine Web-UI-Anmeldung vornehmen, erhalten den HTTP-Status 428. Sie müssen das Passwort zunächst mit `POST /rest/confirmPassword` und den Hauptteil `{"password":"..."}` unter Verwendung desselben Tokens senden. Integrationen mit API-Schlüsseln und MQTT sind davon nicht betroffen.

### Firmware über eine URL installieren

Ab 3.10.0 kann die Firmware nur noch über eine URL einer EMS-ESP-Version auf GitHub installiert werden, die mit `https://github.com/emsesp/EMS-ESP32/releases/` beginnt. Die Versionsliste der Web-Benutzeroberfläche verwendet stets diese URLs. Alle anderen Dateien sollten stattdessen heruntergeladen und über die Web-Benutzeroberfläche hochgeladen werden.

### Firmware-Rollback

Ab 3.9.1 wird eine neu installierte Firmware erst dann beibehalten, wenn sie 2 Minuten lang gelaufen ist. Wenn sie vorher abstürzt oder neu startet, kehrt das Gateway zur zuvor ausgeführten Firmware zurück. Ist keine vorhanden, starten Boards mit dem [Recovery App](#wiederherstellungs-app) stattdessen die Recovery-App. Dies funktioniert auf allen Boards, auch auf den 4-MB-Modellen, da EMS-ESP immer über zwei Firmware-Partitionen verfügt (`app0` und `app1`).

Dies gilt für Firmware, die installiert wird, während EMS-ESP oder die Recovery-App ausgeführt wird: beim Hochladen einer Datei über die Web-Benutzeroberfläche, beim Installieren einer Version aus der Versionsliste der Web-Benutzeroberfläche oder beim Hochladen in der Recovery-App. Das Flashen über USB mit [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher) oder esptool wird nicht überprüft; diese Firmware wird sofort beibehalten.

Jeder Neustart in den ersten 2 Minuten zählt, auch wenn Sie selbst auf „Neustart“ klicken. Warten Sie daher, bis die Firmware bestätigt wurde. Es gibt zwei Ausnahmen:

- Wenn EMS-ESP die Einstellungen aus einer älteren Version übernimmt und neu startet, um sie zu übernehmen, behält es zunächst die neue Firmware bei
- Wenn du innerhalb der ersten 2 Minuten eine andere Firmware installierst, bleibt die aktuell ausgeführte Firmware zunächst erhalten.

Das Systemprotokoll zeigt, was passiert:

| Botschaft | Bedeutung |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `New firmware, it will be confirmed after running for 120 seconds` | wird beim Start angezeigt; die neue Firmware befindet sich in der Testphase |
| `New firmware confirmed as working` | Die 2 Minuten sind abgelaufen, die Firmware bleibt erhalten |
| `Firmware in partition app1 failed to start and was rolled back`   | Die Firmware in `app1` (oder `app0`) hielt nicht einmal zwei Minuten durch, das Gateway wechselte wieder zur anderen zurück |

Die Überprüfung erfolgt durch den Bootloader, das kleine Programm am Anfang des Flash-Speichers, das auswählt, welche Firmware gestartet werden soll. Bei der Installation der Firmware über die Web-Benutzeroberfläche wird der Bootloader niemals ersetzt, dies geschieht nur beim Flashen über USB. Gateways, die über USB mit 3.9.0 geflasht wurden, verfügen über einen Bootloader ohne Rollback-Funktion. Sie funktionieren weiterhin normal, aber ein fehlgeschlagenes Update wird nicht rückgängig gemacht. Wenn nach der Installation einer neuen Firmware über die Web-Benutzeroberfläche die erste Meldung nicht angezeigt wird, flashen Sie 3.9.1 oder eine neuere Version einmal über USB, um einen Bootloader mit Rollback zu erhalten.

Nachdem die Firmware bestätigt wurde, überwacht EMS-ESP Systemabstürze: Auf Boards mit der Recovery-App startet EMS-ESP die Recovery-App, nachdem es fünfmal hintereinander zu einem Systemabsturz gekommen ist (siehe [When it starts](#wann-es-losgeht)).

## Wiederherstellungs-App

Ab 3.9.0 kann auf Boards mit 16 MB oder 32 MB Flash die EMS-ESP Recovery App installiert werden. Es handelt sich um eine kleine, separate Firmware, die in einem eigenen Bereich des Flash-Speichers (der `boot`-Partition) neben den beiden Partitionen für EMS-ESP (`app0` und `app1`) gespeichert ist. Falls EMS-ESP nicht mehr startet oder ein Firmware-Update fehlgeschlagen ist, können Sie mit der Recovery-App das Gateway über einen Browser wieder in Betrieb nehmen, ohne es über USB anzuschließen. Auf den 4-MB-Boards ist dafür kein Platz.

EMS-ESP 3.9.0 wird mit der Wiederherstellungs-App 1.0.0 geliefert, und 3.10.0 mit der Wiederherstellungs-App 1.1.0. Für die mit **[3.10.0]** gekennzeichneten Funktionen ist die Recovery-App 1.1.0 erforderlich, siehe [What's new in 3.10.0](#was-ist-neu-in-3100).

### Was es kann

Nach der Anmeldung zeigt die Recovery-App ein Dashboard an, in dem Sie folgende Möglichkeiten haben:

- **Firmware hochladen**: Installieren Sie eine EMS-ESP-Firmware-Datei `.bin` in einer der EMS-ESP-Partitionen. Standardmäßig wird zunächst eine leere Partition ausgewählt, dann eine, auf der die Firmware nicht gestartet werden konnte, und andernfalls die mit der ältesten Firmware, sodass eine funktionierende Firmware als Ausweichlösung erhalten bleibt. Sie können die Partition auch selbst auswählen. Sie können die `.md5`-Datei auch zunächst hochladen, um die Firmware zu überprüfen.
  - **[3.10.0]** Wie in der Web-Benutzeroberfläche wird ein offizieller Build sofort installiert, während bei einem benutzerdefinierten Build zunächst eine Bestätigung abgefragt wird, siehe [Official and custom builds](#offizielle-und-benutzerdefinierte-builds).
- **Firmware starten**: Neustart mit einer der installierten EMS-ESP-Firmware-Versionen. Die Tabelle zeigt die Version und das Installationsdatum der jeweiligen Firmware an und gibt eine Warnung aus, wenn der Start einer Firmware zuvor fehlgeschlagen ist.
- **Auf Werkseinstellungen zurücksetzen**: Alle EMS-ESP-Einstellungen werden gelöscht. Diese Option wird nicht angezeigt, wenn das Zurücksetzen auf die Werkseinstellungen in den EMS-ESP-Einstellungen deaktiviert ist.
  - **[3.10.0]** Die gesamte Dateisystempartition und der Absturz-Dump werden ebenfalls gelöscht, sodass alte Passwörter und Schlüssel nicht mehr aus dem Flash-Speicher ausgelesen werden können.
- **[3.10.0] Absturz-Dump**: Laden Sie den Dump des letzten Absturzes herunter oder löschen Sie ihn; siehe [Reporting a crash](#einen-absturz-melden). Dieser Abschnitt wird nur angezeigt, wenn ein Dump vorhanden ist.

Außerdem werden der Grund für den Start, der Chip, das Netzwerk, mit dem er verbunden ist, sowie die installierten Firmware-Versionen angezeigt.

Die Recovery-App liest lediglich die EMS-ESP-Einstellungen aus, ändert diese jedoch niemals – außer bei einem Zurücksetzen auf die Werkseinstellungen. Sie kann weder ein Dateisystem-Image installieren noch ein Backup wiederherstellen.

### Installation und Aktualisierung

Öffnen Sie in der EMS-ESP-Weboberfläche **Einstellungen > Version**. Auf Boards, die dies unterstützen, gibt es eine Zeile **Recovery App** mit der installierten Version oder dem Hinweis „Nicht installiert“. Klicken Sie auf die Schaltfläche „Installieren“, um die neueste Version von GitHub herunterzuladen. **[3.10.0]** Wenn eine neuere Version verfügbar ist, wird sie über dieselbe Schaltfläche aktualisiert, und in der Zeile wird angezeigt, ob es sich bei der installierten Recovery-App um einen offiziellen Build handelt. Sie können die `EMS-ESP-Recovery-<version>-<chip>-16MB[+].bin`-Datei auch über den [release page](https://github.com/emsesp/EMS-ESP32/releases) herunterladen und wie eine normale Firmware hochladen. Die Installation der Recovery-App führt keinen Neustart des EMS-ESP durch und hat keinerlei Auswirkungen auf Ihre Einstellungen oder die installierte EMS-ESP-Firmware.

Die Recovery-App kann nur über EMS-ESP installiert werden, nicht über die Recovery-App selbst.

### Wann es losgeht

Die Recovery-App wird gestartet:

- wenn Sie auf der Seite **Einstellungen > Version** auf **„Im Wiederherstellungsmodus neu starten“** klicken
- wenn Sie die GPIO-Taste etwa 10 Sekunden lang gedrückt halten, sofern die Werksrücksetzung in den EMS-ESP-Einstellungen nicht deaktiviert ist
- automatisch, wenn EMS-ESP nach einem Neustart fünfmal hintereinander abstürzt
- automatisch, wenn eine neu installierte Firmware innerhalb der ersten 2 Minuten abstürzt oder neu startet und keine vorherige Firmware vorhanden ist, auf die zurückgegriffen werden kann; siehe [Firmware rollback](#firmware-rollback)

### Verbindung herstellen

Die Recovery-App verwendet die von EMS-ESP gespeicherten Netzwerkeinstellungen:

- Die Verbindung erfolgt über Ethernet, sofern dies auf Ihrer Platine eingerichtet ist, andernfalls über WLAN, wobei die statische IP-Adresse verwendet wird, sofern Sie eine festgelegt haben. Rufen Sie die Seite in einem Browser über die übliche IP-Adresse oder `http://<hostname>.local` auf.
- Es wird immer auch ein Zugangspunkt gestartet, der nach Ihrem EMS-ESP-Zugangspunkt benannt ist, wobei `-recovery` hinzugefügt wird, zum Beispiel `ems-esp-recovery`, mit demselben Zugangspunkt-Passwort. Stellen Sie eine Verbindung dazu her und öffnen Sie `http://192.168.4.1` oder die IP-Adresse des Zugangspunkts, die Sie in EMS-ESP festgelegt haben.

Melden Sie sich mit einem bestehenden EMS-ESP-Administrator-Benutzernamen und -Passwort an. Gastbenutzer können sich nicht anmelden. Wenn die Einstellungen nicht gelesen werden können, beispielsweise nach einem Zurücksetzen auf die Werkseinstellungen, verwenden Sie die werkseitige `admin`-Anmeldung. In diesem Fall ist das Zurücksetzen auf die Werkseinstellungen nicht möglich.

**[3.10.0]** Nach mehreren fehlgeschlagenen Anmeldeversuchen fordert die Recovery-App Sie auf, einige Minuten zu warten, bevor Sie es erneut versuchen.

### Zurück zu EMS-ESP

Durch einen Neustart des Gateways oder durch Aus- und Einschalten bleibt es in der Recovery-App. Um den Modus zu verlassen, klicken Sie neben einer funktionierenden EMS-ESP-Firmware auf **Firmware starten** oder laden Sie eine neue Firmware hoch, die nach dem Hochladen gestartet wird.

### Was ist neu in 3.10.0?

Die Wiederherstellungs-App 1.1.0, die zusammen mit EMS-ESP 3.10.0 veröffentlicht wurde, bietet folgende zusätzliche Funktionen:

- eine Überprüfung, ob es sich bei der hochgeladenen Firmware um eine offizielle EMS-ESP-Version handelt, mit der Option „Trotzdem installieren“ für eine benutzerdefinierte Version
- der Abschnitt **Crash-Dump** mit einer Zusammenfassung des Absturzes und Schaltflächen zum Herunterladen oder Löschen des Dumps
- Unterstützung für die gehashte Passwörter von 3.10.0
- eine Begrenzung der fehlgeschlagenen Anmeldeversuche
- eine Werksrücksetzung, bei der auch die gesamte Dateisystempartition und der Absturz-Dump gelöscht werden
- Firmware-Uploads, die bei einer fehlgeschlagenen Prüfung niemals bootfähig bleiben

:::warning[Aktualisieren Sie die Wiederherstellungs-App nach dem Upgrade auf 3.10.0]

Ab Version 3.10.0 speichert EMS-ESP Passwörter in gehashter Form. Die Wiederherstellungs-App 1.0.0 aus 3.9.0 kann diese nicht lesen, sodass Ihr übliches Administratorpasswort dort nicht mehr funktioniert. Nach dem Upgrade von EMS-ESP auf 3.10.0 aktualisieren Sie die Wiederherstellungs-App unter **Einstellungen > Version**.

Wenn Sie sich nicht bei der Recovery-App 1.0.0 anmelden können, verwenden Sie den gesamten gespeicherten Hash, beginnend mit `$pbkdf2-sha256Wenn Sie sich nicht bei der Recovery-App 1.0.0 anmelden können, verwenden Sie den gesamten gespeicherten Hash, beginnend mit , als Passwort. Der Konsolenbefehl `show users` in EMS-ESP zeigt dies an, siehe [Going back to an older version](#zurück-zu-einer-älteren-version). Falls EMS-ESP überhaupt nicht startet, flashen Sie es über USB mit dem Befehl [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher).

:::

## Was tun, wenn EMS-ESP abstürzt?

Ausgehend von 3.10.0 speichert der ESP32 bei einem Absturz von EMS-ESP (Panik, `abort()`, Stapelüberlauf oder Watchdog) vor dem Neustart einen Absturz-Dump im Flash-Speicher. Der Dump bleibt nach dem Neustart erhalten und wird so lange aufbewahrt, bis er durch den nächsten Absturz ersetzt wird oder bis Sie ihn löschen.

Nur Boards mit 16 MB oder 32 MB Flash-Speicher bieten Platz für einen Crash-Dump, die 4-MB-Boards hingegen nicht. Bei einer Spannungsabfall, einem Stromausfall oder einem normalen Neustart wird kein Dump geschrieben.

### Einen Absturz melden

Nach dem Neustart schreibt EMS-ESP `Crash dump found: ...` in das Systemprotokoll, und `/api/system/info` zeigt im Abschnitt `system` dieselbe Zusammenfassung wie `coredump`. Zum Beispiel:

```text
task=async_tcp pc=0x400d1234 cause=28 vaddr=0x00000000 bt=0x400d1234 0x400d5678 0x400e9abc sha=1a2b3c4d5 reason=LoadProhibited
```

Kopieren Sie diese Zeile in ein [GitHub issue](https://github.com/emsesp/EMS-ESP32/issues), zusammen mit der EMS-ESP-Version und Ihrer Platine sowie einer Beschreibung dessen, was unmittelbar vor dem Absturz passiert ist. Die Entwickler können anhand der Adressen die Stelle im Code ermitteln, an der der Absturz aufgetreten ist.

Wenn möglich, fügen Sie dem Ticket bitte auch den vollständigen Absturz-Dump bei. Laden Sie ihn als Administrator herunter:

- in EMS-ESP: **Einstellungen > Download/Upload**, Schaltfläche **Crash-Dump**. Diese wird nur angezeigt, wenn ein Dump vorliegt. Skripte können `GET /rest/coredump` verwenden.
- in der EMS-ESP-Wiederherstellung: im Abschnitt **Crash Dump** auf dem Dashboard, nachdem Sie sich angemeldet haben. Dort wird auch die Zusammenfassungszeile angezeigt. Dies ist hilfreich, wenn EMS-ESP so häufig abgestürzt ist, dass das Board stattdessen die Wiederherstellung gestartet hat.

Beide speichern eine `coredump.bin`-Datei.

Löschen Sie anschließend den Speicherauszug, damit der nächste Absturz eindeutig als neuer Absturz erkannt wird: Führen Sie `call system coredump` in der Konsole aus oder senden Sie `POST /api/system/coredump` als Administrator.

| Feld    | Bedeutung |
| -------- | -------------------------------------------------------------------------------- |
| `task`   | die Aufgabe, bei der es zu einem Absturz kam |
| `pc`     | die Adresse in der Firmware, an der der Absturz auftrat |
| `cause`  | die Ursache der Ausnahme auf dem ESP32, z. B. 28 = LoadProhibited, 29 = StoreProhibited |
| `vaddr`  | die Speicheradresse, auf die zugegriffen wurde; ein Wert nahe 0 bedeutet in der Regel einen Nullzeiger |
| `bt`     | der Backtrace, wobei die zum Absturz führende Funktion an erster Stelle steht und danach ihre Aufrufer folgen |
| `sha`    | der Anfang des SHA256-Hashwerts der Firmware, bei der es zu einem Absturz kam |
| `reason` | der Grund für die Panik, z. B. die `abort()`- oder Watchdog-Meldung |

Bei C3 und C6 gibt es keinen Backtrace, sondern nur `ra` (Rückkehradresse), `mcause` und `mtval`.

### Einen Absturz-Dump selbst entschlüsseln

Für die Dekodierung wird die Datei `firmware.elf` genau des Builds benötigt, bei dem der Absturz aufgetreten ist. Wenn Sie EMS-ESP selbst kompilieren, wird von jedem Build eine gzip-komprimierte Kopie unter dem Namen `build/elf/<variant>-<sha>.elf.gz` gespeichert, wobei `<sha>` mit dem Eintrag `sha` in der Absturzübersicht übereinstimmt. Entpacken Sie diese mit `gunzip -k`. Diese Dateien sind jeweils etwa 20 MB groß, löschen Sie daher von Zeit zu Zeit alte Dateien.

Wandeln Sie die Adressen aus der Zusammenfassung in Funktions-, Datei- und Zeilenadressen um:

```bash
# ESP32, use xtensa-esp32s3-elf-addr2line for the S3 and xtensa-esp32s2-elf-addr2line for the S2
~/.platformio/packages/toolchain-xtensa-esp-elf/bin/xtensa-esp32-elf-addr2line -pfiaC \
  -e .pio/build/s_16M_P/firmware.elf 0x400d1234 0x400d5678 0x400e9abc

# C3/C6, pass the pc and ra
~/.platformio/packages/toolchain-riscv32-esp/bin/riscv32-esp-elf-addr2line -pfiaC \
  -e .pio/build/c3_mini_4M/firmware.elf 0x42001234 0x42005678
```

Dekodiere für die Stacks und Register jeder Aufgabe das heruntergeladene `coredump.bin` mit dem `firmware.elf`:

```bash
~/.platformio/penv/bin/esp-coredump info_corefile -t raw -c coredump.bin .pio/build/s_16M_P/firmware.elf
```

Oder schließen Sie die Platine über USB an und lassen Sie `esp-coredump` den Speicherauszug in einem Schritt lesen und dekodieren:

```bash
~/.platformio/penv/bin/esp-coredump --port /dev/ttyUSB0 info_corefile .pio/build/s_16M_P/firmware.elf
```

Oder speichern Sie den Dump über USB in einer Datei und dekodieren Sie diese später:

```bash
# 16MB layout: 0xFF0000, 32MB layout: 0x1FF0000
~/.platformio/penv/bin/esptool.py --port /dev/ttyUSB0 read_flash 0xFF0000 0x10000 coredump.bin
~/.platformio/penv/bin/esp-coredump info_corefile -t raw -c coredump.bin .pio/build/s_16M_P/firmware.elf
```

Verwenden Sie `dbg_corefile` anstelle von `info_corefile`, um den Speicherauszug in GDB zu öffnen. Bei anderen Partitionslayouts ermitteln Sie den Offset der `coredump`-Partition mithilfe von `python gen_esp32part.py .pio/build/<env>/partitions.bin`.

Der Panik-Handler gibt außerdem den Backtrace über den seriellen Port aus. Bei einem schwer reproduzierbaren Absturz sollten Sie einen seriellen Monitor verwenden, der die Daten in eine Datei protokolliert; so können Sie auch nachvollziehen, was unmittelbar vor dem Absturz geschehen ist:

```bash
pio device monitor -e s_16M_P -f esp32_exception_decoder -f log2file
```
