---
id: FAQ
title: Frequently Asked Questions
description: Common questions and answers about EMS-ESP including factory reset, EMS telegrams, and troubleshooting
---

# Häufig gestellte Fragen

## Wie führt man einen Werksreset des EMS-ESP durch?

Wenn Sie einen GPIO-Taster konfiguriert haben (auf allen BBQKees-Boards standardmäßig aktiviert), wird durch 10 Sekunden langes Drücken und anschließendes Loslassen ein Werksreset durchgeführt. EMS-ESP wird im Access-Point-Modus neu gestartet.

## Was ist ein EMS-Telegramm?

Verfasst von MichaelDvP in [this article](https://github.com/emsesp/EMS-ESP32/discussions/1612#discussioncomment-8408868):

Den besten Überblick über bekannte Telegramme bieten [Norberts1](https://github.com/norberts1/hometop_HT3/blob/master/HT3/docu/HT_EMS_Bus_messages.pdf) und [EMS-Wiki](https://emswiki.thefischer.net/doku.php). Generell lässt sich sagen:

- Die Messwerte werden in regelmäßigen Abständen von 10 Sekunden bzw. 1 Minute übertragen.
- Einstellungen werden erst nach einer Änderung übertragen
- Wenn eine Einstellung eines Geräts über die Benutzeroberfläche des Thermostats geändert wird, erscheint die Meldung „Thermostat -w-> Gerät“ mit ausschließlich diesem Wert.
- Manche Geräte senden sich schnell ändernde Werte als Einzelwerte
- Die gemessenen Temperaturen werden normalerweise als 2 Bytes (SHORT) mit dem Faktor 0,1 angegeben (z. B. 01 23 -> 0x0123 -> dez 291 -> 29,1 °C)
- Lufttemperaturwerte werden oft mit dem Faktor 0,5 als Einzelbyte (INT) angegeben (z. B. 0x2D → Dez. 45 → 22,5 °C)
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
  Die Raumtemperatur messen und den Heizkessel einschalten, wobei die Heizungsabschaltung aktiviert ist, wenn die Raumtemperatur den Sollwert überschreitet. Um häufiges Ein- und Ausschalten zu vermeiden, eine Hysterese hinzufügen.
- raumgesteuert, dynamisch
  Hier muss eine PID-Regelung berechnet werden. Das geht etwas über den Rahmen des ems-esp-Schedulers hinaus. Aber vielleicht ist es möglich. Bei HA kannst du unter „Implementierung eines intelligenten Thermostats (mit SAT)“ nachlesen. Siehe [#2103](https://github.com/emsesp/EMS-ESP32/issues/2103)
- Steuerung über intelligente Thermostatventile (TRVs):
  Wenn Sie den Öffnungsgrad der Thermostatventile ablesen können, richten Sie eine einfache I-Regelung ein. Ist ein Thermostatventil vollständig geöffnet: Erhöhen Sie die Vorlauftemperatur; liegt der Öffnungsgrad des am weitesten geöffneten Thermostatventils unter 90 %: Verringern Sie die Vorlauftemperatur. Das Aufheizen ist ein langsamer Prozess, gehen Sie daher increase/decrease vorsichtig vor.

Wenn Sie mehr darüber erfahren möchten, lesen Sie doch einmal diese Beiträge:

- [Smart control a heating system with HA?](https://github.com/emsesp/EMS-ESP32/discussions/965)
- [Thermostat emulation](https://github.com/emsesp/EMS-ESP32/issues/151)
- [Changing the boiler heating directly](tips-and-tricks#steuerung-der-kesselheizung)
- [Implementing a smart thermostat (using SAT)](https://github.com/emsesp/EMS-ESP32/issues/2103)

## Was sind Busprotokolle und Übertragungsmodi?

Protokoll und Timing sind zwei verschiedene Dinge; man wählt den Übertragungsmodus, der am besten funktioniert.

HT3 ist die Elektronik von Junkers, und das HT3-Protokoll entspricht dem EMS-Protokoll, lediglich im ersten Byte (Absender) ist das höchste Bit gesetzt. Jedes von uns gesendete Telegramm beginnt in einem Buderus-System mit 0B, bei Junkers hingegen mit 8B. Dies führt dazu, dass die Geräte der verschiedenen Marken nicht miteinander kompatibel sind. EMS-ESP überprüft den Bus beim Start und wählt automatisch das richtige Protokoll aus. Außerdem verwendet Junkers ein anderes Telegramm numbers/orders. Module der Marke Bosch verwenden zwar dieselben Telegrammnummern wie Buderus, adressieren jedoch wie Junkers, sodass auch sie inkompatibel sind. Sie können keine Junkers- oder Buderus-Module an eine Bosch-Heizungsanlage anschließen.

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

Bei einem Upgrade oder Downgrade zwischen verschiedenen EMS-ESP-Versionen übernimmt EMS-ESP die Migration der Einstellungen, um die Kompatibilität mit der neu installierten Version zu gewährleisten.

Lesen Sie vor einem Upgrade stets die [ChangeLog](Version-Release-History.md), um sich über die Versionshinweise und etwaige Änderungen, die Kompatibilitätsprobleme verursachen könnten, zu informieren.

### Upgrade von 3.8.x auf 3.10.x

:::warning[Kein Zurücksetzen auf die Werkseinstellungen erforderlich]

Wenn Sie eine 3.9.0-Entwicklungsversion über die Web-Benutzeroberfläche einer 3.8.x-Version installieren, wird im Dialogfeld angezeigt, dass für das Upgrade ein Zurücksetzen auf die Werkseinstellungen erforderlich ist. Dies ist jedoch nicht der Fall, ignorieren Sie diesen Teil der Meldung daher. Ihre Einstellungen bleiben erhalten und werden migriert. Beim Upgrade auf 3.10.0 wird diese Meldung nicht angezeigt.

:::

Bevor Sie das Upgrade durchführen:

1. **Erstellen Sie eine Systemsicherung** unter „Einstellungen“ > Download/Upload. Nach dem Upgrade werden Passwörter in gehashter Form gespeichert, und die Version 3.8.x kann diese nicht lesen. Für einen Rückfall auf die Version 3.8.x ist diese Sicherung daher erforderlich; andernfalls ist ein Zurücksetzen auf die Werkseinstellungen erforderlich.
2. **Beachten Sie, welche Integrationen die API nutzen**, beispielsweise Home Assistant REST-Sensoren, Node-RED oder Skripte. Deren Zugriffstoken funktionieren nach dem Upgrade nicht mehr.

Nach dem Upgrade:

1. **Legen Sie neue Passwörter fest, falls Sie noch die werkseitigen Passwörter verwenden.** Ein Administrator, der sich mit einem werkseitigen Passwort anmeldet, muss ein neues Administratorpasswort festlegen, bevor die Web-Benutzeroberfläche genutzt werden kann, sowie ein neues Passwort für den Zugangspunkt, falls noch kein WLAN-Netzwerk eingerichtet ist.
2. **Erstellen Sie für jede Integration einen API-Schlüssel** unter „Sicherheit“ > „API-Schlüssel“ und senden Sie diesen als `Authorization: Bearer <key>`. Wählen Sie „Lesen“ für Integrationen, die nur Werte auslesen, und „Lesen und Schreiben“ für solche, die Einstellungen oder Werte ändern.
3. **Prüfen Sie, welche Aktionen Gastbenutzer ausführen dürfen.** Nur Administratoren können den Scheduler, Befehle, benutzerdefinierte Entitäten und Module ändern. Befehle, die bereits vor dem Upgrade vorhanden waren, können weiterhin von Gastbenutzern ausgeführt werden; bei neuen Befehlen aktivieren Sie das Kontrollkästchen „Gastbenutzer dürfen diesen Befehl ausführen“, falls dies gewünscht ist.
4. **Überprüfen Sie den Scheduler und die Befehle auf Einträge, die Sie nicht erstellt haben.** Vor 3.10.0 konnten Gastbenutzer und Aufrufe ohne Token solche Einträge hinzufügen, und diese werden beim Upgrade beibehalten. Planer-Einträge werden mit Administratorrechten ausgeführt. Löschen Sie alle Einträge, die Sie nicht erkennen, und deaktivieren Sie bei Befehlen, die Gäste nicht benötigen, die Option „Gäste dürfen diesen Befehl ausführen“.

Sie müssen Ihr Backup nach dem Upgrade nicht hochladen. Bewahren Sie es auf, falls Sie wieder auf 3.8.x zurückwechseln möchten. Die vollständige Liste der kompatibilitätsbrechenden Änderungen finden Sie unter [ChangeLog](Version-Release-History.md).

### Offizielle und benutzerdefinierte Builds

Ab 3.10.0 prüft EMS-ESP, ob es sich bei der Firmware um einen offiziellen Build handelt, wenn Sie eine Firmware-Datei über die Web-Benutzeroberfläche hochladen, eine Version aus der Versionsliste der Web-Benutzeroberfläche installieren oder diese über die Recovery-App hochladen. Offizielle Releases und Entwicklungsversionen von [GitHub](https://github.com/emsesp/EMS-ESP32/releases) sind von EMS-ESP signiert und werden sofort installiert. Auf der Seite „Version“ wird neben der Versionsnummer „Offizieller Build“ angezeigt.

Alles andere ist ein benutzerdefinierter Build, zum Beispiel einer, den Sie selbst erstellt haben, ein Community-Build, eine Version, die älter ist als 3.10.0, oder ein Dateisystem-Image. Die Web-Benutzeroberfläche zeigt dann vor der Installation die Meldung „Dies ist kein offizieller EMS-ESP-Build“ an. Klicken Sie auf „Trotzdem installieren“, um die Installation fortzusetzen, oder lassen Sie es sein, wenn Sie dies nicht erwartet haben. Auf der Versionsseite wird dann „Benutzerdefinierte Version“ angezeigt.

Installieren Sie eine benutzerdefinierte Version nur, wenn Sie der Quelle vertrauen. Wenn Sie eine offizielle Version erwartet haben, wurde die Datei möglicherweise verändert oder beschädigt, beispielsweise durch einen Browser oder einen Download-Manager. Laden Sie sie erneut von der Release-Seite herunter.

Die Option „Flashen über USB mit [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher) oder esptool“ ist nicht aktiviert.

Wenn Sie Ihre eigene Firmware erstellen, lesen Sie bitte [Installing your own build](https://github.com/emsesp/EMS-ESP32/blob/dev/CONTRIBUTING.md#installing-your-own-build).

### Warum werde ich erneut nach meinem Passwort gefragt?

Bei 3.10.0 fordert die Web-Benutzeroberfläche Sie erneut zur Eingabe Ihres Passworts auf, bevor Änderungen vorgenommen werden, die die Kontrolle über das Gerät übernehmen oder Sie aus dem Gerät aussperren könnten:

- das Hochladen oder Installieren von Firmware, einschließlich der Recovery-App, sowie das Wechseln zur anderen Firmware-Partition
- ein Backup wiederherstellen oder eines mit Passwörtern und Schlüsseln herunterladen
- ein Zurücksetzen auf die Werkseinstellungen
- Hinzufügen, Ändern oder Entfernen von Benutzern und Passwörtern sowie Erstellen oder Widerrufen von API-Schlüsseln
- CORS aktivieren, zulässige Hostnamen hinzufügen, den API-Bypass aktivieren oder Telnet aktivieren

Nach der Eingabe werden Sie in diesem Browser 5 Minuten lang nicht erneut dazu aufgefordert. Eine erneute Anmeldung oder ein Neustart von EMS-ESP beendet diesen Vorgang.

Skripte, die diese Änderungen über eine Web-UI-Anmeldung vornehmen, erhalten den HTTP-Status 428. Sie müssen das Passwort zunächst mit `POST /rest/confirmPassword` und den Hauptteil `{"password":"..."}` unter Verwendung desselben Tokens senden. Integrationen mit API-Schlüsseln und MQTT sind davon nicht betroffen.

### Firmware über eine URL installieren

Ab 3.10.0 kann die Firmware nur noch über eine URL einer EMS-ESP-Version auf GitHub installiert werden, die mit `https://github.com/emsesp/EMS-ESP32/releases/` beginnt. Die Versionsliste der Web-Benutzeroberfläche verwendet stets diese URLs. Alle anderen Dateien sollten stattdessen heruntergeladen und über die Web-Benutzeroberfläche hochgeladen werden.

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
| `bt`     | der Backtrace, wobei die zum Absturz führende Funktion an erster Stelle steht und danach die Funktionen, die sie aufgerufen haben |
| `sha`    | der Anfang des SHA256-Hashwerts der Firmware, bei der es zum Absturz kam |
| `reason` | der Grund für die Panik, z. B. die `abort()`- oder Watchdog-Meldung |

Bei C3 und C6 gibt es keinen Backtrace, sondern nur `ra` (Rückkehradresse), `mcause` und `mtval`.

### Einen Absturz-Dump selbst entschlüsseln

Für die Dekodierung wird die Datei `firmware.elf` genau des Builds benötigt, bei dem der Absturz aufgetreten ist. Wenn Sie EMS-ESP selbst kompilieren, wird von jedem Build eine gzipped-Kopie unter dem Namen `build/elf/<variant>-<sha>.elf.gz` gespeichert, wobei `<sha>` mit dem Eintrag `sha` in der Absturzübersicht übereinstimmt. Entpacken Sie diese mit `gunzip -k`. Diese Dateien sind jeweils etwa 20 MB groß, löschen Sie daher ab und zu alte Dateien.

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
