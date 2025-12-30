---
id: Configuring
---

# Bestätigen

## Erstmalige Einrichtung

In der Werkskonfiguration wird ein WiFi-Zugangspunkt namens `ems-esp` eingerichtet. Verbinden Sie sich mit diesem mit dem WPA-Passwort `ems-esp-neo`. Wenn Sie zu einem Anmeldebildschirm (Captive Portal) aufgefordert werden, melden Sie sich mit dem Benutzernamen `admin` und dem Passwort `admin` an. Diese können später geändert werden. Wenn Sie eine Ethernet-Karte haben, können Sie sich direkt mit deren IP-Adresse oder über `http://ems-esp` oder `http://ems-esp.local` verbinden.

Jetzt können Sie die Einstellungen weiter konfigurieren. Wenn Sie nicht mit Ihrem WiFi-Netzwerk verbunden sind, tun Sie dies zuerst auf der Seite Einstellungen->Netzwerk. Sie können dies auch über die Konsole tun, wenn Sie mit einem Serial/USB-Port verbunden sind und die Befehle `set wifi ssid` und `set wifi password` verwenden.

Wenn Sie Warnungen erhalten, dass die Verbindung zum EMS-Bus fehlgeschlagen ist oder Tx- oder Rx-Fehler vorliegen, folgen Sie der Anleitung [troubleshooting](Troubleshooting).

:::note Wenn Sie im Protokoll die Meldung "Rx unvollständige Telegramme" sehen, geraten Sie nicht in Panik. Einige Telegramme können verpasst werden, und dies wird in der Regel durch Rauschstörungen auf der Leitung verursacht.
:::

Im folgenden Abschnitt werden einige der wichtigsten Einstellungen beschrieben, die über die WebUI im Abschnitt Einstellungen vorgenommen werden können. Die meisten sind selbsterklärend, daher werden hier nur die wichtigsten beschrieben.

## Anwendungseinstellungen

### Dienstleistungen

