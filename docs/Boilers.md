# List of Boilers

This is the current list of supported boilers from Buderus, Nefit, Sieger, Junkers and Bosch:

- BK13/BK15/Smartline/GB1x2i
- GB125/GB135/MC10
- Cascade CM10
- Logamax Plus GB022
- Condens 2500/Logamax/Logomatic/Cerapur Top/Greenstar/Generic HT3
- Topline/GB162
- Cascade MCM10
- Proline
- GBx72/Trendline/Cerapur/Greenstar Si
- GB212
- GC7000F
- Logano GB125/KB195i/Logamatic MC110
- Greenstar 30Ri Compact
- Cerapur Aero
- Hybrid Heatpump
- Logano GB212
- Enviline/Compress 6000AW/Hybrid 3000-7000iAW/SupraEco/Geo 5xx/WLW196i/WSW196i
- Geo 5xx
- Condens 5000i/Greenstar 8000/GC9800IW/GB192i.2
- Logamax U122/Cerapur
- Ecomline Excellent
- Logamax Plus/GB192/Condens GC9000/Greenstar ErP
- Cascade MC400
- EasyControl Adapter
- Greenstar HIU
- Logamax Plus GB122/Condense 2300

## Device Entities

<!-- prettier-ignore -->
!!! notice
    The boiler commands below will vary depending on boiler type/brand and system configuration Some commands will not work because they are overwritten by controller or thermostat. In this case there are thermostat commands for this setting.

<!-- prettier-ignore -->
!!! warning "this list is not complete and subject to change between versions"

<!-- prettier-ignore -->
| command | data | id  | comments |
| - | - | - | - |
| `comfort` | `<hot \|eco \| intelligent>` | | |
| `flowtemp` | `<degrees>` | | Limited to heatingtemp, set by thermostat if present |
| `wwsettemp` | `<degrees>` | | Only if thermostat does not manage it |
| `boilhyston` | `<degrees>` | | Start burner below flowtemp (negative value), allowed range depends on boiler type |
| `boilhystoff` | `<degrees>` | | Stop burner above flowtemp (positive value), allowed range depends on boiler type |
| `burnperiod` | `<minutes>` | | |
| `burnminpower` | `<%>` | | Changeable only for modulated burners |
| `burnmaxpower` | `<%>` | | Changeable only for modulated burners |
| `pumpdelay` | `<minutes>` | | |
| `wwactivated` | `<off \| on>` | | |
| `wwtapactivated` | `<off \| on>` | | Special function working in boiler test-mode |
| `wwonetime` | `<off \| on>` | | Overwritten by some thermostats, see thermostat commands |
| `wwcircpump` | `<off \| on>` | | |
| `wwcirc` | `<off \| on>` | | Overwritten by some thermostats, see thermostat commands |
| `wwcircmode` | `<n>` | | (1=1x3min, .. 6=6x3min, 7=on) |
| `wwflowtempoffset` | `<degrees>` | | Offset to boiler temperature while preparing warm water |
| `wwmaxpower` | `<%>` | | Maximum power for warm water heating |
| `heatingactivated` | `<off \| on>` | | Not changeable for some systems. i.g. Set by MC10 rotary control |
| `heatingtemp` | `<degrees>` | | Upper limit for flowtemp, not changeable for some systems or overwritten (MC10) |
| `maintenance` | `<off \| <hours> \| <dd.mm.yyyy> \| reset>` | | set maintenance to date or time or reset message |
| `pumpmodmin` | `<%>` | | Changeable only for modulated pumps |
| `pumpmodmax` | `<%>` | | Changeable only for modulated pumps |
| `reset` | `<error \| maintenance>` | | Use `reset error` only if there is an active error! |
