---
title: Installation Guide
description: Getting started with EMS-ESP. What you need, how to install and do initial configuration.
---

<div class="install-hero" style="text-align: center; margin: 2rem 0; padding: 2rem; background: var(--md-default-bg-color--lighter); border-radius: 10px; border: 1px solid var(--md-default-fg-color--lightest);">
  <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
  <h1 style="margin: 0; color: var(--md-default-fg-color);">Installation Guide</h1>
  <p style="font-size: 1.2rem; margin: 1rem 0; color: var(--md-default-fg-color--light);">
    Everything you need to get EMS-ESP up and running
  </p>
</div>

<div class="hardware-requirements" style="margin: 3rem 0;">
  <h2 style="color: var(--md-default-fg-color);">🔧 Required Hardware</h2>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin: 2rem 0;">
    <div style="background: var(--md-default-bg-color); padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔌</div>
        <h3 style="margin: 0; color: var(--md-default-fg-color);">ESP32 Development Board</h3>
      </div>
      <p style="color: var(--md-default-fg-color); margin-bottom: 1rem;">
        The EMS-ESP firmware runs on an ESP32 module from <a href="https://www.espressif.com/en/products/socs" style="color: #007bff;">Espressif</a>. The chipsets ESP32-S, ESP32-S2, ESP32-S3 and ESP32-C3 are supported.
      </p>
      <p style="color: var(--md-default-fg-color--light); font-size: 0.9rem;">
        See the post <a href="https://github.com/emsesp/EMS-ESP32/discussions/839#discussioncomment-4493156" style="color: #007bff;">here</a> on which development boards we have tested against.
      </p>
      <div style="text-align: center; margin-top: 1.5rem;">
        <img style="width: 100%; max-width: 400px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" src="../_media/images/esp32-dev-boards.jpg" alt="ESP32 Development Boards">
      </div>
    </div>

    <div style="background: var(--md-default-bg-color); padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔗</div>
        <h3 style="margin: 0; color: var(--md-default-fg-color);">EMS Interface Board</h3>
      </div>
      <p style="color: var(--md-default-fg-color); margin-bottom: 1rem;">
        EMS-ESP also requires a separate circuit to read and write to the EMS bus. You can either <a href="EMS-Circuit" style="color: #007bff;">build your own</a> or purchase a EMS Gateway board directly from BBQKees Electronics.
      </p>
      <div style="text-align: center; margin: 1.5rem 0;">
        <img style="width: 120px; margin: 0.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" src="../_media/images/EMS-Gateway-S3.png" alt="EMS Gateway S3">
        <img style="width: 120px; margin: 0.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" src="../_media/images/EMS-Gateway-E32-V2.png" alt="EMS Gateway E32 V2">
      </div>
      <div style="text-align: center;">
        <a href="https://bbqkees-electronics.nl" style="display: inline-block; padding: 0.8rem 1.5rem; background: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit BBQKees Electronics</a>
      </div>
    </div>
  </div>
</div>

<div class="installation-section" style="margin: 3rem 0;">
  <h2 style="color: var(--md-default-fg-color);">🚀 Installing EMS-ESP</h2>
  
  <div style="background: var(--md-default-bg-color); padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest); margin-bottom: 2rem;">
    <div style="text-align: center;">
      <h3 style="margin-top: 0; color: var(--md-default-fg-color);">📥 Download & Install</h3>
      <p style="color: var(--md-default-fg-color--light); margin-bottom: 2rem;">
        Click the link below to go to the download page and see the multiple methods available to install the firmware onto your ESP32 board.
      </p>
      <a href="https://download.emsesp.org" style="display: inline-block; padding: 1rem 2rem; background: #007bff; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Install Firmware</a>
    </div>
  </div>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #ffc107; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #e0a800;">⚠️ Important Notice</h4>
      <p style="margin: 0; color: var(--md-default-fg-color);">
        Pay attention to the <a href="Version-Release-History" style="color: #007bff;">Change Log</a> before upgrading so you are aware of any breaking changes.
      </p>
    </div>

    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #17a2b8; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #17a2b8;">💾 Backup Recommendation</h4>
      <p style="margin: 0; color: var(--md-default-fg-color);">
        If you are upgrading from a previous release it's recommended you make a backup copy of any settings and configurations before performing the installation. This can be done from the WebUI Settings page 'Download/Upload'.
      </p>
    </div>
  </div>
