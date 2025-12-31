---
id: EMS-Circuit
---

# Ein Prototyp für die Hardware

:::note
Bei Fragen oder Vorschlägen posten Sie diese bitte direkt im _board-design_ channel in [Discord](https://discord.com/invite/3J3GgnzpyT)
:::

:::warning
Ich würde sehr empfehlen, einen von [BBQKees's gateways](https://bbqkees-electronics.nl/) zu kaufen. Seine Schaltungen sind sehr professionell und haben viele Iterationen durchlaufen und wurden gründlich getestet. Die unten gezeigten Entwürfe sind nur zu Versuchszwecken und aus nostalgischen Gründen hinzugefügt, da hier alles begann. Sie werden funktionieren, aber es kann zu Qualitätsverlusten und Übertragungsfehlern kommen.
:::

### Ein Prototyp auf dem Breadboard

Nachfolgend finden Sie eine Prototyp-Platine, die Sie selbst auf einem Breadboard zum Testen bauen können. Das Layout wurde mit [DIY Layout Creator](https://github.com/bancika/diy-layout-creator) erstellt.

![Breadboard Circuit](/media/schematics/breadboard.png)

Der für diesen Entwurf verwendete Schaltplan lautet:

![Schematic](/media/schematics/circuit.png)

optional habe ich auch 2 0,5A/72V-Polysicherungen zwischen dem EMS und den beiden Induktivitäten L1 und L2 als zusätzlichen Schutz eingebaut

### Stromversorgung des Stromkreises über das EMS

Unten sehen Sie mein ursprüngliches Design für die EMS-ESP-Platine, die auf einem ESP8266 basiert. Obwohl sich das Projekt weiterentwickelt hat und wir jetzt mit dem leistungsfähigeren ESP32 arbeiten, ist das Grunddesign immer noch dasselbe und wird mit einigen GPIO-Anpassungen funktionieren. Hier wird die Schaltung über die EMS-Leitung selbst mit Strom versorgt, entweder über die beiden EMS-Drähte oder über die 3,5-mm-Servicebuchse. Ein billiger Abwärtswandler (z.B. ein [Pololu D24C22F5](https://www.pololu.com/product/2858)) wird verwendet, um die gefährlichen 15V DC auf 5V zu reduzieren, um dem ESP, der mindestens 250mA benötigt, genügend Strom zu liefern.

![Power circuit](/media/schematics/Schematic_EMS-ESP.png) |

## Andere Entwürfe von Nutzern

@ghost2021 hat ein schönes Gehäuse gebaut, das zum EMS-Gateway passt und das man von [www.thingiverse.com](https://www.thingiverse.com/thing:4874218) herunterladen und ausdrucken kann.

@shane hat ein Board für die Version 2, das auf einem ESP8266 basiert und das Sie auf seinem [GitHub](https://github.com/rocksolidsr/esp-ems-board) finden können.
