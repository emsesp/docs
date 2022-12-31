If you are looking for support, have a question or suggestion follow these steps:

1. If the request is **hardware** related go to [BBQKees' EMS Gateway Documentation](https://bbqkees-electronics.nl/wiki/).
2. Contact the **Support Community** using [Discord](https://discord.gg/3J3GgnzpyT) for asking general questions and chatting with other users. You have better chances to getting fast responses here.
3. **Search** in existing [GitHub issues](https://github.com/emsesp/EMS-ESP32/issues) as you might find an answer to your question in current or closed issues.
4. **Create a new issue** in GitHub, either a [Bug Report](https://github.com/emsesp/EMS-ESP32/issues/new?template=bug_report.md) for reporting possible defects, a [Feature Request](https://github.com/emsesp/EMS-ESP32/issues/new?template=feature_request.md) for a new idea or a [Question](https://github.com/emsesp/EMS-ESP32/issues/new?template=questions---troubleshooting.md) for general support. When creating the issue make sure you attach the EMS-ESP support information either using http://ems-esp.local/api/system/info or by clicking on the `Support Info` button from the Help page in the WebUI.

---

## Tips & Tricks

**Below are a collection of useful tips, tricks and code submitted by the community:**

### Control the boiler heating (by @Oderik)

In a very simple setup a boiler provides heat to one heating circuit. If `heating activated` is `on`, the boiler maintains the `selected flow temperature` by regulating the burner and the heat pump.

Once the `current flow temperature` exceeds the `selected flow temperature` + `temperature hysteresis off`, the heating will stop until the `current flow temperature` drops below the `selected flow temperature` + `temperature hysteresis on` (which is typically a negative value).

Thus to activate the heating you will need to set `heatingactivated` to `on` and set an appropriate `flowtemp`. The latter should be derived from the `heating temperature setting` which can be set using the physical dial/control on the boiler. It should be considered as the maximum flow temperature. You can also use a lower flow temperature to maintain a constant room temperature once the initial heating is done.

### Retrieve data via REST using PHP (by @flohse123)

```php
<?php
$ch = curl_init("http://<myIP>/api?device=thermostat&cmd=info");
curl_exec($ch);
curl_close($ch);
?>
```
