---
id: Contributing
title: Contributing to EMS-ESP
description: Learn how to contribute to EMS-ESP through documentation, testing, code, and device support
---

# Beitragend

_Jeder Beitrag hilft, EMS-ESP besser zu machen_. Dieses Projekt braucht Hilfe bei:

- leitfäden für die Integration in Hausautomationssysteme
- tests mit verschiedenen Arten von EMS-Geräten (Heizkessel, Thermostate, Solaranlagen, Heap-Pumpen usw.), um unsere unterstützte Datenbank zu erweitern
- Erweitern Sie die Dokumentation um weitere Details, korrigieren Sie Rechtschreibfehler und andere Ungenauigkeiten, die Sie finden. Wenn Sie einen Fehler in einem Artikel entdecken, verwenden Sie den Link _Improve this article_ oben auf der Seite, um ihn zu korrigieren. Beachten Sie, dass Sie ein GitHub-Konto benötigen. Nehmen Sie die Änderung vor, klicken Sie auf "Propose file change" und "Create pull request".

Die vollständigen Richtlinien für die Mitwirkung finden Sie in [CONTRIBUTING.md](https://github.com/emsesp/EMS-ESP32/blob/main/CONTRIBUTING.md) als Teil des GitHub-Quellcode-Repositorys.

## Grundlegende Gestaltungsprinzipien

- Die Kerndienste wie Telnet, Logging und Shell basieren auf den Bibliotheken `@nomis`. Dieser allgemeine Entwurfspattern konzentriert sich darauf, alles so asynchron wie möglich zu machen, so dass keine Operation eine andere Operation um ihre Ausführungszeit bringen sollte. Siehe [this article](https://isocpp.org/wiki/faq/ctors#static-init-order) für weitere Einzelheiten.
- Alle EMS-Geräte (z. B. Heizkessel, Thermostat, Solarmodule, Mischer usw.) werden von einer Basisklasse abgeleitet, und jede Klasse verwaltet ihre eigene Registrierung von Telegrammen und mqtt-Handlern. Dadurch ist der EMS-Gerätecode einfacher zu verwalten und wir können ihn um neue Telegrammtypen und Funktionen erweitern.

## Für Ordnung im Code sorgen

Der Webcode verwendet `prettier`. Zur automatischen Formatierung führen Sie `pnpm format` aus dem Ordner `interface` aus.

Der C++-Code verwendet `clang`. Der einfachste Weg zur automatischen Formatierung des Codes ist die Verwendung der VSCode-Erweiterung [Format Files](https://marketplace.visualstudio.com/items?itemName=jbockle.jbockle-format-files). Führen Sie dann den Befehl `Start Format Files: From Glob` aus und wählen Sie `src/**` als glob pattern.

## Die Webbibliotheken auf dem neuesten Stand halten

Verwenden Sie ein Update-Check-Tool wie `ncu`, um die Webbibliotheken auf dem neuesten Stand zu halten. Sie können auch `npx npm-check-updates` verwenden. Siehe [npm-check-updates](https://github.com/raineorshine/npm-check-updates).

## Pull Requests

Ein Pull Request (PR) ist der Prozess, bei dem Codeänderungen in GitHub verwaltet werden.

Das Verfahren ist einfach.

- Forken des EMS-ESP-Repository [git repository](https://github.com/emsesp/EMS-ESP32)
- Wechsel zum `dev`-Zweig
- Write/Change den Code in Ihrem Fork für eine neue Funktion, Fehlerbehebung, Optimierung...
- Stellen Sie sicher, dass der Code nach dem EMS-ESP-Stil formatiert ist (wie in clang definiert)
- Erstellen Sie zusätzliche Tests in `tests.cpp` und verwenden Sie die Testsuite `make run` (nur linux/osx), um sicherzustellen, dass keine Änderungen vorgenommen werden
- Aktualisieren Sie das `CHANGELOG_LATEST.md` mit der Änderung und verlinken Sie auf den PR
- Erstellen Sie einen Pull Request gegen den [**dev**](https://github.com/emsesp/EMS-ESP32/tree/dev)-Zweig von EMS-ESP

Achten Sie darauf, dass Sie sich an diese Regeln halten:

1. Alle Pull-Requests müssen gegen den Dev-Zweig gerichtet sein.
2. Stellen Sie sicher, dass der Code gemäß `.clang-format` formatiert ist. In Visual Studio Code verwenden Sie Alt-Shift-F zur automatischen Formatierung.
3. Vergewissern Sie sich, dass jeder neue Code deutlich kommentiert ist und erklärt, was function/logic bewirkt.
4. Es sollten nur relevante Dateien berührt werden (achten Sie auch darauf, ob Ihr Editor die automatische Formatierungsfunktion aktiviert hat).
5. Pro PR sollte nur ein feature/fix hinzugefügt werden.
6. PRs, die sich nicht kompilieren lassen (bei CI-Tests fehlschlagen) oder Programmierfehler verursachen, werden nicht zusammengeführt. Bitte beheben Sie das Problem. Das Gleiche gilt für PRs, die gegen einen älteren Commit in der Entwicklungsabteilung gerichtet sind - Sie müssen möglicherweise neu bündeln und Konflikte lösen.
7. Alle Pull Requests sollten von mindestens einem anderen Mitwirkenden als dem Ersteller begutachtet werden, mit Ausnahme des Eigentümers.
8. Alle Pull Requests sollten Aktualisierungen der Dokumentation berücksichtigen.
9. Pull Requests, die ein offenes Problem beheben, insbesondere ein als schwerwiegend eingestuftes Problem, sollten vorrangig behandelt werden.
10. Wenn ein PR angenommen wird, sollte er überprüft und auf der Grundlage des Feedbacks aktualisiert und dann zusammengeführt werden.
11. Um eine PR einzureichen, müssen Sie die bereitgestellte PR-Vorlage verwenden, alle Kästchen ankreuzen, die erforderlichen Aufgaben ausführen und den GAV akzeptieren.
12. Pull Requests, die die oben genannten Bedingungen nicht erfüllen, werden abgelehnt und geschlossen.

## Semantische Commit-Meldungen

Format: `<type>(<scope>): <subject>`

`<scope>` ist optional. Siehe [this article](https://www.conventionalcommits.org/) für weitere Einzelheiten.

- `feat`: (neue Funktion für den Benutzer, keine neue Funktion für das Build-Skript)
- `fix`: (Fehlerkorrektur für den Benutzer, keine Korrektur für ein Build-Skript)
- `docs`: (Änderungen in der Dokumentation)
- `style`: (Formatierung, fehlende Semikolons usw.; keine Änderung des Produktionscodes)
- `refactor`: (Umstrukturierung des Produktionscodes, z. B. Umbenennung einer Variablen)
- `test`: (Hinzufügen fehlender Tests, Refactoring von Tests; keine Änderung des Produktionscodes)
- `chore`: (Aktualisierung der Grunt-Aufgaben usw.; keine Änderung des Produktionscodes)
