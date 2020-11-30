# Howto

Achieve common tasks with ems esp.

## Controll boiler heating

In a very simple setup a boiler provides heat to one heating circuit. If `heatingactivated` is `on`, the boiler maintains the set `flowtemperature` by regulating the burner and the heat pump. Once the actual flow temperature exceeds the set flowtemperature plus hyst_off, heating will stop until the flow temperature drops below the set flowtemperature plus hyst_on (which is actually negative commonly).

Thus to activate heating, you need to set heatingactivated to on and set an appropriate flowtemperature. The latter should be dervived from the heating temperature setting which is configured using a hardware knob on the boiler. It should be considered the maximum flow temperature. You can use a lower flow temperature to maintain a a constant room temperature once initial heating is done.
