_Any contribution helps make EMS-ESP better_. This project needs help with:

- guides for integrating into home automation systems
- testing with various types of EMS devices (boilers, thermostats, solar, heap pumps etc) to build up our supported database
- Expand the documentation with more details, fixing spelling mistakes and other inaccuracies you may find. If you spot an error in an article use the _Improve this article_ link at the top of the page to correct it. Note you will need a GitHub account. Make the change, click on "Propose file change" and "Create pull request".

The full Contributing guidelines can found in [CONTRIBUTING.md](https://github.com/emsesp/EMS-ESP32/blob/main/CONTRIBUTING.md) as part of the GitHub source code repository.

## Basic design principles

- The core services like telnet, logging and shell are based off the libraries from @nomis. This general design pattens focuses on making everything as asynchronous as possible so that no one operation should starve another operation of it's time to execute (<https://isocpp.org/wiki/faq/ctors#static-init-order>).
- All EMS devices (e.g. boiler, thermostat, solar modules, mixer units etc) are derived from a factory base class and each class handles its own registering of telegram and mqtt handlers. This makes the EMS device code easier to manage and we can extend with new telegrams types and features.

## Keeping the code tidy

The web code uses `prettier`. To auto format run `npm run format` from the `interface` folder.

The C++ code use `clang`. The easiest way to auto format the code is using the VSCode [Format Files](https://marketplace.visualstudio.com/items?itemName=jbockle.jbockle-format-files) extension. Then run the command `Start Format Files: From Glob` and select `src/**` as the glob pattern.

## Keeping the Web libraries up to date

Use an update like `ncu` to keep the package.\* web libraries up to date. You can install using `npm install -g npm-check-updates`. See [npm-check-updates](https://www.npmjs.com/package/npm-check-updates).

```bash
ncu -u
```

## Pull Requests

A Pull Request (PR) is the process where code modifications are managed in GitHub.

The process is straight-forward.

- Fork the EMS-ESP Repository [git repository](https://github.com/emsesp/EMS-ESP32)
- Switch to the `dev` branch
- Write/Change the code in your Fork for a new feature, bug fix, optimization...
- Make sure the code is formatting to the EMS-ESP style (as defined in clang)
- Create any additional tests in `tests.cpp` and use the test suite `make run` (linux/osx only) to make sure there are no breaking changes
- Update the `CHANGELOG_LATEST.md` with the change and link to the PR
- Create a Pull Request against the [**dev**](https://github.com/emsesp/EMS-ESP32/tree/dev) branch of EMS-ESP

Make sure you adhere to these rules:

1. All pull requests must be done against the dev branch.
2. Make sure code is formatting per the `.clang-format`. In Visual Studio Code use Alt-Shift-F to auto-format.
3. Make sure any new code is clearly commented explaining what the function/logic does.
4. Only relevant files should be touched (Also beware if your editor has auto-formatting feature enabled).
5. Only one feature/fix should be added per PR.
6. PRs that don't compile (fail in CI Tests) or cause coding errors will not be merged. Please fix the issue. Same goes for PRs that are raised against older commit in dev - you might need to rebase and resolve conflicts.
7. All pull requests should undergo peer review by at least one contributor other than the creator, excepts for the owner.
8. All pull requests should consider updates to the documentation.
9. Pull requests that address an outstanding issue, particularly an issue deemed to be severe, should be given priority.
10. If a PR is accepted, then it should undergo review and updated based on the feedback provided, then merged.
11. By submitting a PR, it is needed to use the provided PR template and check all boxes, performing the required tasks and accepting the CLA.
12. Pull requests that don't meet the above will be denied and closed.

## Semantic Commit Messages

Format: `<type>(<scope>): <subject>`

`<scope>` is optional. See <https://www.conventionalcommits.org/>.

#### Example

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
