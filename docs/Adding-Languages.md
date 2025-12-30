---
id: Adding-Languages
---
# Adding Languages

### How to add language XY to the WebUI

- Download the SVG flag from [here](https://gitlab.com/catamphetamine/country-flag-icons/-/tree/master/3x2) and place in `interface/src/i18n`
- Create the folder XY in `interface/src/i18n`
- Copy `interface/src/i18n/en/index.ts` to `interface/src/i18n/XY/index.ts`
- Change in the first and last line `en` to your language and in the first lines `BaseTranslation` to `Translation`
- Edit `interface/src/i18n/XY/index.ts` and replace the English texts by your language
- Edit `interface/src/components/layout/LanguageSelector.tsx` and add the following:

```
import { ReactComponent as XYflag } from 'i18n/XY.svg';
...
        <MenuItem key="xy" value="xy">
          <XYflag style={{ width: 16, verticalAlign: 'middle' }} />
          &nbsp;XY
        </MenuItem>
```

- Navigate to the `interface` folder and type `pnpm standalone` and test the WebUI

### How to add language XY to device entities

- Edit `interface/src/project/SettingsApplication.tsx` and insert in selection box (~ line 345):

  ```ts
  <MenuItem value="xy">NewLanguage (XY)</MenuItem>
  ```

- Edit `src/system.cpp` line 45 and append `EMSESP_LOCALE_XY` to the `languages[]` array
- Edit `src/local_translations.h` and append the defines by adding  
  `#define EMSESP_LOCALE_XY "xy"`
- add your translation as `, "your text"` at the end of each `MAKE_PSTR_LIST()` inside the bracket it should look something like this:
  `MAKE_PSTR_LIST(tag, "en", "de", "nl", "se", "pl", "xy")`
- Compile, flash, test
