---
id: Adding-Languages
---

# Talen toevoegen

### Hoe taal XY toevoegen aan de WebUI

- Download de SVG-vlag van [here](https://gitlab.com/catamphetamine/country-flag-icons/-/tree/master/3x2) en plaats deze in `interface/src/i18n`
- Maak de map XY in `interface/src/i18n`
- Kopieer `interface/src/i18n/en/index.ts` naar `interface/src/i18n/XY/index.ts`
- Verander in de eerste en laatste regel `en` in jouw taal en in de eerste regels `BaseTranslation` in `Translation`
- Bewerk `interface/src/i18n/XY/index.ts` en vervang de Engelse teksten door jouw taal
- Bewerk `interface/src/components/layout/LanguageSelector.tsx` en voeg het volgende toe:

```
import { ReactComponent as XYflag } from 'i18n/XY.svg';
...
        <MenuItem key="xy" value="xy">
          <XYflag style={{ width: 16, verticalAlign: 'middle' }} />
          &nbsp;XY
        </MenuItem>
```

- Navigeer naar de map `interface` en typ `pnpm standalone` en test de WebUI

### Hoe taal XY aan apparaatentiteiten toe te voegen

- Bewerk `interface/src/project/SettingsApplication.tsx` en voeg in selectievak in (~ regel 345):

  ```ts
  <MenuItem value="xy">NewLanguage (XY)</MenuItem>
  ```

- Bewerk `src/system.cpp` regel 45 en voeg `EMSESP_LOCALE_XY` toe aan de `languages[]` matrix
- Bewerk `src/local_translations.h` en voeg de definities toe door `#define EMSESP_LOCALE_XY "xy"` toe te voegen
- voeg je vertaling toe als `, "your text"` aan het einde van elke `MAKE_PSTR_LIST()` binnen de haakjes. Het moet er ongeveer zo uitzien: `MAKE_PSTR_LIST(tag, "en", "de", "nl", "se", "pl", "xy")`
- Compileren, flashen, testen
