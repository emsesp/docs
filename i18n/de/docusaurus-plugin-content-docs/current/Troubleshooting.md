---
id: Troubleshooting
---

# Fehlersuche

Im Folgenden finden Sie Antworten auf einige häufige Probleme.

## Probleme bei der Firmware-Installation

### Upload über das Webinterface nicht möglich

Wenn Sie die Firmware über das Webinterface hochladen und die Fehlermeldung "Ungültige Dateierweiterung oder inkompatible bin-Datei" sehen, überprüfen Sie, ob Sie die richtige Firmware-Binärdatei verwenden, die zu Ihrem Board und ESP32-Chipsatz passt. Wenn das der Fall ist, kann es daran liegen, dass die Firmware zu groß für die Boot-Partition ist, was in bestimmten Situationen beim Wechsel von 3.6.5 zu 3.7.0 der Fall sein kann. Die Lösung besteht darin, eines der Flash-Tools zu verwenden.

### Web Interface zeigt nach einem Update alte Daten oder Fehler im Browser an

Die Ursache dafür ist, dass der Browser die alten Dateien zwischengespeichert hat. Um dies zu beheben, löschen Sie den Browser-Cache und laden Sie die Seite neu. Drücken Sie STRG-R oder CMD-R oder F5 in den meisten Browsern.

### EMS-ESP kann sich nicht mit einem versteckten WiFi-Netzwerk verbinden

Es gibt ein bekanntes Problem mit einigen WiFi-Routern (z.B. Unifi), dass versteckte Netzwerke mit dem ESP32 nicht unterstützt werden. Versuchen Sie, sich mit dem Netzwerk über den BSSID-Namen zu verbinden (manchmal auch über die MAC-Adresse des Access Points).

## Stabilität

### EMS-ESP kann sich nicht mit dem WiFi verbinden

Der EMS-ESP befindet sich wahrscheinlich im Access Point Modus. Suchen Sie nach einer WiFi SSID `ems-esp`, verbinden Sie sich mit dieser und öffnen Sie einen Browser auf 'http://192.168.4.1'. Wenn Sie einen WiFi-Client konfiguriert haben, hat Ihr Router über DHCP eine IP-Adresse zugewiesen. Sie sollten dann in der Lage sein, eine Verbindung über https://ems-esp oder https://ems-esp.local. herzustellen

Auf Boards mit Ethernet wird Ethernet deaktiviert, wenn eine WiFi SSID vorhanden ist. Wenn Sie Ethernet verwenden möchten, deaktivieren Sie diese Einstellung.

### Die LED blinkt ständig

Ein schnelles Blinken der LED bedeutet, dass das System hochfährt oder sich im Installationsmodus befindet. Verbinden Sie sich über das WiFi mit dem Access Point (`ems-esp`), um die Konfiguration abzuschließen.

Ein langsamer Puls bedeutet entweder, dass keine WiFi-Verbindung besteht oder dass EMS-ESP nicht vom EMS-Bus lesen kann. Gehen Sie in diesem Fall zum Web-Interface und versuchen Sie eine andere Tx-Modus-Einstellung.

Weitere Einzelheiten über die Bedeutung der blinkenden LED finden Sie im Abschnitt [Getting Started](Getting-Started.md).

### EMS-ESP startet oft neu

Ein gesundes gateway/interface-Board, auf dem EMS-ESP läuft, sollte über lange Zeiträume ohne spontane Neustarts funktionieren. Wenn Ihr Board also in unregelmäßigen Abständen von selbst neu startet, stimmt etwas nicht.

Notieren Sie, wie oft er abstürzt und ob es einen Zusammenhang mit Aktivitäten im Netzwerk (z. B. WLAN oder MQTT-Neuverbindung) oder etwas incoming/outgoing zu einem der EMS-Geräte gibt. Eine gute Möglichkeit, dies zu erkennen, ist die Verwendung des Home Assistant oder eines einfachen MQTT-Explorers, um die Betriebszeit des Systems zu beobachten.

Zu überprüfende Dinge:

#### Möglicherweise liegt es an der Stromversorgung

