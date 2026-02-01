---
id: Boilers
title: Supported Boilers
description: Complete list of supported boiler models from Bosch, Buderus, Nefit, Junkers, Sieger, and Worcester brands
---

# Kessel

Dies ist die aktuelle Liste der unterstützten Heizkessel von Marken wie Buderus, Nefit, Sieger, Junkers und Bosch:

- BK13, BK15
- GB125, GB135, GB1x2i, GB162, GBx72, GB212, GB162, GB192, GB122, GB192i.2
- MC10
- Kaskade CM10, MC400
- Logano
- Logamax Plus GB022, U122
- Logamatic MC10, MC110
- Kondensatoren 2500, GC9000
- Bosch/Junkers Cerapur GC2200W
- Logomatic
- Bosch/Junkers Cerapur-Oberteil, Aero
- Bosch/Junkers Cerapur ZSB 14-3 A
- Greenstar Si, 30Ri Kompakt, ErP, HIU, 8000
- Nefit Topline, Trendline
- Kaskade MCM10
- Nefit Proline
- Nefit Smartline
- GC7000F, GC700iW, GC9800IW
- KB195i
- Hybride Wärmepumpe
- Enviline
- Komprimieren 6000AW
- Hybrid 3000-7000iAW
- SupraEco
- WLW196i, WSW196i
- Kondensatoren 2300, 5000i
- Ecomline Ausgezeichnet
- EasyControl-Adapter

## Geräte-Entitäten mit Befehlen

:::info Die nachstehenden Kesselbefehle variieren je nach Kessel type/brand und Systemkonfiguration. Einige Befehle funktionieren nicht, weil sie vom Regler oder Thermostat überschrieben werden. In diesem Fall gibt es Thermostatbefehle für diese Einstellung.
:::

:::warning diese Liste ist nicht vollständig und kann sich von Version zu Version ändern
:::

| `command` | `data` | `id` | `comments` |
| ------------------ | ------------------------------------------- | --- | ---------------------------------------------------------------------------------- |
| `comfort` | `<hot \|eco \| intelligent>` | | |
| `flowtemp` | `<degrees>` | | Begrenzt auf Heiztemperatur, eingestellt durch Thermostat, falls vorhanden |
| `wwsettemp` | `<degrees>` | Nur wenn der Thermostat es nicht schafft |
| `boilhyston` | `<degrees>` | | Brenner unterhalb der Vorlauftemperatur starten (negativer Wert), erlaubter Bereich hängt vom Kesseltyp ab |
| `boilhystoff` | `<degrees>` | | Brenner oberhalb der Vorlauftemperatur stoppen (positiver Wert), erlaubter Bereich hängt vom Kesseltyp ab |
| `burnperiod` | `<minutes>` | | |
| `burnminpower` | `<%>` | | Nur für modulierte Brenner änderbar |
| `burnmaxpower` | `<%>` | | Nur für modulierte Brenner änderbar |
| `pumpdelay` | `<minutes>` | | |
| `wwactivated` | `<off \| on>` | | |
| `wwtapactivated` | `<off \| on>` | | Sonderfunktion im Kesseltestmodus |
| `wwonetime` | `<off \| on>` | | Wird von einigen Thermostaten überschrieben, siehe Thermostatbefehle |
| `wwcircpump` | `<off \| on>` | | |
| `wwcirc` | `<off \| on>` | | Wird von einigen Thermostaten überschrieben, siehe Thermostatbefehle |
| `wwcircmode` | `<n>` | | (1=1x3min, .. 6=6x3min, 7=ein) |
| `wwflowtempoffset` | `<degrees>` | | Offset zur Kesseltemperatur bei der Warmwasserbereitung |
| `wwmaxpower` | `<%>` | | Maximale Leistung für Warmwasserheizung |
| `heatingactivated` | `<off \| on>` | | Bei einigen Systemen nicht änderbar. z.B. Einstellung durch MC10-Drehschalter |
| `heatingtemp` | `<degrees>` | | Obere Grenze für flowtemp, bei einigen Systemen nicht änderbar oder überschreibbar (MC10) |
| `maintenance` | `<off \| <hours> \| <dd.mm.yyyy> \| reset>` | | Wartung auf Datum oder Uhrzeit einstellen oder Meldung zurücksetzen |
| `pumpmodmin` | `<%>` | | Nur für modulierte Pumpen änderbar |
| `pumpmodmax` | `<%>` | | Nur für modulierte Pumpen änderbar |
| `reset` | `<error \| maintenance>` | | Verwenden Sie `reset error` nur, wenn es einen aktiven Fehler gibt!                                |
