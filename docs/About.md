<div class="about-hero" style="text-align: center; margin: 2rem 0; padding: 2rem; background: var(--md-default-bg-color--lighter); border-radius: 10px; border: 1px solid var(--md-default-fg-color--lightest);">
  <img style="width: 80px; height: 80px; margin-bottom: 1rem;" src="../_media/logo/boiler_64.png" alt="EMS-ESP Logo">
  <h1 style="margin: 0; color: var(--md-default-fg-color);">About EMS-ESP</h1>
  <p style="font-size: 1.2rem; margin: 1rem 0; color: var(--md-default-fg-color--light);">
    Open source firmware for ESP32-based devices
  </p>
</div>

<div class="about-description" style="margin: 2rem 0; padding: 1.5rem; background: var(--md-default-bg-color); border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
  <p style="font-size: 1.1rem; line-height: 1.6; margin: 0; color: var(--md-default-fg-color);">
    <strong>EMS-ESP</strong> is an open source firmware for <a href="https://www.espressif.com/en/products/socs" style="color: #007bff;">Espressif</a> ESP32 based chipsets originally developed by <a href="https://github.com/proddy" style="color: #007bff;">@Proddy</a> back in 2018 and now owned and maintained exclusively by both <strong>Proddy</strong> and <a href="https://github.com/MichaelDvP" style="color: #007bff;">@MichaelDvP</a>.
  </p>
</div>

<div class="disclaimer-section" style="margin: 2rem 0;">
  <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #ffc107; border: 1px solid var(--md-default-fg-color--lightest);">
    <h4 style="margin-top: 0; color: #e0a800;">⚠️ Important Disclaimer</h4>
    <p style="margin: 0; color: var(--md-default-fg-color);">
    This code was developed based off information gathered on the internet and many hours of reverse engineering the communications between the EMS bus and real live devices. It is not based on any official documentation or supported libraries from Bosch/Buderus/Junkers/Nefit (and associated companies) and therefore there are no guarantees whatsoever regarding the safety of your devices and/or their settings, or the accuracy of the information provided.
    </p>
  </div>
</div>

<div class="license-section" style="margin: 2rem 0; padding: 1.5rem; background: var(--md-default-bg-color--lighter); border-radius: 8px; border: 1px solid var(--md-default-fg-color--lightest);">
  <h3 style="margin-top: 0; color: var(--md-default-fg-color);">📄 License</h3>
  <p style="margin: 0; color: var(--md-default-fg-color--light);">
    This program is licensed under <strong>GPL-3.0</strong>.
  </p>
</div>

