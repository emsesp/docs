---
title: EMS-ESP Documentation
description: Open-source firmware for the Espressif ESP32 microcontroller that communicates with EMS (Energy Management System) based equipment
hide:
  - toc
---

<div class="hero-section" style="text-align: center; margin: 2rem 0; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white;">
  <img style="width: 80px; height: 80px; margin-bottom: 1rem;" src="_media/logo/boiler.svg" alt="EMS-ESP Logo">
  <h1 style="margin: 0; font-size: 2.5rem; font-weight: 300;">EMS-ESP</h1>
  <p style="font-size: 1.2rem; margin: 0.5rem 0; opacity: 0.9;">Open-source firmware for ESP32 to communicate with EMS heating appliances</p>
</div>

[![version](https://img.shields.io/github/release/emsesp/EMS-ESP32.svg?label=Latest%20Release)](https://github.com/emsesp/EMS-ESP32/blob/main/CHANGELOG.md)
[![release-date](https://img.shields.io/github/release-date/emsesp/EMS-ESP32.svg?label=Released)](https://github.com/emsesp/EMS-ESP32/commits/main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=emsesp_EMS-ESP32&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=emsesp_EMS-ESP32)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/9441142f49424ef891e8f5251866ee6b)](https://www.codacy.com/gh/emsesp/EMS-ESP32/dashboard?utm_source=github.com&utm_medium=referral&utm_content=emsesp/EMS-ESP32&utm_campaign=Badge_Grade)
[![downloads](https://img.shields.io/github/downloads/emsesp/EMS-ESP32/total.svg)](https://github.com/emsesp/EMS-ESP32/releases)
[![chat](https://img.shields.io/discord/816637840644505620.svg?style=flat-square&color=blueviolet)](https://discord.gg/3J3GgnzpyT)

[![donate](https://img.shields.io/badge/donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/prderbyshire/2)

<div class="releases-section" style="background: var(--md-default-bg-color--lighter); padding: 1.5rem; border-radius: 8px; margin: 2rem 0; border-left: 4px solid #28a745;">
  <h3 style="margin-top: 0; color: #28a745;">📦 Latest Releases</h3>
  <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
    <div>
      <strong>Stable:</strong> <a href="https://github.com/emsesp/EMS-ESP32/releases/tag/v3.7.2" style="color: #28a745; font-weight: bold;">v3.7.2</a>
    </div>
    <div>
      <strong>Development:</strong> <a href="https://github.com/emsesp/EMS-ESP32/releases/tag/latest" style="color: #007bff; font-weight: bold;">v3.7.3</a>
    </div>
  </div>
</div>

<div class="description-section" style="margin: 2rem 0; padding: 1.5rem; background: var(--md-default-bg-color); border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
  <p style="font-size: 1.1rem; line-height: 1.6; margin: 0; color: var(--md-default-fg-color);">
    <strong>EMS-ESP</strong> is an open-source firmware for the Espressif ESP32 microcontroller to communicate with <strong>EMS</strong> (Energy Management System) compatible equipment from manufacturers such as <strong>Bosch</strong>, <strong>Buderus</strong>, <strong>Nefit</strong>, <strong>Junkers</strong>, <strong>Worcester</strong>, <strong>Sieger</strong>, <strong>elm.leblanc</strong> and <strong>iVT</strong>.
  </p>
</div>

<div class="features-section" style="margin: 2rem 0;">
  <h2 style="text-align: center; margin-bottom: 2rem; color: var(--md-default-fg-color);">🚀 Key Features</h2>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #007bff; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #007bff;">🔌 Device Compatibility</h4>
      <ul style="margin: 0; padding-left: 1.2rem; color: var(--md-default-fg-color);">
        <li>EMS, EMS+, EMS2, EMS Plus protocols</li>
        <li>Logamatic EMS, Junkers 2-wire</li>
        <li>Heatronic 3 and 4</li>
        <li>120+ different EMS compatible devices</li>
      </ul>
    </div>

    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #28a745; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #28a745;">🌐 Web Interface</h4>
      <ul style="margin: 0; padding-left: 1.2rem; color: var(--md-default-fg-color);">
        <li>Multi-user, multi-language interface</li>
        <li>Real-time monitoring and control</li>
        <li>Easy settings configuration</li>
        <li>11 languages supported</li>
      </ul>
    </div>
    
    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #ffc107; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #e0a800;">🔧 Integration & Automation</h4>
      <ul style="margin: 0; padding-left: 1.2rem; color: var(--md-default-fg-color);">
        <li>Home Assistant, Domoticz, openHAB</li>
        <li>Modbus support</li>
        <li>Powerful Scheduler</li>
        <li>Notification service</li>
      </ul>
    </div>
    
    <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #dc3545; border: 1px solid var(--md-default-fg-color--lightest);">
      <h4 style="margin-top: 0; color: #dc3545;">⚡ Advanced Features</h4>
      <ul style="margin: 0; padding-left: 1.2rem; color: var(--md-default-fg-color);">
        <li>External sensor support</li>
        <li>Serial/USB & Telnet console</li>
        <li>Thermostat simulation</li>
        <li>Custom EMS entities</li>
      </ul>
    </div>
  </div>
  
  <div style="text-align: center; margin: 2rem 0;">
    <p style="font-size: 1.1rem; color: var(--md-default-fg-color--light);">
      For a complete list of features, read the <a href="Version-Release-History" style="color: #007bff; font-weight: bold;">change log</a>
    </p>
  </div>
</div>

<div class="demo-section" style="text-align: center; margin: 3rem 0; padding: 2rem; background: var(--md-default-bg-color--lighter); border-radius: 10px; border: 1px solid var(--md-default-fg-color--lightest);">
  <h3 style="margin-top: 0; color: var(--md-default-fg-color);">📱 Live Demo</h3>
  <img style="width: 80%; max-width: 600px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin: 1rem 0;" src="../_media/screenshot/main-screen.png" alt="EMS-ESP Main Screen">
  <br>
  <a href="https://demo.emsesp.org" style="display: inline-block; margin-top: 1rem; padding: 0.8rem 2rem; background: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background 0.3s;">Try Live Demo</a>
  <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--md-default-fg-color--light);">
    <em>Select your language on the sign-on page and log in with any username and password</em>
  </p>
</div>

<div class="action-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 3rem 0;">
  <div style="background: var(--md-default-bg-color); padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; border-top: 4px solid #28a745; border: 1px solid var(--md-default-fg-color--lightest);">
    <div style="font-size: 2.5rem; margin-bottom: 1rem;">📦</div>
    <h3 style="margin-top: 0; color: #28a745;">Get Started</h3>
    <p style="color: var(--md-default-fg-color--light); margin-bottom: 1.5rem;">Ready to install EMS-ESP? Check out our installation guide to get started.</p>
    <a href="Installing" style="display: inline-block; padding: 0.8rem 1.5rem; background: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Installation Guide</a>
  </div>
  
  <div style="background: var(--md-default-bg-color); padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; border-top: 4px solid #007bff; border: 1px solid var(--md-default-fg-color--lightest);">
    <div style="font-size: 2.5rem; margin-bottom: 1rem;">🆘</div>
    <h3 style="margin-top: 0; color: #007bff;">Need Help?</h3>
    <p style="color: var(--md-default-fg-color--light); margin-bottom: 1.5rem;">Having issues or need support? Check out our support resources and community.</p>
    <a href="Support" style="display: inline-block; padding: 0.8rem 1.5rem; background: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Support</a>
  </div>
  
  <div style="background: var(--md-default-bg-color); padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; border-top: 4px solid #6f42c1; border: 1px solid var(--md-default-fg-color--lightest);">
    <div style="font-size: 2.5rem; margin-bottom: 1rem;">💬</div>
    <h3 style="margin-top: 0; color: #6f42c1;">Join Community</h3>
    <p style="color: var(--md-default-fg-color--light); margin-bottom: 1.5rem;">Connect with other users, get help, and share your experiences.</p>
    <a href="https://discord.gg/3J3GgnzpyT" style="display: inline-block; padding: 0.8rem 1.5rem; background: #6f42c1; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Discord</a>
  </div>
</div>

<div class="discord-widget" style="text-align: center; margin: 3rem 0; padding: 2rem; background: var(--md-default-bg-color--lighter); border-radius: 10px; border: 1px solid var(--md-default-fg-color--lightest);">
  <h3 style="margin-top: 0; color: var(--md-default-fg-color);">🎮 Live Community Chat</h3>
  <p style="color: var(--md-default-fg-color--light); margin-bottom: 1.5rem;">Join our Discord server for real-time support, discussions, and community updates</p>
  <a href="https://discord.gg/3J3GgnzpyT">
    <img style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" src="https://discordapp.com/api/guilds/816637840644505620/widget.png?style=banner2" alt="Discord Server">
  </a>
</div>