- Schalten Sie das Gateway aus und prüfen Sie, ob die Kabelverbindungen sicher sind. Prüfen Sie, ob der ESP32, der DC-DC-Wandler und alle Jumper am Gateway fest auf ihren Anschlüssen sitzen.
- Versuchen Sie, das Gateway über die USB-Buchse des ESP32 mit Strom zu versorgen (lesen Sie im [wiki](https://bbqkees-electronics.nl/wiki/) nach, wie Sie dies bei Ihrem speziellen Gateway-Modell tun können). Wenn die Neustarts aufhören, dann haben Sie ein Problem mit der externen Stromquelle (BUS oder Servicebuchse) oder dem DC-DC-Wandler im Gateway.
- Wenn Sie WiFi verwenden, versuchen Sie, die WiFi-Sendeleistung auf der `Network Settings`-Seite auf 10 dBm zu reduzieren, um zu sehen, ob das hilft.

#### Möglicherweise liegt es am Speicher

Der ESP32 hat einen sehr begrenzten Arbeitsspeicher, der zwischen dem Laufzeit-Stack und dem Heap aufgeteilt ist. Der Heap kann schnell fragmentiert werden, wodurch die maximale Größe eines Puffers reduziert wird, und wir verwenden eine Menge Puffer, um all die schönen JSON-Dateien für das Senden an MQTT und das Auffüllen der Webseiten vorzubereiten. Wenn der ESP32 keinen Platz mehr hat, startet er sich einfach neu. Zu prüfende Dinge:

- Wenn die WebUI zugänglich ist, gehen Sie zu `Status->Hardware` und sehen Sie sich den Heap an. Wenn der freie Speicher weniger als 90 KB oder die maximale Zuweisung weniger als 45 KB beträgt, kann dies ein Problem sein und Sie müssen die Dienste deaktivieren, es erneut versuchen und dies melden. Deaktivieren Sie zunächst mDNS und SysLog (falls vorhanden) nacheinander und sehen Sie, ob das hilft.
- Vergewissern Sie sich, dass die maximale Puffergröße des Systemprotokolls bei `Status->System Log` auf den niedrigsten Wert (25) eingestellt ist.
- Jedes Netzwerkprotokoll (Ethernet, Wifi, AP) verbraucht Speicher. Wenn Sie nur Ethernet verwenden (z. B. ein BBQKees E32 Gateway), schalten Sie WiFi und den Access Point aus (verwenden Sie eine leere WiFI ssid).
- Wenn Sie viele EMS-Entitäten haben, verwenden Sie die Seite "Anpassungen" und setzen Sie alle nicht verwendeten Entitäten (angezeigt durch einen leeren Wert) auf "aus dem Speicher entfernen".

#### Es könnte am Code liegen

- Gehen Sie zu `Status->System Log` und setzen Sie `Log Level` auf `INFO`. Dadurch wird sichergestellt, dass Sie beim nächsten Neustart das Neustartprotokoll ganz oben sehen. Es wird etwas Ähnliches wie `2022-12-30 11:58:02.000    INFO 0:      [emsesp]     Last system reset reason Core0: Software reset CPU, Core1: Software reset CPU` angezeigt.
- Und schließlich, wenn nichts von dem oben genannten funktioniert, dann ist das Problem der Kern der Verarbeitung der eingehenden Telegramme. Versuchen Sie, einige Protokolle kurz vor dem Absturz zu erfassen (SysLog ist hierfür gut geeignet) und posten Sie die Informationen in einem neuen GitHub-Problem.

### Das EMS-ESP reagiert nicht mehr

Wenn der EMS-ESP nicht mehr reagiert und Sie nicht auf die WebUI zugreifen können, führen Sie die folgenden Schritte aus:

- Überprüfen Sie Ihren Netzwerk-Router, um zu sehen, ob ems-esp noch aktiv ist. Wenn Sie ein Mesh von WiFi-Zugangspunkten betreiben, kann es sein, dass es zu einem neuen Standort gerootet wurde oder die WiFi-Kanäle gewechselt wurden. Um dies zu umgehen, können Sie eine BSSID in EMS-ESP (nur WiFI) einstellen.
- Schauen Sie sich die integrierte LED an, wenn Sie sie nicht deaktiviert haben. Wenn die LED blinkt oder leuchtet, bedeutet dies, dass EMS-ESP noch läuft.
- Überprüfen Sie dann die EMS-ESP-Dienste. Können Sie über Telnet an Port 25 auf die Konsole zugreifen? Werden immer noch MQTT-Nachrichten gesendet, falls aktiviert?
- Wenn Sie den Ethernet-Anschluss verwenden, sehen Sie dann die LED am Anschluss blinken, um den ein- und ausgehenden Datenverkehr anzuzeigen?
- Wenn EMS-ESP sich selbst neu gestartet hat, suchen Sie in den Systemprotokollen nach dem Reset-Grund. Dies wird eine der ersten Meldungen sein. Siehe oben.
- Schließen Sie die Karte über USB an einen Computer an, ohne sie nach dem Ausschalten des EMS-ESP neu zu starten, und rufen Sie die serielle Konsole auf, um zu sehen, ob Fehler vorliegen.
- Abschließend melden Sie einen GitHub-Problemfall mit den Support-Informationen und Details zu Ihrer Einrichtung an.

### Sie haben das Admin-Passwort vergessen

Wenn Sie das Admin-Passwort vergessen haben, können Sie es über die Konsole mit dem Befehl `set admin password` zurücksetzen.

```sh
ems-esp:$ su
ems-esp:# set admin password
```

## EMS-Daten und Konnektivität

### Nicht alle EMS-Geräte werden erkannt

Versuchen Sie, den Wert für den Sendemodus auf der Seite Einstellungen zu ändern. Das Standard-EMS funktioniert für ältere EMS1.0-Systeme, EMS2 oder EMSPlus-Systeme und HT3 für Junkers/Worcester, die das Heatronics-Protokoll verwenden.

Wenn Sie EMS-Geräte haben, die möglicherweise noch nicht von EMS-ESP unterstützt werden, dann verwenden Sie `scan` oder `scan deep` von der Konsole aus, um deren Details herauszufinden und dann einen Verbesserungsvorschlag auf GitHub zu posten. Denken Sie daran, dass das `su`-Passwort standardmäßig `ems-esp-neo` ist, sofern es nicht über die Konsole (`passwd`) oder in der WebUI (`Security->Security Settings`) geändert wurde. Zum Beispiel:

```sh
ems-esp:$ su
Password:
000+00:01:38.291 N 0: [shell] Admin session opened on console
ems-esp:# scan
000+00:01:41.034 N 1: [emsesp] Unrecognized EMS device (device ID 0x08, product ID 123). Please report on GitHub.
ems-esp:#
```

Wenn Sie die einströmenden EMS-Daten sehen wollen, verwenden Sie den Befehl `watch`. Siehe [Console](Console.md?id=monitoring-the-ems-traffic).

### Ich vermisse bestimmte Daten von einem EMS-Gerät

Wenn Daten fehlen, brauchen wir Ihre Hilfe, um unsere Datenbank zu erweitern. Versuchen Sie herauszufinden, welches Telegramm die Daten enthalten könnte, indem Sie die Änderung am Gerät (z. B. Heizkessel oder Thermostat) bei laufendem EMS-ESP vornehmen und sich das Systemprotokoll im Trace-Modus ansehen, um festzustellen, welche Befehle gesendet werden und wie die neuen Werte der eingehenden Telegramme lauten.

Wenn Sie das Telegramm gefunden haben, suchen Sie den Offset und verwenden Sie die Seite `Custom Entities` in der WebUI, um eine neue Entität zu erstellen, die Sie dann testen können. Achten Sie dabei auf die Maßeinheit. Machen Sie dann einen Screenshot dieses Bildschirms und posten Sie ihn in einem neuen GitHub-Thema, zusammen mit einem geeigneten "langen" Namen und einem "kurzen" Namen in Englisch und Ihrer Muttersprache, damit wir ihn schnell in den Code implementieren können.

Beachten Sie, dass nicht alle EMS-Geräte die Veröffentlichung ihrer Daten auf dem EMS-Bus zulassen, z. B. die intelligenten Thermostate wie Nefit Easy und Buderus Easy Control CT200, die nur die aktuelle Raum- und Solltemperatur als schreibgeschützte Attribute übermitteln.

Weitere Informationen finden Sie in diesem Artikel über [Decoding EMS Telegrams](FAQ.md?id=decoding-ems-telegrams).

### Viele Rx-Fehler

Es ist durchaus üblich, dass im Protokoll einige Warnungen über unvollständige Telegramme erscheinen. Dies könnte auf Störungen auf der Leitung, unzureichende Stromversorgung oder einen falschen Sende-Modus zurückzuführen sein. Die Warnungen sind in der Regel harmlos, da EMS-ESP entweder auf die nächste Sendung wartet oder weiter versucht, das Telegramm abzuholen. Wenn Sie eine Rx-Qualität von weniger als 80% sehen, versuchen Sie es:

- einen anderen Sendemodus, zum Beispiel zwischen EMS+ und EMS wechseln.
- stromversorgung des EMS-ESP über USB oder Service-Buchse. Wir haben Beispiele gesehen, bei denen eine verrauschte oder ausgefallene Gleichstromversorgung zu RX-Fehlern oder unvollständigen Telegrammen führen kann. Ein Versuch mit USB-Stromversorgung (siehe [BBQKees wiki](https://bbqkees-electronics.nl/wiki/), wie man auf USB-Stromversorgung umschaltet) kann helfen, dieses Problem zu finden.
- beseitigung von Störungen auf der Busleitung durch emc, Reflexionen, andere Geräte. Verbinden Sie das EMS-ESP mit einem anderen Gerät am Bus. Im Allgemeinen ist ein bisher nicht angeschlossener Bus-Ausgang an einem Gerät wie dem MM100 besser als eine geteilte Verbindung an einem bereits verwendeten Stecker.

### EMS-Bus stellt keine Verbindung her

Wenn Sie die EMS-Leitungen verwenden, ist bei einigen Systemen die Reihenfolge wichtig. Versuchen Sie, sie zu vertauschen!

Ein BBQKees Gateway ist DCE und die ESP32s sind DTE, also müssen Sie TX(esp)-TX(gateway) und RX-RX verbinden. TX am ESP32 ist das Senden von Daten, TX am Gateway ist der Eingang für das Senden von Daten an den EMS-Bus. Beachten Sie, dass eine gekreuzte (Nullmodem) Verbindung nur für DTE-DTE-Verbindungen verwendet wird.

Der häufigste Fehler bei der Verdrahtung besteht darin, dass die Interfaceplatine an ein ESP32-Modul angeschlossen wird und zwar an die mit TX und RX gekennzeichneten Pins des ESP32-Moduls. Wenn Sie sich nicht sicher sind, welche Pins Sie verwenden sollen, gehen Sie zu EMS-ESP Settings, wählen Sie das Interface Board Profile für Ihr Board und wählen Sie "Custom", um die standardmäßig zugewiesenen GPIOs zu sehen.

### Das Ändern eines Wertes auf einem EMS-Gerät funktioniert nicht

Wenn Sie feststellen, dass setting/writing ein EMS-Gerätewert keine Wirkung hat, setzen Sie in der WebUI die Systemprotokollebene auf DEBUG und wiederholen Sie die Aktion, wobei Sie alle Fehler oder Warnungen im Systemprotokoll beachten. Für eine gründlichere Analyse verwenden Sie die Telnet-Konsole, `su`, dann `log debug` und wiederholen Sie die Aktion dann mit dem Befehl `call`. Posten Sie die Ausgabe in einem neuen GitHub-Problem, wie in [Support Section](Support) beschrieben.

Beachten Sie, dass bei einigen Systemen, an denen z. B. ein Gateway oder ein Controller angeschlossen ist, jede Änderung zurückgesetzt oder überschrieben wird. Dies ist einfach das Verhalten der anderen Master-Controller und wir können nicht viel dagegen tun.

### Das Ändern eines Wertes funktioniert zunächst, wird dann aber auf den ursprünglichen Wert zurückgesetzt

In einigen Fällen kann es vorkommen, dass EMS-Änderungen von einem anderen angeschlossenen EMS-Gerät überschrieben oder ignoriert werden. Zum Beispiel bei der Verwendung von `heatingactivated` zum Ausschalten der Heizung. Eine Lösung ist hier, alle paar Sekunden 0 an `boiler/selflowtemp` zu senden.

Bestimmte Heizkessel mit manueller Temperatureinstellung knobs/dials setzen alle EMS-ESP-Einstellungen außer Kraft. Um einen Temperaturwert über EMS-ESP zu ändern, stellen Sie sicher, dass der Wert, den Sie senden, kleiner ist als der Wert, auf den der Kessel psychisch über den Drehknopf eingestellt ist. Der Kessel setzt sich alle 2 Minuten auf den eingestellten Wert zurück. Verwenden Sie daher den Zeitplaner von EMS-ESP, um den Temperaturwert automatisch jede Minute zurückzusetzen.

### Es werden falsche Werte von einem bestimmten Gerät angezeigt

Wenn Sie feststellen, dass bestimmte Werte entweder in der WebUI, der Konsole oder in MQTT falsch angezeigt werden, helfen Sie uns bitte, dies zu korrigieren, indem Sie einen GitHub-Problembericht zusammen mit dem erwarteten Wert erstellen. Wenn Sie aufgefordert werden, Debug-Informationen bereitzustellen, rufen Sie die Telnet-Konsole auf und führen Sie Folgendes aus

```sh
% su
% log trace
```

und dann entweder ein `read` oder `watch`, z. B. `read 21 2D8`, um alle Daten von HC2 auf einem Mixing MM100 anzuzeigen.

## Temperatursensoren

### Ungewöhnliche Sensormessungen

Wenn Sie ungewöhnliche Messwerte des Dallas-Sensors feststellen (verrückte Minustemperaturen, plötzliche Messwertspitzen usw.), überprüfen Sie Folgendes:

- Verkabelung mit dem JST-Anschluss am Gateway.
- Dass Sie den richtigen Stromversorgungsmodus für Ihre Anwendung wählen: parasitär oder nicht-parasitär
- Ob die Stromversorgung über USB das Problem behebt (in [wiki](https://bbqkees-electronics.nl/wiki/) wird erklärt, wie Sie die to/from USB-Stromversorgung für Ihr Gateway-Modell umschalten). Wenn dies der Fall ist, könnte dies auf ein Problem mit der Stromversorgung des Gateways über die BUS- oder Servicebuchsenanschlüsse hindeuten.

## MQTT

### Nachrichten kommen nicht immer über MQTT an

Wenn Sie feststellen, dass MQTT-Nachrichten nicht beim MQTT broker/server-Versuch ankommen:

- Prüfen Sie die EMS-ESP-Protokolle auf Fehler. Wenn Sie Fehler mit "wenig Speicher" sehen, lesen Sie [It may be memory related](Troubleshooting.md?id=general#it-may-be-memory-related), um zu erfahren, wie Sie die Speichernutzung reduzieren können
- Überprüfen Sie den MQTT-Broker auf Fehler. Möglicherweise haben Sie falsche Anmeldeinformationen oder doppelte Client-IDs, die einen Verbindungskonflikt verursachen
- Setzen Sie den EMS-ESP System Log Level auf ALL (über Web oder Konsole) und überwachen Sie den Datenverkehr
- Verwenden Sie die Telnet-Konsole, um eine Veröffentlichung zu erzwingen und zu sehen, was passiert. (`log debug`, `su` und `publish`)
- Erhöhen Sie die Veröffentlichungszeit. Vielleicht gibt es zu viele Nachrichten und die Warteschlange wird überflutet
- Wenn es immer noch nicht klappt, führen Sie eine lokale Kopie des MQTT-Mosquitto-Brokers aus und überwachen Sie die Ausgabe wie folgt:
  - laden Sie die neueste Version von Mosquitto von `https://mosquitto.org/download/` herunter
  - eine neue `mosquitto.conf`-Datei erstellen oder eine bestehende mit just aktualisieren:

  ```yaml
  listener 1883
  allow_anonymous true
  ```

  - mit dem Flag -v ausführen, damit Sie alle ausführlichen Meldungen sehen, z. B. unter Windows its:

  ```txt
  "C:\Program Files\mosquitto\mosquitto.exe" -v -c "C:\Program Files\mosquitto\mosquitto.conf"
  ```

  Beachten Sie, dass die Ausführung mit allow_anonymous true für Produktionsumgebungen nicht empfohlen wird.

### Befehle, die über MQTT gesendet werden, funktionieren nicht

Verwenden Sie die Konsole, um die Befehle manuell zu testen, wobei Sie sich anmelden müssen. Wenn zum Beispiel die Änderung der Thermostattemperatur nicht funktioniert, versuchen Sie es:

```sh
ems-esp:$ su
ems-esp:# log debug
ems-esp:# call thermostat seltemp 15
```

In der Konsole sollte eine Protokollanweisung wie `[thermostat] Setting thermostat temperature to 15.0 for heating circuit 1, mode auto` erscheinen, gefolgt von den gesendeten Telegrammen. Wenn Sie Protokollfehler sehen, erstellen Sie ein GitHub-Problem (siehe [Support](Support)).

### Integration mit Home Assistant bricht ab, wenn MQTT-Broker neu gestartet wird

Die Integration mit Home Assistant verwendet MQTT Discovery, die im MQTT-Broker "aufbewahrte" Themen sind. Wenn der MQTT-Dienst gestoppt und neu gestartet wird und der MQTT-Server die Topics nicht in einer Datenbank speichert, gehen diese Nachrichten natürlich verloren und die Integration mit Home Assistant wird entfernt. Um dieses Problem zu lösen, fügen Sie Ihrem MQTT-Dienst eine Persistenz hinzu. Bei Verwendung von Mosquitto würde eine `.conf`-Datei zum Beispiel so aussehen:

```
listener 1883
allow_anonymous false
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
```

Weitere Informationen hierzu finden Sie unter [this article](https://pagefault.blog/2020/02/05/how-to-set-up-persistent-storage-for-mosquitto-mqtt-broker).

Eine alternative Möglichkeit ohne die Verwendung von Persistenz auf dem MQTT-Server besteht darin, EMS-ESP anzuweisen, alle MQTT-Themen des Home Assistant neu zu veröffentlichen. Sie können dies über die EMS-ESP WebUI ab Version 3.4 und höher tun.

## Assistentin zu Hause

### HA zeigt Fehler an wie _"Received message on illegal discovery topic"_ oder _"Template variable warning: 'dict object' has no attribute..."_

Dies kann passieren, wenn Sie von einer früheren EMS-ESP-Version aktualisieren und sich einige der Geräteentitätsnamen geändert haben. Verwenden Sie ein Tool wie MQTTExplorer, um alle `homeassistant/sensor/ems-esp/*`- und `homeassistant/*/ems-esp/*`-Themen aus Ihrem MQTT-Broker zu entfernen, und starten Sie EMS-ESP neu.

### HA hat doppelte Entitäten, vorangestellt mit \_2

Siehe die Korrektur von swa72 [here](https://github.com/swa72/home-assistant/blob/main/README-mqtt.md).

### HA hat die Namen meiner Entitäten durcheinander gebracht

Das passiert, wenn HA Änderungen an MQTT Discovery vornimmt. Es gibt ein nettes Tool namens [homeassistant-entity-renamer](https://github.com/saladpanda/homeassistant-entity-renamer), das Ihnen helfen kann, dies zu beheben.

## Spezifische EMS-Einstellungen

### Thermostat Date/Time

Das richtige Format für die Einstellung der Thermostatzeit ist:

```
< NTP | dd.mm.yyyy-hh:mm:ss-day(0-6)-dst(0/1) >
```

Der Thermostat benötigt eine Einstellung von Wochentag und Sommerzeit. Der Bosch-Wochentag ist Mo-0, Su-6, im Gegensatz zur Unix-Zeit.

Wenn Sie NTP aktiviert haben, können Sie einfach "NTP" eingeben und die NTP-Zeit wird auf den Thermostat eingestellt.

Bei aktiviertem NTP wird die Thermostatuhr auch automatisch von EMS-ESP gestellt, wenn sie von der NTP-Zeit abweicht.

Achten Sie darauf, ob Sie die Sommerzeit aktivieren wollen oder nicht. Dies sollte mit der Einstellung an Ihrem Thermostat übereinstimmen.
