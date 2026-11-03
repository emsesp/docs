---
id: Configuring
title: Configuring EMS-ESP
description: Complete guide to configuring EMS-ESP including first-time setup, WiFi, application settings, and customization options
---

# Konfigurieren

## Ersteinrichtung

Die standardmäßige „Werkskonfiguration“ startet einen WLAN-Zugangspunkt namens `ems-esp`. Stellen Sie eine Verbindung zu diesem Zugangspunkt mit dem WPA-Passwort `ems-esp-neo` her. Wenn ein Anmeldebildschirm (Captive Portal) angezeigt wird, melden Sie sich mit dem Benutzernamen `admin` und dem Passwort `admin` an. Diese Angaben können später geändert werden. Wenn Sie über eine Ethernet-Karte verfügen, können Sie eine Verbindung direkt über deren IP-Adresse oder über `http://ems-esp` bzw. `http://ems-esp.local` herstellen.

Nun können Sie mit der weiteren Konfiguration der Einstellungen fortfahren. Falls noch keine Verbindung zu Ihrem WLAN-Netzwerk besteht, stellen Sie diese zunächst über die Seite „Einstellungen -> Netzwerk“ her. Sie können dies auch über die Konsole tun, wenn Sie mit einem Serial/USB-Port verbunden sind und die Befehle `set wifi ssid` und `set wifi password` verwenden.

Wenn Warnmeldungen angezeigt werden, dass keine Verbindung zum EMS-Bus hergestellt werden konnte, oder wenn Tx- oder Rx-Fehler auftreten, befolgen Sie bitte die Anleitung unter [troubleshooting](Troubleshooting).

:::note
Wenn im Protokoll „Rx incomplete telegrams“ angezeigt wird, geraten Sie nicht in Panik. Es kann vorkommen, dass einige Telegramme übersehen werden, was in der Regel auf Störsignale auf der Leitung zurückzuführen ist.
:::

Im folgenden Abschnitt werden einige der wichtigsten Einstellungen beschrieben, die über die Web-Benutzeroberfläche im Bereich „Einstellungen“ angepasst werden können. Die meisten sind selbsterklärend, daher werden hier nur die wichtigsten beschrieben.

## Anwendungseinstellungen

### Dienstleistungen

