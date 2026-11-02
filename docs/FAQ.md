---
id: FAQ
title: Frequently Asked Questions
description: Common questions and answers about EMS-ESP including factory reset, EMS telegrams, and troubleshooting
---
# FAQ

## How to Factory Reset EMS-ESP?

If you have a GPIO Button configured (enabled by default on all BBQKees boards) pressing this for 10 seconds and releasing will perform a factory reset. EMS-ESP will restart in Access Point mode.

## What is an EMS Telegram?

Written by MichaelDvP in [this article](https://github.com/emsesp/EMS-ESP32/discussions/1612#discussioncomment-8408868):

Best overview of known telegrams is from [Norberts1](https://github.com/norberts1/hometop_HT3/blob/master/HT3/docu/HT_EMS_Bus_messages.pdf) and the [EMS-Wiki](https://emswiki.thefischer.net/doku.php). In general we can say:

- measurement values are broadcasted periodical 10 sec / 1 min
- settings are only broadcasted after a change
- changing a setting of a device via the UI of thermostat results in a message thermostat -w-> device with only this value
- some devices broadcast fast changing values as single values
- measured temperatures are normally 2 bytes (SHORT) with factor 0.1 (e.g. 01 23 -> 0x0123 -> dez 291 -> 29.1°C)
- air temperature settings are often factor 0.5 as single byte (INT) (e.g. 0x2D -> dez 45 -> 22.5°C)
- water temperature settings are typically single byte (UINT) (e.g. 0x3C -> 60°C), differential values (hysteresis in Kelvin) are signed (INT)
- percent settings are single byte (UINT) (0x64 -> 100%)
- on/off states or settings can be single byte with on/off 0xFF/0x00, or 0x01/0x00 or a single bit in a byte together with 7 other states
- times and energy is typically 3 or 4 bytes with or without factor

For different brands/devices Bosch sometimes use different expressions for the same value, Maybe changing developers or they like to make reverse engineering difficult!

If you search a setting, log the telegrams for the device (log all or watch &lt;device-id&gt;) and change the setting on the thermostat to different states/values. Then search for these values in the log. If you search for a measurement, log the device and view the value on the thermostat and wait for changes, note old/new values and time. Then check the log for this time stamp (or 10 sec / 1 min later) and the value within a telegram. Best to have more changes/values to be sure.

## Can EMS-ESP simulate a Thermostat?

Partially. As the folks over at [OpenTherm Gateway (OTGW)](https://otgw.tclcode.com/standalone.html#intro) nicely put it:

:::tip[Why use a Thermostat?]

    - The thermostat manufacturers have spent years of research to work out the heating characteristics for the most efficient and comfortable way to heat a house.
    - The thermostat provides a control interface that people are familiar with, so other members of the household are still able to adjust the setpoint.
    - It provides convenient housing for the room temperature sensor, which is needed unless you use a heating curve based solely on the outside temperature.

:::

As **MichaelDvP** points out _"a thermostat is a clever electronic device. You can put in the desired room temperature and it calculates from some parameters and measurements the required flowtemp for this room temperature and sends it to the boiler. This happens in a control loop and is updated often."_

And **mtc716** said _"A thermostat creates a heat curve that is constantly adapted to the surrounding temperatures and used to estimate which water temperature is necessary in order to bring the room temperature up. There are some good articles in the net about how to setup the heat curve correctly. The main parameters you need are "design temp" which is the heating water temp at minimal outside temp. Furthermore you need the "comfort temp" like explained before and the "temp offset" which causes a parallel shift in the heating curve."_

Additionally, As **MichaelDvP** says "If you want to build a software controlled thermostat, you can use different methods:"

- outdoortemperature controlled:
  define a heatingcurve for your building. This is a linear interpolation between a minimum outdoortemp for your region (typical-11°C for middle europe) with max flowtemp (designtemp ~76°C for radiators, 40°C for floor) and the actual room setpoint (e.g. 21°C) for outdoor and flowtemp. You can add an offset.
  selflowtemp = offset + setpoint + (designtemp- setpoint) \* (setpoint - outdoortemp) / (setpoint - minoutdoor)
- room controlled, switched:
  measure the roomtemperature and switch the boiler with heatingoff enabled for roomtemp > setpoint. To avoid many switching add a hysteresis
- room controlled, dynamic
  Here you need to calculate a PID control. A bit out of scope for the ems-esp scheduler. But maybe possible. With HA you can check Implementing a smart thermostat (using SAT). See [#2103](https://github.com/emsesp/EMS-ESP32/issues/2103)
- controlled by smart TRVs:
  If you can read the opening of the TRVs make a simple I-Control. If a TRV is fully open: increase flowtemp, if the most open TRV is below 90% opening: decrease flowtemp. Heating is a slow process, so increase/decrease carefully.

For further reading, check out these discussions:

- [Smart control a heating system with HA?](https://github.com/emsesp/EMS-ESP32/discussions/965)
- [Thermostat emulation](https://github.com/emsesp/EMS-ESP32/issues/151)
- [Changing the boiler heating directly](tips-and-tricks#controlling-the-boiler-heating)
- [Implementing a smart thermostat (using SAT)](https://github.com/emsesp/EMS-ESP32/issues/2103)

## What are Bus protocols and Tx modes?

Protocol and timing are different things, you pick the tx-mode that works best.

HT3 is the Junkers electronic and HT3 protocol is the same as EMS, only in first byte (sender) the highest bit is set. Each telegram we send starts with 0B in a Buderus system, but with 8B in Junkers. This makes the devices of the different brands incompatible. EMS-ESP checks the bus on start and select the right protocol automatically. Also Junkers uses different telegram numbers/orders. Bosch labeled modules uses the same telegram numbers as Buderus, but addressing like Junkers, so also incompatible. You can't connect Junkers or Buderus modules to a Bosch heating system.

Tx-mode is the send timing: The client devices send by current modulation, the master by voltage modulation. This allows full duplex (Hardware mode), but depending on line impedance drawing current also influences the voltage. When sending, the master repeats every byte sent by the device to publish it to the other devices. With a Tx-mode of "EMS" we wait for the master byte before sending the next. The older Junkers seems to have a lower timeout so we need to start the next byte before the master echo is completed ("HT3"). "EMS+" is less critical and we can wait a bit longer than one byte to allow voltage to be stabilized after the sending.

## Can you run multiple instances of EMS-ESP?

Yes you can. Keep in mind the following settings:

- (Settings->MQTT Settings) MQTT `Entity ID format` is set to "Multiple instances, short name"
- (Settings->MQTT Settings) MQTT `Client ID` must be unique to avoid conflicts in the MQTT broker
- (Settings->MQTT Settings) MQTT `Base` is unique (just be sure). Usually set this to the hostname.
- (Settings->Network Settings) `Hostname` is unique, to avoid network conflicts
- (Settings->Application Settings) `EMS BUS ID` are different (not both 0x0B)

## Why do EMS telegram's in `raw watch` mode have a type 0x100 higher then in `raw` mode?

See [this discussion](https://github.com/emsesp/EMS-ESP32/discussions/2025)

## Should I raise the minBurnPower to between 10-20% in cold winters, so there's always a baseline thermal supply?

(answer from [MichaelDvP](https://github.com/MichaelDvP))

That will not work. The Boiler works with `selflowtemp` as target and modulates the burner to hold the `flowtemp`. If `flowtemp` is higher than selected on min burn power, the boiler shut off, waits the min period and `flowtemp` is down to `selflowtemp` -   hysteresis and starts again. Raising the `burnminpower` will only result in more on/off cycles in mild conditions.

## How to conserve energy of the ESP32 chip

If you're concerned about the energy consumption of the ESP32 chip and need to reduce the heat consumption you can apply some of these settings:
- `Underclock CPU speed` in the **Application Settings/Hardware section**
- If you're using WiFi enable `WiFi Sleep Mode`, select `use lower WiFi bandwidth` and lower the transmit `Tx power` to around 8.5 dBm in the **Network Settings/WiFi section**
- If you're using Ethernet enable `Force 10Mbit half-duplex` in the **Network Settings/Ethernet section**

Note this will reduce the performance of the ESP32 chip and may cause stability issues.

## Upgrading the firmware

When upgrading or downgrading between EMS-ESP versions, EMS-ESP will handle any migrations of the settings to maintain compatibility with the new version installed.

Always read the [ChangeLog](Version-Release-History.md) for the release notes and notes of any breaking changes before upgrading.

### Upgrading from 3.8.x to 3.9.x

:::warning[No factory reset needed]

When you install 3.9.x from the Web UI of a 3.8.x version, the dialog says the upgrade requires a factory reset. This is no longer the case, so ignore that part of the message. Your settings are kept and migrated.

:::

Before you upgrade:

1. **Make a System Backup** in Settings > Download/Upload. After the upgrade, passwords are stored hashed and 3.8.x can't read them, so going back to 3.8.x needs this backup, otherwise a factory reset.
2. **Note which integrations use the API**, such as Home Assistant REST sensors, Node-RED or scripts. Their access tokens stop working after the upgrade.

After the upgrade:

1. **Set new passwords if you still use the factory ones.** An admin who signs in with a factory password must set a new admin password before the Web UI can be used, plus a new access point password if no WiFi network is set.
2. **Create an API key for each integration** in Security > API Keys and send it as `Authorization: Bearer <key>`. Pick "Read" for integrations that only read values, "Read and Write" for ones that change settings or values.
3. **Check what guest users can do.** Only admins can change the Scheduler, Commands, Custom Entities and Modules. Commands from before the upgrade can still be run by guests; for new Commands, tick "Guests may run this command" if they should.

You don't need to upload your backup after the upgrade. Keep it in case you want to go back to 3.8.x. The full list of breaking changes is in the [ChangeLog](Version-Release-History.md).

### Firmware not signed by EMS-ESP

From 3.9.0, EMS-ESP only installs firmware that is signed by EMS-ESP. This applies to uploading a firmware file in the Web UI, installing a version from the Web UI's version list, uploading in the Recovery app and uploading a filesystem image. All official releases and development builds from [GitHub](https://github.com/emsesp/EMS-ESP32/releases) are signed. Anything else is refused with "This firmware is not signed by EMS-ESP" and nothing is installed.

You'll usually see this when:

- **you go back to a version older than 3.8.6.** Only 3.8.6 and newer are signed. Use the 3.8.6 files from its [release page](https://github.com/emsesp/EMS-ESP32/releases/tag/v3.8.6), or allow one unsigned upload as described below.
- **you install a build that isn't from EMS-ESP**, such as one you built yourself or a community build.
- **the file was changed or damaged**, for example by a browser or download manager. Download it again from the release page.

#### Allowing one unsigned upload

You need physical access to the device, so this can't be done over the network:

1. Connect the device to a computer with a USB cable and open the serial console at 115200 baud. See [Console](Console.md) for how.
2. Type `su` and sign in with the username and password of a Web UI admin user.
3. Type `allow unsigned`.
4. Upload the firmware in the Web UI as usual.

This allows one upload only. It ends after that upload or when the device restarts. It doesn't work over telnet or in the Web UI's console. While it's on, the upload pages show a warning.

The Version page shows "Official build" next to the version when the running firmware is signed by EMS-ESP, and "Custom build" otherwise.

Flashing over USB with the [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher) or esptool is never checked, so that also works.

#### Building your own firmware

If you install your own builds often, you can sign them with your own key so the device accepts them without `allow unsigned`. The steps are in [Installing your own build](https://github.com/emsesp/EMS-ESP32/blob/dev/CONTRIBUTING.md#installing-your-own-build).

### Why am I asked for my password again?

From 3.9.0, the Web UI asks for your password again before changes that could take over or lock you out of the device:

- uploading or installing firmware, also the Recovery app, and switching to the other firmware partition
- restoring a backup, or downloading one with passwords and keys
- a factory reset
- adding, changing or removing users and passwords, and creating or revoking API keys
- turning on CORS, adding allowed host names, turning on the API bypass, or turning on telnet

Once entered, you aren't asked again for 5 minutes on that browser. Signing in again or restarting EMS-ESP ends this.

Scripts that make these changes with a Web UI sign-in get HTTP status 428. They need to send the password first with `POST /rest/confirmPassword` and the body `{"password":"..."}`, using the same token. Integrations with API keys and MQTT are not affected.

### Installing firmware from a URL

From 3.9.0, firmware can only be installed from a URL of an EMS-ESP release on GitHub, starting with `https://github.com/emsesp/EMS-ESP32/releases/`. The Web UI's version list always uses these. For any other file, download it and upload it in the Web UI instead.
