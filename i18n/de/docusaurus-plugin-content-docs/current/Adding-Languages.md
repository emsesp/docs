---
id: Adding-Languages
title: Adding Languages
description: Guide to adding new language translations to EMS-ESP WebUI and documentation
---

# Sprachen hinzufügen

Verwenden Sie den Tag [Entity Translation Editor](/entity-translation-editor), um Sprachübersetzungen für Entitäten hinzuzufügen oder zu bearbeiten, die in MQTT, der API und bei Systemvorgängen verwendet werden. Dabei werden alle Entitäten und ihre Übersetzungen in einer Tabelle angezeigt, fehlende Übersetzungen werden hervorgehoben, und Sie können Ihre Änderungen direkt in der Datei speichern. Übertragen Sie die Änderungen anschließend zurück in das GitHub-Repository.

Verwenden Sie den Link [WebUI Translation Editor](/webui-translation-editor), um die Übersetzungen der Web-Benutzeroberfläche selbst zu bearbeiten. Laden Sie den Ordner `i18n` von [here](https://github.com/emsesp/EMS-ESP32/tree/dev/interface/src/i18n) herunter. Alle Sprachen werden nebeneinander in einer Tabelle angezeigt, wobei auf leere Übersetzungen geprüft wird. Nehmen Sie die Änderungen vor, speichern Sie sie und übertragen Sie sie zurück in das GitHub-Repository.

## Manuelles Hinzufügen

### So fügen Sie die Sprache XY zur WebUI hinzu

- Laden Sie die SVG-Flagge von [here](https://gitlab.com/catamphetamine/country-flag-icons/-/tree/master/3x2) herunter und fügen Sie sie in `interface/src/i18n` ein.
- Erstelle den Ordner „XY“ in `interface/src/i18n`
- `interface/src/i18n/en/index.ts` nach `interface/src/i18n/XY/index.ts` kopieren
- Ändern Sie in der ersten und letzten Zeile `en` in Ihre Sprache und in den ersten Zeilen `BaseTranslation` in `Translation`
- Bearbeite `interface/src/i18n/XY/index.ts` und ersetze die englischen Texte durch die Texte in deiner Sprache
- Bearbeiten Sie `interface/src/components/layout/LanguageSelector.tsx` und fügen Sie Folgendes hinzu:

```
import { ReactComponent as XYflag } from 'i18n/XY.svg';
...
        <MenuItem key="xy" value="xy">
          <XYflag style={{ width: 16, verticalAlign: 'middle' }} />
          &nbsp;XY
        </MenuItem>
```

- Wechseln Sie in den Ordner `interface`, geben Sie `pnpm standalone` ein und testen Sie die WebUI

### So fügen Sie die Sprache XY zu Geräteentitäten hinzu

- Bearbeite `interface/src/project/SettingsApplication.tsx` und füge Folgendes in das Auswahlfeld ein (~ Zeile 345):

  ```ts
  <MenuItem value="xy">NewLanguage (XY)</MenuItem>
  ```

- Bearbeite Zeile 45 von `src/system.cpp` und füge `EMSESP_LOCALE_XY` an das Array `languages[]` an
- Bearbeite `src/local_translations.h` und füge die Definitionen hinzu, indem du  
  `#define EMSESP_LOCALE_XY "xy"` einfügst
- Fügen Sie Ihre Übersetzung als `, "your text"` am Ende jedes `MAKE_PSTR_LIST()` innerhalb der Klammer ein; das sollte in etwa so aussehen:
  `MAKE_PSTR_LIST(tag, "en", "de", "nl", "se", "pl", "xy")`
- Kompilieren, flashen, testen
