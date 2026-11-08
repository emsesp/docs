---
id: tips-and-tricks
title: Tips and Tricks
description: Community-contributed tips, tricks, and code snippets for advanced EMS-ESP usage and automation
---

# Tipps und Tricks

**Im Folgenden finden Sie eine Sammlung nützlicher Tipps, Tricks und Code-Beispiele, die von der Community eingereicht wurden:**

## Steuerung der Heizkesselheizung

_(by Oderik)_

In einer sehr einfachen Konfiguration versorgt ein Heizkessel einen Heizkreis mit Wärme. Wenn `heating activated` gleich `on` ist, hält der Heizkessel die `selected flow temperature` aufrecht, indem er den Brenner und die Wärmepumpe regelt.

Sobald der Wert von `current flow temperature` den Wert von `selected flow temperature` + `temperature hysteresis off` überschreitet, wird die Heizung abgeschaltet, bis der Wert von `current flow temperature` unter den Wert von `selected flow temperature` + `temperature hysteresis on` fällt (was in der Regel ein negativer Wert ist).

Um die Heizung zu aktivieren, müssen Sie daher `heatingactivated` auf `on` einstellen und einen geeigneten Wert für `flowtemp` festlegen. Letzterer sollte sich aus dem `heating temperature setting` ableiten, der über den physikalischen Regler dial/control am Heizkessel eingestellt werden kann. Er sollte als maximale Vorlauftemperatur betrachtet werden. Sie können auch eine niedrigere Vorlauftemperatur verwenden, um nach Abschluss der anfänglichen Aufheizung eine konstante Raumtemperatur aufrechtzuerhalten.

Weitere Informationen von Michael:

Mit EMS-ESP können Sie die Vorlauftemperatur direkt am Heizkessel einstellen, ohne einen Thermostat zu verwenden. Viele Nutzer gehen so vor. Hier einige Hinweise:

- Der Flowtemp-Wert am Bedienfeld muss höher eingestellt werden, da die über den EMS-Bus übermittelte Temperatur nur akzeptiert wird, wenn sie einen niedrigeren Wert aufweist
- Sie müssen mindestens einmal pro Minute einen Wert übermitteln, um die Vorlauftemperatur aufrechtzuerhalten; andernfalls wechselt der Heizkessel automatisch auf den höheren Sollwert, der über das Bedienfeld eingestellt wurde.
- Es gibt eine spezielle EMS-ESP-Einheit namens `forceheatingoff`, die den Wert für die Vorlauftemperatur automatisch jede Minute auf 0 für den Heizkessel einstellt. Andere Nutzer ziehen es hingegen vor, stattdessen ein on/off-Regelelement zu verwenden.

Der Boiler „OneTime“ verfügt über eine spezielle Logik. Er lädt nicht bei Bedarf nach, wie die meisten Menschen erwarten. Er überprüft die aktuelle Temperatur und lädt nur nach, wenn diese außerhalb des Sollwertbereichs (Sollwert-Hysterese) liegt. Wenn die Warmwasserversorgung auf automatische Nachladung eingestellt ist, funktioniert dies nie, sondern nur im Warmwasser-Eco-Modus und bei niedriger Warmwasserspeichertemperatur. Um eine Nachladung auszulösen, müssen Sie die Nachladefunktion des Thermostats verwenden. Dadurch wird der Warmwasser-Sollwert vorübergehend auf einen höheren Wert gesetzt, sodass der Heizkessel eine Nachladung auslöst, und anschließend wieder auf den alten Sollwert zurückgesetzt.

## Daten über REST mit PHP abrufen

_(by flohse123)_

```php
<?php
$ch = curl_init("http://<myIP>/api?device=thermostat&cmd=info");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer <your Read API key>"]);
curl_exec($ch);
curl_close($ch);
?>
```

## Anpassung der Vorlauftemperatur je nachdem, ob die Zentralheizung oder das Warmwasser erwärmt wird

_(by IanC)_

In einem Discord-Beitrag schrieb IanC:

_„Bei einem Worcester-Bosch-Heizkessel aus dem Jahr ~2012 wird die Hausheizung über ein EvoHome-System gesteuert, das erkennt, welche Bereiche des Hauses wie viel Wärme benötigen; allerdings kann es zur Steuerung des Heizkessels für Raum- und Warmwasserbereitung nur ein on/off-Relais verwenden. Das bedeutet, dass es die Vorlauftemperatur nicht direkt regeln kann; diese wurde bisher über einen Drehregler an der Vorderseite des Heizkessels dauerhaft auf 65 °C eingestellt, um bei Bedarf Warmwasser bereitzustellen. Ich bin sehr froh, mein System um EMS-ESP erweitert zu haben, um die Vorlauftemperaturen besser steuern zu können. Ich habe ein einfaches C-Programm geschrieben, das auf meinem OpenWrt-Internetrouter läuft und die EvoHome-Nachrichten abfängt, um nützliche Informationen darüber zu erfassen, wie viel Wärme für Raum- und Warmwasserbereitung benötigt wird, und diese in einfachen TXT-Dateien unter /tmp. zu speichern. Anschließend plane ich alle 4 Minuten ein Shell-Skript ein, das in wenigen Schritten eine Vorlauftemperatur : Zunächst wird ein wetterkompensierter Wert auf Basis der Außentemperatur aus einem Online-Dienst verwendet; dieser wird je nach EvoHome-Raumwärmebedarf um bis zu 25 % nach oben oder unten angepasst; falls erforderlich, wird dieser Wert zur Warmwasserbereitung außer Kraft gesetzt. Die ausgewählte Vorlauftemperatur und eine maximale Brennerstufe werden dann per curl an ein BBQKees-Gerät gesendet, auf dem EMS-ESP läuft, das wiederum den Heizkessel steuert. Bislang scheint es wie beabsichtigt zu funktionieren, ohne dass der Wohnkomfort beeinträchtigt wird, wobei jedoch deutlich niedrigere Vorlauftemperaturen beobachtet werden, um den Betrieb des Heizkessels im Brennwertbereich zu fördern. Es ist sehr schwer zu sagen, ob sich dies auf den Gasverbrauch auswirkt – was ich mir allerdings wünschen würde :-). Die größte Herausforderung besteht für mich nach wie vor darin, zu verhindern, dass EvoHome häufige on/off-Zyklen des Heizkessels auslöst, während es weiterhin versucht, die TPI-Durchflussregelung zu nutzen."_

![1.5.0](/media/examples/ian_setflowtemp.png)

Die Algorithmen zur Temperaturkompensation befinden sich im Shell-Skript:

```sh title="set_flowtemp.sh"
#!/bin/sh -x
MINFLOW=30.0
MAXFLOW=70.0

function set_flowtemp() {
local boiler_key=$(cat /tmp/boiler-key.txt)
curl --silent http://192.168.0.140/api/boiler/selflowtemp \
  -H "Content-Type: application/json" -d "{ "value" : $1 }" \
  -H "Authorization: Bearer $boiler_key"

local burner_power=$(echo $1 | awk '{ \
if ($1 < 40.0) bp = 35;\
else if ($1 < 50.0) bp = 50;\
else if ($1 < 60.0) bp = 65;\
else bp = 90.0; \
printf "%2.1f", bp}')

curl --silent http://192.168.0.140/api/boiler/selburnpow \
  -H "Content-Type: application/json" -d "{ "value" : $burner_power }" \
  -H "Authorization: Bearer $boiler_key"
}

function dhw_active(){
  local active="false"
  if [[ -f /tmp/relay_dhw ]]; then
    active=$(cat /tmp/relay_dhw | awk '{if ($1 == 0.0) print "false"; else print "true";}')
  else
    local curr_hour=$(date +%H)
    if [[ $curr_hour -eq 6 ]] || [[ $curr_hour -eq 16 ]]; then
      active="true"
    fi
  fi

  echo $active
}

function dhw_flowtemp(){
  if [[ -f  /tmp/temp_dhw ]]; then
    echo $(cat /tmp/temp_dhw | awk '{printf "%2.1f", $1 + 20.0}')
  else
    echo $MAXFLOW
  fi
}

function outside_temp(){
  if [[ -f  /tmp/meteo.$(date +%Y%m%d) ]]; then
    echo $(cat /tmp/meteo.$(date +%Y%m%d)|jq .hourly.temperature_2m[$(date +%H)])
  else
    echo UNKNOWN
  fi
}

function weather_flowtemp(){
  local otemp=$(outside_temp)
  if [[ $otemp = "UNKNOWN" ]]; then
    # Default flow temperature if no outside temperature available
    echo 65.0
  else
    # Calculated flow temperature if outside temperature available
    # echo $(echo $otemp | awk '{printf "%2.1f", 70.0 - ($1 + 5) * 1.5}')
    echo $(echo $otemp $MINFLOW $MAXFLOW | awk '{printf "%2.1f", $2 + ($3 - $2) / 25.0 * (20.0 - $1)}')
  fi
}

function load_flowtemp(){
  if [[ -f  /tmp/relay_ch ]]; then
    echo $(cat /tmp/relay_ch | awk '{printf "%2.1f", 20.0 + ($1 * 0.50)}')
  else
    echo $(weather_flowtemp)
  fi
}
function load_factor(){
  if [[ -f  /tmp/relay_ch ]]; then
    local relay_demand=$(cat /tmp/relay_ch)
    echo $(echo $1 $relay_demand $MINFLOW | awk '{printf "%2.1f", $3 + ($1 - $3) * (0.75 + $2 / 200.0)}')
  else
    echo $1
  fi
}

function max(){
  echo $(echo $1 $2 | awk '{if ($2 > $1) printf "%2.1f", $2; else printf "%2.1f", $1;}')
}

function min(){
  echo $(echo $1 $2 | awk '{if ($2 < $1) printf "%2.1f", $2; else printf "%2.1f", $1;}')
}

flowtemp=$(weather_flowtemp)
flowtemp=$(load_factor $flowtemp)
if [ $(dhw_active) = "true" ]; then
  alt_flowtemp=$(dhw_flowtemp)
  flowtemp=$(max $flowtemp $alt_flowtemp)
fi
flowtemp=$(min $flowtemp $MAXFLOW)
set_flowtemp $flowtemp
```

## Home Assistant-Sensorvorlage für alle Statusnummern eines GB192-Heizkessels

