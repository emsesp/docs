---
id: tips-and-tricks
---

# Tips en trucs

**Hieronder vindt u een verzameling nuttige tips, trucs en code die door de community zijn ingezonden:**

## Verwarming van de ketel regelen

_(by Oderik)_

In een heel eenvoudige opstelling levert een ketel warmte aan één verwarmingscircuit. Als `heating activated` `on` is, handhaaft de ketel de `selected flow temperature` door de brander en de warmtepomp te regelen.

Zodra de `current flow temperature` de `selected flow temperature` + `temperature hysteresis off` overschrijdt, stopt de verwarming totdat de `current flow temperature` onder de `selected flow temperature` + `temperature hysteresis on` komt (wat meestal een negatieve waarde is).

Om de verwarming te activeren moet je dus `heatingactivated` instellen op `on` en een geschikte `flowtemp` instellen. Deze laatste moet worden afgeleid van de `heating temperature setting` die kan worden ingesteld met de fysieke dial/control op de ketel. Deze moet worden beschouwd als de maximale aanvoertemperatuur. Je kunt ook een lagere aanvoertemperatuur gebruiken om de kamertemperatuur constant te houden als de eerste verwarming klaar is.

Aanvullende informatie van Michael:

Je kunt de flowtemp met EMS-ESP direct op de ketel instellen zonder een thermostaat te gebruiken. Veel gebruikers doen dit. Enkele tips:

- de flowtemp-waarde op het bedieningspaneel moet hoger worden ingesteld omdat de temperatuur die via de EMS-bus wordt verzonden alleen wordt geaccepteerd als deze een lagere waarde heeft
- je moet minstens elke minuut een waarde sturen om de flowtemp te handhaven, anders valt de ketel automatisch terug naar het hogere setpoint van het bedieningspaneel.
- Er is een speciale EMS-ESP-entiteit genaamd `forceheatingoff` die de flowtemp-waarde elke minuut automatisch op 0 zet voor de ketel. Andere gebruikers gebruiken liever een on/off regelaar.

De boiler heeft een speciale logica. Hij laadt niet bij op afroep zoals de meeste mensen verwachten. Hij controleert de huidige temperatuur en laadt alleen bij als deze buiten het instelbereik ligt (instelpunt-hysterese). Als dhw is ingesteld op automatisch opladen, zal het nooit werken, alleen in de dhw eco-modus en lage dhw opslagtemperatuur. Voor gewoon bijladen moet je de thermostaat-laadfunctie gebruiken. Die zet het dhw setpoint tijdelijk op een hogere waarde, zodat de ketel een herlading activeert, en dan terug naar het oude setpoint.

## Gegevens ophalen via REST met PHP

_(by flohse123)_

```php
<?php
$ch = curl_init("http://<myIP>/api?device=thermostat&cmd=info");
curl_exec($ch);
curl_close($ch);
?>
```

## De aanvoertemperatuur aanpassen op basis van het feit of CH of DHW wordt verwarmd

_(by IanC)_

Uit de Discord post die IanC zei:

met een Worcester Bosch ketel uit ~2012 wordt de verwarming van het huis geregeld door een EvoHome systeem dat weet welke delen van het huis hoeveel warmte nodig hebben, maar het kan alleen een on/off relais gebruiken om de ketel te regelen voor ruimte- en waterverwarming. Dit betekent dat het de aanvoertemperatuur niet rechtstreeks kan regelen en deze is in het verleden ingesteld op continu 65C via de draaiknop aan de voorkant van de ketel om waterverwarming mogelijk te maken wanneer dat nodig is. Ik ben erg blij dat ik EMS-ESP aan mijn systeem heb toegevoegd om de aanvoertemperatuur te regelen. Ik heb een eenvoudig C-programma geschreven dat op mijn OpenWrt internetrouter draait en dat EvoHome-berichten afluistert om nuttige informatie over de benodigde hoeveelheid warmte voor ruimte en water op te slaan in eenvoudige txt-bestanden in /tmp.. Vervolgens plan ik elke 4 minuten een shellscript dat een aantal stappen gebruikt om een aanvoertemperatuur te selecteren: begin met een voor het weer gecompenseerde waarde op basis van de buitentemperatuur van de online service; pas deze aan met maximaal 25% naar boven of beneden op basis van de vraag naar ruimteverwarming van EvoHome; indien nodig overschrijf ik deze waarde om warm water te verwarmen. De geselecteerde aanvoertemperatuur en een maximaal branderniveau worden vervolgens via krul naar een BBQKees-apparaat gestuurd waarop EMS-ESP draait, dat op zijn beurt de ketel regelt. Tot nu toe lijkt het te werken zoals bedoeld zonder verlies van comfort in huis, maar met veel lagere aanvoertemperaturen die worden waargenomen om te proberen de ketel te laten werken in de condensatiezone.  Het is erg moeilijk om te zeggen of het invloed heeft op het gasverbruik - wat ik graag zou willen :-). De grootste uitdaging die ik nog steeds zie, is hoe ik kan voorkomen dat EvoHome frequente on/off cycli van de ketel veroorzaakt terwijl het nog steeds probeert om TPI debietregeling te gebruiken

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