- **Umgehung der Access Token-Autorisierung bei API-Aufrufen**. Für RESTful-Schreibbefehle über HTTP POST ist das Zugriffs-Token erforderlich. Dies geschieht aus Sicherheitsgründen, um zu verhindern, dass jemand die Geräteeinstellungen ändert. Wenn Sie dieses Flag setzen, ist die API offen. Nicht empfohlen!
- **Telnet-Konsole aktivieren**. Diese Option ist standardmäßig aktiviert und ermöglicht Benutzern die Verbindung mit dem unsicheren Telnet-Server an Port 23.
- **Modbus aktivieren**. Diese Funktion ist standardmäßig ausgeschaltet und ermöglicht es dem Benutzer, eine Verbindung zum Modbus-TCP-Server herzustellen (Standard-Port 502). Aufgrund von Speicherbeschränkungen ist diese Funktion nur auf Karten mit zusätzlichem PSRAM verfügbar.
- **Syslog aktivieren**:
  - **IP** ist die IP-Adresse eines Syslog-Servers für die Erfassung von Fernprotokollen. Leer lassen, wenn Sie SysLog nicht verwenden. Hinweis: EMS-ESP verwendet das Standardprotokoll [RFC5424](https://datatracker.ietf.org/doc/html/rfc5424). Stellen Sie daher sicher, dass Ihr Syslog-Server für die Verarbeitung dieser Nachrichten eingerichtet ist und nicht für RFC3164 (BSD Syslog).
  - **Port** bei Verwendung einer alternativen Portnummer. Der Standardwert ist 514. Und es wird UDP (nicht TCP) verwendet.
  - mit **Protokollebene** wird die maximale Protokollebene für gemeldete Nachrichten festgelegt. Die höchste Stufe ist DEBUG, bei der sehr viele Protokolldaten gesendet werden, daher ist Vorsicht geboten.
  - **Intervall markieren** sendet eine spezielle `mark`-Nachricht an das SysLog. Dies ist nützlich für die Zeitmessung von Ereignissen.

### Sensoren

- **Analoge Sensoren aktivieren**. Damit kann jeder GPIO Signale erfassen, egal ob es sich um einen digitalen I/O, einen Impulszähler oder einen ADC handelt, der mv misst. Es sind noch viele weitere Optionen verfügbar. Beachten Sie, dass der `Factor` ein Teiler ist.
- **1-Draht-Parasitenstrom aktivieren**. Wählen Sie diese Option, wenn Sie (Dallas-)Temperatursensoren mit parasitärer Leistung verwenden.

### Formatierungsoptionen

- **Sprache**. Hier wird die Sprache festgelegt, die für die Namen der EMS-Geräteeinheiten, die in den WebUI-Geräten und im Dashboard angezeigt werden, und auch für die MQTT-Erkennung verwendet wird. Die Standardeinstellung ist Englisch. Wenn Sie den Home Assistant verwenden und die Sprache umstellen, müssen Sie eventuell die vorherigen EMS-ESP MQTT-Einträge entfernen (unter HA-Einstellungen->Geräte & Dienste->MQTT) und EMS-ESP neu starten, um sicherzugehen.
- **Boolean Format Dashboard**. So werden boolesche Werte in der WebUI und in MQTT-Payloads angezeigt.
- **Boolean Format API/MQTT**. So werden boolesche Werte in den MQTT-Payloads und der API-JSON-Ausgabe geschrieben.
- **Enum Format API/MQTT**. Dies ist die Art und Weise, wie Listenwerte in den MQTT-Payloads und API JSON dargestellt werden, entweder durch den Wert oder die Indexposition innerhalb der Liste. Bei der Verwendung von Home Assitant werden für einige Entitäten keine Werte, sondern ganze Zahlen angezeigt, z. B. statt `off, hot, cold` wird `0, 1, 2` angezeigt.
- **Umrechnung der Temperaturwerte in Fahrenheit**. Für unsere US-Freunde.
- **EMS-Telegramme hexadezimal protokollieren** schreibt die Telegramme im Rohformat überall als hexadezimale Werte hin.

### Hardware-Einstellungen

- **Board Profile**. Board-Profile sind vorkonfigurierte GPIO-Einstellungen für eine Reihe von gängigen ESP32-Entwicklungsboards und EMS-Gateway-Schaltungen. Die folgenden Profile sind verfügbar:

| `profile name` | `based on board` | `led` | `dallas` | `rx` | `tx` | `button` | `phy_type` | `eth_power` | `eth_phy_addr` | `eth_clock_mode` |
| ------------ | ---------------------- | --- | ------ | --- | --- | ------ | -------- | --------- | ------------ | ---------------------------- |
| S32 | BBQKees Gateway S32 | 2 | 18 | 23 | 5 | 0 | | | | | |
| E32 | BBQKees Gateway E32 | 2 | 4 | 5 | 17 | 33 | LAN8720 | 16 | 1 | Eingang zu GPIO0 |
| E32V2 | BBQKees Gateway E32 V2 | 2 | 14 | 4 | 5 | 34 | LAN8720 | 15 | 0 | Ausgang von GPIO0 |
| S32S3 | BBQKees Gateway S3 | 2 | 18 | 5 | 17 | 0 | | | | | |
| MH-ET | MH-ET Live D1 Mini | 2 | 18 | 23 | 5 | 0 | | | | | |
| NODEMCU | NodeMCU 32S | 2 | 18 | 23 | 5 | 0 | | | | | |
| LOLIN | Lolin D32 | 2 | 18 | 17 | 16 | 0 | | | | | |
| OLIMEX | Olimex ESP32-EVB | 0 | 0 | 36 | 4 | 34 | LAN8720 | -1 | 0 | Eingang zu GPIO0 |
| OLIMEXPOE | Olimex ESP32-POE | 0 | 0 | 36 | 4 | 34 | LAN8720 | 12 | 0 | Ausgang von GPIO17, invertiert |
| C3MINI | Lolin C3 Mini | 7 | 1 | 4 | 5 | 9 | | | | | |
s2MINI | Lolin S2 Mini | 15 | 7 | 11 | 12 | 0 | | | | | |
| S3MINI | Liligo S3 | 17 | 18 | 8 | 5 | 0 | | | | | |

Wenn Sie `Custom` wählen, werden die folgenden zusätzlichen Einstellungen angezeigt, mit denen Sie die GPIOs manuell konfigurieren können, um sie an Ihr eigenes Board anzupassen. Sie können auch jederzeit `Custom` wählen, um die aktuellen Board-Profileinstellungen anzuzeigen, ohne zu speichern.

*Benutzerdefinierte Bordeinstellungen:*

- **Rx GPIO**. Dies ist der GPIO-Pin, dem das Rx-Signal zugewiesen ist. Standardmäßig ist dies GPIO 23, aber es kann fast jeder freie Pin sein. Verbinden Sie diesen GPIO-Pin mit dem RX-Anschluss auf der EMS-Schnittstellenkarte.
- **Tx GPIO**. Dies ist der GPIO-Pin, dem das Tx-Signal zugewiesen ist. Standardmäßig ist dies GPIO 5, aber es kann fast jeder freie Pin sein. Verbinden Sie diesen GPIO-Pin mit dem TX-Anschluss auf der EMS-Schnittstellenkarte.
- **Taste GPIO**. Dies ist der GPIO-Pin, dem die Taste zugewiesen ist. Es ist ein Pull-up. Die Taste wird für verschiedene Funktionen verwendet. Ein einfacher Klick bewirkt nichts, ein Doppelklick führt einen WiFi-Reset durch und stellt die Verbindung zum AP wieder her, ein langes Drücken für 10 Sekunden und Loslassen führt einen Factory-Reset durch und ein sehr langes Drücken für mindestens 20 Sekunden ohne Loslassen startet den EMS-ESP neu und bringt ihn auf die ursprüngliche Boot-Partition.
- **Temperatur GPIO**. Dies ist der Pin, an den externe Temperatursensoren angeschlossen werden. Die Dallas-Chips DS1822, DS18S20, DS18B20, DS1825 werden einschließlich ihrer parasitären Varianten unterstützt und können auch auf einer einzigen Leitung verkettet werden, bis zu 100 Sensoren.
- **LED GPIO**. Dies ist der Pin für die LED, standardmäßig für die Onboard-LED auf dem ESP-Devboard.
- **Eth PHY Typ**. Dies ist der Typ des verwendeten Ethernet-Chips.

:::note Auf ESP32-Entwicklungsplatinen gibt es oft auch Pins mit der Bezeichnung RX und TX. Diese sind jedoch normalerweise mit dem USB-Chip verbunden und können nicht für die EMS-Schnittstellenschaltung verwendet werden.
:::

- **EMS Tx-Modus**. Der Tx-Modus ist der Modus, in dem EMS-ESP Telegramme auf dem EMS-Bus sendet. Wählen Sie den Modus, der für Ihr System am besten geeignet ist, und achten Sie auf Tx-Fehler im Web Dashboard und `show ems` in der Konsole. Das Ändern des Wertes hat sofortige Auswirkungen.
  - `EMS` ist der Standard für EMS1.0-Systeme, aber auch mit den meisten anderen Busprotokollen kompatibel.
  - `EMS+` ist so konzipiert, dass es besser für EMS2.0/EMS+ Systeme funktioniert.
  - `HT3` für Heatronics3, hauptsächlich von Junkers verwendet.
  - `Hardware` verwendet die interne ESP-Hardware, um das Telegramm auszusenden. Die Telegramme werden sofort gesendet. Dies ist die schnellste und effizienteste Methode, funktioniert aber nur auf einigen Systemen.
- **EMS-Bus-ID**. Das EMS-ESP kann mehrere Geräte simulieren. Halten Sie sich an die Standardeinstellung `Service Key (0x0B)`, es sei denn, Sie verwenden mehr als eine EMS gateways/interface-Karte. Es ist wichtig zu beachten, dass der Serviceschlüssel auch von zertifizierten service/maintenance-Technikern bei der Wartung Ihrer Heizungsanlagen verwendet wird. Stellen Sie also sicher, dass Sie das EMS-ESP ausschalten, bevor sie eintreffen, da sie sonst keine Verbindung zum EMS-Bus herstellen können.
- **Nur-Lesen-Modus aktivieren**. Dies deaktiviert alle ausgehenden Tx-Schreibbefehle an den EMS-Bus und versetzt EMS-ESP im Wesentlichen in den Hörmodus. Tx wird jedoch benötigt, um EMS-Geräte zu erkennen (da es einen Versionsbefehl aussendet). Wenn Sie EMS-ESP explizit in einen Lese-only/sniffer-Modus versetzen wollen, verwenden Sie `set tx_mode 0` von der Konsole aus.
- **LED ausblenden**. Schaltet die LED im normalen Betriebsmodus aus. Die LED wird weiterhin beim Booten oder bei Verbindungsproblemen angezeigt.
- **Untertaktete CPU-Geschwindigkeit**. Untertaktet den ESP auf 160Mhz, spart Strom und Wärme und verlängert die Lebensdauer des Chips auf Kosten der Leistung und Reaktionszeit. Ein Neustart des EMS-ESP ist erforderlich.

### Besondere Funktionen

- der **Entwicklermodus** aktiviert erweiterte Funktionen in der WebUI, wie z. B. den Befehl Lesen aus dem Systemprotokoll.
- **Kessel bei ausgeschalteter Zwangsheizung starten**.
- **Fernbedienung bei fehlender Raumtemperatur deaktivieren**. Dies ist eine Sicherheitsfunktion, die verhindert, dass der Heizkessel startet, wenn der simulierte Raumtemperatursensor fehlt oder nicht funktioniert.
- **Dusch-Timer aktivieren**. Aktivieren Sie diese Option, um die Dauer des Warmwassers zu messen, und es wird eine MQTT-Nachricht mit der Dauer gesendet. Der Timer startet nach einer Mindestlaufzeit von 2 Minuten.
- **Brausealarm aktivieren**. Diese Funktion ist etwas experimentell und funktioniert möglicherweise nicht bei allen Heizkesseln. Nach 7 Minuten (konfigurierbar), in denen das heiße Wasser läuft, sendet er eine Warnung aus, indem er 10 Sekunden lang kaltes Wasser ausgibt (ebenfalls konfigurierbar). Der Kessel geht in den Testmodus, um diesen Vorgang auszuführen, daher ist Vorsicht geboten!

## Netzwerkeinrichtung

Auf der Seite Netzwerk können Sie den EMS-ESP mit Ihrem Heimnetzwerk verbinden. Sie können zwischen WiFi und Ethernet wählen, wenn die Hardwarekarte dies unterstützt. Hinweis: WiFi muss 2.4GHz/WPA2 sein. Es wird keine Verbindung zu einem 5GHz WifFi-Zugangspunkt hergestellt.

### CORS (Cross-Origin Resource Sharing)

Wenn CORS aktiviert ist, werden jeder Webanforderung neue HTTP-Header hinzugefügt, damit die Web-API `fetch`- und `XMLHttpRequest`-Anforderungen über verschiedene Domänen hinweg stellen kann. Sie deaktiviert die Preflight-Prüfung, die standardmäßig der Politik des gleichen Ursprungs folgt. Siehe [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) für weitere Einzelheiten. Es gibt auch ein Browser-Addon "CORS unblock", das auf die gleiche Weise funktioniert.

Aktivieren Sie diese Funktion, wenn Sie in VPNs arbeiten oder andere Server (z.B. Grafana) auf anderen Domains laufen, die Aufrufe an die API von EMS-ESP tätigen.

## MQTT-Einrichtung

- **Broker-Adresse**. Verwenden Sie die IP-Adresse, nicht einen FQDN.
- **Port**. Der Standardwert ist 1883 und 8883 für SSL.
- **Basis**. Allen Themen ist das Präfix `Base` vorangestellt, daher ist dies wichtig. Vergewissern Sie sich, dass dies eindeutig ist, wenn Sie mehr als ein EMS-ESP mit demselben Broker verwenden.
- **Kunden-ID**. Diese wird intern zur Identifizierung von EMS-ESP mit dem Broker verwendet und ist optional. Hinweis: MQTT-Themen werden mit dem Hostnamen (Standard `ems-esp`) und nicht mit der Client-ID versehen. Zu verwenden, wenn mehrere Geräte vorhanden sind.
- **Benutzername** und **Passwort** sind optional, werden aber aus Sicherheitsgründen empfohlen. Standardmäßig benötigt der Mosquitto MQTT-Broker ein username/password, also achten Sie darauf, wenn Sie das Home Assistant Add-On hier verwenden.
- **Saubere Sitzung**. Erzeugt eine nicht-persistente Sitzung, wenn aktiviert. Die Standardeinstellung und empfohlene Einstellung ist deaktiviert, damit sie bei der Verwendung von Hausautomatisierungssystemen deaktiviert bleibt.
- **QoS**. Dienstgüte, 0, 1 oder 2. 0 ist die Standardeinstellung und für die meisten Szenarien geeignet. Ein Wert von 1 garantiert, dass die Nachricht gesendet wurde, verursacht aber etwas mehr Netzwerkverkehr und Overhead.
- **Immer das Retain Flag setzen**. Aktivieren Sie diese Option, wenn Sie alle Nachrichten auf dem MQTT-Broker aufbewahren möchten. Standard ist deaktiviert.
- **Formatierung**. Mit der Option `Nested` werden alle Gerätedaten in einem einzigen MQTT-Topic zusammengefasst, indem eingebettete JSON-Objekte wie `dhw` in `boiler_data`, `hc1` in `thermostat_data` usw. verwendet werden. `As individual topics` teilt dies in separate MQTT-Themen ohne Gruppierung auf, so dass MQTT-Themen zu `boiler_data` und `boiler_data_dhw`, `thermostat_data` und `thermostat_data_hc1` usw. werden. Das Gleiche gilt für die Analog- und Temperatursensoren. Die Standardeinstellung ist verschachtelt.
- **Befehlsausgabe in einem 'Antwort'-Thema veröffentlichen'**. Dies nimmt die Ausgabe eines API-Befehls und veröffentlicht das Ergebnis in einem Thema namens `response`.
- **Einzelwertthemen bei Änderung veröffentlichen**. Diese Option veröffentlicht sofort das Topic und den Payload für jede Operation und ist nur verfügbar, wenn MQTT Discovery deaktiviert ist.
- **MQTT Discovery aktivieren** aktiviert die Integration über MQTT Discovery, die vollständig von Home Assistant und teilweise von Domoticz unterstützt wird.
- **Erkennungstyp**. Wählen Sie zwischen "Home Assistant" und zwei Protokollen für "Domoticz". `Domoticz (latest)` verwendet Zahlen, Schalter, Auswahl und andere moderne Typen, während `Domoticz` nur Sensoren für alles verwendet und auch alle Template-Bedingungen entfernt.
- **Format der Entitäts-ID**: Es gibt 3 Optionen. Die erste `single instance, long names` verwendet das ältere `< v3.5` Format. Die Standardeinstellung und empfohlene Einstellung für alle neuen Installationen ist die zweite Option namens `Single instance, short name`, die den EMS-ESP-Gerätenamen verwendet, der festgelegt ist und auf der Seite `Settings->Customization` zu sehen ist. Die letzte Option muss verwendet werden, wenn mehr als eine Version der EMS-ESP-Firmware verwendet wird, da sie jede Version eindeutig macht, indem sie allen MQTT-Themen den Basisnamen vorangestellt wird.
- **Veröffentlichungsintervalle**. Dieser Abschnitt gilt pro Gerät und legt fest, wie häufig eine MQTT-Nachricht gesendet wird. Wenn der Wert 0 eingestellt ist, sendet EMS-ESP automatisch Daten, wenn eine merkliche Änderung eintritt, was innerhalb weniger Sekunden der Fall sein kann.

## NTP-Einrichtung

- Der **NTP-Server** ist standardmäßig `time.google.com`. Dieser kann auf einen lokalen NTP-Server oder einen bestimmten Server, wie `pool.ntp.org`, geändert werden.
- Die **Zeitzone** ist standardmäßig "Europe/Amsterdam". Diese kann auf eine der [IANA Time Zone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)-Zeitzonen geändert werden.

## Benutzer und Rollen verwalten

Auf der Seite Sicherheit können Sie das Standardkennwort für das Captive Portal und die Telnet-CLI ändern. Außerdem können Sie hier HTTPS für das Captive Portal und den MQTT-Broker aktivieren.

Auf der Seite Benutzer können Sie zusätzliche Benutzer für das Captive Portal und Telnet CLI erstellen. Der Standardbenutzer ist `admin` mit dem Passwort `admin`.

Jeder Benutzer verfügt über ein eindeutiges Zugriffstoken (einsehbar durch Klicken auf das Schlüsselsymbol), das für RESTful-Schreibbefehle über HTTP POST verwendet wird. Dies geschieht aus Sicherheitsgründen, um zu verhindern, dass jemand die Geräteeinstellungen ändert.

![Web](/media/screenshot/web_users.png)

## Hinzufügen von Analog- und Temperatursensoren

Externe Sensoren, wie Temperatur- und Analogsensoren, können an eine Reihe von GPIO-Pins des ESP32-Chips angeschlossen werden. Wenn Sie ein BBQKees Gateway-Board verwenden, verfügt es bereits über einen externen Stecker für Dallas-Temperatursensoren, die in der WebUI ohne zusätzliche Konfiguration sichtbar sind.

Um analoge Sensoren hinzuzufügen, klicken Sie auf `Add` und wählen Sie zwischen einem normalen digitalen in/out, einem Zähler (der on/off-Impulse zählt), einem ADC zur Spannungsmessung, einem Timer, einer Rate und PWM 0-2. Hinweis: Der Zählerwert bleibt erhalten und wird beim Neustart nicht zurückgesetzt.

![Web](/media/screenshot/web_sensor.png)

:::warning Seien Sie vorsichtig, wenn Sie einen GPIO auswählen, damit er nicht mit den anderen verwendeten GPIOs kollidiert (Sie können CUSTOM board profile wählen, um Ihre aktuelle Konfiguration zu sehen).

    EMS-ESP ist an den Niederspannungsbus Ihrer Heizung angeschlossen und jede Überspannung kann die EMS-ESP-Platine und möglicherweise Ihre Heizgeräte beschädigen. Versorgen Sie externe Geräte niemals direkt über die EMS-ESP-Platine.

    ESP32 Entwicklungsplatinen unterscheiden sich in ihrer verfügbaren Pin-Konfiguration. Normalerweise können Sie 1, 6-11, 12, 14, 15, 20, 24, 28-31 und 40+ nicht verwenden. Siehe diese Links [here](https://diyprojects.io/esp32-how-to-use-gpio-digital-io-arduino-code/#.YFpVEq9KhjG) und [here](https://nodemcu.readthedocs.io/en/dev-esp32/modules/gpio/).

:::

Die folgenden GPIOs werden empfohlen:

- digitale Ausgabe: `13, 19, 21, 22, 27, 33, 37, 38`
- digital input/counter/timer/rate: `13, 19, 21, 22, 25, 26, 27, 33, 35, 37, 38, 39 (note no pullup on 35 & 39)`
- ADC-Eingang: `13, 19, 21, 22, 25, 26, 27, 33, 35, 37, 38, 39`
- DAC-Ausgang: `25, 26`
- PWM-Ausgang: `13, 19, 21, 22, 25, 26, 27, 33, 37, 38`

Grenzwerte:

- ADC: max. Eingang 3,3V, Anzeige in MilliVolt
- DAC 8bit, Wertebereich 0..255 für 0V-3.3V Ausgang, Konfigurieren als `Digital out` auf gpio 25 oder 26 (ESP32), 17, 18 (ESP32S2), nicht verfügbar für ESP32S3, ESP32C3
- PWM 0-2: maximale Frequenz 5000Hz, Auflösung 13bits. Jeder Kanal kann nur für einen Gpio verwendet werden.
- Pulse ist ein digitaler Ausgang für einen einzelnen Impuls mit einstellbarer Länge. Bei der Einstellung auf `on` per Befehl geht der Sensor nach Beendigung des Impulses auf `off`.
- Counter/timer/rate auslösen: `high->low edge with 15 ms debounce. Only for low pulse rates < 30Hz.`
- Zähler 0-2, Frequ 0-2: Hochgeschwindigkeits-Eingänge für 1 Hz bis 100kHz Signale, keine Entprellung, RC-Filter für verrauschte Signale verwenden. Interruptgesteuert, jeder Kanal kann nur für einen Gpio verwendet werden.

Die Zähler werden auf reboot/update gespeichert und jede Stunde an nvs. I Fall von Abstürzen, Stromausfällen, kann der Wert nach niedriger sein.

### Steuerrelais

Ein häufiger Anwendungsfall ist die Steuerung eines Relais zum Schalten on/off eines Geräts. Dies kann durch Hinzufügen eines digitalen Ausgangssensors und anschließendes Erstellen eines Befehls zu dessen Steuerung erfolgen. Der Befehl kann dem Dashboard hinzugefügt und so geplant werden, dass on/off zu bestimmten Zeiten geschaltet wird.

Erstellen Sie einen analogen Sensor mit dem Typ "Digitaler Ausgang".

Der professionelle Weg ist die Verwendung einer separaten Relaisplatine mit Opto-Isolation und einer Flyback-Diode. Die Relaisplatine wird dann von einer separaten Stromversorgung gespeist und das Relais wird wie oben beschrieben an den digitalen Ausgang des EMS-ESP angeschlossen. Die Relaisplatine wird dann an das Gerät angeschlossen, das Sie steuern möchten. Auf diese Weise ist das Gerät vollständig vom EMS-ESP isoliert und die Relaiskarte kann die höhere Spannung und den höheren Strom verarbeiten.

## Entitäten anpassen

Die Seite "Anpassung" zeigt alle registrierten Entitäten und ermöglicht es, Befehle und Werte von der Veröffentlichung über MQTT/API auszuschließen oder sie von den WebUI-Seiten zu entfernen. Die Geräte und das Dashboard zeigen nur Entitäten mit Wert, während das Anpassungsmodul alle Entitäten anzeigt. Wenn eine Entität keinen Wert hat, wird sie von EMS-ESP unterstützt, aber nicht von Ihrem boiler/thermostat/etc und wird nicht veröffentlicht oder für Integrationen wie Home Assistant sichtbar.

![Web](/media/screenshot/web_customizations.png)

## Planen von Aktionen

Verwenden Sie den Scheduler, um Befehle in bestimmten Abständen aufzurufen. Ein paar Beispiele:

- stellen Sie die Warmwassertemperatur morgens und abends auf einen höheren Wert ein
- jede Woche einen Neustart des Systems durchführen (obwohl das nicht nötig sein sollte!), indem Sie `system/restart` in das Feld Befehl eingeben
- mit dem Befehl `system/message` eine Nachricht an das Protokoll und an mqtt senden
- verwendung in Kombination mit einer benutzerdefinierten "ram"-Einheit zum Abrufen von Daten über eine andere API wie `{"url":"http://server.tld/path/file", "key":"nameofkey"}` und Verwendung dieser als Bedingung im Scheduler
- daten über einen RESTful HTTP POST-Befehl an eine externe API senden, z. B. `{"url":"http://192.168.0.100/cm?cmnd=power"} == {"power":"off"}`
- zum Aufrufen eines Home Assistant-Skripts oder -Dienstes, wenn eine Bedingung erfüllt ist, z. B. `{ "url":"http://<ha ip>/api/services/script/my_script", "header":{"authorization":"Bearer <ha key>", "Content-Type":"application/json"} }`

:::warning Verwendung von HTTPS in Scheduler-Befehlen HTTPS wird nur auf den ESP32- und ESP32-S3-Varianten mit PSRAM unterstützt, wenn es mit `url` zu einem externen Endpunkt verwendet wird. Das https fällt auf http zurück und kann einen Fehler melden.
:::

Bei der Erstellung eines Scheduler-Eintrags ist das `name` optional, aber es ist nützlich, einen Namen zu vergeben. Dann kann man ihn über einen Befehl (enable/disable) steuern und den Status im MQTT-Topic `scheduler_data` sehen.

![Web](/media/screenshot/web_scheduler.png)

Der Scheduler kann auch verwendet werden, um regelmäßig Werte auf der Grundlage eines anderen Entitätswerts oder sogar einer benutzerdefinierten benutzerdefinierten Entität (Variable) einzustellen. Um beispielsweise die Vorlauftemperatur des Heizkessels jede Minute auf der Grundlage einer vom Benutzer verwalteten Entität einzustellen, die von außen gesteuert wird (z. B. im Home Assistant), würde dies folgendermaßen aussehen:

![Web](/media/screenshot/web_scheduler_custom.png) ![Web](/media/screenshot/web_scheduler_flowtemp.png)

### Bedingungen

In **Version 3.7** wurde der Scheduler erweitert, um bedingte Anweisungen und Formeln zu unterstützen, die in den `Command` and/or `Value`-Feldern für die Typen Timer, On Change und Condition verwendet werden können.

Bedingungen haben eine strenge Syntax (siehe unten) und werden alle 10 Sekunden ausgewertet. Die Bedingung wird nur ausgeführt, wenn die Bedingung von falsch auf wahr wechselt. Dies ist eine leistungsstarke neue Funktion, die es beispielsweise ermöglicht, einen Zeitplan auf der Grundlage einer Bedingung festzulegen oder einen Wert auf der Grundlage einer Bedingung festzulegen.

Beachten Sie die folgenden Regeln:

- eine Bedingung muss ein logischer Wert `0` oder `1` sein, die Bedingung ist `true` nur für `1`, ein arithmetisches Ergebnis `1` wird auch als `true` interpretiert Fahrplanbefehl ausgeführt für `3 > 2, 3 - 2` Fahrplanbefehl nicht ausgeführt für `3 < 2`, `3 + 2`
- leerzeichen sind nicht erforderlich, machen die Formel aber besser lesbar
- EMS-ESP-Werte werden mit `<device>/<entity>` oder `<device>/<entity>/value` angesprochen. Das `<entity>` kann zusätzliche Präfixe wie `<hc2>` enthalten.
- Die Einstellungen des Benutzers für Boolean-Format (`0/1`, `off/on`, `OFF/ON` oder `false/true`) und Enum-Format (value/index) werden bei der Auswertung von bool und enums verwendet. Überprüfen Sie den richtigen Wert, bevor Sie einen Zeitplan festlegen, indem Sie die API direkt abfragen. Gehen Sie zum Beispiel zu `http://ems-esp.local/api/thermostat`, um zu sehen, ob das Gebäude "mittel" ist, und erstellen Sie dann die Regel mit `thermostat/building == medium`.
- zeichenfolgen, die Sonderzeichen enthalten, müssen in Anführungszeichen gesetzt werden, z. B. `boiler/pumpmode == "delta-P2"`, um einen Berechnungsfehler bei Delta minus P2 zu vermeiden.
- alle Zeichenfolgen werden in Kleinbuchstaben umgewandelt (vor v3.7.2)
- befehle, denen ein Trennzeichen (`/`) folgt, müssen in Klammern gesetzt werden, z.B. `(boiler/seltemp)/2`
- bedingungsbefehl wird nur bei einem Wechsel der Bedingung von `false` zu `true` ausgeführt. Wenn die Bedingung wahr bleibt, wird der Befehl nicht wiederholt
- ein Befehl Wert kann auch eine Formel sein
- erlaubte Operationen:
  - arithmetik: `+` `-` `*` `/` `%`
  - funktionen: `round` `abs` `int` `exp` `log` `sqrt` `pow`, `hex`
  - logik: `==` `!=` `<=` `>=` `<` `>` `&&` `||`
  - präfix: `!` (nicht) und `-` (Negation)
  - bedingte Operationen: `<cond1> ? <expr1> : <expr2>` Beispiele:
    - (zulässig vor v3.7.2) `<cond> ? 5 + <expr1> : 5 + <expr2>`
    - (erlaubt seit v3.7.2) `5 + (<cond> ? <expr1> : <expr2>)` und kaskadierte Bedingungen `<cond1> ? <cond2> ? <expr1> : <expr2> : <cond3> ? <expr3> : <expr4>`

Ein On Change Trigger ist eine Liste von Entitäten im Format `<device>/<entity>`, zum Beispiel `boiler/outdoortemp custom/setpoint`. Da sich Entitäten nie gleichzeitig ändern, sind logische Operationen wie `&&` hier nicht sinnvoll. Beachten Sie, dass die Verwendung von `system` als `<device>` nicht unterstützt wird.

![Web](/media/screenshot/web_conditions_1.png)

![Web](/media/screenshot/web_conditions_2.png)

### Web-Befehle

Das Senden oder Abrufen von Daten über eine Webanfrage kann in einem json-Befehl verwendet werden:

- GET einen Wert vom Webserver: `{"url":"http://server.tld/path/file"}`
- GET einen json-Wert vom Webserver und wählen Sie den Schlüssel: `{"url":"http://server.tld/path/file", "key":"nameofkey"}`
- einen Wert mit POST setzen: Befehl: `{"url":"http://server.tld/path/file", "header":{"content-type":"text/plain", "token":"mytoken"}` Wert: die Post-Nachricht, wenn es sich um einen Json handelt, ist der Content-Type-Header in der Kopfzeile gesetzt, er muss nicht gesetzt werden.

Beispiele:

- abfrage des Stromversorgungszustands eines Tasmanischen Steckers Beispiel: `{"url":"http://192.168.0.100/cm?cmnd=power", "key":"power"} == off` ist identisch mit `{"url":"http://192.168.0.100/cm?cmnd=power"} == {"power":"off"}`
- einstellung eines Tasmoto-Steckers: `{"url":"http://192.168.0.100/cm?cmnd=power%20on"}`

### Benachrichtigung

Mit Webbefehlen kann ein Dienst wie [pushover](https://pushover.net) verwendet werden, um eine Push-Nachricht bei Ereignissen zu senden. Um eine andere Nachricht zu senden, erstellen Sie eine benutzerdefinierte Entität in RAM mit dem Namen `message`, oder wie auch immer Sie wollen. Erstellen Sie einen Zeitplan On Change, der die Änderung dieser Nachricht auslöst und die Push-Nachricht sendet.

![grafik](https://github.com/user-attachments/assets/570576b5-b382-4ab2-bff3-4468291334a3)

Jetzt können Sie mit dem Befehl `custom/message` weitere Zeitpläne erstellen und individuelle Texte als Daten verwenden.

## Hinzufügen von benutzerdefinierten Entitäten

Custom Entities ist eine fortschrittliche und leistungsfähige Möglichkeit, EMS-ESP um eigene EMS-Entitäten zu erweitern, die Daten aus einem bestimmten EMS-Telegramm extrahieren. Dies ist nützlich, wenn EMS-ESP eine bestimmte Entität noch nicht unterstützt, oder wenn Sie Daten aus einem Telegramm extrahieren möchten, das noch nicht unterstützt wird. Ein weiterer häufiger Anwendungsfall ist die Fehlersuche oder die Beobachtung eines bestimmten Verhaltens beim Ändern von Parametern in einem EMS-Gerät.

Eine moderne Wärmepumpe kann zum Beispiel neue Funktionen haben, die in EMS-ESP nicht enthalten sind. In diesem Fall würden Sie den `watch`-Befehl verwenden, um den eingehenden EMS-Verkehr in Kombination mit der manuellen Anpassung spezifischer Parameter einzusehen. Wenn Sie das spezifische Telegramm und den Offset gefunden haben, erstellen Sie eine benutzerdefinierte Entität, um den Typ fein abzustimmen und den Wert zu überprüfen. Beantragen Sie dann die Aufnahme in das nächste EMS-ESP-Release-Update.

![Web](/media/screenshot/web_customentities.png)
