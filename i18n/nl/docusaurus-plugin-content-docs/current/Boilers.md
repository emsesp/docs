---
id: Boilers
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

:::info
De onderstaande ketelcommando's variëren afhankelijk van ketel type/brand en systeemconfiguratie Sommige commando's zullen niet werken omdat ze worden overschreven door regelaar of thermostaat. In dit geval zijn er thermostaatcommando's voor deze instelling.
:::

:::warning
deze lijst is niet volledig en kan tussen versies veranderen
:::

| `command` | `data` | `id` | `comments` |
| ------------------ | ------------------------------------------- | --- | ---------------------------------------------------------------------------------- |
| `comfort` | `<hot \|eco \| intelligent>` | | |
| Beperkt tot verwarmingstemperatuur, ingesteld door thermostaat indien aanwezig
| Alleen als de thermostaat het niet beheert
| Start brander onder flowtemp (negatieve waarde), toegestaan bereik hangt af van keteltype |
| Stop de brander boven de flowtemp (positieve waarde), het toegestane bereik hangt af van het keteltype
| `burnperiod` | `<minutes>` | | |
| `burnminpower` | `<%>` | Alleen wijzigbaar voor gemoduleerde branders |
| `burnmaxpower` | `<%>` | Alleen wijzigbaar voor gemoduleerde branders |
| `pumpdelay` | `<minutes>` | | |
| `wwactivated` | `<off \| on>` | | |
| `wwtapactivated` | `<off \| on>` | Speciale functie die werkt in boilertestmodus |
| `wwonetime` | `<off \| on>` | Overschreven door sommige thermostaten, zie thermostaatcommando's |
| `wwcircpump` | `<off \| on>` | | |
| `wwcirc` | `<off \| on>` | Overschreven door sommige thermostaten, zie thermostaatcommando's |
| `wwcircmode` | `<n>` | | (1=1x3min, ... 6=6x3min, 7=on) |
| `wwflowtempoffset` | `<degrees>` | Offset naar boilertemperatuur tijdens het bereiden van warm water |
| Maximaal vermogen voor verwarming van warm water |
| `heatingactivated` | `<off \| on>` | Niet wijzigbaar voor sommige systemen. bijv. Ingesteld door MC10 draaiknop
| Bovengrens voor flowtemp, kan voor sommige systemen niet worden gewijzigd of overschreven (MC10)
| Stel onderhoud in op datum of tijd of stel bericht opnieuw in
| `pumpmodmin` | `<%>` | Alleen wijzigbaar voor gemoduleerde pompen |
| `pumpmodmax` | `<%>` | Alleen wijzigbaar voor gemoduleerde pompen |
| Gebruik `reset error` alleen als er een actieve fout is!                                |
