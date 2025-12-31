---
id: FAQ
---

# FAQ

## Wie setzt man das EMS-ESP auf die Werkseinstellungen zurück?

Wenn Sie eine GPIO-Taste konfiguriert haben (standardmäßig auf allen BBQKees-Platinen aktiviert), können Sie diese 10 Sekunden lang drücken und dann loslassen, um einen Factory Reset durchzuführen. Das EMS-ESP wird im Access Point Modus neu gestartet.

## Was ist ein EMS-Telegramm?

MichaelDvP schreibt in [this article](https://github.com/emsesp/EMS-ESP32/discussions/1612#discussioncomment-8408868):

Die beste Übersicht über bekannte Telegramme ist die von [Norberts1](https://github.com/norberts1/hometop_HT3/blob/master/HT3/docu/HT_EMS_Bus_messages.pdf) und [EMS-Wiki](https://emswiki.thefischer.net/doku.php). Generell kann man sagen:

- messwerte werden periodisch 10 sec / 1 min gesendet
- einstellungen werden nur nach einer Änderung übertragen
- die Änderung einer Einstellung eines Geräts über die Benutzeroberfläche des Thermostats führt zu einer Meldung Thermostat -w-> Gerät mit nur diesem Wert
- einige Geräte senden schnell wechselnde Werte als Einzelwerte
- gemessene Temperaturen sind normalerweise 2 Bytes (SHORT) mit Faktor 0,1 (z.B. 01 23 -> 0x0123 -> dez 291 -> 29,1°C)
- lufttemperatur-Einstellungen sind oft Faktor 0,5 als Einzelbyte (INT) (z.B. 0x2D -> dez 45 -> 22,5°C)
- wassertemperatur-Einstellungen sind typischerweise Ein-Byte-Werte (UINT) (z. B. 0x3C -> 60°C), Differenzwerte (Hysterese in Kelvin) sind vorzeichenbehaftet (INT)
- prozentangaben sind Einzelbyte (UINT) (0x64 -> 100%)
- on/off Zustände oder Einstellungen können ein einzelnes Byte mit on/off 0xFF/0x00, oder 0x01/0x00 oder ein einzelnes Bit in einem Byte zusammen mit 7 anderen Zuständen sein
- zeiten und Energie ist typischerweise 3 oder 4 Bytes mit oder ohne Faktor

Für verschiedene brands/devices verwendet Bosch manchmal unterschiedliche Ausdrücke für denselben Wert. Vielleicht wechselnde Entwickler oder sie wollen das Reverse Engineering erschweren!

Wenn Sie eine Einstellung suchen, loggen Sie die Telegramme für das Gerät (log all oder watch &lt;device-id&gt;) und ändern Sie die Einstellung am Thermostat auf andere states/values. Suchen Sie dann im Protokoll nach diesen Werten. Wenn Sie nach einer Messung suchen, protokollieren Sie das Gerät und sehen Sie sich den Wert auf dem Thermostat an und warten Sie auf Änderungen, notieren Sie old/new-Werte und Zeit. Prüfen Sie dann das Protokoll auf diesen Zeitstempel (oder 10 sec / 1 min später) und den Wert innerhalb eines Telegramms. Am besten mehrere changes/values, um sicher zu sein.

## Kann EMS-ESP einen Thermostat simulieren?

Teilweise. Wie die Leute von [OpenTherm Gateway (OTGW)](https://otgw.tclcode.com/standalone.html#intro) es so schön formulieren:

:::tip
Warum einen Thermostat verwenden?

    - Die Hersteller von Thermostaten haben jahrelang geforscht, um die Heizungseigenschaften für die effizienteste und komfortabelste Art der Beheizung eines Hauses zu ermitteln.
    - Der Thermostat bietet eine den Menschen vertraute Steuerungsschnittstelle, so dass auch andere Haushaltsmitglieder den Sollwert einstellen können.
    - Er bietet eine praktische Unterbringung für den Raumtemperaturfühler, der benötigt wird, wenn Sie nicht mit einer Heizkurve arbeiten, die ausschließlich auf der Außentemperatur basiert.

:::

Wie **MichaelDvP** feststellt, ist ein Thermostat ein cleveres elektronisches Gerät. Man kann die gewünschte Raumtemperatur eingeben, und es berechnet aus einigen Parametern und Messungen die erforderliche Vorlauftemperatur für diese Raumtemperatur und sendet sie an den Heizkessel. Dies geschieht in einem Regelkreis und wird häufig aktualisiert."_

Und **mtc716** sagte _"Ein Thermostat erstellt eine Heizkurve, die ständig an die Umgebungstemperaturen angepasst wird und dazu dient, abzuschätzen, welche Wassertemperatur erforderlich ist, um die Raumtemperatur zu erhöhen. Es gibt einige gute Artikel im Netz darüber, wie man die Heizkurve richtig einstellt. Die wichtigsten Parameter, die Sie benötigen, sind die "Auslegungstemperatur", d. h. die Heizwassertemperatur bei minimaler Außentemperatur. Außerdem benötigen Sie die "Komforttemperatur", wie bereits erläutert, und den "Temp-Offset", der eine Parallelverschiebung der Heizkurve bewirkt

Außerdem, wie **MichaelDvP** sagt: "Wenn Sie einen softwaregesteuerten Thermostat bauen wollen, können Sie verschiedene Methoden verwenden:"

- außentemperatur gesteuert: Definieren Sie eine Heizkurve für Ihr Gebäude. Dies ist eine lineare Interpolation zwischen einer minimalen Außentemperatur für Ihre Region (typisch 11°C für Mitteleuropa) mit maximaler Vorlauftemperatur (Solltemperatur ~76°C für Heizkörper, 40°C für Fußboden) und dem aktuellen Raumsollwert (z.B. 21°C) für Außen- und Vorlauftemperatur. Sie können einen Offset hinzufügen. selflowtemp = Offset + Sollwert + (designtemp- Sollwert) \* (Sollwert - Außentemp) / (Sollwert - minoutdoor)
- raumgesteuert, geschaltet: Messen Sie die Raumtemperatur und schalten Sie den Kessel mit aktivierter Heizungsabschaltung bei Raumtemperatur > Sollwert. Um viele Schaltvorgänge zu vermeiden, fügen Sie eine Hysterese
- raumgesteuert, dynamisch Hier müssen Sie eine PID-Regelung berechnen. Das sprengt ein wenig den Rahmen des ems-esp Schedulers. Aber vielleicht möglich. Mit HA können Sie die Implementierung eines intelligenten Thermostats (mit SAT) überprüfen. Siehe [#2103](https://github.com/emsesp/EMS-ESP32/issues/2103)
- gesteuert durch intelligente TRVs: Wenn Sie die Öffnung der TRVs ablesen können, machen Sie eine einfache I-Steuerung. Wenn ein TRV vollständig geöffnet ist: erhöhen Sie die Durchflusstemperatur, wenn das am weitesten geöffnete TRV unter 90 % Öffnung liegt: verringern Sie die Durchflusstemperatur. Das Aufheizen ist ein langsamer Prozess, also increase/decrease vorsichtig.

Weitere Informationen finden Sie in diesen Diskussionen:

- [Smart control a heating system with HA?](https://github.com/emsesp/EMS-ESP32/discussions/965)
- [Thermostat emulation](https://github.com/emsesp/EMS-ESP32/issues/151)
- [Changing the boiler heating directly](tips-and-tricks#steuerung-der-kesselheizung)
- [Implementing a smart thermostat (using SAT)](https://github.com/emsesp/EMS-ESP32/issues/2103)

## Was sind Busprotokolle und Sendemodi?

Protokoll und Timing sind unterschiedliche Dinge, Sie wählen den Sende-Modus, der am besten funktioniert.

HT3 ist die Junkers-Elektronik und das HT3-Protokoll ist das gleiche wie EMS, nur dass im ersten Byte (Absender) das höchste Bit gesetzt ist. Jedes Telegramm, das wir senden, beginnt bei einem Buderus-System mit 0B, bei Junkers jedoch mit 8B. Das macht die Geräte der verschiedenen Marken inkompatibel. EMS-ESP prüft den Bus beim Start und wählt automatisch das richtige Protokoll. Auch Junkers verwendet ein anderes Telegramm numbers/orders. Bosch-Module verwenden die gleichen Telegrammnummern wie Buderus, adressieren aber wie Junkers, sind also ebenfalls inkompatibel. Sie können keine Junkers- oder Buderus-Module an ein Bosch-Heizsystem anschließen.

Der Tx-Modus ist das Sende-Timing: Die Client-Geräte senden per Strommodulation, der Master per Spannungsmodulation. Dies ermöglicht Vollduplex (Hardware-Modus), aber je nach Leitungsimpedanz beeinflusst die Stromaufnahme auch die Spannung. Beim Senden wiederholt der Master jedes vom Gerät gesendete Byte, um es den anderen Geräten mitzuteilen. Mit einem Tx-Modus von "EMS" warten wir auf das Master-Byte, bevor wir das nächste senden. Die älteren Junkers-Geräte scheinen ein niedrigeres Timeout zu haben, so dass wir das nächste Byte senden müssen, bevor das Master-Echo abgeschlossen ist ("HT3"). "EMS+" ist weniger kritisch und wir können etwas länger als ein Byte warten, damit sich die Spannung nach dem Senden stabilisieren kann.

## Können Sie mehrere Instanzen von EMS-ESP ausführen?

Ja, das können Sie. Beachten Sie die folgenden Einstellungen:

- (Einstellungen->MQTT-Einstellungen) MQTT `Entity ID format` ist auf "Mehrere Instanzen, kurzer Name" eingestellt
- (Einstellungen->MQTT Einstellungen) MQTT `Client ID` muss eindeutig sein, um Konflikte im MQTT Broker zu vermeiden
- (Einstellungen->MQTT Einstellungen) MQTT `Base` ist eindeutig (seien Sie sicher). Normalerweise wird dies auf den Hostnamen gesetzt.
- (Einstellungen->Netzwerkeinstellungen) `Hostname` ist eindeutig, um Netzwerkkonflikte zu vermeiden
- (Einstellungen->Anwendungseinstellungen) `EMS BUS ID` unterschiedlich sind (nicht beide 0x0B)

## Warum haben EMS-Telegramme im `raw watch`-Modus einen höheren Typ 0x100 als im `raw`-Modus?

Siehe [this discussion](https://github.com/emsesp/EMS-ESP32/discussions/2025)