</div>

<div class="led-status-section" style="margin: 3rem 0;">
  <h2 style="color: var(--md-default-fg-color);">💡 LED Status Indicators</h2>
  <p style="color: var(--md-default-fg-color--light); margin-bottom: 2rem;">
    When EMS-ESP starts-up and is running, the onboard LED will show the system status.
  </p>
  
  <div class="boot-sequence" style="margin: 2rem 0;">
    <h3 style="color: var(--md-default-fg-color);">🔄 During Boot Sequence</h3>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #dc3545; border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; align-items: center; margin-bottom: 1rem;">
          <div style="width: 20px; height: 20px; background: #dc3545; border-radius: 50%; margin-right: 1rem; animation: blink 1s infinite;"></div>
          <h4 style="margin: 0; color: #dc3545;">1 Flash</h4>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          EMS bus is not yet connected. If this takes more than a few seconds check the EMS Tx Mode and the physical connection to the EMS bus.
        </p>
      </div>
      
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #ffc107; border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; align-items: center; margin-bottom: 1rem;">
          <div style="width: 20px; height: 20px; background: #ffc107; border-radius: 50%; margin-right: 1rem; animation: blink 1s infinite;"></div>
          <div style="width: 20px; height: 20px; background: #ffc107; border-radius: 50%; margin-right: 1rem; animation: blink 1s infinite; animation-delay: 0.5s;"></div>
          <h4 style="margin: 0; color: #e0a800;">2 Flashes</h4>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          Network (WiFi or Ethernet) is connecting. If this persists check the EMS-ESP Network settings. EMS-ESP uses 2.4GHz/WPA2 only.
        </p>
      </div>
      
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #6f42c1; border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; align-items: center; margin-bottom: 1rem;">
          <div style="width: 20px; height: 20px; background: #6f42c1; border-radius: 50%; margin-right: 1rem; animation: blink 1s infinite;"></div>
          <div style="width: 20px; height: 20px; background: #6f42c1; border-radius: 50%; margin-right: 1rem; animation: blink 1s infinite; animation-delay: 0.3s;"></div>
          <div style="width: 20px; height: 20px; background: #6f42c1; border-radius: 50%; margin-right: 1rem; animation: blink 1s infinite; animation-delay: 0.6s;"></div>
          <h4 style="margin: 0; color: #6f42c1;">3 Flashes</h4>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          Both the EMS bus and Network are still trying to connect. This could be due to an incorrect EMS-ESP Board Profile setting.
        </p>
      </div>
    </div>
  </div>
  
  <div class="normal-operation" style="margin: 2rem 0;">
    <h3 style="color: var(--md-default-fg-color);">✨ During Normal Operation</h3>
    <p style="color: var(--md-default-fg-color--light); margin-bottom: 1.5rem;">
      Unless the LED has been disabled in the settings, the LED will show the system status.
    </p>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #28a745; border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; align-items: center; margin-bottom: 1rem;">
          <div style="width: 20px; height: 20px; background: #28a745; border-radius: 50%; margin-right: 1rem;"></div>
          <h4 style="margin: 0; color: #28a745;">Steady Light</h4>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          Good connection and EMS data is flowing in.
        </p>
      </div>
      
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #ffc107; border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; align-items: center; margin-bottom: 1rem;">
          <div style="width: 20px; height: 20px; background: #ffc107; border-radius: 50%; margin-right: 1rem; animation: pulse 2s infinite;"></div>
          <h4 style="margin: 0; color: #e0a800;">Slow Pulse</h4>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          Either the WiFi or the EMS bus are still connecting.
        </p>
      </div>
      
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #17a2b8; border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; align-items: center; margin-bottom: 1rem;">
          <div style="width: 20px; height: 20px; background: #17a2b8; border-radius: 50%; margin-right: 1rem; animation: blink 0.3s infinite;"></div>
          <h4 style="margin: 0; color: #17a2b8;">Fast Pulse</h4>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          System is booting up and configuring itself.
        </p>
      </div>
    </div>
  </div>
</div>

<style>
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
