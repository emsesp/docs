---
id: Adding-Languages
title: Adding Languages
description: Guide to adding new language translations to EMS-ESP WebUI and documentation
---

# Sprachen hinzufügen

### Wie man die Sprache XY zur WebUI hinzufügt

- Laden Sie die SVG-Flagge von [here](https://gitlab.com/catamphetamine/country-flag-icons/-/tree/master/3x2) herunter und platzieren Sie sie in `interface/src/i18n`
- Erstellen Sie den Ordner XY in `interface/src/i18n`
- Kopieren von `interface/src/i18n/en/index.ts` nach `interface/src/i18n/XY/index.ts`
- Ändern Sie in der ersten und letzten Zeile `en` in Ihre Sprache und in den ersten Zeilen `BaseTranslation` in `Translation`
- Bearbeiten Sie `interface/src/i18n/XY/index.ts` und ersetzen Sie die englischen Texte durch Ihre Sprache
- Bearbeiten Sie `interface/src/components/layout/LanguageSelector.tsx` und fügen Sie Folgendes hinzu:

```
import { ReactComponent as XYflag } from 'i18n/XY.svg';
...
        <MenuItem key="xy" value="xy">
          <XYflag style={{ width: 16, verticalAlign: 'middle' }} />
          &nbsp;XY
        </MenuItem>
```

- Navigieren Sie zum Ordner `interface` und geben Sie `pnpm standalone` ein und testen Sie die WebUI

### Wie man die Sprache XY zu Geräteeinheiten hinzufügt

- Bearbeiten Sie `interface/src/project/SettingsApplication.tsx` und fügen Sie es in das Auswahlfeld ein (~ Zeile 345):

  ```ts
  <MenuItem value="xy">NewLanguage (XY)</MenuItem>
  ```

- Bearbeiten Sie `src/system.cpp` Zeile 45 und fügen Sie `EMSESP_LOCALE_XY` an das `languages[]` Array an
- Bearbeiten Sie `src/local_translations.h` und fügen Sie die Definitionen durch Hinzufügen von `#define EMSESP_LOCALE_XY "xy"` hinzu
- fügen Sie Ihre Übersetzung als `, "your text"` am Ende jedes `MAKE_PSTR_LIST()` innerhalb der Klammer ein, so dass es etwa so aussieht: `MAKE_PSTR_LIST(tag, "en", "de", "nl", "se", "pl", "xy")`
- Kompilieren, flashen, testen