## Home Assistant sensorsjabloon voor alle statusnummers van een GB192-ketel

(door tefracky van [this comment](https://github.com/emsesp/EMS-ESP32/issues/938#issuecomment-1417592878)

Hier is de sensor in het nieuwe Home-Assistant sjabloonformaat voor alle statusnummers voor de Buderus GB192i-19 in het Duits:

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

## Een aangepast klimaatcomponent gebruiken in Home Assistant

_(by elRadix)_ van [this comment](https://github.com/emsesp/EMS-ESP32/discussions/790#discussioncomment-4895520)

Dit voorbeeld stelt 2 klimaatentiteiten in voor dhw met hun modus en verwarmingsklimaat met behulp van een aangepaste HACS-kaart in HA genaamd [simple thermostat](https://github.com/nervetattoo/simple-thermostat) zoals:

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
      temperature_command_topic: 'ems-esp/boiler/wwseltemp'
      temperature_command_template: >
        {{ '{"cmd":"wwseltemp ","data":'}}
        {{ value }}
        {{ '}'}}
      current_temperature_template: '{{ value_json.wwcurtemp }}'
      temperature_state_template: '{{ value_json.wwseltemp }}'
      mode_state_template: "{% if value_json.wwactivated == 'off' %} off {% else %} heat {% endif %}"
      mode_state_topic: 'ems-esp/boiler_data_ww'
      mode_command_topic: 'ems-esp/boiler/wwactivated'
      mode_command_template: >
        {{ '{"cmd":"wwactivated","data":"'}}
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
      fan_mode_state_template: '{{ value_json.wwcomfort }}'
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

## De on/off van de warmtepomp automatiseren in Home Assistant

`waengr` op ons Discord-kanaal postte een [message](https://discord.com/channels/816637840644505620/816958041345884180/1287897271148609566) over het automatiseren van een eenvoudige schakelaar om de warmtepomp in en uit te schakelen. Hij verwijst naar GitHub kwesties [1600](https://github.com/emsesp/EMS-ESP32/discussions/1600) en [1717](https://github.com/emsesp/EMS-ESP32/issues/1717).

In zijn eigen woorden, dit is wat hij deed:

"Ik analyseerde de binaire invoerstring zoals voorgesteld, die door EMS-ESP werd geleverd in `text.boiler_hpin1opt` zoals weergegeven in de Home Assistant. Ik veranderde de toggles op de UI van de pomp en zag de string veranderen. Daarna veranderde ik handmatig de string in de Home Assistant en zag de UI van de pomp veranderen. Tweerichtingscommunicatie is dus mogelijk!

Ik heb nog niet alle opties geprobeerd, maar hier zijn een paar opmerkingen:

- Ik dacht dat ik slim was door vooruit te denken, dus bij het selecteren van "Kompressorbetr. sperren" (compressorwerking blokkeren) heb ik ook "Zuheizerbetr. sperren" (hulpverwarming blokkeren) geselecteerd. Maar - ik maak geen grapje - ALLEEN de bijverwarming ging aan en verspilde een hoop stroom (in ieder geval voor een paar minuten).
- "Heizbetrieb sperren" (blokverwarming) schakelt ook de circulatiepomp uit, wat ik niet wil omdat ik een buffervat van 500 liter heb.
- "EVU-Sperrzeit 1" (bloktijd 1 van het energiebedrijf) werkt tot nu toe goed (waar zijn de andere EVU-Sperrzeit voor?)

De volgende stap was het veranderen van de string met automatiseringen.

Voorlopig ga ik uit van vaste tijden: Een verwarmingsperiode tijdens de nacht wanneer we laag tarief hebben en dan nog een rond de middag wanneer ik misschien wat overtollig PV-vermogen heb. Later kan ik het koppelen aan de werkelijke PV-productie. Ik verander alleen de eerste bit, die is om de altijd uitgeschakelde ingang "Eingang invertiert" (ingang omkeren) om te keren, zoals voorgesteld. De tweede bit is "EVU-Sperrzeit 1".

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

Hier is mijn work-in-progress dashboard in Home Assistant:

![Dashboard](/media/screenshot/PV_HA_dash.png)

- links: `text.boiler_hpin1opt` en de bovenstaande automatiseringen om het te veranderen in "aan" en "uit".
- rechtsboven: een handgetekend schema waarin ik een aantal van de meer dan 200 waarden uit EMS-ESP in kaart probeer te brengen.
- rechtsonder: de 200+ waarden.

Het volgende dat hij onderzoekt is hoe hij een duidelijke vermogensmeting (in W) kan krijgen van hoeveel stroom de warmtepomp op dit moment gebruikt.

## Eenvoudige trigger voor extra warm water in Home Assistant

_(by oliof)_

Hier is een eenvoudige automatisering die extra warm water inschakelt door te dubbelklikken op een knop op basis van Zigbee. Deze trigger kan desgewenst eenvoudig worden vervangen door een spraakcommando of een gescande QR-code.

![image](https://github.com/user-attachments/assets/da3795fd-5bba-411c-a533-49fe5efc70c3)

## Laaglastoptimalisatie van een Buderus GB172 gasketel

_(by oliof with additional input by tz)_

Als je begint met het afstellen van je ketel, zul je waarschijnlijk situaties krijgen waarbij de ketel zelfs bij de laagste modulatiestand te veel warmte produceert. In die gevallen kan het de moeite waard zijn om een extra regeling te overwegen die de ketel enige tijd uitschakelt als de gewenste temperatuur is bereikt. Hier is een mogelijke implementatie die in principe een tweepuntsregeling is. Thermische traagheid zal de schakelingen redelijk ver uit elkaar houden zonder extra vertraging of tijdslimieten op de meeste verwarmingssystemen, maar het is eenvoudig om deze toe te voegen als u het aantal inschakelingen wilt verminderen.

Deze optimalisatie bij lage belasting kan het gasverbruik met 15-20% verminderen met weinig verandering in het temperatuurcomfort.

### Vereisten

- Een thermometer die met hoge resolutie en hoge frequentie werkt.
- Deze thermometer instellen als een [Remote Thermostat](https://emsesp.org/Special-Functions/#remote-thermostats).
- Een ketel waarbij het instellen van `Heating Activated` op `off` het verwarmen feitelijk uitschakelt. Dit lijkt te gelden voor gasketels, maar zal waarschijnlijk niet werken voor warmtepompen. Maak in dat geval gebruik van de entiteit `forceheatingoff`.

### Afgeleide sensoren en automatiseringen

Een van de nadelen van een thermometer met hoge resolutie is dat er wat ruis op de temperatuurmetingen zit. Je kunt een filter gebruiken om een vloeiende curve te krijgen (met enige vertraging). Bijvoorbeeld (uittreksel uit `configuration.yaml` van HomeAssistant):

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

In de volgende afbeelding zie je de ruisende ruwe temperaturen en de gefilterde temperaturen. Pas de `lowpass` `time_constant` van het `lowpass` filter en de `simple_moving_average` `window_size` van het `window_size` filter aan om de curve desgewenst dichter te laten aansluiten.

![image](https://github.com/user-attachments/assets/cfe1cf9c-d825-4693-80ce-28e8684b9ecf)

Met de gefilterde sensor is het nu mogelijk om de automatiseringen zo in te stellen dat de verwarming wordt uit- en ingeschakeld als de referentietemperatuur van de kamer een drempel passeert. Het `temperature` attribuut van de thermostaat wordt gebruikt als drempelwaarde, zodat je de doeltemperatuur nog steeds op de gebruikelijke manier kunt aanpassen.

Vanaf HA 2025.01 is het met de numerieke trigger van de Home Assistant alleen mogelijk om waarden met enkele precisie te triggeren. Omdat we onze tweepuntsregeling dichter bij het instelpunt willen houden, gebruiken we een aangepaste sjabloontrigger:

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

Houd er rekening mee dat we de verwarming een klein beetje onder de ingestelde temperatuur uitschakelen, zodat we er niet te veel boven afwijken. De `-0.02`-waarde moet waarschijnlijk worden afgestemd op je verwarmingssysteem en voorkeuren. Met de gefilterde sensor hebben we het `for:`-blok misschien niet strikt nodig, maar het is nog een kleine veiligheid om er iets in te hebben. Er is een extra vertraging van 5 minuten voor de activering om bouncing te voorkomen. Pas aan indien nodig voor je systeem (mogelijk niet nodig met de gefilterde referentietemperatuur).

De automatisering om de verwarming weer te activeren volgt hetzelfde patroon (met een andere fudgefactor van `-0.05` die je naar behoefte moet aanpassen):

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

Dit is een voorbeeldgrafiek met de entiteit `Heating activated` en de temperatuur van de referentieruimte met een doeltemperatuur van 20,5°C, gewijzigd in 20°C tegen het einde van de weergegeven tijdsperiode. Zoals u kunt zien, ondanks het primitieve regelalgoritme, is de temperatuurafwijking ruwweg +-0,1K met lange perioden waarin het verwarmingssysteem uit is (op andere momenten daalde de afwijking tot ruwweg -0,25K, maar herstelde zich nog steeds vrij snel. YMMV).

![image](https://github.com/user-attachments/assets/76cdbdcd-2010-493b-85f8-4253220888d9)

De knop die wordt gebruikt in de automatisering is een eenvoudige Aqara zigbee-knop.

:::info Ik gebruik een [MH0-C40IN thermometer](https://pvvx.github.io/MHO_C401N/) met de [pvvx firmware](https://github.com/pvvx/ATC_MiThermometer), omdat deze twee cijfers precisie biedt en ruwweg één tot twee keer per minuut wordt bijgewerkt.)  
    Houd er rekening mee dat thermometers met een lage resolutie en een lage updatefrequentie invloed hebben op je vermogen om snel te reageren op temperatuurveranderingen.  
    Als je wilt, kun je met tasmota en een DS18B20 of BME820 sensor een hoge resolutie thermometer bouwen die regelmatig wordt bijgewerkt.
:::

## Optimaliseren voor warmtepompen

Matthias heeft zijn Bosch/Buderus warmtepomp op [his blog](https://bosch-buderus-wp.github.io/xps/matthias) gedocumenteerd en laat zelfs zien hoe je AI kunt gebruiken om een MCP/LLM in te stellen om de warmtepomp te regelen. Zie [here](https://bosch-buderus-wp.github.io/docs/smarthome/ai) voor meer details.


`txpause` gebruiken om het busverkeer tijdelijk uit te schakelen

_(by DiZil1)_ van https://github.com/emsesp/EMS-ESP32/discussions/1953#discussiegesprek-15387910

"Om je wat context te geven waarom dit zo belangrijk voor me is en niet alleen leuk om te hebben. Ik moet dit nauwlettend in de gaten houden omdat, in mijn opstelling, A31 fouten de neiging hebben om na verloop van tijd te escaleren tot kritieke blokkeringsfouten, waardoor uiteindelijk het verwarmingssysteem wordt uitgeschakeld."

```yaml
# =========================
# EMS-ESP Package
# File: /config/packages/ems-esp.yaml
# =========================

rest_command:
  ems_tx_on:
    url: "http://192.168.178.XX/api/system/txpause"
    method: POST
    headers:
      Authorization: !secret ems_esp_token
      Content-Type: application/json
    payload: >
        {
          "value": "on"
        }

  ems_tx_off:
    url: "http://192.168.178.XX/api/system/txpause"
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
    name: "EMS-ESP TXPause Raw"
    unique_id: ems_esp_txpause_raw
    resource: "http://192.168.178.XX/api/system/system/txpause"
    method: GET
    headers:
      Authorization: !secret ems_esp_token
    scan_interval: 30
    timeout: 5
    value_template: >
      {{ value_json.value }}

template:
  - switch:
      - name: "EMS-ESP TXPause"
        unique_id: ems_esp_txpause_switch
        icon: mdi:swap-horizontal
        state: >
          {% set v = states('sensor.ems_esp_txpause_raw') | lower %}
          {{ v in ['true', 'on', '1', 'yes'] }}
        turn_on:
          - service: rest_command.ems_tx_on
          - delay: "00:00:01"
          - service: homeassistant.update_entity
            target:
              entity_id: sensor.ems_esp_txpause_raw
        turn_off:
          - service: rest_command.ems_tx_off
          - delay: "00:00:01"
          - service: homeassistant.update_entity
            target:
              entity_id: sensor.ems_esp_txpause_raw
```
