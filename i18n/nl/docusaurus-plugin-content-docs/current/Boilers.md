---
id: Boilers
title: Supported Boilers
description: Complete list of supported boiler models from Bosch, Buderus, Nefit, Junkers, Sieger, and Worcester brands
---

# Ketels

Dit is de huidige lijst met ondersteunde boilers van merken als Buderus, Nefit, Sieger, Junkers en Bosch:

- BK13, BK15
- GB125, GB135, GB1x2i, GB162, GBx72, GB212, GB162, GB192, GB122, GB192i.2
- MC10
- Cascade CM10, MC400
- Logano
- Logamax Plus GB022, U122
- Logamatic MC10, MC110
- Condens 2500, GC9000
- Bosch/Junkers Cerapur GC2200W
- Logomatic
- Bosch/Junkers Cerapur Top, Aero
- Bosch/Junkers Cerapur ZSB 14-3 A
- Greenstar Si, 30Ri Compact, ErP, HIU, 8000
- Nefit-toplijn, trendlijn
- Cascade MCM10
- Nefit Proline
- Nefit Smartline
- GC7000F, GC700iW, GC9800IW
- KB195i
- Hybride warmtepomp
- Enviline
- Compress 6000AW
- Hybride 3000-7000iAW
- SupraEco
- WLW196i, WSW196i
- Condens 2300, 5000i
- Ecomline Uitstekend
- EasyControl-adapter

## Apparaatentiteiten met opdrachten

:::info De onderstaande ketelcommando's variëren afhankelijk van de ketel type/brand en systeemconfiguratie Sommige commando's zullen niet werken omdat ze worden overschreven door regelaar of thermostaat. In dit geval zijn er thermostaatcommando's voor deze instelling.
:::

:::warning deze lijst is niet volledig en kan tussen versies veranderen
:::

| `command` | `data` | `id` | `comments` |
| ------------------ | ------------------------------------------- | --- | ---------------------------------------------------------------------------------- |
| `comfort` | `<hot \|eco \| intelligent>` | | |
| `flowtemp` | `<degrees>` | | Beperkt tot verwarmingstemperatuur, ingesteld door thermostaat indien aanwezig |
| `wwsettemp` | `<degrees>` | | Alleen als thermostaat het niet beheert |
| `boilhyston` | `<degrees>` | Start brander onder flowtemp (negatieve waarde), toegestaan bereik hangt af van keteltype |
| `boilhystoff` | `<degrees>` | Stop brander boven flowtemp (positieve waarde), toegestaan bereik hangt af van keteltype |
| `burnperiod` | `<minutes>` | | |
| `burnminpower` | `<%>` | | Alleen te wijzigen voor gemoduleerde branders |
| `burnmaxpower` | `<%>` | | Alleen te wijzigen voor gemoduleerde branders |
| `pumpdelay` | `<minutes>` | | |
| `wwactivated` | `<off \| on>` | | |
| `wwtapactivated` | `<off \| on>` | | Speciale functie die werkt in boilertestmodus |
| `wwonetime` | `<off \| on>` | | Overschreven door sommige thermostaten, zie thermostaatopdrachten |
| `wwcircpump` | `<off \| on>` | | |
| `wwcirc` | `<off \| on>` | | Overschreven door sommige thermostaten, zie thermostaatopdrachten |
| `wwcircmode` | `<n>` | | (1=1x3min, ... 6=6x3min, 7=on) |
| `wwflowtempoffset` | `<degrees>` | Offset naar boilertemperatuur bij het bereiden van warm water |
| `wwmaxpower` | `<%>` | Maximumvermogen voor verwarming van warm water |
| `heatingactivated` | `<off \| on>` | | Niet wijzigbaar voor sommige systemen. bijv. Ingesteld door MC10 draaiknop |
| `heatingtemp` | `<degrees>` | Bovengrens voor flowtemp, niet wijzigbaar voor sommige systemen of overschrijfbaar (MC10) |
| `maintenance` | `<off \| <hours> \| <dd.mm.yyyy> \| reset>` | Stel onderhoud in op datum of tijd of reset bericht |
| `pumpmodmin` | `<%>` | | Alleen te wijzigen voor gemoduleerde pompen |
| `pumpmodmax` | `<%>` | | Alleen te wijzigen voor gemoduleerde pompen |
| `reset` | `<error \| maintenance>` | Gebruik `reset error` alleen als er een actieve fout is!                                |
