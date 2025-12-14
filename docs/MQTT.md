---
title: MQTT Integration
description: Complete guide to MQTT integration with EMS-ESP for home automation systems
---

<div class="mqtt-hero" style="text-align: center; margin: 2rem 0; padding: 2rem; background: var(--md-default-bg-color--lighter); border-radius: 10px; border: 1px solid var(--md-default-fg-color--lightest);">
  <div style="font-size: 3rem; margin-bottom: 1rem;">📡</div>
  <h1 style="margin: 0; color: var(--md-default-fg-color);">MQTT Integration</h1>
  <p style="font-size: 1.2rem; margin: 1rem 0; color: var(--md-default-fg-color--light);">
    Connect EMS-ESP to your home automation system via MQTT
  </p>
</div>

<div class="mqtt-overview" style="margin: 3rem 0;">
  <h2 style="color: var(--md-default-fg-color);">📊 Published Data</h2>
  
  <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest); margin-bottom: 2rem;">
    <p style="margin: 0; color: var(--md-default-fg-color);">
      When MQTT is enabled, EMS-ESP will publish MQTT topics for each device. The frequency can be configured from the WebUI to be either sent when data changes are detected or set to a specific period in seconds which is kinder on network traffic.
    </p>
  </div>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #28a745; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #28a745;">🔍 MQTT Discovery</h4>
      <p style="margin: 0; color: var(--md-default-fg-color);">
        When MQTT Discovery is enabled, EMS-ESP will automatically create special Discovery topics (with <code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">/config</code>) for each EMS device entity that has received a valid value.
      </p>
    </div>

    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #007bff; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #007bff;">📋 Data Formats</h4>
      <p style="margin: 0; color: var(--md-default-fg-color);">
        The table below lists the topics being published. The format shown is the MQTT Format as defined in EMS-ESP's settings. Default format is <code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">Nested</code> which uses a single topic to show multiple entries in the payload.
      </p>
    </div>

  </div>
</div>

<div class="mqtt-topics" style="margin: 3rem 0;">
  <h2 style="color: var(--md-default-fg-color);">📋 MQTT Topics Reference</h2>
  
  <div style="overflow-x: auto; margin: 2rem 0;">
    <table style="width: 100%; border-collapse: collapse; background: var(--md-default-bg-color); border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <thead>
        <tr style="background: var(--md-default-bg-color--lighter);">
          <th style="padding: 1rem; text-align: left; color: var(--md-default-fg-color); border-bottom: 1px solid var(--md-default-fg-color--lightest);">Topic</th>
          <th style="padding: 1rem; text-align: center; color: var(--md-default-fg-color); border-bottom: 1px solid var(--md-default-fg-color--lightest);">Format</th>
          <th style="padding: 1rem; text-align: left; color: var(--md-default-fg-color); border-bottom: 1px solid var(--md-default-fg-color--lightest);">Description</th>
          <th style="padding: 1rem; text-align: left; color: var(--md-default-fg-color); border-bottom: 1px solid var(--md-default-fg-color--lightest);">Payload Example</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid var(--md-default-fg-color--lightest);">
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">status</code></td>
          <td style="padding: 1rem; text-align: center; color: var(--md-default-fg-color);">n/a</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);">MQTT will and testament messages</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">online</code> or <code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">offline</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--md-default-fg-color--lightest);">
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">info</code></td>
          <td style="padding: 1rem; text-align: center; color: var(--md-default-fg-color);">n/a</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);">System information and events</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">{"version":"3.7.2","hostname":"ems-esp"}</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--md-default-fg-color--lightest);">
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">heartbeat</code></td>
          <td style="padding: 1rem; text-align: center; color: var(--md-default-fg-color);">all</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);">System stats in JSON (default every minute)</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">{"bus_status":"connected","uptime":"02:16:00"}</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--md-default-fg-color--lightest);">
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">tapwater_active</code></td>
          <td style="padding: 1rem; text-align: center; color: var(--md-default-fg-color);">all</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);">Boolean: hot tap water running (DHW)</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color--light);">-</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--md-default-fg-color--lightest);">
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">heating_active</code></td>
          <td style="padding: 1rem; text-align: center; color: var(--md-default-fg-color);">all</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);">Boolean: heating is on</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color--light);">-</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--md-default-fg-color--lightest);">
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">boiler_data</code></td>
          <td style="padding: 1rem; text-align: center; color: var(--md-default-fg-color);">all</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);">Non warm water data from Boiler device</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">{"heatingactive":"off","curflowtemp":57.5}</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--md-default-fg-color--lightest);">
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">thermostat_data</code></td>
          <td style="padding: 1rem; text-align: center; color: var(--md-default-fg-color);">nested</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);">Thermostat data and Heating Circuits</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">{"hc1":{"seltemp":15.0,"mode":"auto"}}</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--md-default-fg-color--lightest);">
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">thermostat_data_hc&lt;id&gt;</code></td>
          <td style="padding: 1rem; text-align: center; color: var(--md-default-fg-color);">single</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);">Individual heating circuit data</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">{"seltemp":15,"mode":"auto"}</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--md-default-fg-color--lightest);">
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">mixer_data</code></td>
          <td style="padding: 1rem; text-align: center; color: var(--md-default-fg-color);">nested</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);">Mixer data with hc1-hc4 and wwc1, wwc2</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">{"hc1":{"flowTemp":55,"pumpStatus":"on"}}</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--md-default-fg-color--lightest);">
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">shower_data</code></td>
          <td style="padding: 1rem; text-align: center; color: var(--md-default-fg-color);">all</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);">Shower timer and alert toggles</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">{"timer":"0","duration":"4m 32s"}</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--md-default-fg-color--lightest);">
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">solar_data</code></td>
          <td style="padding: 1rem; text-align: center; color: var(--md-default-fg-color);">all</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);">Solar Module data (if connected)</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">{"collectorTemp":15.8,"energyToday":1792}</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--md-default-fg-color--lightest);">
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">temperaturesensor_data</code></td>
          <td style="padding: 1rem; text-align: center; color: var(--md-default-fg-color);">nested</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);">External Dallas temperature sensors</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">{"28-233D-9497":{"temp":19.6}}</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--md-default-fg-color--lightest);">
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">analogsensor_data</code></td>
          <td style="padding: 1rem; text-align: center; color: var(--md-default-fg-color);">nested</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);">External analog sensors</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">{"31":{"name":"analog31","value":0}}</code></td>
        </tr>
        <tr>
          <td style="padding: 1rem; color: var(--md-default-fg-color);"><code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">custom_data</code></td>
          <td style="padding: 1rem; text-align: center; color: var(--md-default-fg-color);">nested</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color);">Custom entities</td>
          <td style="padding: 1rem; color: var(--md-default-fg-color--light);">-</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div class="mqtt-commands" style="margin: 3rem 0;">
  <h2 style="color: var(--md-default-fg-color);">📤 Using MQTT to Send Commands</h2>
  
  <div style="background: var(--md-default-bg-color); padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
    <div style="text-align: center;">
      <h3 style="margin-top: 0; color: var(--md-default-fg-color);">🔧 Command Reference</h3>
      <p style="color: var(--md-default-fg-color--light); margin-bottom: 2rem;">
        Learn how to use MQTT to send commands to EMS-ESP for controlling your heating system.
      </p>
      <a href="/Commands#mqtt" style="display: inline-block; padding: 1rem 2rem; background: #007bff; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">View Commands Guide</a>
    </div>
  </div>
</div>

<div class="mqtt-monitoring" style="margin: 3rem 0;">
  <h2 style="color: var(--md-default-fg-color);">📊 Monitoring MQTT Traffic</h2>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #28a745; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #28a745;">🔍 MQTT Explorer</h4>
      <p style="margin: 0; color: var(--md-default-fg-color);">
        For precise monitoring of MQTT traffic, I suggest using <a href="http://mqtt-explorer.com/" style="color: #007bff;">MQTT Explorer</a>. This tool provides a visual interface to monitor all MQTT topics and messages.
      </p>
    </div>

    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #17a2b8; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #17a2b8;">💻 Console Commands</h4>
      <p style="margin: 0; color: var(--md-default-fg-color);">
        Use the console command <code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">show mqtt</code> to display the status of the MQTT service, topic subscriptions, and outbound publishing queue.
      </p>
    </div>

    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #ffc107; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #e0a800;">📈 WebUI Status</h4>
      <p style="margin: 0; color: var(--md-default-fg-color);">
        In the WebUI you can see the size of the queue and overall stats are available in the <strong>Status</strong> page.
      </p>
    </div>

  </div>
</div>
