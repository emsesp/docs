---
id: Thermostats
---

# Thermostate

Dies ist die aktuelle Liste der unterstützten Thermostate von Marken wie Buderus, Nefit, Sieger, Junkers und Bosch:

- TC100/Moduline Einfach Einfach
- EasyControl, CT200 Einfach
- WSW196i
- UI800/BC400
- Moduline 100, 200, 300, 400, 1000, 1010, 3000
- RC10, RC20, RC25, RC30, RC35, RC100, RC200, RC300, RC310, RC3
- RC100H
- RC20RF
- Fernbedienungen: RFM20, RT800, RC220, RC100H, TR120RF, CR20RF, Moduline 1010H
- CW100, CW400
- Sinn II
- HPC410
- Rego 2000, 3000
- Komfort RF CRF, Komfort+
- CR10, CRF200S, CRF200S, CR20RF, CR50, CR120
- UI800
- ES72, ES73, ES72, ES79
- FW100, FW120, FW200, FW500
- FR10, FR50, FR100, FR110, FR120
- FB10, FB100
- RT800
- TR120RF

:::note Diese Thermostate unterstützen leider keine direkten EMS-Schreibbefehle und erscheinen daher im EMS-ESP als Nur-Lese-Geräte:

    - Buderus Logamatic TC100, Bosch EasyControl CT200, Junkers CT100, Moduline Easy. Siehe [here](https://community.home-assistant.io/t/buderus-tc100-junkers-ct100-thermostat/67992)
    - Junkers FW/FR Baujahr vor 9/2008 (FD889). Siehe [here](https://github.com/emsesp/EMS-ESP32/issues/105#issuecomment-915874482)
    - Tado Thermostate
:::

## Geräte-Entitäten

:::warning Die tatsächlichen Thermostat-Befehle unten variieren je nach Thermostat-Marke und -Modell. Diese Liste ist auch nicht vollständig und kann sich von Version zu Version ändern.
:::

| Befehl | Daten | ID | Kommentare |
| - | - | - | - |
| `datetime` | `<ntp \| dd.mm.yyyy-hh:mm:ss-dw-dst>` | | RC35, RC100, RC300, `dw`:Tag der Woche: 0-mo,.. `dst`:Sommerzeit 0/1 |
| `wwmode` | `<off \| on \| auto>` | | RC100, RC300, RC30, RC35 |
| `wwsettemp` | `<degrees>` | | RC100, RC300 |
| `wwsettemplow` | `<degrees>` | | RC100, RC300 |
| `wwcircmode` | `<off \| on \| auto \| own>` | | RC30, RC35, RC100, RC300 |
| `wwcharge` | `<off \| on>` | | RC100, RC300 |
| `clockoffset` | `<seconds>` | | RC30 |
| `language` | `<n>` | | RC30 (0=de, 1=nl, 2=fr, 3=it) |
| `display` | `<n>` | | RC30 (0=int temp, 1= int set, 2=ext temp, 3=burner, 4=ww, 5=mode, 6=time, 7=date, 8=smoke) |
| `minexttemp` | `<degrees>` | | RC30, RC35, RC100, RC300 |
| `calinttemp` | `<degrees>` | | RC30, RC35 |
| `building` | `<light \| medium \| heavy>` | | RC30, RC35, RC100, RC300 |
| `temp` | `<degrees>` | Heizkreis | aktueller Sollwert je nach Modus |
| `mode` | `<auto \| night \| day \| nofrost \| heat \| eco>` | Heizkreislauf | |
| `manualtemp` | `<degrees>` | Heizkreis | RC100, RC300 |
| `ecotemp` | `<degrees>` | Heizkreislauf | RC100, RC300, Junkers |
| `heattemp` | `<degrees>` | Heizkreislauf | Junkers |
| `comforttemp` | `<degrees>` | Heizkreis | RC100, RC300 |
| `summermode` | `<winter \| auto \| summer>` | Heizkreis | RC100, RC300 |
| `summertemp` | `<degrees>` | Heizkreis | RC30, RC35, RC100, RC300 |
| `nighttemp` | `<degrees>` | Heizkreis | RC20, RC30, RC35 |
| `daytemp` | `<degrees>` | Heizkreis | RC20, RC30, RC35 |
| `daytemp2` | `<degrees>` | Heizkreis | RC20 |
| `daytemp3` | `<degrees>` | Heizkreis | RC20 |
| `daytemp4` | `<degrees>` | Heizkreis | RC20 |
| `nofrosttemp` | `<degrees>` | Heizkreislauf | RC30, RC35, RC100, RC300, Junkers |
| `remotetemp` | `<degrees>` | Heizkreis | RC30, RC35 |
| `control` | `<off \| RC20 \| RC3x>` | Heizkreis | RC30, RC35 (Raumsteuerung für hc) |
| `pause` | `<hours>` | Heizkreis | RC30, RC35 |
| `party` | `<hours>` | Heizkreis | RC30, RC35 |
| `holiday` | `<dd.mm.yyyy-dd.mm.yyyy \| dd.mm.yyyy+dd.mm.yyyy>` | Heizkreislauf | RC30, RC35, verwenden Sie `-` für 'außer Haus', `+` für 'zu Hause' |
| `designtemp` | `<degrees>` | Heizkreis | RC30, RC35, RC100, RC300 |
| `offsettemp` | `<degrees>` | Heizkreis | RC30, RC35, RC100, RC300 |
| `holidaytemp` | `<degrees>` | Heizkreis | RC30, RC35 |
| `roominfluence` | `<degrees>` | Heizkreis | RC30, RC35, RC100, RC300 |
| `minflowtemp` | `<degrees>` | Heizkreis | RC30, RC35, RC100, RC300 |
| `maxflowtemp` | `<degrees>` | Heizkreis | RC30, RC35, RC100, RC300 |
| `flowtempoffset` | `<degrees>` | Heizkreis | RC30, RC35 |
| `program` | `<0 - 10 \| 1 - 9 \| 1 - 2>` | Heizkreis | RC30, RC35, RC20, RC100, RC300 |
| `controlmode` | `<room \| outdoor>` | Heizkreis | RC30, RC35, RC100, RC300 |
| `reducemode` | `<nofrost \| reduce \| room \| outdoor>` | Heizkreis | RC30, RC35 |
| `roomtemp` | `<degrees>` | Heizkreis | nur v2.2: HA-Thermostat Raumtemperatur fälschen, `-1` zum Löschen verwenden |
| `switchtime` | `<nn.d.o.hh:mm>` | Heizkreis | nur v3: eines der Programme Schaltzeiten einstellen, nn=Nummer(00-42), d=Tag(0-6), o=ein(0,1), hh:mm=Zeit, d=7 oder o=7 löscht |
