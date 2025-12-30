---
id: EMS-Circuit
---
# Een prototype hardwareontwerp

:::note Vragen of suggesties kunt u rechtstreeks posten op het _board-design_ kanaal in [Discord](https://discord.com/invite/3J3GgnzpyT)
:::

:::warning Ik zou de aankoop van een van [BBQKees's gateways](https://bbqkees-electronics.nl/) ten zeerste aanbevelen. Zijn circuits zijn zeer professioneel en hebben vele iteraties ondergaan en zijn grondig getest. De hieronder getoonde ontwerpen zijn slechts voor experimentele doeleinden en toegevoegd om nostalgische redenen, aangezien het hier allemaal begonnen is. Ze zullen werken maar je kan kwaliteitsverlies en transmissiefouten ervaren.
:::

### Een prototype op een Breadboard

Hieronder zie je een prototype printplaat die je zelf kunt bouwen op een breadboard om te testen. De lay-out is gemaakt met [DIY Layout Creator](https://github.com/bancika/diy-layout-creator).

![Breadboard Circuit](/media/schematics/breadboard.png)

Het schema dat voor dit ontwerp is gebruikt, is

![Schematic](/media/schematics/circuit.png)

optioneel heb ik ook 2 0,5A/72V polyzekeringen toegevoegd tussen de EMS en de twee spoelen L1 en L2 voor extra bescherming

### Stroomvoorziening via het EMS

Hieronder staat mijn oorspronkelijke ontwerp voor de EMS-ESP printplaat gebaseerd op een ESP8266. Hoewel het project is geëvolueerd en we nu de krachtigere ESP32 hebben, is het basisontwerp nog steeds hetzelfde en zal het werken met wat GPIO tweaking. Hier wordt het circuit gevoed vanaf de EMS-lijn zelf via de twee EMS-draden of de 3,5mm service-aansluiting. Een goedkope buck converter (zoals een [Pololu D24C22F5](https://www.pololu.com/product/2858)) wordt gebruikt om de gevaarlijke 15V DC terug te brengen naar 5V om genoeg stroom te leveren aan de ESP, die minstens 250mA nodig heeft.

![Power circuit](/media/schematics/Schematic_EMS-ESP.png) |

## Ontwerpen van andere gebruikers

@ghost2021 heeft een mooie behuizing voor de EMS Gateway gemaakt die je kunt downloaden en printen vanaf [www.thingiverse.com](https://www.thingiverse.com/thing:4874218).

@shane heeft een bord voor versie 2 gebaseerd op een ESP8266 dat je kunt vinden op zijn [GitHub](https://github.com/rocksolidsr/esp-ems-board).
