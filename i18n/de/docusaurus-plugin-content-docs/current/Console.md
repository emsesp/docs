---
id: Console
title: Console Access
description: Access EMS-ESP console via Telnet or USB Serial for advanced monitoring and command execution
---

# Konsole

EMS-ESP verfügt über einen Telnet-Server, mit dem sich Clients über einen Telnet-Client wie [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) oder nativ über das Betriebssystem wie in diesem Beispiel mit [Windows](https://www.technipages.com/windows-10-enable-telnet) verbinden können. Der Port ist 23.

Sie können auch über einen seriellen USB-Anschluss mit einer Baudrate von 115200 auf die Konsole zugreifen. Sie müssen STRG-D drücken, um die serielle Konsole zu öffnen.

Die Konsole gibt Ihnen mehr Einblick in den EMS-Bus-Verkehr, die MQTT-Warteschlangen und die vollständigen Geräteinformationen, die erfasst werden. Sie verhält sich ähnlich wie eine Unix/Linux-Shell. Einige der am häufigsten verwendeten Befehle sind:

- `help` oder `F1` listet die Befehle und Schlüsselwörter auf. Dies funktioniert in jedem Kontext.
- `exit` beendet die Konsole oder beendet den aktuellen Kontext. `CTRL-D` tut dasselbe.
- `CTRL-U` für Rückgängig machen oder Löschen der Zeile.
- `<TAB>` für die automatische Vervollständigung
- `system`, um das Systemmenü aufzurufen. Verwenden Sie `exit` oder CTRL-D, um zurückzukehren.
- `su` wechselt in den "Superuser" oder Admin-Modus. Das Standardpasswort ist `ems-esp-neo` und kann mit `passwd` aus dem Systemmenü oder über die Weboberfläche geändert werden (genannt geheimes Passwort). Im su-Modus wechselt die Eingabeaufforderung von `- `su` wechselt in den "Superuser" oder Admin-Modus. Das Standardpasswort ist `ems-esp-neo` und kann mit `passwd` aus dem Systemmenü oder über die Weboberfläche geändert werden (genannt geheimes Passwort). Im su-Modus wechselt die Eingabeaufforderung von  zu `#`.
- Einige Einstellungen können in der Konsole geändert werden. Der Befehl `set` führt sie auf.
- `show` oder `F2` zeigt die Daten an, die dem jeweiligen Kontext entsprechen, in dem Sie sich befinden. Im Stammverzeichnis werden alle EMS-Geräteinformationen und alle externen Dallas-Temperatursensoren angezeigt.
- `show commands` oder `call` listet alle Befehle auf, die mit dem Befehl `call` aufgerufen werden können. Siehe [Commands](Commands).
- `log` legt die Protokollierungsstufe fest. `log off` deaktiviert die Protokollierung. Verwenden Sie `log debug` für Debugging-Befehle und -Aktionen, `log all` umfasst die Telegramme wie `watch on`. Dies wird beim nächsten Öffnen der Konsole zurückgesetzt.
- `watch` gibt die eingehenden Rx-Telegramme direkt auf der Konsole aus. Sie können auch eine bestimmte EMS-Geräte-ID oder Telegramm-ID oder unbekannte (neue) Telegramme überwachen lassen. Sie können auch wählen, ob die Ausgabe als ausführlicher Text oder als Rohdatenbytes erfolgen soll.

## Konsolenbefehle

Die Eingabe von `help` führt die verfügbaren Befehle auf. Einige Administrationsbefehle werden erst aktiv, wenn zuerst ein `su`-Befehl eingegeben wird.

```yaml
exit
help
log [level]
show [system | users | devices | log | ems | values | mqtt | commands
su
passwd
restart [partitionname]
wifi reconnect
set admin password
set wifi password
set hostname <name>
set wifi ssid <name>
set board_profile <name>
set bus_id <deviceID>
set tx_mode <n>
set service <ap | mqtt | ntp> <enable | disable>
scan [deep]
read <deviceID> <type ID> [offset] [length]
watch [off | on | raw | unknown] [ID]
call [device] [cmd] [data] [id|hc]
```

## Beispiele

### Aufrufen eines Befehls zum Ändern von Werten

Beachten Sie, dass Sie zuerst `su` benötigen, um Zugang zu allen `call`-Befehlen zu erhalten.

![Console](/media/screenshot/console1.png)

### Anzeige der Gerätewerte

![Console](/media/screenshot/console0.png)

### Überwachung des EMS-Verkehrs

Mit dem Befehl `watch` können Sie die eingehenden EMS-Telegramme überwachen.

Die Syntax lautet `watch on <ID>`, wobei ID entweder eine Telegramm-ID oder eine Geräte-ID ist.

Beachten Sie, dass das CRC-Byte nicht im Datenpaket enthalten ist.

Wenn Sie nur Telegramme sehen wollen, die noch nicht registriert sind, verwenden Sie `watch unknown`

Wenn Sie die rohen Bytes einschließlich CRC sehen wollen, wie sie auf der EMS-Leitung übertragen werden, verwenden Sie `watch raw <ID>`.

![Console](/media/screenshot/console3.png)
