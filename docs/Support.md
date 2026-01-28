---
id: Support
---
# Getting Support

If you are looking for EMS-ESP support, have a question or suggestion here are the options:

- If you're using a BBQKees gateway board and having trouble connecting it, go first to [BBQKees' EMS Gateway Documentation](https://bbqkees-electronics.nl/wiki/).
- Look through the [Troubleshooting](Troubleshooting.md) section for solutions to common problems.
- Try reaching out to the **EMS-ESP Community** on [Discord](https://discord.gg/GP9DPSgeJq). This is a good place for asking general questions and chatting with other users. You have better chances to getting fast responses here.
- Search through existing **[GitHub issues](https://github.com/emsesp/EMS-ESP32/issues)**, both open and closed, as your issue may already be resolved.
- **Search** the [GitHub discussions](https://github.com/emsesp/EMS-ESP32/discussions) as you might find an answer to your question.
- As a last resort, **create** a [Problem Report](https://github.com/emsesp/EMS-ESP32/issues/new?template=bug_report.md) on GitHub following the guidelines below.

:::tip important!

    Before creating a new GitHub issue, please make sure you have are using either the latest Stable or Development firmware version. Versions older than these are no longer supported as we simply don't have the resources to support every version.

    Users running BBQKees certified gateway boards get priority support. This is because they have a warranty and we want to make sure they get the best support possible. Users that have built their own EMS gateway boards or are using an unsolicited clone circuit will get limited support as it most cases we've found it's hardware related issues.

    When creating a new GitHub issue make sure that you provide the following information:

    1. Attach the EMS-ESP Support Information. This will show us which EMS devices you have attached and the firmware version you are using. You can fetch the information from the URL [http://&lt;hostname&gt;/api/system/info](http://ems-esp.local/api/system/info) or by downloading by clicking the `Support Information` button from the Help page in the WebUI. Issues that are missing this information will be closed without investigation.
    2. State the problem you are experiencing.
    3. State the steps to reproduce the problem.
    4. State the expected behavior.
    5. State the actual behavior.
:::