<div class="history-section" style="margin: 3rem 0;">
  <h2 style="text-align: center; margin-bottom: 2rem; color: var(--md-default-fg-color);">📚 Project History</h2>
  <p style="text-align: center; font-size: 1.1rem; color: var(--md-default-fg-color--light); margin-bottom: 3rem;">
    A journey through the evolution of EMS-ESP from prototype to production
  </p>
  
  <div class="timeline" style="position: relative; max-width: 800px; margin: 0 auto;">
    <!-- Timeline line -->
    <div style="position: absolute; left: 30px; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, #007bff, #28a745);"></div>

    <!-- 2017 -->
    <div class="timeline-item" style="position: relative; margin-bottom: 3rem; padding-left: 80px;">
      <div style="position: absolute; left: 20px; top: 10px; width: 20px; height: 20px; background: #007bff; border-radius: 50%; border: 3px solid var(--md-default-bg-color);"></div>
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="margin: 0; color: #007bff;">August 2017</h4>
          <span style="background: #007bff; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">Prototype</span>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          My first prototype, read only and based on an ESP8266. Because the Serial UART was used I couldn't display the values to the screen so had to write a Telnet service which consumed about 75% of the time. The GitHub repo had 4 .cpp files and was called Boiler.
        </p>
      </div>
    </div>

    <!-- 2018 -->
    <div class="timeline-item" style="position: relative; margin-bottom: 3rem; padding-left: 80px;">
      <div style="position: absolute; left: 20px; top: 10px; width: 20px; height: 20px; background: #28a745; border-radius: 50%; border: 3px solid var(--md-default-bg-color);"></div>
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="margin: 0; color: #28a745;">May 2018</h4>
          <span style="background: #28a745; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">v0.1.0</span>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          The first public prototype. Built only for the ESP8266. This version only had a very simple telnet interface and MQTT.
        </p>
      </div>
    </div>

    <div class="timeline-item" style="position: relative; margin-bottom: 3rem; padding-left: 80px;">
      <div style="position: absolute; left: 20px; top: 10px; width: 20px; height: 20px; background: #28a745; border-radius: 50%; border: 3px solid var(--md-default-bg-color);"></div>
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="margin: 0; color: #28a745;">September 2018</h4>
          <span style="background: #28a745; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">v1.0.0</span>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          First official stable release on GitHub
        </p>
      </div>
    </div>

    <!-- 2019 -->
    <div class="timeline-item" style="position: relative; margin-bottom: 3rem; padding-left: 80px;">
      <div style="position: absolute; left: 20px; top: 10px; width: 20px; height: 20px; background: #ffc107; border-radius: 50%; border: 3px solid var(--md-default-bg-color);"></div>
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="margin: 0; color: #e0a800;">March 2019</h4>
          <span style="background: #ffc107; color: #000; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">v1.5.0</span>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          Added support for the ESP32. Only way to change settings was via Telnet.
        </p>
        <img style="width: 100%; max-width: 400px; border-radius: 8px; margin-top: 1rem;" src="../_media/screenshot/telnet_menu.jpg" alt="Telnet Menu v1.5.0">
      </div>
    </div>

    <div class="timeline-item" style="position: relative; margin-bottom: 3rem; padding-left: 80px;">
      <div style="position: absolute; left: 20px; top: 10px; width: 20px; height: 20px; background: #ffc107; border-radius: 50%; border: 3px solid var(--md-default-bg-color);"></div>
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="margin: 0; color: #e0a800;">September 2019</h4>
          <span style="background: #ffc107; color: #000; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">v1.9.0</span>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          Major release with a new WebUI based on javascript
        </p>
        <img style="width: 100%; max-width: 400px; border-radius: 8px; margin-top: 1rem;" src="../_media/screenshot/ems_dashboard.png" alt="EMS Dashboard v1.9.0">
      </div>
    </div>

    <!-- 2020 -->
    <div class="timeline-item" style="position: relative; margin-bottom: 3rem; padding-left: 80px;">
      <div style="position: absolute; left: 20px; top: 10px; width: 20px; height: 20px; background: #dc3545; border-radius: 50%; border: 3px solid var(--md-default-bg-color);"></div>
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="margin: 0; color: #dc3545;">August 2020</h4>
          <span style="background: #dc3545; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">v2.0.0</span>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          Complete re-write of the Telnet Console and WebUI. Added HA support plus an additional 50 new EMS devices
        </p>
      </div>
    </div>

    <!-- 2021 -->
    <div class="timeline-item" style="position: relative; margin-bottom: 3rem; padding-left: 80px;">
      <div style="position: absolute; left: 20px; top: 10px; width: 20px; height: 20px; background: #6f42c1; border-radius: 50%; border: 3px solid var(--md-default-bg-color);"></div>
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="margin: 0; color: #6f42c1;">March 2021</h4>
          <span style="background: #6f42c1; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">v3.0.0</span>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          Exclusive to the ESP32. Ethernet support, improved MQTT
        </p>
        <img style="width: 100%; max-width: 400px; border-radius: 8px; margin-top: 1rem;" src="../_media/screenshot/version301.png" alt="Version 3.0.1">
      </div>
    </div>

    <!-- 2022 -->
    <div class="timeline-item" style="position: relative; margin-bottom: 3rem; padding-left: 80px;">
      <div style="position: absolute; left: 20px; top: 10px; width: 20px; height: 20px; background: #17a2b8; border-radius: 50%; border: 3px solid var(--md-default-bg-color);"></div>
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="margin: 0; color: #17a2b8;">January 2022</h4>
          <span style="background: #17a2b8; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">v3.4.0</span>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          New UI and more features
        </p>
        <img style="width: 100%; max-width: 400px; border-radius: 8px; margin-top: 1rem;" src="../_media/screenshot/version340.png" alt="Version 3.4.0">
      </div>
    </div>

    <!-- 2023 -->
    <div class="timeline-item" style="position: relative; margin-bottom: 3rem; padding-left: 80px;">
      <div style="position: absolute; left: 20px; top: 10px; width: 20px; height: 20px; background: #fd7e14; border-radius: 50%; border: 3px solid var(--md-default-bg-color);"></div>
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="margin: 0; color: #fd7e14;">February 2023</h4>
          <span style="background: #fd7e14; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">v3.5.0</span>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          Multi-Language, Heat pumps, Customizations, MQTT Discovery improvements.
        </p>
        <img style="width: 100%; max-width: 400px; border-radius: 8px; margin-top: 1rem;" src="../_media/screenshot/version350.png" alt="Version 3.5.0">
      </div>
    </div>

    <div class="timeline-item" style="position: relative; margin-bottom: 3rem; padding-left: 80px;">
      <div style="position: absolute; left: 20px; top: 10px; width: 20px; height: 20px; background: #fd7e14; border-radius: 50%; border: 3px solid var(--md-default-bg-color);"></div>
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="margin: 0; color: #fd7e14;">August 2023</h4>
          <span style="background: #fd7e14; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">v3.6.0</span>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          Sensors in its own tab and able to browse all entities from the list. Added Scheduler and Custom Entity editor, plus Italian and Turkish.
        </p>
        <img style="width: 100%; max-width: 400px; border-radius: 8px; margin-top: 1rem;" src="../_media/screenshot/version360.png" alt="Version 3.6.0">
      </div>
    </div>

    <!-- 2024-2025 -->
    <div class="timeline-item" style="position: relative; margin-bottom: 3rem; padding-left: 80px;">
      <div style="position: absolute; left: 20px; top: 10px; width: 20px; height: 20px; background: #20c997; border-radius: 50%; border: 3px solid var(--md-default-bg-color);"></div>
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="margin: 0; color: #20c997;">October 2024</h4>
          <span style="background: #20c997; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">v3.7.0</span>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          More of everything. Web UI refreshed with a Dashboard. Added Modbus support. Added Scheduler conditions and functions.
        </p>
      </div>
    </div>

    <div class="timeline-item" style="position: relative; margin-bottom: 3rem; padding-left: 80px;">
      <div style="position: absolute; left: 20px; top: 10px; width: 20px; height: 20px; background: #20c997; border-radius: 50%; border: 3px solid var(--md-default-bg-color);"></div>
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="margin: 0; color: #20c997;">November 2024</h4>
          <span style="background: #20c997; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">v3.7.1</span>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          Bug fixes and stability improvements.
        </p>
      </div>
    </div>

    <div class="timeline-item" style="position: relative; margin-bottom: 3rem; padding-left: 80px;">
      <div style="position: absolute; left: 20px; top: 10px; width: 20px; height: 20px; background: #20c997; border-radius: 50%; border: 3px solid var(--md-default-bg-color);"></div>
      <div style="background: var(--md-default-bg-color); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--md-default-fg-color--lightest);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="margin: 0; color: #20c997;">March 2025</h4>
          <span style="background: #20c997; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">v3.7.2</span>
        </div>
        <p style="margin: 0; color: var(--md-default-fg-color);">
          Many improvements and fixes.
        </p>
      </div>
    </div>

  </div>
</div>
