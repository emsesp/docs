---
id: tips-and-tricks
title: Tips and Tricks
description: Community-contributed tips, tricks, and code snippets for advanced EMS-ESP usage and automation
---

# Tips en trucs

**Hieronder vind je een verzameling handige tips, trucs en code die door de community zijn ingezonden:**

## De verwarming van de ketel regelen

_(by Oderik)_

In een heel eenvoudige opstelling voorziet een ketel één verwarmingscircuit van warmte. Als `heating activated` gelijk is aan `on`, houdt de ketel de `selected flow temperature` op peil door de brander en de warmtepomp te regelen.

Zodra de `current flow temperature` de `selected flow temperature` + `temperature hysteresis off` overschrijdt, wordt de verwarming uitgeschakeld totdat de `current flow temperature` onder de `selected flow temperature` + `temperature hysteresis on` daalt (wat doorgaans een negatieve waarde is).

Om de verwarming in te schakelen, moet u dus `heatingactivated` instellen op `on` en een geschikte waarde voor `flowtemp` instellen. Deze laatste moet worden afgeleid van de `heating temperature setting`, die kan worden ingesteld met behulp van de fysieke dial/control op de ketel. Deze waarde moet worden beschouwd als de maximale aanvoertemperatuur. U kunt ook een lagere aanvoertemperatuur gebruiken om een constante kamertemperatuur te handhaven zodra de initiële opwarming is voltooid.

Aanvullende informatie van Michael:

Je kunt de aanvoertemperatuur met EMS-ESP rechtstreeks op de ketel instellen zonder een thermostaat te gebruiken. Veel gebruikers doen dit. Enkele tips:

- de flowtemp-waarde op het bedieningspaneel moet hoger worden ingesteld, aangezien de via de EMS-bus verzonden temperatuur alleen wordt geaccepteerd als deze een lagere waarde heeft
- je moet minstens elke minuut een waarde doorgeven om de aanvoertemperatuur op peil te houden; anders schakelt de ketel automatisch terug naar het hogere instelpunt dat via het bedieningspaneel is ingesteld.
- Er is een speciale EMS-ESP-entiteit met de naam `forceheatingoff` die de flowtemp-waarde elke minuut automatisch op 0 zet voor de boiler. Andere gebruikers geven er de voorkeur aan om in plaats daarvan een on/off-regelaar te gebruiken.

De boiler ‘OneTime’ werkt volgens een speciale logica. Hij vult de boiler niet bij op verzoek, zoals de meeste mensen verwachten. Hij controleert de huidige temperatuur en vult de boiler alleen bij als deze buiten het instelpuntbereik valt (instelpunt-hysterese). Als de warmwatervoorziening is ingesteld op automatisch bijvullen, werkt dit nooit; het werkt alleen in de warmwater-eco-modus en bij een lage warmwateropslagtemperatuur. Om alleen bij te vullen, moet u de bijvulfunctie van de thermostaat gebruiken. Daarmee wordt het instelpunt voor warm water tijdelijk op een hogere waarde ingesteld, zodat de ketel een bijvulcyclus start, waarna het instelpunt weer wordt teruggezet naar de oude waarde.

## Gegevens ophalen via REST met PHP

_(by flohse123)_

```php
<?php
$ch = curl_init("http://<myIP>/api?device=thermostat&cmd=info");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer <your Read API key>"]);
curl_exec($ch);
curl_close($ch);
?>
```

## De aanvoertemperatuur aanpassen naargelang er verwarming of warm water wordt verwarmd

_(by IanC)_

In het Discord-bericht zei IanC:

_"Met een Worcester Bosch-ketel uit circa 2012 wordt de verwarming van het huis geregeld door een EvoHome-systeem dat weet welke delen van het huis hoeveel warmte nodig hebben, maar het kan alleen een on/off-relais gebruiken om de ketel aan te sturen voor ruimteverwarming en warmwatervoorziening. Dit betekent dat het de aanvoertemperatuur niet rechtstreeks kan regelen, en in het verleden werd deze via een draaiknop aan de voorkant van de ketel continu ingesteld op 65 °C om waterverwarming mogelijk te maken wanneer dat nodig was. Ik ben erg blij dat ik EMS-ESP aan mijn systeem heb toegevoegd om de aanvoertemperaturen te helpen beheren. Ik heb een eenvoudig C-programma geschreven dat op mijn OpenWrt-internetrouter draait en dat EvoHome-berichten afluistert om nuttige informatie over de benodigde hoeveelheid warmte voor ruimteverwarming en warm water vast te leggen in eenvoudige txt-bestanden in /tmp.. Vervolgens plan ik elke 4 minuten een shellscript in dat in een paar stappen een aanvoertemperatuur selecteert : begin met een weersgecompenseerde waarde op basis van de buitentemperatuur van een online dienst; pas deze naar boven of beneden aan met maximaal 25% op basis van de EvoHome-vraag naar ruimteverwarming; overschrijf dit indien nodig om warm water te verwarmen. De geselecteerde aanvoertemperatuur en een maximaal branderniveau worden vervolgens via curl verzonden naar een BBQKees-apparaat waarop EMS-ESP draait, dat op zijn beurt de ketel aanstuurt. Tot nu toe lijkt het te werken zoals bedoeld, zonder dat dit ten koste gaat van het wooncomfort, maar met veel lagere aanvoertemperaturen om de ketel aan te moedigen in de condensatiezone te werken. Het is erg moeilijk te zeggen of dit invloed heeft op het gasverbruik – wat ik wel graag zou willen :-). De grootste uitdaging die ik nog zie, is hoe ik kan voorkomen dat EvoHome frequente on/off-cycli van de ketel veroorzaakt terwijl het nog steeds probeert gebruik te maken van TPI-aansturing van de aanvoertemperatuur."_

![1.5.0](/media/examples/ian_setflowtemp.png)

De algoritmen voor temperatuurcompensatie staan in het shellscript:

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

## Home Assistant-sensorsjabloon voor alle statusnummers op een GB192-ketel

