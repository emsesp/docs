
## via the Web

![Web](_media/web_status.PNG)

## via the Console

EMS-ESP has a telnet server that enables clients to connect using a telnet client such as [CoolTerm](http://freeware.the-meiers.org/), [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) or natively via the OS like this example with [Windows 10](https://www.technipages.com/windows-10-enable-telnet).

Connecting to the console will give you more insight into the EMS bus traffic, MQTT queues and the full device information.

The console is reachable via Telnet (port 22) or via the Serial port if using an USB (on baud 115200). To change any settings in the console you must be admin (use `su` with the default password `ems-esp-neo`).
  
Some of the most common commands are:
  * `help` lists the commands and keywords. This works in each context.
  * `exit` will exit the console or exit the current context. `CTRL-D` does the same.
  * `CTRL-U` for Undo
  * `<TAB>` for auto-complete
  * Some specific commands are behind contexts. Think of this as a sub-menu. e.g. `system`, `thermostat`. The path will always show you which context you are in. `$` is the root.
  * `su` will switch to the Admin super-user. The default password is `ems-esp-neo` and can be changed with `passwd` from the system menu or via the Web interface (called secret password). When in Admin mode the command prompt switches from `$` to `#`.
  * Some settings can be changed in the console. The `set` command will list them.
  * `show` shows the data specific to the which context you're in. From the root it will show you all the EMS device information and any external temperature sensors. 
  * `log` sets the logging level. `log off` disables logging. Use `log debug` for debugging commands and actions. This will be reset next time the console is opened.
  * `watch` will output the incoming Rx telegrams directly to the console. You can also put on a watch on a specific EMS device ID or telegram ID. Also choose to output as verbose text as raw data bytes.

The `call` command is to execute a command. The command names (`[cmd]`) are the same as the MQTT commands as described in the [MQTT](MQTT.md) section. You can view these from the console directly by teh command `call` without any arguments, as admin.

Connect to the IP address of the EMS-ESP. Type `?` or `help` to see a list of commands:

![Console](_media/console.PNG)




