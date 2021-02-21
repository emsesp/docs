### Contributing to EMS-ESP

*Any contribution helps make EMS-ESP better*. This project needs help with:
- guides for integrating into home automation systems
- testing with various types of EMS devices (boilers, thermostats, solar, heap pumps etc) to build up our supported database
- Expand the documentation with more details, fixing spelling mistakes and other inaccuracies you may find. If you spot an error in an article use the *Improve this article* link at the top of the page to correct it. Note you will need a GitHub account. Make the change, click on "Propose file change" and "Create pull request".

-------
Below is a collection of useful tips, tricks and code submitted by the community:

### 1) Controlling boiler heating (by @Oderik)

In a very simple setup a boiler provides heat to one heating circuit. If `heating activated` is `on`, the boiler maintains the `selected flow temperature` by regulating the burner and the heat pump.

Once the `current flow temperature` exceeds the `selected flow temperature` + `temperature hysteresis off`, the heating will stop until the `current flow temperature` drops below the `selected flow temperature` + `temperature hysteresis on` (which is typically a negative value).

Thus to activate the heating you will need to set `heatingactivated` to `on` and set an appropriate `flowtemp`. The latter should be derived from the `heating temperature setting` which can be set using the physical dial/control on the boiler. It should be considered as the maximum flow temperature. You can also use a lower flow temperature to maintain a constant room temperature once the initial heating is done.

### 2) Retrieving data via REST using PHP (by @flohse123)

```php
<?php
$ch = curl_init("http://<myIP>/api?device=thermostat&cmd=info");
curl_exec($ch);
curl_close($ch);
?>
```
