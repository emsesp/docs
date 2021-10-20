_Any contribution helps make EMS-ESP better_. This project needs help with:

- guides for integrating into home automation systems
- testing with various types of EMS devices (boilers, thermostats, solar, heap pumps etc) to build up our supported database
- Expand the documentation with more details, fixing spelling mistakes and other inaccuracies you may find. If you spot an error in an article use the _Improve this article_ link at the top of the page to correct it. Note you will need a GitHub account. Make the change, click on "Propose file change" and "Create pull request".

## Semantic Commit Messages

Format: `<type>(<scope>): <subject>`

`<scope>` is optional

### Example

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

More Examples:

- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)
- `docs`: (changes to the documentation)
- `style`: (formatting, missing semi colons, etc; no production code change)
- `refactor`: (refactoring production code, eg. renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc; no production code change)

References:

- <https://www.conventionalcommits.org/>

## Creating Releases

On every commit to the `dev` branch a firmware build is triggered and tagged as `latest`.

To create an final build version, follow these steps to create a tagged release

- go the `main` branch
- git merge with origin/dev
- update the `version.h`
- update the `CHANGELOG.md`
- `git tag -f v2.2.1` (for example)
- `git push --tags -f`
