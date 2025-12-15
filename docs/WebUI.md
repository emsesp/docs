---
title: WebUI
description: Access and navigate the EMS-ESP web interface
---

<div class="webui-hero" style="text-align: center; margin: 2rem 0; padding: 2rem; background: var(--md-default-bg-color--lighter); border-radius: 10px; border: 1px solid var(--md-default-fg-color--lightest);">
  <div style="font-size: 3rem; margin-bottom: 1rem;">🌐</div>
  <h1 style="margin: 0; color: var(--md-default-fg-color);">Web Interface</h1>
  <p style="font-size: 1.2rem; margin: 1rem 0; color: var(--md-default-fg-color--light);">
    Access your EMS-ESP device through the modern web interface
  </p>
</div>

<div class="access-section" style="margin: 2rem 0; padding: 1.5rem; background: var(--md-default-bg-color); border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
  <h3 style="margin-top: 0; color: var(--md-default-fg-color);">🔗 Accessing the WebUI</h3>
  <p style="margin: 0; color: var(--md-default-fg-color);">
    Access the WebUI via <code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">http://ems-esp</code> or <code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">http://ems-esp.local</code>. The <code style="background: var(--md-code-bg); padding: 0.2rem 0.4rem; border-radius: 3px; color: var(--md-code-fg);">ems-esp</code> is the name of the WiFi hostname as defined in the WiFi Settings page.
  </p>
</div>

<div class="screenshots-section" style="margin: 3rem 0;">
  <h2 style="text-align: center; margin-bottom: 2rem; color: var(--md-default-fg-color);">📱 Interface Screenshots</h2>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest); text-align: center;">
      <h4 style="margin-top: 0; color: var(--md-default-fg-color);">📊 Status Dashboard</h4>
      <p style="color: var(--md-default-fg-color--light); margin-bottom: 1rem;">Monitor your EMS system status and real-time data</p>
      <img style="width: 100%; max-width: 400px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" src="../_media/screenshot/web_status.png" alt="Web Status Dashboard">
    </div>

    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest); text-align: center;">
      <h4 style="margin-top: 0; color: var(--md-default-fg-color);">🔧 Device Management</h4>
      <p style="color: var(--md-default-fg-color--light); margin-bottom: 1rem;">Configure and manage your EMS devices</p>
      <img style="width: 100%; max-width: 400px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" src="../_media/screenshot/web_devices.png" alt="Web Devices Management">
    </div>

    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest); text-align: center;">
      <h4 style="margin-top: 0; color: var(--md-default-fg-color);">⚙️ System Settings</h4>
      <p style="color: var(--md-default-fg-color--light); margin-bottom: 1rem;">Configure system parameters and preferences</p>
      <img style="width: 100%; max-width: 400px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" src="../_media/screenshot/web_settings.png" alt="Web Settings Configuration">
    </div>

    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest); text-align: center;">
      <h4 style="margin-top: 0; color: var(--md-default-fg-color);">📡 MQTT Configuration</h4>
      <p style="color: var(--md-default-fg-color--light); margin-bottom: 1rem;">Set up MQTT broker connection and topics</p>
      <img style="width: 100%; max-width: 400px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" src="../_media/screenshot/web_mqtt.png" alt="Web MQTT Configuration">
    </div>

  </div>
</div>

<div class="features-section" style="margin: 3rem 0;">
  <h2 style="text-align: center; margin-bottom: 2rem; color: var(--md-default-fg-color);">✨ WebUI Features</h2>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #007bff; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #007bff;">📊 Real-time Monitoring</h4>
      <ul style="margin: 0; padding-left: 1.2rem; color: var(--md-default-fg-color);">
        <li>Live data updates</li>
        <li>System status overview</li>
        <li>Device health monitoring</li>
      </ul>
    </div>

    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #28a745; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #28a745;">🔧 Easy Configuration</h4>
      <ul style="margin: 0; padding-left: 1.2rem; color: var(--md-default-fg-color);">
        <li>Intuitive settings interface</li>
        <li>Device management tools</li>
        <li>Network configuration</li>
      </ul>
    </div>

    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #ffc107; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #e0a800;">🌐 Multi-language Support</h4>
      <ul style="margin: 0; padding-left: 1.2rem; color: var(--md-default-fg-color);">
        <li>11 supported languages</li>
        <li>Localized interface</li>
        <li>Customizable labels</li>
      </ul>
    </div>

    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #dc3545; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #dc3545;">📱 Responsive Design</h4>
      <ul style="margin: 0; padding-left: 1.2rem; color: var(--md-default-fg-color);">
        <li>Mobile-friendly interface</li>
        <li>Tablet optimization</li>
        <li>Desktop compatibility</li>
      </ul>
    </div>

  </div>
</div>

<div class="quick-start" style="margin: 3rem 0; padding: 2rem; background: var(--md-default-bg-color--lighter); border-radius: 10px; border: 1px solid var(--md-default-fg-color--lightest);">
  <h3 style="margin-top: 0; color: var(--md-default-fg-color);">🚀 Quick Start</h3>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
    <div style="text-align: center;">
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">1️⃣</div>
      <h4 style="margin: 0; color: var(--md-default-fg-color);">Connect</h4>
      <p style="margin: 0; color: var(--md-default-fg-color--light); font-size: 0.9rem;">Access via http://ems-esp</p>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">2️⃣</div>
      <h4 style="margin: 0; color: var(--md-default-fg-color);">Configure</h4>
      <p style="margin: 0; color: var(--md-default-fg-color--light); font-size: 0.9rem;">Set up your devices</p>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">3️⃣</div>
      <h4 style="margin: 0; color: var(--md-default-fg-color);">Monitor</h4>
      <p style="margin: 0; color: var(--md-default-fg-color--light); font-size: 0.9rem;">Watch real-time data</p>
    </div>
  </div>
</div>
