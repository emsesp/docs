---
id: EMS-Circuit
---
# A prototype hardware design

:::note For questions or suggestions please post these directly on the _board-design_ channel in [Discord](https://discord.com/invite/3J3GgnzpyT)
:::

:::warning I would highly recommend purchasing one of [BBQKees's gateways](https://bbqkees-electronics.nl/). His circuits and very professional and been through many iterations and thoroughly tested. The designs shown below are just for experimental purposes and added for nostalgic reasons, since this is where it all started. They will work but you may experience loss of quality and transmission errors.
:::

### A Breadboard prototype

Below is a prototype board you can build yourself on a breadboard for testing. The layout was done using [DIY Layout Creator](https://github.com/bancika/diy-layout-creator).

![Breadboard Circuit](/media/schematics/breadboard.png)

The schematic used for this design is:

![Schematic](/media/schematics/circuit.png)

_Optionally I've also added 2 0.5A/72V polyfuses between the EMS and the two inductors L1 and L2 for extra protection._

### Circuit powering via the EMS

Below is my original design for the EMS-ESP circuit board based off an ESP8266. Although the project has progressed and we're now on the more powerful ESP32 the basic design is still the same and will work with some GPIO tweaking. Here the circuit is powered from the EMS line itself via either the two EMS wires or the 3.5mm service jack. A cheap buck converter (like a [Pololu D24C22F5](https://www.pololu.com/product/2858)) is used to step this down the dangerous 15V DC to 5V to provide enough power to the ESP which needs at least 250mA.

![Power circuit](/media/schematics/Schematic_EMS-ESP.png) |

## Other user's designs

@ghost2021 built a nice enclosure which fits the EMS Gateway which you can download and print from [www.thingiverse.com](https://www.thingiverse.com/thing:4874218).

@shane has a board for version 2 based off an ESP8266 which you can find on his [GitHub](https://github.com/rocksolidsr/esp-ems-board).
