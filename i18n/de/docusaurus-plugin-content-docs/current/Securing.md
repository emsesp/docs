---
id: Securing
title: Securing your gateway
description: How to keep EMS-ESP safe on your network, use it remotely without port forwarding, and protect MQTT, passwords and API access
---

# Ihr Gateway sichern

EMS-ESP kann Einstellungen an Ihrer Heizungsanlage ändern. Behandeln Sie es daher wie jedes andere Gerät, das Ihr Zuhause steuert. Der Großteil der Web-Benutzeroberfläche, der API, MQTT und Telnet ist nicht verschlüsselt, daher ist das Netzwerk, in dem sie laufen, von Bedeutung. Auf dieser Seite wird erklärt, wie Sie die Einrichtung sicher vornehmen können.

## Halte es aus dem Internet heraus

Leiten Sie niemals Ports von Ihrem Router an EMS-ESP weiter, egal ob 80 (Web-UI und API), 23 (Telnet), 502 (Modbus) oder andere. Jeder im Internet könnte dann darauf zugreifen, und die Verbindung ist nicht verschlüsselt.

Wenn Sie EMS-ESP nutzen möchten, während Sie nicht zu Hause sind, verwenden Sie stattdessen eine der folgenden Optionen:

- **Ein VPN in Ihr Heimnetzwerk.** Das ist die einfachste und sicherste Methode. Viele Router verfügen über eine integrierte VPN-Funktion (zum Beispiel eine FRITZ!Box oder ein UniFi-Gateway), oder nutzen [WireGuard](https://www.wireguard.com/) bzw. [Tailscale](https://tailscale.com/). Ihr Smartphone oder Laptop verbindet sich dann so, als befände es sich zu Hause.
- **Home Assistant.** Wenn Sie Home Assistant mit [Home Assistant Cloud](https://www.nabucasa.com/) oder Ihrem eigenen sicheren Fernzugriff nutzen, steuern Sie EMS-ESP über Home Assistant, anstatt das Gerät selbst zu öffnen.
- **Ein Reverse-Proxy mit HTTPS.** Ein Proxy wie [Caddy](https://caddyserver.com/), [Nginx Proxy Manager](https://nginxproxymanager.com/) oder Traefik stellt Ihnen eine `https://`-Adresse mit einem echten Zertifikat zur Verfügung und leitet diese an EMS-ESP in Ihrem Netzwerk weiter. Fügen Sie den Hostnamen des Proxys unter **Einstellungen > Netzwerk > Zulässige Hostnamen** hinzu, da EMS-ESP die Anfragen sonst ablehnt. Sichern Sie den Proxy außerdem mit eigenen Anmeldedaten und halten Sie die Proxy-Software auf dem neuesten Stand.

## Es in ein eigenes Netzwerk einbinden

Falls Ihr Router dies unterstützt, richten Sie für EMS-ESP ein separates Netzwerk für Smart-Home-Geräte ein (ein VLAN oder ein guest/IoT-WLAN), das von Ihren Computern und Smartphones getrennt ist.

Dann nur das zulassen, was nötig ist:

- Von Ihrem Computer oder Smartphone sowie über Home Assistant oder andere Integrationen an EMS-ESP auf Port 80. Fügen Sie Port 502 hinzu, wenn Sie Modbus verwenden, und Port 23 nur, wenn Sie Telnet nutzen.
- Von EMS-ESP zu Ihrem MQTT-Broker (1883 oder 8883 mit TLS), Ihrem NTP-Server und Ihrem Syslog-Server, falls Sie einen verwenden.
- Von EMS-ESP ins Internet über HTTPS (443) nur, wenn Sie die Versionsprüfung der Web-Benutzeroberfläche nutzen und Updates aus der Versionsliste installieren möchten. Andernfalls blockieren Sie diese Verbindung und laden Sie stattdessen die Firmware-Dateien hoch.

## Passwörter und Konten

- Weisen Sie dem Admin-Benutzer ein sicheres Passwort zu, das Sie nirgendwo sonst verwenden. Ab 3.10.0 müssen die werkseitigen Passwörter geändert werden, bevor die Web-Benutzeroberfläche genutzt werden kann.
- Wenn kein WLAN-Netzwerk eingerichtet ist, richtet EMS-ESP einen eigenen Zugangspunkt ein. Legen Sie hierfür ebenfalls ein eigenes Passwort fest.
- Erstellen Sie nur die Benutzer, die Sie benötigen. Ein Gastbenutzer kann Werte einsehen, aber keine Einstellungen ändern.
- Integrationen wie Home Assistant, Node-RED oder Skripte sollten einen **API-Schlüssel** (**Einstellungen > Sicherheit > API-Schlüssel**) verwenden, nicht das Passwort eines Benutzers. Verwenden Sie einen „Lese“-Schlüssel, wenn die Integration nur Werte ausliest, und einen „Lese- und Schreib“-Schlüssel nur dann, wenn Änderungen vorgenommen werden müssen. Widerrufen Sie Schlüssel, die Sie nicht mehr verwenden.
- Eine **Systemsicherung**, bei der das Kontrollkästchen „Passwörter und Schlüssel einbeziehen“ aktiviert ist, enthält alle Passwörter. Bewahren Sie sie an einem sicheren Ort auf oder lassen Sie die Option deaktiviert.

## Schalten Sie aus, was Sie nicht benutzen

Auf den Seiten „Einstellungen“:

- **Telnet** ist ab 3.10.0 standardmäßig deaktiviert. Lassen Sie es deaktiviert, sofern Sie es nicht benötigen, da Telnet nicht verschlüsselt ist.
- Die Option **„API-Aufrufe ohne Zugriffstoken zulassen“** gewährt jedem in Ihrem Netzwerk Gastrechte. Verwenden Sie stattdessen API-Schlüssel.
- **CORS** wird nur benötigt, wenn eine Webseite unter einer anderen Adresse die API aufruft. Wenn Sie diese Option aktivieren, geben Sie die genaue Adresse dieser Seite an, nicht `*`.
- **Modbus** und **Syslog**, falls Sie diese nicht nutzen.
- Der **Schreibschutzmodus** verhindert, dass EMS-ESP Änderungen an Ihrer Heizungsanlage übermittelt. Verwenden Sie diesen Modus, wenn Sie lediglich Werte ablesen möchten.

## MQTT

- Verwenden Sie einen Benutzernamen und ein Passwort für Ihren MQTT-Broker und richten Sie für EMS-ESP ein eigenes Konto ein.
- Wenn Ihr Broker TLS unterstützt, aktivieren Sie **TLS** in den MQTT-Einstellungen (in der Regel Port 8883) und legen Sie fest, wie EMS-ESP den Broker überprüft:
  - **CA-Zertifikat**: Fügen Sie das Zertifikat der Zertifizierungsstelle, die das Broker-Zertifikat signiert hat, als Text (PEM) ein. Verwenden Sie dies für Zertifikate von Let's Encrypt oder Ihrer eigenen Zertifizierungsstelle.
  - **Zertifikats-Fingerabdruck**: Der SHA-1-Fingerabdruck des eigenen Zertifikats des Brokers. Verwenden Sie diesen für ein selbstsigniertes Zertifikat. Sie können ihn wie folgt auslesen:

    ```bash
    openssl s_client -connect <broker>:8883 </dev/null 2>/dev/null | openssl x509 -noout -fingerprint -sha1
    ```

    Wenn der Broker ein neues Zertifikat erhält, aktualisieren Sie den Fingerabdruck.
  - **Nichts, nicht aktiviert**: Die Verbindung ist verschlüsselt, aber EMS-ESP überprüft nicht, ob die Kommunikation tatsächlich mit Ihrem Broker stattfindet. Auf der Seite mit den MQTT-Einstellungen und im Protokoll wird darauf hingewiesen.
- Alles, was Nachrichten an die MQTT-Themen von EMS-ESP senden kann, kann Ihre Heizungseinstellungen ändern. Nutzen Sie die Zugriffskontrolllisten des Brokers, um einzuschränken, wer dort Nachrichten veröffentlichen darf.

## Firmware

- Installieren Sie offizielle Builds über den [EMS-ESP releases](https://github.com/emsesp/EMS-ESP32/releases), über die Versionsliste der Web-Benutzeroberfläche oder mit dem [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher). Auf der Seite „Version“ wird für diese Builds „Offizieller Build“ angezeigt.
- Klicken Sie bei einer benutzerdefinierten Version nur dann auf „Trotzdem installieren“, wenn Sie der Quelle vertrauen. Siehe [Official and custom builds](FAQ#offizielle-und-benutzerdefinierte-builds).
- Halten Sie EMS-ESP auf dem neuesten Stand, da Sicherheitskorrekturen in neuen Versionen enthalten sind.

## Physischer Zugang

Jeder, der Zugang zum USB-Anschluss des Gateways hat, kann dessen Flash-Speicher auslesen, andere Firmware flashen oder die serielle Konsole nutzen. Die Gateways werden ohne Secure Boot und ohne Flash-Verschlüsselung ausgeliefert, sodass Sie jederzeit beliebige Firmware installieren können. Bewahren Sie das Gateway an einem Ort auf, der für andere Personen nicht leicht zugänglich ist.

Bevor Sie ein Gateway verkaufen oder verschenken, führen Sie einen Werksreset durch (Werksreset auf der Versionsseite, der Befehl `system/format` oder durch langes Drücken der Taste). Ab dem Modell 3.10.0 werden dadurch alle Einstellungen, einschließlich Passwörter und Schlüssel, aus dem Flash-Speicher gelöscht.

## Ein Sicherheitsproblem melden

Wenn Sie glauben, ein Sicherheitsproblem in EMS-ESP entdeckt zu haben, eröffnen Sie bitte kein öffentliches Ticket. Melden Sie es stattdessen privat auf GitHub mit [Report a vulnerability](https://github.com/emsesp/EMS-ESP32/security/advisories/new) oder nutzen Sie [Contact Form](https://emsesp.org/About/#-contact). Unter [SECURITY.md](https://github.com/emsesp/EMS-ESP32/blob/dev/SECURITY.md) erfahren Sie, welche Informationen Sie angeben sollten, für welche Versionen Sicherheitskorrekturen bereitgestellt werden und wie diese veröffentlicht werden.
