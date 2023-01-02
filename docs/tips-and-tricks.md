**Below are a collection of useful tips, tricks and code submitted by the community:**

## Control the boiler heating
*(by @Oderik)*

In a very simple setup a boiler provides heat to one heating circuit. If `heating activated` is `on`, the boiler maintains the `selected flow temperature` by regulating the burner and the heat pump.

Once the `current flow temperature` exceeds the `selected flow temperature` + `temperature hysteresis off`, the heating will stop until the `current flow temperature` drops below the `selected flow temperature` + `temperature hysteresis on` (which is typically a negative value).

Thus to activate the heating you will need to set `heatingactivated` to `on` and set an appropriate `flowtemp`. The latter should be derived from the `heating temperature setting` which can be set using the physical dial/control on the boiler. It should be considered as the maximum flow temperature. You can also use a lower flow temperature to maintain a constant room temperature once the initial heating is done.

## Retrieve data via REST using PHP
*(by @flohse123)*

```php
<?php
$ch = curl_init("http://<myIP>/api?device=thermostat&cmd=info");
curl_exec($ch);
curl_close($ch);
?>
```
