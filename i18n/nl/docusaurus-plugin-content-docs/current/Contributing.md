---
id: Contributing
title: Contributing to EMS-ESP
description: Learn how to contribute to EMS-ESP through documentation, testing, code, and device support
---

# Bijdragen

elke bijdrage helpt om EMS-ESP beter te maken_. Dit project heeft hulp nodig met:

- gidsen voor integratie in domoticasystemen
- testen met verschillende soorten EMS-apparaten (verwarmingsketels, thermostaten, zonne-energie, afvalpompen enz.) om onze ondersteunde database op te bouwen
- Breid de documentatie uit met meer details, verbeter spelfouten en andere onnauwkeurigheden die je kunt vinden. Als je een fout ziet in een artikel, gebruik dan de _Improve this article_ link bovenaan de pagina om het te corrigeren. Let op: je hebt een GitHub account nodig. Breng de wijziging aan, klik op "Propose file change" en "Create pull request".

De volledige richtlijnen voor bijdragen zijn te vinden in [CONTRIBUTING.md](https://github.com/emsesp/EMS-ESP32/blob/main/CONTRIBUTING.md) als onderdeel van de GitHub broncode repository.

## Basisprincipes voor ontwerp

- De kerndiensten zoals telnet, logging en shell zijn gebaseerd op de bibliotheken `@nomis`. Dit algemene ontwerpprincipe richt zich op het zo asynchroon mogelijk maken van alles, zodat geen enkele bewerking een andere mag verhongeren om uit te voeren. Zie [this article](https://isocpp.org/wiki/faq/ctors#static-init-order) voor meer details.
- Alle EMS-apparaten (bijv. boiler, thermostaat, zonnepanelen, mixers enz.) zijn afgeleid van een fabrieksklasse en elke klasse registreert zijn eigen telegram- en mqtt-handlers. Hierdoor is de EMS apparaatcode eenvoudiger te beheren en kunnen we uitbreiden met nieuwe telegramtypen en functies.

## De code netjes houden

De webcode gebruikt `prettier`. Om automatisch op te maken voer je `pnpm format` uit vanuit de map `interface`.

De C++ code gebruikt `clang`. De eenvoudigste manier om de code automatisch op te maken is door de VSCode [Format Files](https://marketplace.visualstudio.com/items?itemName=jbockle.jbockle-format-files)-extensie te gebruiken. Voer vervolgens de opdracht `Start Format Files: From Glob` uit en selecteer `src/**` als glob pattern.

## De webbibliotheken up-to-date houden

Gebruik een updatecontroleprogramma zoals `ncu` om de webbibliotheken up-to-date te houden. Je kunt `npx npm-check-updates` gebruiken. Zie [npm-check-updates](https://github.com/raineorshine/npm-check-updates).

## Pull Verzoeken

Een Pull Request (PR) is het proces waarbij codewijzigingen worden beheerd in GitHub.

Het proces is eenvoudig.

- De EMS-ESP-opslagplaats forken [git repository](https://github.com/emsesp/EMS-ESP32)
- Schakel over naar de `dev`-tak
- Write/Change de code in je Fork voor een nieuwe functie, bugfix, optimalisatie...
- Zorg ervoor dat de code is opgemaakt naar de EMS-ESP stijl (zoals gedefinieerd in clang)
- Maak eventuele aanvullende tests in `tests.cpp` en gebruik de testsuite `make run` (alleen linux/osx) om ervoor te zorgen dat er geen brekende wijzigingen zijn
- Werk de `CHANGELOG_LATEST.md` bij met de wijziging en link naar de PR
- Maak een Pull Request tegen de [**dev**](https://github.com/emsesp/EMS-ESP32/tree/dev) tak van EMS-ESP

Zorg ervoor dat je je aan deze regels houdt:

1. Alle pull requests moeten gedaan worden tegen de dev branch.
2. Zorg ervoor dat de code wordt geformatteerd volgens `.clang-format`. Gebruik in Visual Studio Code Alt-Shift-F om automatisch te formatteren.
3. Zorg ervoor dat alle nieuwe code duidelijk wordt becommentarieerd met uitleg over wat de function/logic doet.
4. Alleen relevante bestanden mogen worden aangeraakt (pas ook op als je editor de functie voor automatisch formatteren heeft ingeschakeld).
5. Per PR mag slechts één feature/fix worden toegevoegd.
6. PR's die niet compileren (mislukken in CI-tests) of coderingsfouten veroorzaken, worden niet samengevoegd. Los het probleem alsjeblieft op. Hetzelfde geldt voor PR's die tegen een oudere commit in dev zijn opgeworpen - je moet misschien rebasen en conflicten oplossen.
7. Alle pull requests moeten peer review ondergaan door ten minste één bijdrager anders dan de maker, behalve de eigenaar.
8. Alle pull requests moeten updates van de documentatie overwegen.
9. Pull verzoeken die een openstaand probleem aanpakken, in het bijzonder een probleem dat als ernstig wordt beschouwd, moeten prioriteit krijgen.
10. Als een PR wordt geaccepteerd, moet deze worden beoordeeld en bijgewerkt op basis van de feedback die wordt gegeven en vervolgens worden samengevoegd.
11. Als u een PR wilt indienen, moet u het meegeleverde PR-sjabloon gebruiken en alle vakjes aanvinken, de vereiste taken uitvoeren en de CAO accepteren.
12. Pull-aanvragen die niet aan het bovenstaande voldoen, worden geweigerd en gesloten.

## Semantische vastlegberichten

Formaat: `<type>(<scope>): <subject>`

`<scope>` is optioneel. Zie [this article](https://www.conventionalcommits.org/) voor meer informatie.

- `feat`: (nieuwe functie voor de gebruiker, geen nieuwe functie voor het buildscript)
- `fix`: (bugfix voor de gebruiker, geen fix voor een buildscript)
- `docs`: (wijzigingen in de documentatie)
- `style`: (opmaak, ontbrekende puntkomma's, enzovoort; geen wijziging in de productiecode)
- `refactor`: (productiecode refactoren, bijvoorbeeld een variabele hernoemen)
- `test`: (ontbrekende tests toevoegen, tests hertekenen; geen wijziging in de productiecode)
- `chore`: (grunt-taken bijwerken enzovoort; geen productiecode wijzigen)
