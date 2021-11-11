_Any contribution helps make EMS-ESP better_. This project needs help with:

- guides for integrating into home automation systems
- testing with various types of EMS devices (boilers, thermostats, solar, heap pumps etc) to build up our supported database
- Expand the documentation with more details, fixing spelling mistakes and other inaccuracies you may find. If you spot an error in an article use the _Improve this article_ link at the top of the page to correct it. Note you will need a GitHub account. Make the change, click on "Propose file change" and "Create pull request".

The full Contributing guidelines can found in [CONTRIBUTING.md](https://github.com/emsesp/EMS-ESP32/blob/main/CONTRIBUTING.md) as part of the GitHub source code repository.

## Pull Requests

A Pull Request (PR) is the process where code modifications are managed in GitHub.

The process is straight-forward.

- Fork the EMS-ESP Repository [git repository](https://github.com/emsesp/EMS-ESP32).
- Switch to the `dev` branch
- Write/Change the code in your Fork for a new feature, bug fix, optimization, etc.
- Ensure tests work if you can by running `make run` (linux/osx only).
- Create a Pull Request against the [**dev**](https://github.com/emsesp/EMS-ESP32/tree/dev) branch of EMS-ESP.

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