(door tefracky van [this comment](https://github.com/emsesp/EMS-ESP32/issues/938#issuecomment-1417592878))

Hier is de sensor in het nieuwe Home-Assistant-sjabloonformaat voor alle statusnummers van de Buderus GB192i-19 in het Duits:

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

## Een aangepaste Climate-component gebruiken in Home Assistant

_(by elRadix)_ van [this comment](https://github.com/emsesp/EMS-ESP32/discussions/790#discussioncomment-4895520)

In dit voorbeeld worden twee klimaatentiteiten voor warm water ingesteld, inclusief hun modus en verwarmingsklimaat, met behulp van een aangepaste HACS-kaart in HA met de naam [simple thermostat](https://github.com/nervetattoo/simple-thermostat), bijvoorbeeld:

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

## Het on/off van de warmtepomp automatiseren in Home Assistant

`waengr` heeft op ons Discord-kanaal een [message](https://discord.com/channels/816637840644505620/816958041345884180/1287897271148609566) geplaatst over hoe je een eenvoudige schakelaar kunt automatiseren om de warmtepomp in en uit te schakelen. Hij verwijst naar GitHub-issues [1600](https://github.com/emsesp/EMS-ESP32/discussions/1600) en [1717](https://github.com/emsesp/EMS-ESP32/issues/1717).

Volgens zijn eigen woorden heeft hij het volgende gedaan:

"Ik heb de binaire invoerreeks geanalyseerd zoals voorgesteld; deze werd door EMS-ESP geleverd in `text.boiler_hpin1opt`, zoals weergegeven in Home Assistant. Ik heb de schakelaars op de gebruikersinterface van de pomp omgezet en gekeken hoe de string veranderde. Vervolgens heb ik de string handmatig gewijzigd in Home Assistant en gekeken hoe de gebruikersinterface van de pomp veranderde. Bidirectionele communicatie is dus mogelijk!

Ik heb nog niet alle opties uitgeprobeerd, maar hier zijn alvast een paar opmerkingen:

- Ik dacht dat ik slim was door vooruit te denken, dus toen ik "Kompressorbetr. sperren" (compressorblokkering) selecteerde, heb ik ook "Zuheizerbetr. sperren" (hulpverwarming blokkeren) geselecteerd. MAAR – ik meen het echt – ALLEEN de bijverwarming ging aan en verspilde veel stroom (in ieder geval een paar minuten lang).
- Met „Heizbetrieb sperren“ (verwarmingsmodus uitschakelen) wordt ook de circulatiepomp uitgeschakeld, en dat is niet wat ik wil, aangezien ik een buffertank van 500 liter heb.
- "EVU-Sperrzeit 1" (blokkeertijd 1 van het energiebedrijf) werkt tot nu toe prima (waar dienen de andere EVU-Sperrzeiten dan voor?)

Vervolgens was het aan de beurt om de reeks met automatiseringen aan te passen.

Voorlopig houd ik het bij vaste tijden: een verwarmingsperiode ’s nachts, wanneer het dagtarief geldt, en vervolgens nog een rond het middaguur, wanneer ik mogelijk wat overtollige PV-stroom heb. Later kan ik nog wat experimenteren om het systeem af te stemmen op de daadwerkelijke PV-productie. Ik pas alleen het eerste deel aan, namelijk het omkeren van de altijd uitgeschakelde ingang „Eingang invertiert“ (ingangsomkering), zoals voorgesteld. Het tweede deel is „EVU-Sperrzeit 1“.

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

Dit is mijn dashboard in Home Assistant, dat nog in ontwikkeling is:

![Dashboard](/media/screenshot/PV_HA_dash.png)

- links: `text.boiler_hpin1opt` en de hierboven genoemde automatiseringen om dit in te stellen op "aan" en "uit".
- rechtsboven: een handgetekend schema waarin ik probeer een aantal van de meer dan 200 waarden uit EMS-ESP in kaart te brengen.
- rechtsonder: de waarden boven de 200.

Vervolgens gaat hij onderzoeken hoe hij een duidelijke vermogensmeting (in W) kan krijgen van het vermogen dat de warmtepomp op dit moment verbruikt.

## Eenvoudige trigger voor extra warmwaterkosten in Home Assistant

_(by oliof)_

Hier volgt een eenvoudige automatisering waarmee je extra warm water kunt in- of uitschakelen door te dubbelklikken op een Zigbee-knop. Deze trigger kan desgewenst eenvoudig worden vervangen door een spraakopdracht of een gescande QR-code.

![image](https://github.com/user-attachments/assets/da3795fd-5bba-411c-a533-49fe5efc70c3)

## Optimalisatie bij lage belasting van een Buderus GB172-gasketel

_(by oliof with additional input by tz)_

Wanneer u begint met het afstellen van uw ketel, zult u hoogstwaarschijnlijk te maken krijgen met situaties waarin de ketel te veel warmte produceert,
zelfs op de laagste modulatiesnelheid. In die gevallen kan het de moeite waard zijn om een extra regelingsschema te overwegen dat
de ketel voor enige tijd uitschakelt wanneer de streeftemperatuur is bereikt. Hier volgt een mogelijke implementatie die
in feite een tweepuntsregelaar is. Door de thermische traagheid zullen de schakelingen bij de meeste verwarmingssystemen redelijk ver uit elkaar liggen zonder extra vertraging
of tijdslimieten, maar deze kun je eenvoudig toevoegen als je het aantal inschakelmomenten wilt verminderen.

Deze optimalisatie bij lage belasting kan het gasverbruik met 15-20% verminderen, zonder dat dit noemenswaardige gevolgen heeft voor het temperatuurcomfort.

### Vereisten

- Een thermometer met hoge resolutie en frequente bijwerking.
- Deze thermometer instellen als een [Remote Thermostat](https://emsesp.org/Special-Functions/#remote-thermostats).
- Een verwarmingsketel waarbij het instellen van `Heating Activated` op `off` de verwarming daadwerkelijk uitschakelt. Dit lijkt te gelden voor gasketels, maar zal hoogstwaarschijnlijk
  niet werken bij warmtepompen. Gebruik in dat geval de entiteit `forceheatingoff`.

### Afgeleide sensoren en automatiseringen

Een van de nadelen van een thermometer met hoge resolutie is dat er enige ruis in de temperatuurmetingen zit. Je kunt een filter gebruiken
om een vloeiende curve te krijgen (met enige vertraging). Bijvoorbeeld (fragment uit de `configuration.yaml` van HomeAssistant):

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

In de onderstaande afbeelding zie je de ruwe temperaturen met ruis en de gefilterde temperatuur. Pas indien gewenst de `lowpass`-filter `time_constant` en de `simple_moving_average`-filter `window_size` aan om de curve zo goed mogelijk te laten aansluiten.

![image](https://github.com/user-attachments/assets/cfe1cf9c-d825-4693-80ce-28e8684b9ecf)

Met de gefilterde sensor is het nu mogelijk om automatiseringen in te stellen waarmee de verwarming wordt in- en uitgeschakeld zodra de referentiekamertemperatuur een drempelwaarde overschrijdt. Het `temperature`-attribuut van de thermostaat wordt als drempelwaarde gebruikt, zodat je de streeftemperatuur nog steeds op de gebruikelijke manier kunt aanpassen.

Vanaf HA 2025.01 kunnen bij de numerieke trigger van Home Assistant alleen waarden met enkele precisie als trigger worden gebruikt. Omdat we onze tweepuntsregeling dichter bij het instelpunt willen houden, gebruiken we een aangepaste sjabloontrigger:

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

Houd er rekening mee dat we de verwarming iets onder de ingestelde temperatuur uitschakelen, zodat we daar niet te ver boven uitkomen.
De `-0.02`-waarde moet waarschijnlijk worden aangepast aan uw verwarmingssysteem en voorkeuren. Met de gefilterde sensor hebben we het
`for:`-blok misschien niet strikt nodig, maar het is een extra veiligheidsmaatregel om daar iets in te hebben. Er is een extra vertraging van 5
minuten voordat het systeem in werking treedt, om schommelingen te voorkomen. Pas dit indien nodig aan voor uw systeem (dit is mogelijk niet nodig bij de
gefilterde referentietemperatuur).

De automatisering om de verwarming weer in te schakelen volgt hetzelfde patroon (met een andere aanpassingsfactor van `-0.05`, die je
naar eigen behoefte moet aanpassen):

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

Dit is een voorbeeldgrafiek waarin de `Heating activated`-entiteit en de temperatuur in de referentieruimte worden weergegeven, met een streeftemperatuur van
20,5 °C, die tegen het einde van de weergegeven periode is aangepast naar 20 °C. Zoals u kunt zien, bedraagt de temperatuurafwijking, ondanks het primitieve regelalgoritme,
ongeveer ±0,1 K, waarbij het verwarmingssysteem gedurende lange perioden uitgeschakeld was (op andere momenten daalde de afwijking tot ongeveer -0,25 K, maar herstelde zich nog steeds vrij snel. YMMV).

![image](https://github.com/user-attachments/assets/76cdbdcd-2010-493b-85f8-4253220888d9)

De knop die in de automatisering wordt gebruikt, is een eenvoudige Aqara Zigbee-knop.

:::info
Ik gebruik een [MH0-C40IN thermometer](https://pvvx.github.io/MHO_C401N/) in combinatie met de [pvvx firmware](https://github.com/pvvx/ATC_MiThermometer), omdat deze een nauwkeurigheid van twee cijfers biedt en ongeveer één tot twee keer per minuut wordt bijgewerkt.  
 Houd er rekening mee dat thermometers met een lage resolutie en een lage bijwerkfrequentie uw vermogen om snel op temperatuurveranderingen te reageren, zullen beïnvloeden.  
 Als u dat wilt, kunt u met Tasmota en een DS18B20- of BME820-sensor een thermometer met hoge resolutie bouwen die regelmatig wordt bijgewerkt.
:::

## Optimaliseren voor warmtepompen

Matthias heeft zijn installatie van de Bosch/Buderus-warmtepomp op [his blog](https://bosch-buderus-wp.github.io/xps/matthias) gedocumenteerd en laat zelfs zien hoe je met behulp van AI een MCP/LLM kunt instellen om de warmtepomp aan te sturen.
Zie [here](https://bosch-buderus-wp.github.io/docs/smarthome/ai) voor meer informatie.

Er is ook een [metrics-page](https://bosch-buderus-wp.github.io/metrics/) waar de waarden van de warmtepomp worden opgeslagen en weergegeven.
Als je wilt, kun je [contribute, read this further information](https://bosch-buderus-wp.github.io/metrics/howto).

## `txpause` gebruiken om het busverkeer tijdelijk uit te schakelen

_(by DiZil1)_ van https://github.com/emsesp/EMS-ESP32/discussions/1953#discussioncomment-15387910

"Om je wat achtergrondinformatie te geven over waarom dit voor mij zo belangrijk is en niet zomaar een leuke extra: ik moet dit nauwlettend in de gaten houden, omdat A31-fouten in mijn opstelling na verloop van tijd vaak escaleren tot kritieke, blokkerende fouten, waardoor het verwarmingssysteem uiteindelijk wordt uitgeschakeld."

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