(von tefracky aus [this comment](https://github.com/emsesp/EMS-ESP32/issues/938#issuecomment-1417592878)

Hier ist der Sensor im neuen Home-Assistant-Vorlagenformat für alle Statuszahlen des Buderus GB192i-19 auf Deutsch:

```yaml title="Service code number text for Buderus GB192i-19"
- name: 'Heizungsstatus'
  attributes:
    service-code: "{{states('sensor.heizung_ems_esp_boiler_statusmeldungsnummer')|int(0)}}"
    timestamp: "{{now().strftime('%Y-%m-%d %H:%M:%S')}}"
    date: >
      {{ now().timestamp() | timestamp_custom("%Y-%m-%d", true) }}
    time: >
      {{ now().timestamp() | timestamp_custom("%H:%M:%S", true) }}
  state: >-
    {% set mapper = {
        '200' : '200 - Das Gerät befindet sich im Heizbetrieb.',
        '201' : '201 - Das Gerät befindet sich im Warmwasserbetrieb.',
        '202' : '202 - Wartephase des Geräts. Wärmeanforderung durch RC-Regelgerät oder einen ON/OFF-Thermostat erfolgt in Intervallen von weniger als 10 Minuten.',
        '203' : '203 - Betriebsbereitschaft: keine Wärmeanforderung vorhanden',
        '204' : '204 - Wartephase des Geräts. Die gemessene Vorlauf- temperatur ist höher als die berechnete oder eingestellte Heizwassertemperatur. - Eingestellte Heizwassertemperatur am Gerät prüfen. Heizwassertemperatur ggf. erhöhen. Bei einer außentemperaturgeführten Regelung die eingestellte Heizkurve am Raumthermostat prüfen. Heizkurve ggf. ändern. Verkabelung und Funktion des Speichertemperaturfühlers prüfen. Bauteil ggf. austauschen.',
        '207' : '207 - Der Betriebsdruck ist zu niedrig (weniger als 0,2 bar). - Heizungsanlage bis zu 2 bar füllen. Ausdehnungsgefäß prüfen. Heizungsanlage auf undichte Stellen prüfen. Verkabelung und Funktion des Druckfühlers prüfen. Bauteil ggf. austauschen.',
        '208' : '208 - Das Gerät befindet sich im Schornsteinfegerbe-trieb oder Servicebetrieb.',
        '210' : '210 - Vom Abgastemperaturfühler gemessene Tem- peratur ist zu hoch und ist dadurch geöffnet. - Funktion des Abgastemperaturfühlers prüfen. Bauteil ggf. austauschen. Gerät auf Verschmutzung prüfen. Gerät ggf. warten.',
        '212' : '212 - Der Vorlauf- oder Sicherheitstemperaturfühler misst einen zu schnellen Temperaturanstieg. - Betriebsdruck prüfen. Heizungsanlage und Gerät entlüften. Heizungsanlage auf ausreichenden Wasserdurchfluss prüfen. Verkabelung und Funktion der Pumpe und des jeweiligen Temperaturfühlers prüfen. Bauteil ggf. austauschen.',
        '213' : '213 - Der Vorlauf- oder Rücklauftemperaturfühler misst einen zu schnellen Temperaturanstieg. - Betriebsdruck prüfen. Heizungsanlage und Gerät entlüften. Heizungsanlage auf ausreichenden Wasserdurchfluss prüfen. Wärmeleistung nach der Größe der Heizungsanlage einstellen. Verkabelung zur Pumpe oder zum jeweiligen Temperaturfühler prüfen. Bauteil ggf. austauschen.',
        '214' : '214 - Das Gebläse wird während der Sicherheitszeit abgeschaltet. - Verkabelung und Steckverbindungen des Gebläses prüfen. Betriebsverhalten des Geräts durch Austauschen des Gebläses prüfen. Steckverbindungen des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '215' : '215 - Das Gebläse läuft zu schnell. - Abgasanlage prüfen, ggf. reinigen oder instandsetzen.',
        '216' : '216 - Das Gebläse läuft zu langsam. - Gebläsekabel mit Stecker prüfen, ggf. austauschen. Gebläse auf Verschmutzung und Blockierung prüfen, ggf. austauschen.',
        '217' : '217 - Das Gebläse läuft unregelmäßig während der Hochfahrphase. - Verkabelung und Steckverbindungen des Gebläses prüfen. Betriebsverhalten des Geräts durch Austauschen des Gebläses prüfen. Steckverbindungen des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '218' : '218 - Die vom Vorlauftemperaturfühler gemessene Temperatur ist höher als 105 °C. - Betriebsdruck prüfen. Heizungsanlage und Gerät entlüften. Heizungsanlage auf ausreichenden Wasserdurchfluss prüfen. Funktion der Pumpe und des Vorlauftemperaturfühlers prüfen. Bauteil ggf. austauschen.',
        '219' : '219 - Der Sicherheitstemperaturfühler misst eine Temperatur über 105 °C. - Betriebsdruck prüfen. Heizungsanlage und Gerät entlüften. Heizungsanlage auf ausreichenden Wasserdurchfluss prüfen. Funktion der Pumpe und des Sicherheitstemperaturfühlers prüfen. Bauteil ggf. austauschen.',
        '220' : '220 - Kurzschluss des Sicherheitstemperaturfühlers oder gemessene Wassertemperatur ist höher als 130 °C.',
        '221' : '221 - Die Kontakte des Sicherheitstemperaturfühlers sind unterbrochen. - Stecker des Sicherheitstemperaturfühlers prüfen. Sicherheitstemperaturfühler austauschen und Betriebsverhalten des Geräts prüfen.',
        '222' : '222 - Die Kontakte des Vorlauftemperaturfühlers sind kurzgeschlossen. - Stecker des Vorlauftemperaturfühlers prüfen. Vorlauftemperaturfühler austauschen und Betriebsverhalten des Geräts prüfen.',
        '224' : '224 - Wärmeblock-Temperaturbegrenzer oder Abgas- temperaturbegrenzer hat ausgelöst. - Wenn die blockierende Störung längere Zeit bestehen bleibt, wird aus der blockie- renden Störung eine verriegelnde Störung. Wärmeblock-Temperaturbegrenzer und Anschlusskabel auf Unterbrechung prü- fen, ggf. austauschen. Bei Störung des Abgastemperaturbegrenzers erscheint eine Meldung max. nach 2 Stunden. Abgastemperaturbegrenzer und Anschlusskabel auf Unterbrechung prüfen, ggf. austauschen. Betriebsdruck der Heizungsanlage prüfen. Im Servicemenü unter EINSTELLUNGEN > SONDERFKT. > ENTLÜFTUNGSFKT. die Entlüftung einschalten und das Gerät entlüften. Pumpenleistung oder Pumpenkennfeld korrekt einstellen und auf maximale Leis- tung anpassen. Im Menü Service unter FUNKTIONSTEST > TESTS AKTIVIEREN > PUMPE die Hei- zungspumpe auf Dauerbetrieb einstellen. Heizungspumpe andrehen, ggf. austauschen. Wärmeblock wasserseitig prüfen, ggf. austauschen.',
        '227' : '227 - Unzureichende Flammenbildung (Ionisations- strom) während des Zündungsversuchs des Brenners. - Gerät auf Verschmutzung prüfen. Dynamischen Gasvordruck prüfen. Gas-Luft-Verhältnis prüfen. Steckverbindungen der Zündeinrichtung prüfen. Zündung und Ionisationsstrom prüfen. Zündeinrichtung auf Beschädigung prüfen. Bauteil ggf. austauschen.',
        '228' : '228 - Flammenbildung (Ionisationsstrom) vor Bren- nerstart. - Steckverbindung der Überwachungselektrode prüfen. Zündeinrichtung auf Beschädigung und Verschleiß prüfen. Bauteil ggf. austauschen.',
        '229' : '229 - Unzureichende Flammenbildung (Ionisations- strom) während des Brennerbetriebs. - Dynamischen Gasvordruck prüfen. Verkabelung und Steckverbindung der Überwachungselektrode prüfen. Zündeinrichtung auf Beschädigung und Verschleiß prüfen. Bauteil ggf. austauschen.',
        '231' : '231 - Unterbrechung der Netzspannung während einer verriegelnden Störung. - Gerät erneut starten (Reset).',
        '232' : '232 - Der externe Schaltkontakt ist geöffnet. - Brücke am Anschluss des externen Schaltkontaktes prüfen. Externen Schaltkontakt prüfen.',
        '233' : '233 - Kodierstecker nicht erkannt. - Kodierstecker richtig aufstecken, ggf. austauschen.',
        '234' : '234 - Die Kontakte der Gasarmatur sind unterbro- chen. - Verkabelung und Steckverbindung der Gasarmatur prüfen. Gasarmatur austauschen und Betriebsverhalten des Geräts prüfen.',
        '235' : '235 - Falscher Kodierstecker (HCM-Modul). - Kodierstecker (HCM-Modul) prüfen.',
        '237' : '237 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '238' : '238 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '239' : '239 - Brennerautomat oder HCM-Modul ist defekt. - Kodierstecker austauschen. Steuergerät austauschen.',
        '240' : '240 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '241' : '241 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '242' : '242 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '243' : '243 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '244' : '244 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '245' : '245 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '246' : '246 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '247' : '247 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '248' : '248 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '249' : '249 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '250' : '250 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '251' : '251 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '252' : '252 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '253' : '253 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '254' : '254 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '255' : '255 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '256' : '256 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '257' : '257 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '258' : '258 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '259' : '259 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '260' : '260 - Der Vorlauftemperaturfühler misst keinen Tem- peraturanstieg nach einem Brennerstart. - Betriebsdruck prüfen. Heizungsanlage und Gerät entlüften. Heizungsanlage auf ausreichenden Wasserdurchfluss prüfen. Verkabelung und Funktion der Pumpe und des Vorlauftemperaturfühlers prüfen. Bauteil ggf. austauschen.',
        '261' : '261 - Brennerautomat ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '262' : '262 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '263' : '263 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '264' : '264 - Gebläse ausgefallen. - Verkabelung und Steckverbindungen des Gebläses prüfen. Gebläse auf Verschmutzung und Blockierung prüfen, ggf. austauschen.',
        '265' : '265 - Ein-/Aus-Betrieb: Der Wärmebedarf ist geringer als die minimale Wärmeleistung.',
        '268' : '268 - Komponententest: Das Gerät befindet sich im Testmodus.',
        '269' : '269 - Zündeinrichtung wurde zu lange aktiviert. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '270' : '270 - Das Gerät wird hochgefahren.',
        '272' : '272 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '273' : '273 - Der Brenner und das Gebläse waren 24 Std. un- unterbrochen in Betrieb und werden zur Sicher- heitskontrolle für kurze Zeit außer Betrieb genommen.',
        '275' : '275 - Wärmepumpe im Enteisungsmodus.',
        '276' : '276 - Die Temperatur am Vorlauftemperaturfühler ist > 95 °C. - Diese Störungsanzeige kann auftreten, ohne dass eine Störung vorliegt, wenn plötz- lich alle Heizkörperventile geschlossen werden. Betriebsdruck der Heizungsanlage prüfen. Wartungshähne öffnen. Im Servicemenü unter FUNKTIONSTEST > TESTS AKTIVIEREN > PUMPE die Hei- zungspumpe auf Dauerbetrieb einstellen. Anschlusskabel zur Heizungspumpe prüfen. Heizungspumpe andrehen, ggf. austauschen. Pumpenleistung oder Pumpenkennfeld korrekt einstellen und auf maximale Leistung anpassen.',
        '280' : '280 - Brennerautomat ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '281' : '281 - Die Heizungspumpe erzeugt keinen Druck. - Betriebsdruck der Heizungsanlage prüfen. Wartungshähne öffnen. Heizungspumpe andrehen, ggf. austauschen.',
        '282' : '282 - Keine Drehzahlrückmeldung der Heizungspumpe. - Verkabelung und Funktion der Heizungspumpe prüfen. Bauteil ggf. austauschen.',
        '283' : '283 - Brennerstart.',
        '284' : '284 - Erste Sicherheitszeit: Die Gasarmatur wird geöffnet.',
        '290' : '290 - Brennerautomat oder HCM-Modul ist defekt. - Verkabelung und Steckverbindung des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '305' : '305 - Das Zeitintervall für die Wasser-Warmhaltung ist noch nicht erreicht.',
        '306' : '306 - Flammenbildung (Ionisationsstrom) nach Ab- schalten des Brenners. - Wärmeblock an der Innenseite um die Zündeinrichtung reinigen. Ionisationsteil der Zündeinrichtung prüfen. Bauteil ggf. austauschen. Prüfen, ob das Gas-Luft-Verhältnis auch nach Abschalten des Brenners vorhan- den ist. Prüfen, ob die Gasarmatur auch nach Abschalten des Brenners weiterhin geöff- net ist. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '307' : '307 - Heizungspumpe im Gerät dreht nicht. - Heizungspumpe austauschen und Betriebsverhalten des Geräts prüfen.',
        '323' : '323 - BUS-Kommunikation unterbrochen. - Anschlusskabel BUS-Teilnehmer prüfen, ggf. austauschen.',
        '328' : '328 - Es ist eine kurzzeitige Unterbrechung der Netz- spannung aufgetreten. - Verkabelung des Trafos prüfen (falls vorhanden). Trafo austauschen und Betriebsverhalten des Geräts prüfen. Prüfen, ob die Störung die Folge des Vorhandenseins eines Stromaggregats, ei- nes Windrads oder einer anderen Ausrüstung gewesen sein könnte, die eine Un- terbrechung verursachen kann. Elektroinstallation prüfen.',
        '330' : '330 - Externer Vorlauftemperaturfühler defekt (hydraulische Weiche). - Temperaturfühler und Anschlusskabel auf Kurzschluss prüfen, ggf. austauschen.',
        '331' : '331 - Externer Vorlauftemperaturfühler defekt (hydraulische Weiche). - Temperaturfühler und Anschlusskabel auf Unterbrechung prüfen, ggf. austauschen.',
        '341' : '341 - Die gemessene Temperatur, durch den Vorlauf- temperaturfühler oder den Rücklauftemperatur- fühler, steigt zu schnell. - Wasserdruck des Geräts prüfen und Heizungsanlage und Gerät entlüften. Prüfen, ob genügend Strömung über die Heizungsanlage möglich ist. Betriebsverhalten und Verkabelung der Pumpe und der betreffenden Fühler prüfen. Bauteil ggf. austauschen.',
        '342' : '342 - Die gemessene Temperatur, durch den Vorlauf- temperaturfühler, steigt zu schnell. - Wasserdruck des Geräts prüfen und Heizungsanlage und Gerät entlüften. Prüfen, ob genügend Strömung über die Heizungsanlage möglich ist. Betriebsverhalten und Verkabelung der Pumpe und der betreffenden Fühler prüfen. Bauteil ggf. austauschen.',
        '350' : '350 - Vorlauftemperaturfühler defekt (Kurzschluss). - Wenn die blockierende Störung längere Zeit bestehen bleibt, wird aus der blockie- renden Störung eine verriegelnde Störung. Temperaturfühler und Anschlusskabel auf Kurzschluss prüfen, ggf. austauschen.',
        '351' : '351 - Vorlauftemperaturfühler defekt (Unterbre- chung). - Wenn die blockierende Störung längere Zeit bestehen bleibt, wird aus der blockie- renden Störung eine verriegelnde Störung. Temperaturfühler und Anschlusskabel auf Unterbrechung prüfen, ggf. austauschen.',
        '356' : '356 - Netzspannung niedriger als erlaubt. - Prüfen, ob die Störung die Folge des Vorhandenseins eines Stromaggregats, ei- nes Windrads oder einer anderen Ausrüstung gewesen sein könnte, die eine Un- terbrechung verursachen kann. Elektroinstallation prüfen.',
        '357' : '357 - Entlüftungsbetrieb.',
        '358' : '358 - Blockierschutz für Heizungspumpe und 3-WegeVentil.',
        '360' : '360 - Des angebrachte HCM-Modul korrespondiert nicht mit dem Brennerautomaten. - HCM-Modul-Nummer kontrollieren. Anbringen des HCM-Moduls mit der korrekten HCM-Modul-Nummer.',
        '361' : '361 - Der angebrachte Brennerautomat korrespon- diert nicht mit dem HCM-Modul. - Nummern auf dem Brennerautomaten kontrollieren. Anbringen des HCM-Moduls mit der korrekten HCM-Modul-Nummer.',
        '364' : '364 - Gasarmatur schließt nicht korrekt. - Verkabelung und Steckverbindung der Gasarmatur prüfen. Gasarmatur austauschen und Betriebsverhalten des Geräts prüfen.',
        '365' : '365 - Gasarmatur schließt nicht korrekt. - Verkabelung und Steckverbindung der Gasarmatur prüfen. Gasarmatur austauschen und Betriebsverhalten des Geräts prüfen.',
        '390' : '390 - Brennerautomaten liest falschen Wert im HCMModul. - HCM-Modul austauschen und Betriebsverhalten des Geräts prüfen.',
        '537' : '537 - Keine Drehzahlrückmeldung vom Gebläse. - Anschlussstecker für die Drehzahlregelung am Gebläse aufstecken. Anschlussstecker für die Spannungsversorgung am Gebläse aufstecken. Anschlusskabel für die Drehzahlregelung zwischen Gebläse und Feuerungs- automat (SAFe) austauschen. Anschlusskabel (230 vAC) zwischen Gebläse und Feuerungsautomat (SAFe) aus- tauschen. Feuerungsautomat (SAFe) austauschen.',
        '550' : '550 - Netzspannung zu niedrig. - Versorgungsspannung von mindestens 196 VAC herstellen. Feuerungsautomat (SAFe) austauschen.',
        '560' : '560 - Luftdruckschalter offen. - Jegliche Blockade entfernen. Luftdruckschalter wieder anschließen. Luftdruckschalter ersetzen.',
        '604' : '604 - Anlagenstörung Feuerungsautomat. - Feuerungsautomat (SAFe) austauschen.',
        '810' : '810 - Warmwasser bleibt kalt. - Evtl. ständige Warmwasserentnahme unterbinden. Warmwasser-Temperaturfühler richtig positionieren. Warmwasserbereitung auf „Vorrang“ einstellen. Evtl. entlüften. Bei Störungen in der Verrohrung dies beheben. Wenn Abweichungen bestehen, die Pumpe austauschen. Zirkulationsleitung prüfen. Bei Abweichungen zu den Tabellenwerten den Fühler austauschen.',
        '811' : '811 - Warmwasserbereitung: Thermische Desinfekti- on misslungen. - Evtl. ständige Warmwasserentnahme unterbinden. Warmwasser-Temperaturfühler richtig positionieren. Warmwasserbereitung auf „Vorrang“ einstellen. Evtl. entlüften. Bei Störungen in der Verrohrung dies beheben. Wenn Abweichungen bestehen, die Pumpe austauschen. Zirkulationsleitung prüfen. Bei Abweichungen zu den Tabellenwerten den Fühler austauschen.',
        '815' : '815 - Temperaturfühler hydraulische Weiche defekt. - Fühleranschluss prüfen. Weichenfühler auf falsche Einbauposition oder auf Bruchstelle prüfen.',
        '1011' : '1011 - Vom Abgastemperaturfühler gemessene Tem- peratur ist zu hoch. - Verkabelung des Temperaturfühlers prüfen. Temperaturfühler prüfen, ggf. austauschen. Anschlusskabel auf Unterbrechung oder Kurzschluss prüfen, ggf. austauschen.',
        '1012' : '1012 - Das Gebläse läuft unregelmäßig. - Verkabelung und Steckverbindungen des Gebläses prüfen. Betriebsverhalten des Geräts durch Austauschen des Gebläses prüfen. Steckverbindungen des Brennerautomaten prüfen. Brennerautomaten austauschen und Betriebsverhalten des Geräts prüfen.',
        '1013' : '1013 - Das Inspektionsintervall ist erreicht. Bitte Inspektion durchführen. - Inspektion durchführen. Nicht blockierende Störung zurücksetzen (erforderlich).',
        '1014' : '1014 - Aktuelle Ionisation ist zu niedrig. - Wartung durchführen.',
        '1017' : '1017 - Der Betriebsdruck ist niedrig. - Heizungsanlage bis zu 2 bar füllen. Ausdehnungsgefäß prüfen. Heizungsanlage auf undichte Stellen prüfen. Verkabelung und Funktion des Druckfühlers prüfen. Bauteil ggf. austauschen.',
        '1018' : '1018 - Service Zeit abgelaufen. - Wartung durchführen.',
        '1019' : '1019 - Falscher Pumpentyp detektiert. - Pumpenkennfeld korrekt einstellen. Steckverbindungen und Kabelbaum auf Kontakt prüfen. Gerät aus- und wieder einschalten. Pumpe austauschen und Betriebsverhalten des Geräts prüfen.',
        '1021' : '1021 - Kaltwassertemperaturfühler des Schichtlade- speichers defekt. - Gerät aus- und wieder einschalten. Verbindungsleitung zum Schichtladespeicherfühler (SLS) reparieren bzw. aus- tauschen. Fühler austauschen.',
        '1022' : '1022 - Speichertemperaturfühler defekt oder Kontakt- probleme. - Angezeigte Speichertemperatur auf Plausibilität prüfen. Steckverbindungen und Kabelbaum auf Kontakt prüfen. Grundeinstellungen zurücksetzen.',
        '1023' : '1023 - Eingestellte Wartungszeit ist überschritten. Wartung erforderlich. - Wartung am Gerät ausführen.',
        '1025' : '1025 - Rücklauftemperaturfühler ist defekt. - Verbindungsleitung zum Rücklauftemperaturfühler reparieren bzw. austauschen. Fühler austauschen.',
        '1065' : '1065 - Wasserdruckfühler defekt oder nicht ange- schlossen. - Anschlussstecker am Wasserdruckfühler korrekt aufstecken. Anschlusskabel zum Wasserdruckfühler austauschen. Wasserdruckfühler austauschen. Steuergerät austauschen.',
        '1068' : '1068 - Außentemperaturfühler oder Lambdasonde de- fekt. - Kontaktproblem beseitigen. Lambdasonde austauschen.',
        '2085' : '2085 - Interner Fehler. - Entriegeln. Anlage für 30 Sekunden spannungsfrei schalten. Feuerungsautomat ersetzen.',
        '2626' : '2626 - Anlagenstörung Geräteelektronik. - Geräteelektronik austauschen.',
        '2908' : '2908 - Anlagenstörung Geräteelektronik / Basiscontroller. - Bleibt die Störung nach Reset erhalten, ist der Feuerungsautomat oder Fremdbrennermodul defekt und muss ausgetauscht werden.',
        '2909' : '2909 - Anlagenstörung Geräteelektronik / Basiscontroller. - Bleibt die Störung nach Reset erhalten, ist der Feuerungsautomat oder Fremdbrennermodul defekt und muss ausgetauscht werden.',
        '2910' : '2910 - Fehler im Abgassystem. - Abgassystem montieren. Ablagerungen im Abgassystem entfernen.',
        '2911' : '2911 - Kalibrierung fehlgeschlagen. - Fehlerhafte Komponente ersetzen.',
        '2912' : '2912 - Kein Flammensignal während der Kalibrierung. - Fehlerhafte Komponente ersetzen.',
        '2913' : '2913 - Flammensignal zu niedrig in der Kalibrierung. - Fehlerhafte Komponente ersetzen.',
        '2914' : '2914 - Anlagenstörung Geräteelektronik. - Bleibt die Störung nach Reset erhalten, ist die Gerätesteuerung oder das Brennermodul defekt und muss ausgetauscht werden.',
        '2915' : '2915 - Anlagenstörung Geräteelektronik. - Gerät zurücksetzen. Eine Wärmeanforderung angeben. Wärmeanforderung beenden. Wenn der Fehler danach wieder auftritt, ist der Brennerregler defekt und muss ausgetauscht werden.',
        '2916' : '2916 - Anlagenstörung Geräteelektronik. - Gerät zurücksetzen. Eine Wärmeanforderung angeben. Wärmeanforderung beenden. Wenn der Fehler danach wieder auftritt, ist der Brennerregler defekt und muss ausgetauscht werden.',
        '2917' : '2917 - Kein Flammensignal während der Überprüfung der Verbrennungsregelung. - Gerät ausschalten. Eine Wärmeanforderung angeben. 5 Minuten warten. Wenn der Fehler innerhalb dieser Zeit wieder auftritt, Gerät zu- rücksetzen, ohne Strom zu trennen. Dadurch wird eine Kalibrierung der Ionisationsschaltungen ausgelöst. Wenn der Fehler nach der Kalibrierung wieder auftritt, ist der Brennerregler de- fekt und muss ausgetauscht werden. Abgasanlage auf mögliche Rezirkulation prüfen.',
        '2918' : '2918 - Störung in der Verbrennungsregelung. - Siphon reinigen und das Gerät entwässern (Gasseite).',
        '2919' : '2919 - Störung in der Verbrennungsregelung. - Fehlerhafte Komponente ersetzen.',
        '2920' : '2920 - Störung Flammenüberwachung. - Feuerungsautomat austauschen.',
        '2921' : '2921 - Geräteelektronik im Testmode. - Keine Maßnahme erforderlich (Wärmeerzeuger startet automatisch).',
        '2922' : '2922 - Anlagenstörung Geräteelektronik. - Feuerungsautomat austauschen.',
        '2923' : '2923 - Anlagenstörung Geräteelektronik. - Geräteelektronik austauschen.',
        '2926' : '2926 - Anlagenstörung Geräteelektronik. - Geräteelektronik austauschen.',
        '2927' : '2927 - Flamme während Brennerbetrieb ausgefallen. - Hauptabsperreinrichtung öffnen. Geräteabsperrhahn öffnen. Gerät stilllegen und Gasleitung überprüfen. Signalauswertung auf Leiterplatte defekt. Überwachungselektrode austauschen. Schutzleiteranschluss (PE) im Steuergerät herstellen. Zündleitung austauschen. Anschlusskabel zur Überwachungselektrode austauschen. Gasarmatur austauschen.',
        '2928' : '2928 - Interner Fehler. - Feuerungsautomat austauschen.'
      }
    %}
    {% set state = states('sensor.heizung_ems_esp_boiler_statusmeldungsnummer') %}
    {% set message = mapper[state] if state in mapper %}
    {{ message }}
```

## Verwendung einer benutzerdefinierten Klimakomponente in Home Assistant

_(by elRadix)_ von [this comment](https://github.com/emsesp/EMS-ESP32/discussions/790#discussioncomment-4895520)

In diesem Beispiel werden mithilfe einer benutzerdefinierten HACS-Karte in HA mit dem Namen [simple thermostat](https://github.com/nervetattoo/simple-thermostat) zwei Klimakomponenten für die Warmwasserversorgung mit ihrem Betriebsmodus und ihrem Heizklima eingerichtet, und zwar wie folgt:

![customha](/media/examples/ha_custom_climate.jpg)

```yaml title="configuration.yaml"
mqtt:
  sensor:

  climate:
    - name: boiler
      unique_id: bosh_boiler
      min_temp: 35
      max_temp: 60
      temp_step: 5
      current_temperature_topic: 'ems-esp/boiler_data_ww'
      temperature_state_topic: 'ems-esp/boiler_data_ww'
      temperature_command_topic: 'ems-esp/boiler/dhw.seltemp'
      temperature_command_template: >
        {{ '{"cmd":"dhw.seltemp ","data":'}}
        {{ value }}
        {{ '}'}}
      current_temperature_template: '{{ value_json.dhw.curtemp }}'
      temperature_state_template: '{{ value_json.dhw.seltemp }}'
      mode_state_template: "{% if value_json.dhw.activated == 'off' %} off {% else %} heat {% endif %}"
      mode_state_topic: 'ems-esp/boiler_data_ww'
      mode_command_topic: 'ems-esp/boiler/dhw.activated'
      mode_command_template: >
        {{ '{"cmd":"dhw.activated","data":"'}}
        {%- if value == 'off' -%}off{% else %}on{%- endif -%}
        {{'"}'}}
      modes:
        - 'heat'
        - 'off'
      # use fan mode as proxy to set comfort mode
      fan_mode_command_topic: 'ems-esp/boiler/wwcomfort'
      fan_mode_command_template: >
        {{ '{"cmd":"wwcomfort","data":"'}}
        {%- if value == 'eco' -%}eco{%-elif value == 'hot' -%}hot{%- else -%}intelligent{%- endif -%}
        {{'"}'}}
      fan_mode_state_topic: 'ems-esp/boiler_data_ww'
      fan_mode_state_template: '{{ value_json.dhw.comfort }}'
      fan_modes:
        - 'eco'
        - 'hot'
        - 'intelligent'

    - name: heating
      unique_id: bosh_heating
      min_temp: 30
      max_temp: 80
      temp_step: 5
      current_temperature_topic: 'ems-esp/boiler_data'
      temperature_state_topic: 'ems-esp/boiler_data'
      temperature_command_topic: 'ems-esp/boiler'
      temperature_command_template: >
        {{ '{"cmd":"heatingtemp","data":'}}
        {{ value }}
        {{ '}'}}
      current_temperature_template: '{{ value_json.curflowtemp }}'
      temperature_state_template: '{{ value_json.heatingtemp }}'
      mode_state_template: "{% if value_json.heatingactivated == 'off' %} off {% else %} heat {% endif %}"
      mode_state_topic: 'ems-esp/boiler_data'
      mode_command_topic: 'ems-esp/boiler'
      mode_command_template: >
        {{ '{"cmd":"heatingactivated","data":"'}}
        {%- if value == 'off' -%}off{% else %}on{%- endif -%}
        {{'"}'}}
      modes:
        - 'heat'
        - 'off'
```

```yaml title="HACS card"
type: custom:simple-thermostat
entity: climate.boiler
sensors:
  - id: state
    label: State
    template: '{{hvac_action}}'
label:
  state: Warm Water
layout:
  mode:
    names: true
    icons: true
    headings: false
  step: column
step_size: '1'
control:
  hvac:
    'off':
      name: Warm Water Off
    heat:
      name: Warm Water On
  fan:
    eco:
      name: eco
    hot:
      name: hot
    intelligent:
      name: smart
decimals: '1'
hide:
  state: false
header:
  toggle:
    entity: switch.ketel
    name: power
  name: Boiler
view_layout:
  position: main
```

## Automatisierung des on/off der Wärmepumpe in Home Assistant

`waengr` hat in unserem Discord-Kanal einen [message](https://discord.com/channels/816637840644505620/816958041345884180/1287897271148609566)-Beitrag darüber gepostet, wie man einen einfachen Schalter zum Ein- und Ausschalten der Wärmepumpe automatisieren kann. Er verweist dabei auf die GitHub-Issues [1600](https://github.com/emsesp/EMS-ESP32/discussions/1600) und [1717](https://github.com/emsesp/EMS-ESP32/issues/1717).

Nach seinen eigenen Worten hat er Folgendes getan:

„Ich habe mich daran gehalten, die binäre Eingabezeichenfolge wie vorgeschlagen zu analysieren, die von EMS-ESP im `text.boiler_hpin1opt` bereitgestellt wurde, wie in Home Assistant angezeigt. Ich habe die Schalter auf der Benutzeroberfläche der Pumpe umgelegt und beobachtet, wie sich die Zeichenfolge änderte. Anschließend habe ich die Zeichenfolge in Home Assistant manuell geändert und beobachtet, wie sich die Benutzeroberfläche der Pumpe entsprechend änderte. Die bidirektionale Kommunikation ist also möglich!

Ich habe noch nicht alle Optionen ausprobiert, aber hier sind ein paar Anmerkungen:

- Ich hielt mich für schlau, weil ich vorausgedacht hatte, und habe daher bei der Auswahl von „Kompressorbetr. sperren“ (Kompressorbetrieb sperren) auch „Zuheizerbetr. sperren“ (Zusatzheizbetrieb sperren) ausgewählt. ABER – ich verarsch dich nicht – tatsächlich ging NUR die Zusatzheizung an und verschwendete eine Menge Strom (zumindest für ein paar Minuten).
- Die Option „Heizbetrieb sperren“ schaltet auch die Umwälzpumpe ab, was ich jedoch nicht möchte, da ich einen 500-Liter-Pufferspeicher habe.
- „EVU-Sperrzeit 1“ funktioniert bisher gut (wofür sind die anderen EVU-Sperrzeiten gedacht?)

Als Nächstes ging es darum, die Saite mithilfe von Automatisierungen zu wechseln.

Vorerst halte ich mich an feste Zeiten: Eine Heizphase in der Nacht, wenn wir den Niedertarif haben, und dann eine weitere gegen Mittag, wenn ich möglicherweise überschüssigen PV-Strom habe. Später kann ich dann daran herumprobieren, das System an die tatsächliche PV-Produktion anzupassen. Ich ändere gerade den ersten Teil, nämlich die Umkehrung des Eingangs „Eingang invertiert“, der immer ausgeschaltet ist, wie vorgeschlagen. Der zweite Teil ist „EVU-Sperrzeit 1“.

```yaml
automation heating:
  - id: 'heating_on_by_time'
    alias: 'Allow heating to operate at fixed times (low tariff / expected PV)'
    description: Controls boiler_hpin1opt based on specified times
    trigger:
      - platform: time
        at: '20:00:00'
      - platform: time
        at: '10:00:00'
    action:
      - service: text.set_value
        target:
          entity_id: text.boiler_hpin1opt
        data:
          value: '010000000000000'
  - id: 'heating_off_by_time'
    alias: 'Disallow heating to operate at fixed times (low tariff / expected PV)'
    description: Controls boiler_hpin1opt based on specified times
    trigger:
      - platform: time
        at: '06:00:00'
      - platform: time
        at: '16:00:00'
    action:
      - service: text.set_value
        target:
          entity_id: text.boiler_hpin1opt
        data:
          value: '110000000000000'
```

Hier ist mein Dashboard in Home Assistant, an dem ich gerade arbeite:

![Dashboard](/media/screenshot/PV_HA_dash.png)

- links: `text.boiler_hpin1opt` und die oben genannten Automatisierungen, um den Status auf „ein“ und „aus“ umzuschalten.
- oben rechts: eine handgezeichnete Übersicht, in der ich versuche, einige der über 200 Werte aus EMS-ESP darzustellen.
- unten rechts: die Werte über 200.

Als Nächstes untersucht er, wie man einen genauen Leistungswert (in W) ermitteln kann, der angibt, wie viel Leistung die Wärmepumpe derzeit verbraucht.

## Einfacher Auslöser für die Warmwasser-Zuschlagabrechnung in Home Assistant

_(by oliof)_

Hier ist eine einfache Automatisierung, die durch einen Doppelklick auf einen Zigbee-basierten Taster die Warmwasserzufuhr umschaltet. Dieser Auslöser könnte bei Bedarf problemlos durch einen Sprachbefehl oder das Scannen eines QR-Codes ersetzt werden.

![image](https://github.com/user-attachments/assets/da3795fd-5bba-411c-a533-49fe5efc70c3)

## Optimierung eines Buderus GB172-Gaskessels im Niedriglastbetrieb

_(by oliof with additional input by tz)_

Wenn Sie mit der Feinabstimmung Ihres Heizkessels beginnen, werden Sie höchstwahrscheinlich in Situationen geraten, in denen der Heizkessel
selbst bei niedrigster Modulationsstufe zu viel Wärme erzeugt. In solchen Fällen kann es sich lohnen, ein zusätzliches Regelkonzept in Betracht zu ziehen, das
den Heizkessel für eine gewisse Zeit abschaltet, sobald die Solltemperatur erreicht ist. Hier ist eine mögliche Umsetzung, bei der
es sich im Grunde um einen Zweipunktregler handelt. Durch die thermische Trägheit liegen die Schaltvorgänge bei den meisten Heizungsanlagen auch ohne zusätzliche Verzögerung
oder Zeitbegrenzung in angemessenem Abstand zueinander; diese lassen sich jedoch leicht hinzufügen, wenn Sie die Anzahl der Einschaltvorgänge reduzieren möchten.

Durch diese Optimierung bei geringer Last lässt sich der Gasverbrauch um 15–20 % senken, ohne dass sich der Temperaturkomfort nennenswert verändert.

### Voraussetzungen

- Ein hochauflösendes Thermometer mit hoher Aktualisierungsfrequenz.
- Dieses Thermometer als [Remote Thermostat](https://emsesp.org/Special-Functions/#remote-thermostats) einrichten.
- Ein Heizkessel, bei dem die Einstellung von `Heating Activated` auf `off` die Heizung tatsächlich deaktiviert. Dies scheint bei Gaskesseln der Fall zu sein, funktioniert jedoch höchstwahrscheinlich
  nicht bei Wärmepumpen. Verwenden Sie in diesem Fall die Entität `forceheatingoff`.

### Abgeleitete Sensoren und Automatisierungen

Einer der Nachteile eines hochauflösenden Thermometers ist, dass die Temperaturmesswerte ein gewisses Rauschen aufweisen. Sie können einen Filter verwenden,
um eine geglättete Kurve zu erhalten (mit einer gewissen Verzögerung). Zum Beispiel (Auszug aus dem `configuration.yaml` von HomeAssistant):

```yaml
sensor:
  -platform: filter
   name: "filtered reference room temperature"
   entity_id: sensor.reference_room_temperature
   unique_id: filtered_reference_room_temperature
   filters:
     - filter: outlier
       window_size: 4
       radius: 2.0
     - filter: lowpass
       time_constant: 10
     - filter: time_simple_moving_average
       window_size: "00:15"
       precision: 2
```

In der folgenden Abbildung sehen Sie die verrauschten Rohdaten der Temperaturen und die gefilterten Temperaturwerte. Passen Sie den `lowpass`-Filter `time_constant` und den `simple_moving_average`-Filter `window_size` an, um die Kurve bei Bedarf besser anzupassen.

![image](https://github.com/user-attachments/assets/cfe1cf9c-d825-4693-80ce-28e8684b9ecf)

Mit dem gefilterten Sensor ist es nun möglich, Automatisierungen so einzurichten, dass die Heizung ein- und ausgeschaltet wird, sobald die Referenzraumtemperatur einen Schwellenwert überschreitet. Das `temperature`-Attribut des Thermostats wird als Schwellenwert verwendet, sodass Sie die Zieltemperatur weiterhin auf die gewohnte Weise einstellen können.

Ab HA 2025.01 lässt der numerische Trigger von Home Assistant nur noch Werte mit einfacher Genauigkeit als Auslöser zu. Da wir unsere Zweipunktregelung näher am Sollwert halten möchten, verwenden wir einen benutzerdefinierten Vorlagen-Trigger:

```yaml
alias: Deactivate Heating
description: >-
  Deactivate heating when reference room temperature exceeds a limit
triggers:
  - trigger: template
    value_template: >-
      {{ (states('sensor.filtered_reference_room_temperature') | float) >  
      (state_attr('climate.thermostat_hc1', 'temperature') | float) -0.02 }}
    for:
      hours: 0
      minutes: 5
      seconds: 0
conditions:
  - condition: state
    entity_id: switch.boiler_heating_activated
    state: 'on'
    for:
      hours: 0
      minutes: 5
      seconds: 0
actions:
  - action: switch.turn_off
    target:
      entity_id:
        - switch.boiler_heating_activated
    data: {}
mode: single
```

Bitte beachten Sie, dass wir die Heizung bereits ein kleines bisschen unterhalb der Solltemperatur abschalten, damit wir nicht zu weit darüber hinausgehen.
Der Wert `-0.02` muss wahrscheinlich an Ihre Heizungsanlage und Ihre Vorlieben angepasst werden. Mit dem gefilterten Sensor benötigen wir den
`for:`-Block vielleicht nicht unbedingt, aber es ist eine weitere kleine Sicherheitsmaßnahme, dort etwas einzufügen. Es gibt eine zusätzliche Verzögerung von 5
Minuten vor der Auslösung, um ein Schwanken zu vermeiden. Passen Sie dies nach Bedarf an Ihr System an (möglicherweise nicht erforderlich bei der
gefilterten Referenztemperatur).

Die Automatisierung zur erneuten Aktivierung der Heizung folgt dem gleichen Muster (mit einem anderen Anpassungsfaktor von `-0.05`, den Sie
an Ihre Bedürfnisse anpassen sollten):

```yaml
alias: Activate Heating
description: "Activate heating when the reference room's temperature runs lower than a threshold"
triggers:
  - trigger: template
    value_template: >-
      {{ (states('sensor.filtered_reference_room_temperature') | float) <  
      (state_attr('climate.thermostat_hc1', 'temperature') | float) -0.05 }}
    for:
      hours: 0
      minutes: 5
      seconds: 0
conditions:
  - condition: state
    entity_id: switch.boiler_heating_activated
    state: 'off'
    for:
      hours: 0
      minutes: 5
      seconds: 0
actions:
  - action: switch.turn_on
    target:
      entity_id:
        - switch.boiler_heating_activated
    data: {}
mode: single
```

Dies ist ein Beispieldiagramm, das die `Heating activated`-Entität und die Temperatur im Referenzraum mit einer Solltemperatur von
20,5 °C zeigt, die gegen Ende des dargestellten Zeitraums auf 20 °C geändert wurde. Wie Sie sehen können, beträgt die Temperaturabweichung trotz des einfachen Regelalgorithmus
etwa ±0,1 K, wobei die Heizung über lange Zeiträume ausgeschaltet war (zu anderen Zeiten sank die Abweichung auf etwa –0,25 K, erholte sich aber dennoch recht schnell. Ihre Ergebnisse können abweichen).

![image](https://github.com/user-attachments/assets/76cdbdcd-2010-493b-85f8-4253220888d9)

Der in der Automatisierung verwendete Taster ist ein einfacher Aqara-Zigbee-Taster.

:::info
Ich verwende ein [MH0-C40IN thermometer](https://pvvx.github.io/MHO_C401N/) in Kombination mit dem [pvvx firmware](https://github.com/pvvx/ATC_MiThermometer), da es eine Genauigkeit von zwei Stellen bietet und etwa ein- bis zweimal pro Minute aktualisiert wird.  
 Bitte beachten Sie, dass Thermometer mit geringer Auflösung und niedriger Aktualisierungsfrequenz Ihre Fähigkeit beeinträchtigen, schnell auf Temperaturänderungen zu reagieren.  
 Wenn Sie möchten, können Sie mit Tasmota und einem DS18B20- oder BME820-Sensor ein hochauflösendes, häufig aktualisiertes Thermometer bauen.
:::

## Optimierung für Wärmepumpen

Matthias hat seine Konfiguration der Bosch/Buderus-Wärmepumpe unter [his blog](https://bosch-buderus-wp.github.io/xps/matthias) dokumentiert und zeigt sogar, wie man mithilfe von KI ein MCP/LLM einrichten kann, um die Wärmepumpe zu steuern.
Weitere Details finden Sie unter [here](https://bosch-buderus-wp.github.io/docs/smarthome/ai).

Außerdem gibt es einen [metrics-page](https://bosch-buderus-wp.github.io/metrics/), in dem die Werte der Wärmepumpe gespeichert und visualisiert werden.
Wenn Sie möchten, klicken Sie auf [contribute, read this further information](https://bosch-buderus-wp.github.io/metrics/howto).

## Vorübergehende Sperrung des Busverkehrs mithilfe von `txpause`

_(by DiZil1)_ von https://github.com/emsesp/EMS-ESP32/discussions/1953#discussioncomment-15387910

„Um Ihnen einen Einblick zu geben, warum dies für mich so wichtig ist und nicht nur ein nettes Extra: Ich muss dies genau im Auge behalten, da A31-Fehler in meiner Konfiguration dazu neigen, sich im Laufe der Zeit zu kritischen, systemblockierenden Fehlern zu entwickeln, die schließlich zum Abschalten des Heizsystems führen.“

```yaml
# =========================
# EMS-ESP Package
# File: /config/packages/ems-esp.yaml
# =========================

rest_command:
  ems_tx_on:
    url: 'http://192.168.178.XX/api/system/txpause'
    method: POST
    headers:
      Authorization: !secret ems_esp_token
      Content-Type: application/json
    payload: >
      {
        "value": "on"
      }

  ems_tx_off:
    url: 'http://192.168.178.XX/api/system/txpause'
    method: POST
    headers:
      Authorization: !secret ems_esp_token
      Content-Type: application/json
    payload: >
      {
        "value": "off"
      }

sensor:
  - platform: rest
    name: 'EMS-ESP TXPause Raw'
    unique_id: ems_esp_txpause_raw
    resource: 'http://192.168.178.XX/api/system/system/txpause'
    method: GET
    headers:
      Authorization: !secret ems_esp_token
    scan_interval: 30
    timeout: 5
    value_template: >
      {{ value_json.value }}

template:
  - switch:
      - name: 'EMS-ESP TXPause'
        unique_id: ems_esp_txpause_switch
        icon: mdi:swap-horizontal
        state: >
          {% set v = states('sensor.ems_esp_txpause_raw') | lower %}
          {{ v in ['true', 'on', '1', 'yes'] }}
        turn_on:
          - service: rest_command.ems_tx_on
          - delay: '00:00:01'
          - service: homeassistant.update_entity
            target:
              entity_id: sensor.ems_esp_txpause_raw
        turn_off:
          - service: rest_command.ems_tx_off
          - delay: '00:00:01'
          - service: homeassistant.update_entity
            target:
              entity_id: sensor.ems_esp_txpause_raw
```
