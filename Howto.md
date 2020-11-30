# Howto

Achieve common tasks with ems esp.

## Control boiler heating

In a very simple setup a boiler provides heat to one heating circuit. If `heating activated` is `on`, the boiler maintains the `selected flow temperature` by regulating the burner and the heat pump. Once the `current flow temperature` exceeds the `selected flow temperature` plus `temperature hysteresis off`, heating will stop until the `current flow temperature` drops below the `selected flow temperature` plus `temperature hysteresis on` (which is actually negative commonly).

Thus to activate heating, you need to set `heatingactivated` to `on` and set an appropriate `flowtemp`. The latter should be dervived from the `heating temperature setting` which is configured using a hardware knob on the boiler. It should be considered the maximum flow temperature. You can use a lower flow temperature to maintain a constant room temperature once initial heating is done.
