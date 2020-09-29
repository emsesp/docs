EMS-ESP has a telnet server that enables clients to connect using a telnet client such as [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) or natively via the OS like this example with [Windows 10](https://www.technipages.com/windows-10-enable-telnet). The port is 22. 

If you're using an ESP32 you can also access the console via a USB Serial port, using baud 115200.

The console will give you more insight into the EMS bus traffic, MQTT queues and the full device information. It behaves similar to a Unix/Linux shell. Some of the most common commands are:

  * `help` lists the commands and keywords. This works in each context.
  * `exit` will exit the console or exit the current context. `CTRL-D` does the same.
  * `CTRL-U` for Undo
  * `<TAB>` for auto-complete
  * `system` to enter the system menu. Use `exit` or CTRL-D to return.
  * `su` will switch to the Admin super-user. The default password is `ems-esp-neo` and can be changed with `passwd` from the system menu or via the Web interface (called secret password). When in Admin mode the command prompt switches from `$` to `#`.
  * Some settings can be changed in the console. The `set` command will list them.
  * `show` shows the data specific to the which context you're in. From the root it will show you all the EMS device information and any external temperature sensors.
  * `show commands` will list all the commands which can called with the `call` command. See [Commands](API).
  * `log` sets the logging level. `log off` disables logging. Use `log debug` for debugging commands and actions. This will be reset next time the console is opened.
  * `watch` will output the incoming Rx telegrams directly to the console. You can also put on a watch on a specific EMS device ID or telegram ID. Also choose to output as verbose text as raw data bytes.

## Examples

### Calling a command to change values

Note you have `su` first to get access to all the `call` commands.

![Console](_media/console1.PNG ':size=80%')

### Showing device values
![Console](_media/console2.PNG ':size=80%')

### Monitoring the EMS traffic
![Console](_media/console3.PNG ':size=80%')

## Console Commands

The full list of console commands are shown below:

```
* = available when Admin mode (su)

[main]
  su
  set
  fetch
  publish
  show
  show devices
  show ems
  show values
  show mqtt
  show commands
  call [device type] [cmd] [data] [n]
  read <device ID> <type ID> *
  scan devices [deep] *
  send telegram <"XX XX ..."> *
  set bus_id <device ID> *
  set tx_mode <n> *
  exit
  help
  log [level]
  watch <on | off | raw> [ID]
  set master thermostat [device ID] *
  system

[system]
  set
  show system
  format *
  show users *
  passwd *
  restart *
  set wifi hostname <name> *
  set wifi password *
  set wifi ssid <name> *
  wifi reconnect *
  exit
  help
  log
  su
 ```
