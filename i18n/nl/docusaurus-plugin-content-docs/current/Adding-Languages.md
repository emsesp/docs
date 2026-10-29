---
id: Adding-Languages
title: Adding Languages
description: Guide to adding new language translations to EMS-ESP WebUI and documentation
---

# Talen toevoegen

Gebruik de [Entity Translation Editor](/entity-translation-editor) om taalvertalingen toe te voegen of te bewerken voor entiteiten die worden gebruikt in MQTT, API’s en systeemoperaties. Hiermee worden alle entiteiten en hun vertalingen in een tabel weergegeven, worden ontbrekende vertalingen gemarkeerd en kun je je wijzigingen direct in het bestand opslaan. Sla de wijzigingen vervolgens weer op in de GitHub-repository als je klaar bent.

Gebruik de [WebUI Translation Editor](/webui-translation-editor) om de vertalingen van de WebUI zelf te bewerken. Download de map `i18n` via [here](https://github.com/emsesp/EMS-ESP32/tree/dev/interface/src/i18n). Alle talen worden naast elkaar in één tabel weergegeven, waarbij wordt gecontroleerd of er lege vertalingen zijn. Breng de wijzigingen aan, sla ze op en commit ze terug naar de GitHub-repository.

## Handmatig toevoegen

### Hoe voeg je taal XY toe aan de WebUI?

- Download de SVG-vlag van [here](https://gitlab.com/catamphetamine/country-flag-icons/-/tree/master/3x2) en plaats deze in `interface/src/i18n`
- Maak de map XY aan in `interface/src/i18n`
- Kopieer `interface/src/i18n/en/index.ts` naar `interface/src/i18n/XY/index.ts`
- Pas in de eerste en laatste regel `en` aan naar je eigen taal en in de eerste regels `BaseTranslation` naar `Translation`
- Bewerk `interface/src/i18n/XY/index.ts` en vervang de Engelse teksten door die in jouw taal
- Bewerk `interface/src/components/layout/LanguageSelector.tsx` en voeg het volgende toe:

```
import { ReactComponent as XYflag } from 'i18n/XY.svg';
...
        <MenuItem key="xy" value="xy">
          <XYflag style={{ width: 16, verticalAlign: 'middle' }} />
          &nbsp;XY
        </MenuItem>
```

- Ga naar de map `interface`, typ `pnpm standalone` en test de WebUI

### Hoe voeg je taal XY toe aan apparaatentiteiten?

- Bewerk `interface/src/project/SettingsApplication.tsx` en voeg het volgende toe in het selectievenster (~ regel 345):

  ```ts
  <MenuItem value="xy">NewLanguage (XY)</MenuItem>
  ```

- Bewerk regel 45 van `src/system.cpp` en voeg `EMSESP_LOCALE_XY` toe aan de `languages[]`-array
- Bewerk `src/local_translations.h` en voeg de definities toe door het volgende toe te voegen:  
  `#define EMSESP_LOCALE_XY "xy"`
- voeg je vertaling toe als `, "your text"` aan het einde van elke `MAKE_PSTR_LIST()` tussen de haakjes; het zou er ongeveer zo uit moeten zien:
  `MAKE_PSTR_LIST(tag, "en", "de", "nl", "se", "pl", "xy")`
- Compileren, flashen, testen
