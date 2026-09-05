---
id: FAQ
title: Frequently Asked Questions
description: Common questions and answers about EMS-ESP including factory reset, EMS telegrams, and troubleshooting
---

# Häufig gestellte Fragen

## Wie führt man einen Werksreset des EMS-ESP durch?

Wenn Sie einen GPIO-Taster konfiguriert haben (der auf allen BBQKees-Boards standardmäßig aktiviert ist), wird durch 10 Sekunden langes Drücken und anschließendes Loslassen ein Werksreset durchgeführt. EMS-ESP startet anschließend im Access-Point-Modus neu.

## Was sind EMS-Telegramme?

Verfasst von MichaelDvP in [this article](https://github.com/emsesp/EMS-ESP32/discussions/1612#discussioncomment-8408868):

Den besten Überblick über bekannte Telegramme bieten [Norberts1](https://github.com/norberts1/hometop_HT3/blob/master/HT3/docu/HT_EMS_Bus_messages.pdf) und [EMS-Wiki](https://emswiki.thefischer.net/doku.php). Generell lässt sich sagen:

- Die Messwerte werden in regelmäßigen Abständen von 10 Sekunden bzw. 1 Minute übertragen.
- Einstellungen werden erst nach einer Änderung übertragen
- Wenn eine Einstellung eines Geräts über die Benutzeroberfläche des Thermostats geändert wird, erscheint die Meldung „Thermostat -w-> Gerät“ mit ausschließlich diesem Wert.
- Manche Geräte senden sich schnell ändernde Werte als Einzelwerte
- Gemessene Temperaturen werden normalerweise als 2 Bytes (SHORT) mit dem Faktor 0,1 angegeben (z. B. 01 23 -> 0x0123 -> dez 291 -> 29,1 °C)
- Lufttemperatureinstellungen werden oft mit dem Faktor 0,5 als Einzelbyte (INT) angegeben (z. B. 0x2D → dez 45 → 22,5 °C)
- Die Einstellungen für die Wassertemperatur sind in der Regel ein Byte (UINT) (z. B. 0x3C -> 60 °C), Differenzwerte (Hysterese in Kelvin) sind vorzeichenbehaftet (INT)
- Prozentangaben werden als Einzelbyte (UINT) angegeben (0x64 → 100 %)
- on/off-Zustände oder -Einstellungen können aus einem einzelnen Byte bestehen, das on/off, 0xFF/0x00 oder 0x01/0x00 enthält, oder aus einem einzelnen Bit in einem Byte zusammen mit 7 weiteren Zuständen
- Zeit und Energie betragen in der Regel 3 oder 4 Byte, mit oder ohne Faktor

Bei verschiedenen brands/devices verwendet Bosch manchmal unterschiedliche Bezeichnungen für denselben Wert – vielleicht wechseln die Entwickler oder sie möchten das Reverse Engineering erschweren!

Wenn Sie eine Einstellung suchen, protokollieren Sie die Telegramme für das Gerät (alle protokollieren oder &lt;Geräte-ID&gt; überwachen) und ändern Sie die Einstellung am Thermostat auf einen anderen Wert als states/values. Suchen Sie anschließend im Protokoll nach diesen Werten. Wenn Sie nach einem Messwert suchen, protokollieren Sie das Gerät, zeigen Sie den Wert am Thermostat an und warten Sie auf Änderungen; notieren Sie sich die old/new-Werte und die Uhrzeit. Überprüfen Sie anschließend das Protokoll auf diesen Zeitstempel (oder 10 Sekunden / 1 Minute später) und den Wert innerhalb eines Telegramms. Am besten sollten Sie mehrere changes/values haben, um sicherzugehen.

## Kann EMS-ESP einen Thermostat simulieren?

Zum Teil. Wie die Leute von [OpenTherm Gateway (OTGW)](https://otgw.tclcode.com/standalone.html#intro) es treffend formuliert haben:

:::Tipp[Warum einen Thermostat verwenden?]

    - Die Thermostathersteller haben jahrelange Forschungsarbeit geleistet, um die Heizcharakteristika zu ermitteln, die eine möglichst effiziente und komfortable Beheizung eines Hauses ermöglichen.
    - Der Thermostat verfügt über eine Bedienoberfläche, mit der die Nutzer vertraut sind, sodass auch andere Haushaltsmitglieder den Sollwert weiterhin einstellen können.
    - Es bietet eine praktische Unterbringung für den Raumtemperatursensor, der erforderlich ist, sofern Sie keine Heizkurve verwenden, die ausschließlich auf der Außentemperatur basiert.

:::

Wie **MichaelDvP** betont: _„Ein Thermostat ist ein cleveres elektronisches Gerät. Man gibt die gewünschte Raumtemperatur ein, und es berechnet anhand verschiedener Parameter und Messwerte die für diese Raumtemperatur erforderliche Vorlauftemperatur und sendet diese an den Heizkessel. Dies geschieht in einem Regelkreis und wird regelmäßig aktualisiert.“_

Und **mtc716** sagte: „Ein Thermostat erstellt eine Heizkurve, die ständig an die Umgebungstemperaturen angepasst wird und dazu dient, abzuschätzen, welche Wassertemperatur erforderlich ist, um die Raumtemperatur zu erhöhen. Im Internet gibt es einige gute Artikel darüber, wie man die Heizkurve richtig einstellt. Die wichtigsten Parameter, die du benötigst, sind die „Auslegungstemperatur“, also die Heizwassertemperatur bei minimaler Außentemperatur. Außerdem benötigst du die „Komforttemperatur“, wie zuvor erläutert, und den „Temperatur-Offset“, der eine parallele Verschiebung der Heizkurve bewirkt.“_

Außerdem sagt **MichaelDvP**: „Wenn Sie einen softwaregesteuerten Thermostat bauen möchten, stehen Ihnen verschiedene Methoden zur Verfügung:“

- Außentemperaturgesteuert:
  Legen Sie eine Heizkurve für Ihr Gebäude fest. Dabei handelt es sich um eine lineare Interpolation zwischen einer Mindestaußentemperatur für Ihre Region (typischerweise -11 °C für Mitteleuropa) bei maximaler Vorlauftemperatur (Auslegungstemperatur ~76 °C für Heizkörper, 40 °C für Fußbodenheizungen) und dem tatsächlichen Raum-Sollwert (z. B. 21 °C) für Außentemperatur und Vorlauftemperatur. Sie können einen Offset hinzufügen.
  selflowtemp = Offset + Sollwert + (Auslegungstemperatur – Sollwert) * (Sollwert – Außentemperatur) / (Sollwert – minimale Außentemperatur)
- raumgesteuert, geschaltet:
  Die Raumtemperatur messen und den Heizkessel einschalten, wobei die Heizungsabschaltung aktiviert ist, wenn die Raumtemperatur den Sollwert überschreitet. Um häufiges Ein- und Ausschalten zu vermeiden, eine Hysterese hinzufügen.
- raumgesteuert, dynamisch
  Hier muss eine PID-Regelung berechnet werden. Das geht ein wenig über den Rahmen des ems-esp-Schedulers hinaus. Aber vielleicht ist es möglich. Bei HA kannst du den Artikel „Implementierung eines intelligenten Thermostats (mit SAT)“ nachlesen. Siehe [#2103](https://github.com/emsesp/EMS-ESP32/issues/2103)
- gesteuert durch intelligente Thermostatventile (TRVs):
  Wenn Sie den Öffnungsgrad der Thermostatventile ablesen können, richten Sie eine einfache I-Regelung ein. Ist ein Thermostatventil vollständig geöffnet: Erhöhen Sie die Vorlauftemperatur; liegt der Öffnungsgrad des am weitesten geöffneten Thermostatventils unter 90 %: Verringern Sie die Vorlauftemperatur. Das Aufheizen ist ein langsamer Prozess, gehen Sie daher increase/decrease vorsichtig vor.

Wenn Sie mehr darüber erfahren möchten, lesen Sie doch diese Beiträge:

- [Smart control a heating system with HA?](https://github.com/emsesp/EMS-ESP32/discussions/965)
- [Thermostat emulation](https://github.com/emsesp/EMS-ESP32/issues/151)
- [Changing the boiler heating directly](tips-and-tricks#steuerung-der-kesselheizung)
- [Implementing a smart thermostat (using SAT)](https://github.com/emsesp/EMS-ESP32/issues/2103)

## Was sind Busprotokolle und Übertragungsmodi?

Protokoll und Timing sind zwei verschiedene Dinge; wählen Sie den Übertragungsmodus, der am besten funktioniert.

HT3 ist die Elektronik von Junkers, und das HT3-Protokoll entspricht dem EMS-Protokoll, nur dass im ersten Byte (Absender) das höchste Bit gesetzt ist. Jedes von uns gesendete Telegramm beginnt in einem Buderus-System mit 0B, bei Junkers hingegen mit 8B. Dies führt dazu, dass die Geräte der verschiedenen Marken nicht miteinander kompatibel sind. EMS-ESP überprüft den Bus beim Start und wählt automatisch das richtige Protokoll aus. Außerdem verwendet Junkers ein anderes Telegramm numbers/orders. Module der Marke Bosch verwenden zwar dieselben Telegrammnummern wie Buderus, adressieren jedoch wie Junkers, sind also ebenfalls nicht kompatibel. Sie können keine Junkers- oder Buderus-Module an ein Bosch-Heizungssystem anschließen.

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

Das wird nicht funktionieren. Der Heizkessel arbeitet mit `selflowtemp` als Sollwert und regelt den Brenner so, dass die `flowtemp` gehalten wird. Wenn `flowtemp` höher ist als der bei minimaler Brennerleistung ausgewählte Wert, schaltet sich der Kessel ab, wartet die Mindestzeit ab und wartet, bis `flowtemp` auf `selflowtemp` gesunken ist – Hysterese – und startet dann erneut. Eine Erhöhung von `burnminpower` führt unter milden Bedingungen lediglich zu mehr on/off-Zyklen.

## So sparen Sie Energie beim ESP32-Chip

Wenn Sie Bedenken hinsichtlich des Energieverbrauchs des ESP32-Chips haben und die Wärmeabgabe reduzieren möchten, können Sie einige der folgenden Einstellungen vornehmen:
- `Underclock CPU speed` im **Abschnitt „Anwendung Settings/Hardware“**
- Wenn Sie WLAN nutzen, aktivieren Sie `WiFi Sleep Mode`, wählen Sie `use lower WiFi bandwidth` aus und senken Sie die Sendeleistung `Tx power` im **Abschnitt „Netzwerk Settings/WiFi“** auf etwa 8,5 dBm ab.
- Wenn Sie Ethernet verwenden, aktivieren Sie `Force 10Mbit half-duplex` im **Abschnitt „Netzwerk Settings/Ethernet“**

Beachten Sie, dass dies die Leistung des ESP32-Chips beeinträchtigt und zu Stabilitätsproblemen führen kann.

## Aktualisierung der Firmware

Bei einem Upgrade oder Downgrade zwischen verschiedenen EMS-ESP-Versionen übernimmt EMS-ESP die Migration der Einstellungen, um die Kompatibilität mit der neu installierten Version zu gewährleisten.

Lesen Sie vor dem Upgrade stets die [ChangeLog](Version-Release-History.md), um sich über die Versionshinweise und etwaige kompatibilitätsbeeinträchtigende Änderungen zu informieren.

:::warning
### Umstellung auf Version 3.9
:::

In Version 3.9 der EMS-ESP-Firmware haben wir den ESP32-Kern optimiert und ein effizienteres Dateisystem verwendet. Das bedeutet leider, dass Sie die Einstellungen nach Abschluss der Installation manuell hochladen müssen. Es ist wichtig, dass Sie vor dem Start des Upgrades zunächst eine Sicherungskopie Ihrer Einstellungen und Anpassungen herunterladen. Dies kann über die Seite Download/Upload in der WebUI erfolgen, wodurch eine für Menschen lesbare JSON-Datei erstellt wird. 

Beim Hochfahren des EMS-ESP wird das Gerät auf die werkseitigen Standardeinstellungen zurückgesetzt. Sie müssen dann Ihre gespeicherten Einstellungen manuell hochladen, indem Sie die soeben erstellte JSON-Sicherungsdatei auswählen und auf der Seite Download/Upload hochladen. Wenn Sie WLAN verwenden, stellen Sie eine Verbindung zum EMS-ESP-Access-Point her und öffnen Sie in einem Browser die Seite http://192.168.4.1.