- **Umgehung der Autorisierung per Zugriffstoken bei API-Aufrufen**. Für RESTful-Schreibbefehle über HTTP-POST ist das Zugriffstoken erforderlich. Dies dient aus Sicherheitsgründen dazu, zu verhindern, dass Unbefugte die Geräteeinstellungen ändern. Durch Setzen dieses Flags wird die API geöffnet. Nicht empfohlen!
- **Telnet-Konsole aktivieren**. Diese Option ist standardmäßig aktiviert und ermöglicht es Benutzern, eine Verbindung zum ungesicherten Telnet-Server auf Port 23 herzustellen.
- **Modbus aktivieren**. Diese Option ist standardmäßig deaktiviert und ermöglicht es Benutzern, eine Verbindung zum Modbus-TCP-Server herzustellen (Standardport 502). Aufgrund von Speicherbeschränkungen ist diese Funktion nur auf Platinen mit zusätzlichem PSRAM verfügbar.
- **Syslog aktivieren**:
  - **IP** ist die IP-Adresse eines Syslog-Servers zur Erfassung von Remote-Protokollen. Lassen Sie das Feld leer, wenn Sie Syslog nicht verwenden. Hinweis: EMS-ESP verwendet das Standardprotokoll [RFC5424](https://datatracker.ietf.org/doc/html/rfc5424). Stellen Sie daher sicher, dass Ihr Syslog-Server für die Verarbeitung dieser Nachrichten konfiguriert ist und nicht beispielsweise für RFC3164 (BSD Syslog).
  - **Port**, falls eine andere Portnummer verwendet wird. Der Standardwert ist 514. Es wird UDP (nicht TCP) verwendet.
  - **Protokollstufe** legt die maximale Protokollstufe für gemeldete Meldungen fest. Die höchste Stufe ist „DEBUG“, bei der eine große Menge an Protokolldaten gesendet wird; verwenden Sie diese daher mit Bedacht.
  - **Mark Interval** sendet eine spezielle `mark`-Meldung an das SysLog. Dies ist nützlich, um Ereignisse zeitlich zu erfassen.

### Sensoren

- **Analoge Sensoren aktivieren**. Dadurch kann jeder GPIO-Pin Signale erfassen, egal ob es sich um einen digitalen I/O, einen Impulszähler oder einen ADC zur Messung von mV handelt. Es stehen außerdem noch viele weitere Optionen zur Verfügung. Beachten Sie, dass `Factor` ein Teiler ist.
- **1-Wire-Parasitenstrom aktivieren**. Wählen Sie diese Option, wenn Sie (Dallas-)Temperatursensoren mit Parasitenstrom verwenden.

### Formatierungsoptionen

- **Sprache**. Hiermit wird die Sprache festgelegt, die für die Namen der EMS-Geräteentitäten verwendet wird, wie sie in der WebUI unter „Geräte“ und im Dashboard angezeigt werden, sowie für die MQTT-Erkennung. Die Standardeinstellung ist Englisch. Wenn Sie Home Assistant verwenden und die Sprache wechseln, müssen Sie möglicherweise die bisherigen EMS-ESP-MQTT-Einträge (unter „Einstellungen“ -> „Geräte & Dienste“ -> „MQTT“ in HA) entfernen und EMS-ESP sicherheitshalber neu starten.
- **Dashboard zum Booleschen Format**. So werden boolesche Werte in der WebUI und in MQTT-Nutzdaten dargestellt.
- **Boolesches Format API/MQTT**. So werden boolesche Werte in den MQTT-Nutzdaten und in der JSON-Ausgabe der API dargestellt.
- **Enum-Format API/MQTT**. So werden Listenwerte in den MQTT-Nutzdaten und im API-JSON dargestellt – entweder anhand ihres Werts oder anhand ihrer Indexposition innerhalb der Liste. Bei Verwendung von Home Assistant werden die Werte jedoch nicht angezeigt, sondern für einige Entitäten Ganzzahlen, z. B. wird anstelle von `off, hot, cold` `0, 1, 2` angezeigt.
- **Temperaturwerte in Fahrenheit umrechnen**. Für unsere Freunde in den USA.
- **EMS-Telegramme im Hexadezimalformat protokollieren** schreibt die Telegramme überall im Rohformat als Hexadezimalwerte.

### Hardware-Einstellungen

- **Board-Profil**. Board-Profile sind vorkonfigurierte GPIO-Einstellungen für eine Reihe gängiger ESP32-Entwicklungsboards und EMS-Gateway-Schaltungen. Folgende Profile stehen zur Verfügung:

| `profile name` | `based on board` | `led` | `dallas` | `rx` | `tx` | `button` | `phy_type` | `eth_power` | `eth_phy_addr` | `eth_clock_mode` |
| -------------- | ---------------------- | ----- | -------- | ---- | ---- | -------- | ---------- | ----------- | -------------- | ---------------------------- |
| S32 | BBQKees Gateway S32    | 2     | 18 | 23   | 5    | 0 | | | | |
| E32 | BBQKees Gateway E32    | 2     | 4 | 5    | 17   | 33 | LAN8720    | 16 | 1 | Eingang an GPIO0 |
| E32V2 | BBQKees Gateway E32 V2 | 2     | 14 | 4    | 5    | 34 | LAN8720    | 15 | 0 | Ausgang von GPIO0 |
| S32S3 | BBQKees Gateway S3     | 2     | 18 | 5    | 17   | 0 | | | | |
| MH-ET | MH-ET Live D1 Mini     | 2     | 18 | 23   | 5    | 0 | | | | |
| NODEMCU | NodeMCU 32S | 2     | 18 | 23   | 5    | 0 | | | | |
| LOLIN | Lolin D32 | 2     | 18 | 17   | 16   | 0 | | | | |
| OLIMEX | Olimex ESP32-EVB | 0     | 0 | 36   | 4    | 34 | LAN8720    | -1 | 0 | Eingang an GPIO0 |
| OLIMEXPOE | Olimex ESP32-POE | 0     | 0 | 36   | 4    | 34 | LAN8720    | 12 | 0 | Ausgang von GPIO17, invertiert |
| C3MINI | Lolin C3 Mini | 7     | 1 | 4    | 5    | 9 | | | | |
| S2MINI | Lolin S2 Mini | 15    | 7 | 11   | 12   | 0 | | | | |
| S3MINI | Liligo S3 | 17    | 18 | 8    | 5    | 0 | | | | |

Um ein benutzerdefiniertes Board zu konfigurieren, aktivieren Sie zunächst `Developer mode`. Wenn Sie `Custom` auswählen, werden die folgenden zusätzlichen Einstellungen angezeigt, mit denen Sie die GPIOs manuell an Ihr eigenes Board anpassen können. Sie können auch jederzeit `Custom` auswählen, um die aktuellen Einstellungen des Board-Profils anzuzeigen, ohne diese zu speichern.

_Benutzerdefinierte Board-Einstellungen:_

- **Rx GPIO**. Dies ist der GPIO-Pin, dem das Rx-Signal zugewiesen ist. Standardmäßig ist dies GPIO 23, es kann jedoch fast jeder freie Pin sein. Verbinden Sie diesen GPIO-Pin mit dem RX-Anschluss auf der EMS-Schnittstellenplatine.
- **Tx GPIO**. Dies ist der GPIO-Pin, dem das Tx-Signal zugewiesen ist. Standardmäßig ist dies GPIO 5, es kann jedoch fast jeder freie Pin sein. Verbinden Sie diesen GPIO-Pin mit dem TX-Anschluss auf der EMS-Schnittstellenplatine.
- **GPIO-Pin der Taste**. Dies ist der GPIO-Pin, dem die Taste zugewiesen ist. Es handelt sich um einen Pull-up-Pin. Die Taste wird für verschiedene Funktionen verwendet. Ein einmaliges Drücken hat keine Auswirkung, ein doppeltes Drücken führt zu einem WLAN-Reset und einer erneuten Verbindung zum AP, ein 10 Sekunden langes Drücken und Loslassen führt zu einem Werksreset und ein sehr langes Drücken von mindestens 20 Sekunden ohne Loslassen führt zu einem Neustart des EMS-ESP auf die ursprüngliche Boot-Partition.
- **Temperatur-GPIO**. An diesem Pin werden externe Temperatursensoren angeschlossen. Die Dallas-Chips DS1822, DS18S20, DS18B20 und DS1825 werden einschließlich ihrer Parasit-Varianten unterstützt und können zudem in einer Daisy-Chain-Konfiguration an eine einzige Leitung angeschlossen werden – bis zu 100 Sensoren.
- **LED GPIO**. Dies ist der Pin für die LED; standardmäßig ist die integrierte LED auf dem ESP-Entwicklungsboard ausgewählt.
- **Eth-PHY-Typ**. Dies ist der Typ des verwendeten Ethernet-Chips.

:::note
Auf ESP32-Entwicklungsboards gibt es oft auch Pins mit der Bezeichnung „RX“ und „TX“. Diese sind jedoch in der Regel mit dem USB-Chip verbunden und können nicht für die EMS-Schnittstellenschaltung verwendet werden.
:::

- **EMS-Tx-Modus**. Der Tx-Modus ist der Modus, in dem EMS-ESP Telegramme über den EMS-Bus sendet. Wählen Sie den Modus, der für Ihr System am besten geeignet ist, und achten Sie auf Tx-Fehler im Web-Dashboard und `show ems` in der Konsole. Die Änderung des Werts wird sofort wirksam.
  - `EMS` ist die Standardeinstellung für EMS1.0-Systeme, ist aber auch mit den meisten anderen Busprotokollen kompatibel.
  - `EMS+` ist so konzipiert, dass es auf EMS2.0/EMS+-Systemen besser funktioniert.
  - `HT3` für Heatronics3, das vor allem von Junkers verwendet wird.
  - `Hardware` nutzt die interne Hardware des ESP, um das Telegramm zu versenden. Telegramme werden sofort versendet. Dies ist die schnellste und effizienteste Methode, funktioniert jedoch nur auf bestimmten Systemen.
  - `Auto` überprüft die empfangenen Bus-Telegramme, um den optimalen Zeitpunkt für `EMS`, `EMS+` oder `HT3` zu ermitteln.
- **EMS-Bus-ID**. Das EMS-ESP kann mehrere Geräte simulieren. Behalten Sie die Standardeinstellung `Gateway 2 (0x49)` bei, es sei denn, Sie verwenden mehr als eine EMS-gateways/interface-Karte oder es treten Konflikte mit anderen EMS-Geräten auf. Beachten Sie bitte, dass der Service-Schlüssel (0x0B), der bis zur EMS-ESP-Version 3.8.1 als Standard verwendet wird, auch von zertifizierten service/maintenance-Technikern bei der Wartung Ihrer Heizungsanlagen verwendet wird und zu Konflikten führen könnte. Stellen Sie sicher, dass Sie das EMS-ESP vor jeglichen Wartungsarbeiten ausschalten oder die EMS-Bus-ID ändern, bevor die Techniker eintreffen; andernfalls können diese keine Verbindung herstellen und Ihr Heizungssystem nicht warten.
- **Schalten Sie den schreibgeschützten Modus ein**. Dadurch werden alle ausgehenden Tx-Schreibbefehle an den EMS-Bus deaktiviert, wodurch der EMS-ESP im Wesentlichen in den Abhörmodus versetzt wird. Tx wird jedoch benötigt, um EMS-Geräte zu erkennen (da es einen Versionsbefehl sendet). Wenn Sie den EMS-ESP explizit in einen Lese-only/sniffer-Modus versetzen möchten, verwenden Sie `set tx_mode 0` über die Konsole.
- **LED ausblenden**. Schaltet die LED im normalen Betriebsmodus aus. Die LED leuchtet weiterhin beim Hochfahren oder bei Verbindungsproblemen.
- **CPU-Taktfrequenz herabsetzen**. Senkt die Taktfrequenz des ESP auf 160 MHz, wodurch Strom und Wärme eingespart werden und die Lebensdauer des Chips verlängert wird – allerdings auf Kosten der Leistung und der Reaktionszeit. Ein Neustart von EMS-ESP ist erforderlich.

### Sonderfunktionen

- Im **Entwicklermodus** werden erweiterte Funktionen in der Web-Benutzeroberfläche aktiviert, wie beispielsweise der Befehl „Read“ aus dem Systemprotokoll und die Konfiguration einer benutzerdefinierten Platine.
- **Den Heizkessel bei ausgeschalteter Zwangsheizung starten**.
- **Fernbedienung bei fehlender Raumtemperatur deaktivieren**. Dies ist eine Sicherheitsfunktion, die verhindert, dass der Heizkessel anspringt, wenn der simulierte Raumtemperatursensor fehlt oder nicht funktioniert.
- **Dusch-Timer aktivieren**. Aktivieren Sie diese Option, um die Laufzeit des Warmwassers zu messen; daraufhin wird eine MQTT-Nachricht mit der Dauer gesendet. Der Timer startet erst nach einer Mindestlaufzeit von 2 Minuten.
- **Duschwarnung aktivieren**. Diese Funktion ist noch im Versuchsstadium und funktioniert möglicherweise nicht bei allen Heizkesseln. Nach 7 Minuten (einstellbar) laufendem Warmwasser wird eine Warnung ausgegeben, indem 10 Sekunden lang (ebenfalls einstellbar) kaltes Wasser fließt. Der Heizkessel wechselt für diesen Vorgang in den Testmodus – bitte mit Vorsicht verwenden!

## Netzwerkeinrichtung

Auf der Seite „Netzwerk“ können Sie EMS-ESP mit Ihrem Heimnetzwerk verbinden. Sie können zwischen WLAN und Ethernet wählen, sofern die Hardwarekarte dies unterstützt. Bitte beachten Sie, dass das WLAN 2.4GHz/WPA2 sein muss. Eine Verbindung zu einem 5-GHz-WLAN-Zugangspunkt ist nicht möglich.

### CORS (Cross-Origin Resource Sharing)

Wenn CORS aktiviert ist, werden jeder Webanfrage neue HTTP-Header hinzugefügt, damit die Web-API `fetch`- und `XMLHttpRequest`-Anfragen über verschiedene Domänen hinweg stellen kann. Dadurch wird die Pre-Flight-Prüfung deaktiviert, die standardmäßig der Same-Origin-Richtlinie folgt. Weitere Informationen finden Sie unter [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). Es gibt außerdem ein Browser-Add-on namens „CORS unblock“, das auf dieselbe Weise funktioniert.

Aktivieren Sie diese Funktion, wenn Sie über ein VPN arbeiten oder wenn andere Server (wie z. B. Grafana) auf anderen Domänen laufen, die Aufrufe an die EMS-ESP-API senden.

## MQTT-Einrichtung

- **Broker-Adresse**. Verwenden Sie die IP-Adresse, nicht einen FQDN.
- **Port**. Die Standardwerte sind 1883 und 8883 für SSL.
- **TLS aktivieren** verschlüsselt die Verbindung zum Broker. **Überprüfen Sie den Broker anhand** eines CA-Zertifikats oder des SHA-1-Fingerabdrucks des Broker-Zertifikats, damit EMS-ESP nur eine Verbindung zu Ihrem Broker herstellt. Siehe [Securing your gateway](Securing.md#mqtt).
- **Basis**. Allen Betreffzeilen wird das Präfix `Base` vorangestellt, daher ist dies wichtig. Achten Sie darauf, dass dieses Präfix eindeutig ist, wenn Sie mehr als einen EMS-ESP mit demselben Broker verwenden.
- **Client-ID**. Diese wird intern verwendet, um EMS-ESP beim Broker zu identifizieren, und ist optional. Hinweis: MQTT-Themen werden mit dem Hostnamen (Standard: `ems-esp`) und nicht mit der Client-ID ergänzt. Verwenden Sie diese Option, wenn Sie mehrere Geräte haben.
- **Benutzername** und **Passwort** sind optional, werden jedoch aus Sicherheitsgründen empfohlen. Standardmäßig erfordert der Mosquitto-MQTT-Broker ein username/password; achten Sie daher darauf, wenn Sie hier das Home Assistant-Add-on verwenden.
- **„Clean Session“ aktivieren**. Erzeugt bei Aktivierung eine nicht persistente Sitzung. Die Standardeinstellung und empfohlene Einstellung ist „deaktiviert“, damit diese Option bei der Nutzung von Hausautomationssystemen deaktiviert bleibt.
- **QoS**. Quality of Service, 0, 1 oder 2. 0 ist die Standardeinstellung und eignet sich für die meisten Szenarien. Der Wert 1 garantiert, dass die Nachricht gesendet wurde, verursacht jedoch etwas mehr Netzwerkverkehr und Overhead.
- **Stellen Sie das „Retain Flag“ immer ein**. Aktivieren Sie diese Option, wenn Sie alle Nachrichten auf dem MQTT-Broker dauerhaft speichern möchten. Standardmäßig ist diese Option deaktiviert.
- **Formatierung**. Die Option `Nested` fasst alle Gerätedaten mithilfe eingebetteter JSON-Objekte wie `dhw` in `boiler_data`, `hc1` in `thermostat_data` usw. zu einem einzigen MQTT-Thema zusammen. `As individual topics` teilt diese ohne Gruppierung in separate MQTT-Themen auf, sodass die MQTT-Themen zu `boiler_data` und `boiler_data_dhw`, `thermostat_data` und `thermostat_data_hc1` usw. werden. Das Gleiche gilt für die Analog- und Temperatursensoren. Die Standardeinstellung ist „verschachtelt“.
- **Befehlsausgabe in einem „response“-Topic veröffentlichen**. Dabei wird die Ausgabe eines API-Befehls entnommen und das Ergebnis in einem Topic namens `response` veröffentlicht.
- **Einzelwert-Themen bei Änderung veröffentlichen**. Diese Option veröffentlicht das Thema und die Nutzdaten für jeden Vorgang sofort und ist nur verfügbar, wenn MQTT Discovery deaktiviert ist.
- **MQTT Discovery aktivieren**: Aktiviert die Integration über MQTT Discovery, die von Home Assistant vollständig und von Domoticz teilweise unterstützt wird.
  - **Erkennungstyp**. Wählen Sie zwischen „Home Assistant“ und zwei Protokollen für „Domoticz“. `Domoticz (latest)` verwendet Zahlen, Schalter, Auswahlfelder und andere moderne Typen, während `Domoticz` für alles lediglich Sensoren verwendet und zudem alle Vorlagenbedingungen entfernt.
  - **Format der Entitäts-ID**: Es gibt 3 Optionen. Die erste Option `single instance, long names` verwendet das ältere `< v3.5`-Format. Die Standard- und empfohlene Einstellung für alle Neuinstallationen ist die zweite Option namens `Single instance, short name`, die den EMS-ESP-Geräte-Entity-Namen verwendet, der fest vorgegeben ist und auf der Seite `Settings->Customization` eingesehen werden kann. Die letzte Option muss verwendet werden, wenn mehr als eine Version der EMS-ESP-Firmware ausgeführt wird, da sie jede Version eindeutig macht, indem allen MQTT-Themen der Basisname vorangestellt wird.
  - **Zahlenformat für Eingaben**: (nur HA) Wählen Sie den Modus „Auswahlfeld“ oder „Schieberegler“. Schieberegler werden nur für Zahlenwerte mit einem Bereich unter 100 verwendet.
- **Sendeintervalle**. Dieser Abschnitt gilt pro Gerät und legt fest, wie oft eine MQTT-Nachricht gesendet wird. Bei der Einstellung 0 sendet EMS-ESP Daten automatisch, sobald eine merkliche Änderung auftritt, was innerhalb weniger Sekunden der Fall sein kann.

## NTP-Einrichtung

- Der Standard-**NTP-Server** ist `time.google.com`. Dieser kann auf einen lokalen NTP-Server oder einen bestimmten Server, wie beispielsweise `pool.ntp.org`, geändert werden.
- Die Standard-**Zeitzone** lautet „Europe/Amsterdam“. Diese kann auf eine beliebige der [IANA Time Zone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)-Zeitzonen geändert werden.

## Benutzer und Rollen verwalten

Auf der Seite „Sicherheit“ können Sie das Standardpasswort für das Captive Portal und die Telnet-CLI ändern. Außerdem können Sie dort HTTPS für das Captive Portal und den MQTT-Broker aktivieren.

Auf der Seite „Benutzer“ können Sie weitere Benutzer für das Captive Portal und die Telnet-CLI anlegen. Der Standardbenutzer lautet `admin` mit dem Passwort `admin`.

Jeder Benutzer verfügt über ein eindeutiges Zugriffstoken (das durch Klicken auf das Schlüsselsymbol angezeigt wird), das für RESTful-Schreibbefehle über HTTP-POST verwendet wird. Dies dient aus Sicherheitsgründen dazu, zu verhindern, dass Unbefugte die Geräteeinstellungen ändern.

![Web](/media/screenshot/web_users.png)

## Hinzufügen von Analog- und Temperatursensoren

Externe Sensoren, wie Temperatur- und Analogsensoren, können an verschiedene GPIO-Pins des ESP32-Chips angeschlossen werden. Bei Verwendung eines BBQKees-Gateway-Boards steht bereits ein externer Anschluss für Dallas-Temperatursensoren zur Verfügung, deren Werte ohne zusätzliche Konfiguration in der WebUI angezeigt werden. BBQKees-Boards sind CE-zertifiziert; das Anschließen von Sensoren an die GPIOs führt zu einer Verletzung der EMV-Konformität. Wenn Sie analoge Sensoren auf eigenes Risiko anschließen möchten, wählen Sie ein anderes Board-Profil oder nutzen Sie den Entwicklermodus, um ein benutzerdefiniertes Board zu konfigurieren.

Um analoge Sensoren hinzuzufügen, klicken Sie auf `Add` und wählen Sie zwischen einem normalen digitalen Sensor in/out, einem Zähler (der on/off Impulse zählt), einem ADC zur Spannungsmessung, einem Timer, einem Rate-Sensor und PWM 0-2. Beachten Sie, dass der Zählerstand gespeichert wird und beim Neustart nicht zurückgesetzt wird.

![Web](/media/screenshot/web_sensor.png)

:::warning
Achten Sie bei der Auswahl eines GPIO-Pins darauf, dass es nicht zu Konflikten mit anderen bereits verwendeten GPIO-Pins kommt (Sie können das Board-Profil „CUSTOM“ auswählen, um Ihre aktuelle Konfiguration anzuzeigen).

    Das EMS-ESP ist an den Niederspannungsbus Ihrer Heizungsanlage angeschlossen. Jede Überspannung kann die EMS-ESP-Platine und möglicherweise auch Ihre Heizgeräte beschädigen. Schließen Sie externe Geräte niemals direkt an die EMS-ESP-Platine an.

    ESP32-Entwicklungsboards unterscheiden sich hinsichtlich ihrer verfügbaren Pin-Konfiguration. In der Regel können die Pins 1, 6–11, 12, 14, 15, 20, 24, 28–31 und 40+ nicht verwendet werden. Siehe dazu diese Links [here](https://diyprojects.io/esp32-how-to-use-gpio-digital-io-arduino-code/#.YFpVEq9KhjG) und [here](https://nodemcu.readthedocs.io/en/dev-esp32/modules/gpio/).

:::

Die folgenden GPIOs werden empfohlen:

- digitale Ausgabe: `13, 19, 21, 22, 27, 33, 37, 38`
- digital input/counter/timer/rate: `13, 19, 21, 22, 25, 26, 27, 33, 35, 37, 38, 39 (note no pullup on 35 & 39)`
- ADC-Eingang: `13, 19, 21, 22, 25, 26, 27, 33, 35, 37, 38, 39`
- DAC-Ausgang: `25, 26`
- PWM-Ausgang: `13, 19, 21, 22, 25, 26, 27, 33, 37, 38`

Einschränkungen:

- ADC: max. Eingangsspannung 3,3 V, wird in Millivolt angezeigt
- 8-Bit-DAC, Wertebereich 0..255 bei 0 V–3,3 V Ausgang, Konfiguration als `Digital out` an GPIO 25 oder 26 (ESP32), 17, 18 (ESP32S2), nicht verfügbar für ESP32S3, ESP32C3
- PWM 0–2: maximale Frequenz 5000 Hz, Auflösung 13 Bit. Jeder Kanal kann nur für einen GPIO verwendet werden.
- „Pulse“ ist ein digitaler Ausgang für einen einzelnen Impuls mit einstellbarer Dauer. Bei der Einstellung auf `on` per Befehl wechselt der Sensor nach Beendigung des Impulses in den Zustand `off`.
- Counter/timer/rate-Trigger: `high->low edge with 15 ms debounce. Only for low pulse rates < 30Hz.`
- Zähler 0–2, Frequenz 0–2: Hochgeschwindigkeitseingänge für Signale von 1 Hz bis 100 kHz, keine Entprellung, bei verrauschten Signalen RC-Filter verwenden. Interruptgesteuert, jeder Kanal kann nur für einen GPIO verwendet werden.

Die Zählerstände werden in reboot/update gespeichert und stündlich an nvs übertragen. Bei Systemabstürzen oder Stromausfällen kann der Wert danach niedriger sein.

### Steuerung von Relais

Ein häufiger Anwendungsfall ist die Steuerung eines Relais zum Ein- und Ausschalten on/off eines Geräts. Dies kann erreicht werden, indem ein digitaler Ausgangssensor hinzugefügt und anschließend ein Befehl zu dessen Steuerung erstellt wird. Der Befehl kann zum Dashboard hinzugefügt und so geplant werden, dass er on/off zu bestimmten Zeiten ausführt.

Erstellen Sie einen analogen Sensor vom Typ „Digitalausgang“.

Die professionelle Vorgehensweise besteht darin, eine separate Relaisplatine mit Optokopplung und einer Rückflussdiode zu verwenden. Die Relaisplatine wird dann über ein separates Netzteil mit Strom versorgt, und das Relais wird wie oben beschrieben an den digitalen Ausgang des EMS-ESP angeschlossen. Die Relaisplatine wird anschließend an das Gerät angeschlossen, das Sie steuern möchten. Auf diese Weise ist das Gerät vollständig vom EMS-ESP isoliert, und die Relaisplatine kann die höheren Spannungs- und Stromwerte bewältigen.

## Entitäten anpassen

Auf der Seite „Anpassung“ werden alle registrierten Entitäten angezeigt. Dort können Sie Befehle und Werte von der Veröffentlichung über MQTT/API ausschließen oder sie aus den WebUI-Seiten entfernen. Unter „Geräte“ und im Dashboard werden nur Entitäten mit einem Wert angezeigt, während das Modul „Anpassung“ alle Entitäten anzeigt. Wenn eine Entität keinen Wert hat, wird sie zwar von EMS-ESP unterstützt, jedoch nicht von Ihrem boiler/thermostat/etc, und wird daher nicht veröffentlicht und ist für Integrationen wie Home Assistant nicht sichtbar.

![Web](/media/screenshot/web_customizations.png)

## Maßnahmen planen

Verwenden Sie den Scheduler, um Befehle in bestimmten Intervallen auszuführen. Hier einige Beispiele:

- Stellen Sie die Warmwassertemperatur morgens und abends auf einen höheren Wert ein.
- Führen Sie jede Woche einen Systemneustart durch (auch wenn das eigentlich nicht nötig sein sollte!), indem Sie im Feld „Befehl“ `system/restart` eingeben.
- Sende eine Nachricht an das Protokoll und an MQTT mithilfe des Befehls `system/message`
- in Kombination mit einer benutzerdefinierten „ram“-Entität verwenden, um Daten über eine andere API wie `{"url":"http://server.tld/path/file", "key":"nameofkey"}` abzurufen, und dies als Bedingung im Scheduler nutzen
- Daten über einen RESTful-HTTP-POST-Befehl an eine externe API senden, zum Beispiel `{"url":"http://192.168.0.100/cm?cmnd=power"} == {"power":"off"}`
- Wird verwendet, um ein Home Assistant-Skript oder einen Dienst aufzurufen, wenn eine Bedingung ausgelöst wird, z. B. `{ "url":"http://<ha ip>/api/services/script/my_script", "header":{"authorization":"Bearer <ha key>", "Content-Type":"application/json"} }`

:::warning[Verwendung von HTTPS in Scheduler-Befehlen]
HTTPS wird nur bei den ESP32- und ESP32-S3-Varianten mit PSRAM unterstützt, wenn `url` für die Kommunikation mit einem externen Endpunkt verwendet wird. In diesem Fall wird von HTTPS auf HTTP zurückgegriffen, was möglicherweise zu einer Fehlermeldung führt.
:::

Beim Anlegen eines Scheduler-Eintrags ist das `name` optional, es ist jedoch sinnvoll, einen Namen zu vergeben. So können Sie den Eintrag über einen Befehl (enable/disable) steuern und den Status im MQTT-Thema `scheduler_data` einsehen.

![Web](/media/screenshot/web_scheduler.png)

Der Scheduler kann auch dazu verwendet werden, Werte in regelmäßigen Abständen auf der Grundlage eines Werts einer anderen Entität oder sogar einer benutzerdefinierten Entität (Variablen) festzulegen. Um beispielsweise die Vorlauftemperatur des Heizkessels jede Minute auf der Grundlage einer vom Benutzer verwalteten Entität festzulegen, die extern gesteuert wird (z. B. in Home Assistant), würde dies wie folgt aussehen:

![Web](/media/screenshot/web_scheduler_custom.png)
![Web](/media/screenshot/web_scheduler_flowtemp.png)

### Bedingungen

Der in **Version 3.7** eingeführte Scheduler wurde erweitert und unterstützt nun bedingte Anweisungen und Formeln, die in den Feldern `Command` and/or `Value` für die Typen „Timer“, „On Change“ und „Condition“ verwendet werden können.

Bedingungen unterliegen einer strengen Syntax (siehe unten) und werden alle 10 Sekunden ausgewertet. Die Bedingung wird nur ausgeführt, wenn sich ihr Wert von „falsch“ auf „wahr“ ändert. Dies ist eine leistungsstarke neue Funktion, mit der Sie beispielsweise einen Zeitplan auf der Grundlage einer Bedingung festlegen oder einen Wert basierend auf einer Bedingung setzen können.

Beachten Sie bitte die folgenden Regeln:

- Eine Bedingung muss ein logischer Wert `0` oder `1` sein; die Bedingung lautet nur für `1` `true`, ein arithmetisches Ergebnis `1` wird ebenfalls als `true` interpretiert
  Der Befehl „schedule“ wird für `3 > 2, 3 - 2` ausgeführt.
  Der Befehl „schedule“ wird für `3 < 2` und `3 + 2` nicht ausgeführt.
- Leerzeichen sind nicht erforderlich, machen die Formel aber übersichtlicher
- Auf EMS-ESP-Werte wird über `<device>/<entity>` oder `<device>/<entity>/value` zugegriffen. Das `<entity>` kann zusätzliche Präfixe wie `<hc2>` enthalten.
- Die Einstellungen des Benutzers für das Boolesche Format (`0/1`, `off/on`, `OFF/ON` oder `false/true`) und das Enum-Format (value/index) werden bei der Auswertung von Booleschen Werten und Enums verwendet. Überprüfen Sie den richtigen Wert, bevor Sie einen Zeitplan festlegen, indem Sie die API direkt abfragen. Gehen Sie beispielsweise zu `http://ems-esp.local/api/thermostat`, um zu sehen, ob der Aufbau „mittel“ ist, und erstellen Sie dann die Regel mit `thermostat/building == medium`.
- Zeichenfolgen, die Sonderzeichen enthalten, müssen in Anführungszeichen gesetzt werden, z. B. `boiler/pumpmode == "delta-P2"`, um einen Berechnungsfehler bei „delta minus P2“ zu vermeiden.
- Alle Zeichenfolgen werden in Kleinbuchstaben umgewandelt (vor v3.7.2)
- Befehle, auf die ein Trennzeichen folgt (`/`), müssen in Klammern gesetzt werden, z. B. `(boiler/seltemp)/2`
- Der Befehl „condition“ wird nur ausgeführt, wenn sich die Bedingung von `false` zu `true` ändert. Bleibt die Bedingung wahr, wird der Befehl nicht wiederholt.
- Ein Befehlswert kann auch eine Formel sein
- zulässige Operationen:
  - Arithmetik: `+` `-` `*` `/` `%`
  - Funktionen: `round` `abs` `int` `exp` `log` `sqrt` `pow`, `hex`
  - Logik: `==` `!=` `<=` `>=` `<` `>` `&&` `||`
  - Präfix: `!` (nicht) und `-` (Negation)
  - Bedingte Operationen: `<cond1> ? <expr1> : <expr2>` Beispiele:
    - (vor v3.7.2 zulässig) `<cond> ? 5 + <expr1> : 5 + <expr2>`
    - (zulässig seit v3.7.2) `5 + (<cond> ? <expr1> : <expr2>)` und kaskadierende Bedingungen `<cond1> ? <cond2> ? <expr1> : <expr2> : <cond3> ? <expr3> : <expr4>`

Ein „On Change“-Trigger ist eine Liste von Entitäten im Format `<device>/<entity>`, zum Beispiel `boiler/outdoortemp custom/setpoint`.
Da sich Entitäten niemals gleichzeitig ändern, sind logische Operatoren wie `&&` hier nicht sinnvoll. Beachten Sie, dass die Verwendung von `system` als `<device>` nicht unterstützt wird.

![Web](/media/screenshot/web_conditions_1.png)

![Web](/media/screenshot/web_conditions_2.png)

### HTTP/HTTPS-Anfragen

Das Senden oder Abrufen von Daten über HTTP/HTTPS-Anfragen ist möglich, indem ein JSON-Objekt als Scheduler-Befehl oder -Wert gesendet wird.

Verwenden Sie die Notation `{"url":"<url>", ["header":"<header>"], ["method":"<method>"], ["key":"<key>"], ["keys":"<keys>"]}`,

`url` ist die URL des Endpunkts, von dem Daten abgerufen oder an den Daten gesendet werden sollen, im Format `http://server.tld/path/file`, und ist obligatorisch. Sowohl HTTP als auch HTTPS werden unterstützt.

`header` ist standardmäßig `{"content-type":application/json"}`, wenn der Scheduler `Value` ein JSON-Objekt ist; andernfalls wird der Wert auf `{"content-type":"text/plain"}` gesetzt. Dies kann durch einen benutzerdefinierten Header überschrieben werden oder indem ein Token wie `{"content-type":"application/json", "token":"mytoken"}` in den Header aufgenommen wird.

`method` ist standardmäßig `GET`, kann jedoch mit den Methoden `POST`, `PUT`, `DELETE` oder `PATCH` überschrieben werden. Wenn der Scheduler `Value` ein JSON-Objekt ist, wird er beim Senden der Daten automatisch auf `POST` gesetzt.

Mit `key` und `keys` lassen sich bei der Ausführung einer GET-Anfrage bestimmte JSON-Objekte aus der zurückgegebenen Nutzlast extrahieren.

#### Beispiele:

#### Die neuesten EMS-ESP-Versionen abrufen und in einem benutzerdefinierten Entitätsfeld speichern

Befehl: `custom/latest_version`
Wert: `{"url":"https://emsesp.org/versions.json"}`

`latest_version` ist der Name der benutzerdefinierten Entität, in der die aktuellste EMS-ESP-Version als RAM-Wert gespeichert wird.

#### Den Inhalt einer benutzerdefinierten Entität an den Pushover-Benachrichtigungsdienst senden

Befehl: `{"url":"https://api.pushover.net/1/messages.json"}`
Wert: `{"user":"<user id>", "token":"<token>", "message":custom/<name>}`

Hierbei wird die [Pushover](https://pushover.net)-API verwendet, um eine Nachricht an den Pushover-Benachrichtigungsdienst zu senden.

`<name>` ist der Name der benutzerdefinierten Entität der zu sendenden Nachricht.

#### Den Status eines Tasmota-Steckers auslesen (GET)

Wert: `{"url":"http://<tasmota IP>/cm?cmnd=Power", "key":"POWER"}`

#### Um zu prüfen, ob ein Tasmota-Stecker ein- oder ausgeschaltet ist (GET)

Wert: `{"url":"http://<tasmota IP>/cm?cmnd=power", "key":"power"} == off`
oder `{"url":"http://<tasmota IP>/cm?cmnd=power"} == {"power":"off"}`

#### Einstellen des Energiezustands eines Tasmota-Steckers (GET)

Befehl: `{"url":"http://<tasmota IP>/cm?cmnd=power%20on"}`

#### Ein Shelly-Relais einschalten (GET)

Befehl: `{"url":"http://<shelly IP>/relais/0?turn=on"}`

## Hinzufügen benutzerdefinierter Entitäten

„Custom Entities“ ist eine fortschrittliche und leistungsstarke Möglichkeit, EMS-ESP zu erweitern, indem Sie eigene EMS-Entitäten hinzufügen, die Daten aus einem bestimmten EMS-Telegramm extrahieren. Dies ist nützlich, wenn EMS-ESP eine bestimmte Entität noch nicht unterstützt oder wenn Sie Daten aus einem Telegramm extrahieren möchten, das noch nicht unterstützt wird. Ein weiterer häufiger Anwendungsfall ist das Debuggen oder Beobachten bestimmter Verhaltensweisen beim Ändern von Parametern an einem EMS-Gerät.

Beispielsweise kann eine moderne Wärmepumpe über neue Funktionen verfügen, die nicht in EMS-ESP enthalten sind. In diesem Fall würden Sie den Befehl `watch` verwenden, um den eingehenden EMS-Datenverkehr anzuzeigen, und gleichzeitig bestimmte Parameter manuell anpassen. Sobald Sie das betreffende Telegramm und den Offset ermittelt haben, erstellen Sie eine benutzerdefinierte Entität, um den Typ genau abzustimmen und den Wert zu überprüfen. Beantragen Sie anschließend, dass dies in das nächste EMS-ESP-Release-Update aufgenommen wird.

![Web](/media/screenshot/web_customentities.png)
