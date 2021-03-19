## **Basic Design Principles**

- The core services like telnet, logging and shell are based off the libraries from @nomis. I also adopted his general design pattens such as making everything as asynchronous as possible so that no one operation should starve another operation of it's time to execute (https://isocpp.org/wiki/faq/ctors#static-init-order).
- All EMS devices (e.g. boiler, thermostat, solar modules, mixer units etc) are derived from a factory base class and each class handles its own registering of telegram and mqtt handlers. This makes the EMS device code easier to manage and we can extend with new telegrams types and features.
- For debugging there is an offline mode where the code can be compiled and executed standalone without uploading to an ESP controller. Use `make` (based off GNUMakefile).

## Testing

The Web can developed and tested in real-time by commenting out the `-D ENABLE_CORS` in `platformio.ini` and then
```sh
cd interface
npm start
```

To test and simulate EMS-ESP locally on your PC you can build and run a 'standalone' version that doesn't need an ESP or connection to the EMS bus. Note however this needs GNUMake to work and currently doesn't build natively on Windows10 (unless you use a Windows Linux sub-system, WSL).

```sh
make run
```

Then from the console prompt use `test <test>` to run the simulations, eg. mixer, thermostat, general etc. See `test.cpp` for the scripts.

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

- https://www.conventionalcommits.org/

## Creating Releases

On every commit to the `dev` branch a firmware build is triggered and tagged as `latest`.

To create an final build version, follow these steps to create a tagged release

- go the `main` branch
- git merge with origin/dev
- update the `version.h`
- update the `CHANGELOG.md`
- `git tag -f v2.2.1`  (for example)
- `git push --tags -f`
