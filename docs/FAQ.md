---
id: FAQ
title: Frequently Asked Questions
description: Common questions and answers about EMS-ESP including factory reset, EMS telegrams, and troubleshooting
---

# FAQ

## How to Factory Reset EMS-ESP?

A factory reset erases all EMS-ESP settings. EMS-ESP then restarts in Access Point mode, where you sign in with the factory `admin` user.

- In the Web UI, as an admin: click **Factory Reset** on the **Settings > Version** page.
- In the console, as an admin: type `call system format`.
- With the GPIO button (enabled by default on all BBQKees boards), on boards with the [Recovery App](#recovery-app) installed: hold the button for about 10 seconds and release it. The gateway restarts into the Recovery App. Sign in there and click **Factory Reset**.

None of these work if factory reset is disabled in the EMS-ESP settings.

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

That will not work. The Boiler works with `selflowtemp` as target and modulates the burner to hold the `flowtemp`. If `flowtemp` is higher than selected on min burn power, the boiler shut off, waits the min period and `flowtemp` is down to `selflowtemp` - hysteresis and starts again. Raising the `burnminpower` will only result in more on/off cycles in mild conditions.

## How to conserve energy of the ESP32 chip

If you're concerned about the energy consumption of the ESP32 chip and need to reduce the heat consumption you can apply some of these settings:

- `Underclock CPU speed` in the **Application Settings/Hardware section**
- If you're using WiFi enable `WiFi Sleep Mode`, select `use lower WiFi bandwidth` and lower the transmit `Tx power` to around 8.5 dBm in the **Network Settings/WiFi section**
- If you're using Ethernet enable `Force 10Mbit half-duplex` in the **Network Settings/Ethernet section**

Note this will reduce the performance of the ESP32 chip and may cause stability issues.

## Upgrading the firmware

When upgrading or downgrading between EMS-ESP versions, EMS-ESP will handle any migrations of the settings to maintain compatibility with the new version installed. Going back from 3.10.0 to an older version is the exception, see [Going back to an older version](#going-back-to-an-older-version).

Always read the [ChangeLog](Version-Release-History.md) for the release notes and notes of any breaking changes before upgrading.

### Upgrading to 3.10.x

:::warning[No factory reset needed]

When you install a 3.9.0 or higher development build from the Web UI of a 3.8.x version, the dialog says the upgrade requires a factory reset. This is not the case, so ignore that part of the message. Your settings are kept and migrated. Upgrading to 3.10.0 doesn't show this message.

Also note that the MAC Address will change, and the DHCP-assigned IP address will likely also change. Use the mDNS (`name.local`) or your router to find the new address.

:::

Before you upgrade:

1. **Make a System Backup** in Settings > Download/Upload. After the upgrade, passwords are stored hashed and older versions can't read them, so going back to 3.8.x or 3.9.x needs this backup.
2. **Note which integrations use the API**, such as Home Assistant REST sensors, Prometheus, Node-RED, dashboards or scripts, including ones that only read values without a token. After the upgrade every call to `/api` needs an API key, and access tokens stop working.

After the upgrade:

1. **Set new passwords if you still use the factory ones.** An admin who signs in with a factory password must set a new admin password before the Web UI can be used, plus a new access point password if no WiFi network is set.
2. **Create an API key for each integration** in Security > API Keys and send it as `Authorization: Bearer <key>`. Pick "Read" for integrations that only read values, "Read and Write" for ones that change settings or values. To read a value in a browser, open the `/api` address and sign in when the browser asks.
3. **Check what guest users can do.** Only admins can change the Scheduler, Commands, Custom Entities and Modules. Commands from before the upgrade can still be run by guests; for new Commands, tick "Guests may run this command" if they should.
4. **Check the Scheduler and Commands for entries you didn't create.** Before 3.10.0, guest users and calls without a token could add them, and they are kept by the upgrade. Scheduler entries run with admin rights. Delete anything you don't recognise, and untick "Guests may run this command" on Commands guests don't need.

#### Home Assistant

Entities that Home Assistant gets through MQTT Discovery keep working, nothing needs to change for them. Only the parts of your configuration that call `/api` directly, such as `rest` sensors and `rest_command`, need an API key:

1. In Security > API Keys, create a key for Home Assistant. Pick "Read" if you only use `rest` sensors, "Read and Write" if you also use `rest_command` to change values.
2. Add the key as a header to every `rest` sensor and `rest_command` that calls EMS-ESP, also the ones that only read:

   ```yaml
   headers:
     authorization: 'Bearer emsesp_...'
   ```

3. Remove any `?access_token=...` from the URLs, a token in the URL no longer works.
4. Restart Home Assistant, or reload the REST entities.

See [Home Assistant](Home-Assistant.md#reading-a-value-via-the-api) for full examples.

#### ioBroker

The [ioBroker ems-esp adapter](https://github.com/tp1de/ioBroker.ems-esp) (7.0.8 and older) reads values without sending a key, and only sends the token when it changes a value. It needs the API key in two places:

1. In Security > API Keys, create a "Read and Write" key for ioBroker.
2. In the adapter settings, change the EMS-ESP address to include the key, for example `http://iobroker:emsesp_...@192.168.1.10`. The name before the `:` can be anything. This lets the adapter read values.
3. Paste the same key into the adapter's EMS-ESP access token field, replacing the old access token. This lets the adapter change values.
4. Save and restart the adapter instance.

You don't need to upload your backup after the upgrade. Keep it in case you want to go back to 3.8.x or 3.9.x. The full list of breaking changes is in the [ChangeLog](Version-Release-History.md).

### Going back to an older version

From 3.10.0, passwords are stored hashed. Older versions read the stored hash as if it were the password itself, so after going back to 3.8.x or 3.9.x your usual password no longer works.

The simplest way back is to restore the System Backup you made before upgrading: install the older version, do a factory reset, sign in with the factory `admin` user and upload the backup in Settings > Download/Upload.

Without that backup, or to keep your settings without a factory reset, sign in with the serial console (USB):

1. Connect to the serial console and type `su`. The password is `ems-esp-neo`, as 3.10.0 removed the Super User password from the settings.
2. Type `show users`. Each user's password is shown as a long text starting with `$pbkdf2-sha256$`.
3. Sign in to the Web UI with that username and the whole text as the password, from `$pbkdf2-sha256$` to the end.
4. In Security > Users, set a new password for each user, and in Security > Settings change the Super User password.

Otherwise a factory reset gets you back in, but removes all settings.

:::warning[Older versions have known security issues]

Versions before 3.10.0 have the security issues fixed in 3.10.0. Only go back if you need to, turn off telnet, and upgrade again as soon as you can.

:::

### Official and custom builds

From 3.10.0, EMS-ESP checks whether firmware is an official build when you upload a firmware file in the Web UI, install a version from the Web UI's version list or upload in the Recovery app. Official releases and development builds from [GitHub](https://github.com/emsesp/EMS-ESP32/releases) are signed by EMS-ESP and install straight away. The Version page shows "Official build" next to the version.

Anything else is a custom build, for example one you built yourself, a community build, a version older than 3.10.0, or a filesystem image. The Web UI then says "This is not an official EMS-ESP build" before anything is installed. Click "Install anyway" to install it, or leave it if you didn't expect this. The Version page then shows "Custom build".

Only install a custom build if you trust where it came from. If you expected an official build, the file may have been changed or damaged, for example by a browser or download manager. Download it again from the release page.

Flashing over USB with the [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher) or esptool isn't checked.

If you build your own firmware, see [Installing your own build](https://github.com/emsesp/EMS-ESP32/blob/dev/CONTRIBUTING.md#installing-your-own-build).

### Why am I asked for my password again?

From 3.10.0, the Web UI asks for your password again before changes that could take over or lock you out of the device:

- uploading or installing firmware, also the Recovery app, and switching to the other firmware partition
- restoring a backup, or downloading one with passwords and keys
- a factory reset
- adding, changing or removing users and passwords, and creating or revoking API keys
- turning on CORS, adding allowed host names, or turning on telnet

Once entered, you aren't asked again for 5 minutes on that browser. Signing in again or restarting EMS-ESP ends this.

Scripts that make these changes with a Web UI sign-in get HTTP status 428. They need to send the password first with `POST /rest/confirmPassword` and the body `{"password":"..."}`, using the same token. Integrations with API keys and MQTT are not affected.

### Installing firmware from a URL

From 3.10.0, firmware can only be installed from a URL of an EMS-ESP release on GitHub, starting with `https://github.com/emsesp/EMS-ESP32/releases/`. The Web UI's version list always uses these. For any other file, download it and upload it in the Web UI instead.

### Firmware rollback

From 3.9.1, a newly installed firmware is only kept once it has run for 2 minutes. If it crashes or restarts before then, the gateway goes back to the firmware it ran before. If there is none, boards with the [Recovery App](#recovery-app) start the Recovery App instead. This works on all boards, also the 4MB ones, as EMS-ESP always has two firmware partitions (`app0` and `app1`).

It applies to firmware installed while EMS-ESP or the Recovery App is running: uploading a file in the Web UI, installing a version from the Web UI's version list, or uploading in the Recovery App. Flashing over USB with the [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher) or esptool isn't checked, that firmware is kept straight away.

Any restart in the first 2 minutes counts, also clicking Restart yourself, so wait until the firmware is confirmed. There are two exceptions:

- when EMS-ESP migrates the settings from an older version and restarts to apply them, it keeps the new firmware first
- when you install another firmware in the first 2 minutes, the one that is running is kept first

The System Log shows what happens:

| Message                                                            | Meaning                                                                                   |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `New firmware, it will be confirmed after running for 120 seconds` | shown at startup, the new firmware is on trial                                            |
| `New firmware confirmed as working`                                | the 2 minutes have passed, the firmware is kept                                           |
| `Firmware in partition app1 failed to start and was rolled back`   | the firmware in `app1` (or `app0`) didn't last 2 minutes, the gateway went back to the other one |

The check is done by the bootloader, the small program at the start of the flash that picks which firmware to start. Installing firmware from the Web UI never replaces the bootloader, only flashing over USB does. Gateways that were flashed over USB with 3.9.0 have a bootloader without rollback. They keep working normally, but a failed update isn't rolled back. If you don't see the first message after installing a new firmware from the Web UI, flash 3.9.1 or newer over USB once to get a bootloader with rollback.

After the firmware is confirmed, EMS-ESP keeps an eye on crashes: on boards with the Recovery App, it starts the Recovery App after crashing 5 times in a row, see [When it starts](#when-it-starts).

## Recovery App

From 3.9.0, boards with 16MB or 32MB flash can have the EMS-ESP Recovery App installed. It's a small, separate firmware that lives in its own part of the flash (the `boot` partition), next to the two partitions that hold EMS-ESP (`app0` and `app1`). If EMS-ESP doesn't start anymore, or a firmware update went wrong, the Recovery App lets you get the gateway working again from a browser, without connecting it over USB. The 4MB boards don't have room for it.

EMS-ESP 3.9.0 comes with Recovery App 1.0.0, and 3.10.0 with Recovery App 1.1.0. Features marked **[3.10.0]** need Recovery App 1.1.0, see [What's new in 3.10.0](#whats-new-in-3100).

### What it can do

After signing in, the Recovery App shows a dashboard where you can:

- **Upload Firmware**: install an EMS-ESP firmware `.bin` file into one of the EMS-ESP partitions. By default it picks an empty partition, then one whose firmware failed to start, and otherwise the one with the oldest firmware, so a working firmware is kept as a fallback. You can also pick the partition yourself. You can also upload the `.md5` file first to check the firmware.
  - **[3.10.0]** As in the Web UI, an official build installs straight away and a custom build asks first, see [Official and custom builds](#official-and-custom-builds).
- **Start Firmware**: restart into one of the installed EMS-ESP firmwares. The table shows the version and install date of each, and warns when a firmware failed to start before.
- **Factory Reset**: erase all EMS-ESP settings. This isn't shown if factory reset is disabled in the EMS-ESP settings.
  - **[3.10.0]** The whole filesystem partition and the crash dump are erased too, so old passwords and keys can't be read back from the flash.
- **[3.10.0] Crash Dump**: download or erase the dump of the last crash, see [Reporting a crash](#reporting-a-crash). This section is only shown when there is a dump.

It also shows why it was started, the chip, the network it's connected to and the installed firmware versions.

The Recovery App only reads the EMS-ESP settings, it never changes them, except for a factory reset. It can't install a filesystem image or restore a backup.

### Installing and updating it

Open **Settings > Version** in the EMS-ESP Web UI. On boards that support it, there's a **Recovery App** row with the installed version, or "Not installed". Click the install button to download the latest version from GitHub. **[3.10.0]** When a newer version is available, the same button updates it, and the row shows whether the installed Recovery App is an official build. You can also download the `EMS-ESP-Recovery-<version>-<chip>-16MB[+].bin` file from the [release page](https://github.com/emsesp/EMS-ESP32/releases) and upload it like a normal firmware. Installing the Recovery App doesn't restart EMS-ESP, and doesn't touch your settings or the installed EMS-ESP firmware.

The Recovery App can only be installed from EMS-ESP, not from the Recovery App itself.

### When it starts

The Recovery App starts:

- when you click **Restart into Recovery App** on the **Settings > Version** page
- when you hold the GPIO button for about 10 seconds, unless factory reset is disabled in the EMS-ESP settings
- automatically, when EMS-ESP crashes 5 times in a row after restarting
- automatically, when a newly installed firmware crashes or restarts within its first 2 minutes and there is no previous firmware to go back to, see [Firmware rollback](#firmware-rollback)

### Connecting to it

The Recovery App uses the network settings saved by EMS-ESP:

- it connects with Ethernet if your board has it set up, otherwise with WiFi, using the static IP address if you set one. Open it in a browser with the usual IP address or `http://<hostname>.local`.
- it always starts an access point as well, named after your EMS-ESP access point with `-recovery` added, for example `ems-esp-recovery`, with the same access point password. Connect to it and open `http://192.168.4.1`, or the access point IP address you set in EMS-ESP.

Sign in with an existing EMS-ESP admin user and password. Guest users can't sign in. If the settings can't be read, for example after a factory reset, use the factory `admin` login. In that case factory reset is not available.

**[3.10.0]** After several failed sign-ins, the Recovery App asks you to wait a few minutes before trying again.

### Going back to EMS-ESP

Restarting the gateway or powering it off and on keeps it in the Recovery App. To leave it, click **Start Firmware** next to a working EMS-ESP firmware, or upload a new firmware, which starts it after the upload.

### What's new in 3.10.0

Recovery App 1.1.0, released with EMS-ESP 3.10.0, adds:

- a check whether uploaded firmware is an official EMS-ESP build, with "Install anyway" for a custom build
- the **Crash Dump** section, with the crash summary and buttons to download or erase the dump
- support for the hashed passwords of 3.10.0
- a limit on failed sign-ins
- a factory reset that also erases the whole filesystem partition and the crash dump
- firmware uploads that are never left bootable if they fail a check

:::warning[Update the Recovery App after upgrading to 3.10.0]

From 3.10.0, EMS-ESP stores passwords hashed. Recovery App 1.0.0 from 3.9.0 can't read them, so your usual admin password doesn't work there anymore. After upgrading EMS-ESP to 3.10.0, update the Recovery App in **Settings > Version**.

If you can't sign in to Recovery App 1.0.0, use the whole stored hash, starting with `$pbkdf2-sha256$`, as the password. The `show users` console command in EMS-ESP shows it, see [Going back to an older version](#going-back-to-an-older-version). If EMS-ESP doesn't start at all, flash it over USB with the [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher).

:::

## What to do when EMS-ESP crashes

From 3.10.0, when EMS-ESP crashes (a panic, `abort()`, stack overflow or watchdog), the ESP32 saves a crash dump in its flash before it restarts. The dump survives the restart and is kept until the next crash replaces it, or until you erase it.

Only boards with 16MB or 32MB flash have room for a crash dump, the 4MB boards don't. A brownout, a power cut or a normal restart doesn't write a dump.

### Reporting a crash

After the restart, EMS-ESP writes `Crash dump found: ...` to the System Log, and `/api/system/info` shows the same summary as `coredump` in the `system` section. For example:

```text
task=async_tcp pc=0x400d1234 cause=28 vaddr=0x00000000 bt=0x400d1234 0x400d5678 0x400e9abc sha=1a2b3c4d5 reason=LoadProhibited
```

Copy this line into a [GitHub issue](https://github.com/emsesp/EMS-ESP32/issues), together with the EMS-ESP version and your board, and what was happening just before the crash. The developers can turn the addresses into the place in the code where it crashed.

If you can, also attach the full crash dump to the issue. Download it as an admin:

- in EMS-ESP: **Settings > Download/Upload**, button **Crash Dump**. It's only shown when there is a dump. Scripts can use `GET /rest/coredump`.
- in the EMS-ESP Recovery: the **Crash Dump** section on the dashboard, after signing in. It also shows the summary line. This helps when EMS-ESP crashed so often that the board started the Recovery instead.

Both save a `coredump.bin` file.

Then erase the dump so the next crash is clearly a new one: run `call system coredump` in the console, or send `POST /api/system/coredump` as an admin.

| Field    | Meaning                                                                          |
| -------- | -------------------------------------------------------------------------------- |
| `task`   | the task that crashed                                                            |
| `pc`     | the address in the firmware where it crashed                                     |
| `cause`  | the exception cause on the ESP32, e.g. 28 = LoadProhibited, 29 = StoreProhibited |
| `vaddr`  | the memory address that was accessed, near 0 usually means a null pointer        |
| `bt`     | the backtrace, the crashing function first and its callers after it              |
| `sha`    | the start of the SHA256 of the firmware that crashed                             |
| `reason` | the panic reason, e.g. the `abort()` or watchdog message                         |

On the C3 and C6 there is no backtrace, only `ra` (return address), `mcause` and `mtval`.

### Decoding a crash dump yourself

Decoding needs the `firmware.elf` of the exact build that crashed. If you build EMS-ESP yourself, each build keeps a gzipped copy as `build/elf/<variant>-<sha>.elf.gz`, where `<sha>` matches the `sha` in the crash summary. Unpack it with `gunzip -k`. These files are about 20 MB each, so delete old ones now and then.

Turn the addresses from the summary into function, file and line:

```bash
# ESP32, use xtensa-esp32s3-elf-addr2line for the S3 and xtensa-esp32s2-elf-addr2line for the S2
~/.platformio/packages/toolchain-xtensa-esp-elf/bin/xtensa-esp32-elf-addr2line -pfiaC \
  -e .pio/build/s_16M_P/firmware.elf 0x400d1234 0x400d5678 0x400e9abc

# C3/C6, pass the pc and ra
~/.platformio/packages/toolchain-riscv32-esp/bin/riscv32-esp-elf-addr2line -pfiaC \
  -e .pio/build/c3_mini_4M/firmware.elf 0x42001234 0x42005678
```

For the stacks and registers of every task, decode the downloaded `coredump.bin` with the `firmware.elf`:

```bash
~/.platformio/penv/bin/esp-coredump info_corefile -t raw -c coredump.bin .pio/build/s_16M_P/firmware.elf
```

Or connect the board with USB and let `esp-coredump` read and decode the dump in one step:

```bash
~/.platformio/penv/bin/esp-coredump --port /dev/ttyUSB0 info_corefile .pio/build/s_16M_P/firmware.elf
```

Or save the dump over USB into a file, and decode that later:

```bash
# 16MB layout: 0xFF0000, 32MB layout: 0x1FF0000
~/.platformio/penv/bin/esptool.py --port /dev/ttyUSB0 read_flash 0xFF0000 0x10000 coredump.bin
~/.platformio/penv/bin/esp-coredump info_corefile -t raw -c coredump.bin .pio/build/s_16M_P/firmware.elf
```

Use `dbg_corefile` instead of `info_corefile` to open the dump in GDB. For other partition layouts, find the offset of the `coredump` partition with `python gen_esp32part.py .pio/build/<env>/partitions.bin`.

The panic handler also prints the backtrace to the serial port. For a crash that's hard to reproduce, leave a serial monitor logging to a file, which also shows what happened just before the crash:

```bash
pio device monitor -e s_16M_P -f esp32_exception_decoder -f log2file
```
