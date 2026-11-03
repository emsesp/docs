---
id: Securing
title: Securing your gateway
description: How to keep EMS-ESP safe on your network, use it remotely without port forwarding, and protect MQTT, passwords and API access
---
# Securing your gateway

EMS-ESP can change settings on your heating system, so treat it like any other device that controls your home. Most of the Web UI, the API, MQTT and telnet are not encrypted, so the network they run on matters. This page explains how to set it up safely.

## Keep it off the internet

Never forward ports from your router to EMS-ESP, whether 80 (Web UI and API), 23 (telnet), 502 (Modbus) or anything else. Anyone on the internet would then be able to reach it, and the connection isn't encrypted.

To use EMS-ESP when you're away from home, use one of these instead:

- **A VPN into your home network.** This is the simplest and safest. Many routers have one built in (for example a FRITZ!Box or UniFi gateway), or use [WireGuard](https://www.wireguard.com/) or [Tailscale](https://tailscale.com/). Your phone or laptop then connects as if it were at home.
- **Home Assistant.** If you use Home Assistant with [Home Assistant Cloud](https://www.nabucasa.com/) or your own secure remote access, control EMS-ESP through Home Assistant rather than opening the device itself.
- **A reverse proxy with HTTPS.** A proxy such as [Caddy](https://caddyserver.com/), [Nginx Proxy Manager](https://nginxproxymanager.com/) or Traefik gives you an `https://` address with a real certificate and forwards it to EMS-ESP on your network. Add the proxy's host name under **Settings > Network > Allowed host names**, otherwise EMS-ESP refuses the requests. Protect the proxy with its own login as well, and keep the proxy software up to date.

## Put it on its own network

If your router supports it, put EMS-ESP on a separate network for smart home devices (a VLAN or a guest/IoT WiFi), away from your computers and phones.

Then only allow what is needed:

- From your computer or phone, and from Home Assistant or other integrations, to EMS-ESP on port 80. Add port 502 if you use Modbus, and 23 only if you use telnet.
- From EMS-ESP to your MQTT broker (1883, or 8883 with TLS), your NTP server, and your syslog server if you use one.
- From EMS-ESP to the internet over HTTPS (443) only if you want the Web UI's version check and to install updates from the version list. Otherwise block it and upload firmware files instead.

## Passwords and accounts

- Give the admin user a strong password that you don't use anywhere else. From 3.10.0 the factory passwords must be changed before the Web UI can be used.
- If no WiFi network is set, EMS-ESP starts its own access point. Give it its own password as well.
- Only create the users you need. A guest user can see values but not change settings.
- Integrations such as Home Assistant, Node-RED or scripts should use an **API key** (**Settings > Security > API Keys**), not a user's password. Use a "Read" key when the integration only reads values, and a "Read and Write" key only when it needs to change things. Revoke keys you no longer use.
- A **System Backup** with "Include passwords and keys" ticked contains all passwords. Store it somewhere safe, or leave the option off.

## Turn off what you don't use

In the Settings pages:

- **Telnet** is off by default from 3.10.0. Leave it off unless you need it, because telnet isn't encrypted.
- **Allow API calls without an access token** gives anyone on your network guest rights. Use API keys instead.
- **CORS** is only needed when a web page on another address calls the API. If you enable it, set the exact address of that page, not `*`.
- **Modbus** and **Syslog**, if you don't use them.
- **Read-only mode** stops EMS-ESP from sending any changes to your heating system. Use it if you only want to read values.

## Limit how often values are written

From 3.10.0, EMS-ESP protects your boiler and thermostat from automations that write too often, for example one that sends the flow temperature on every sensor update. In Application Settings, next to read-only mode:

- **Skip a write that repeats the value sent in the last minute** (on by default). Writing the same value to the same entity again within a minute isn't sent to the boiler, but the caller still gets OK. `45`, `45.0` and `"45"` count as the same value, as do `on`, `1` and `true`.
- **Max #writes per minute** (default 10) counts the writes to each entity, for example `boiler/selflowtemp` or `thermostat/hc1/seltemp`, in a minute. All entities together are limited to 120 writes a minute. Set it to 0 to turn the limit off, which asks for your password.
- **Refuse writes over the limit** (off by default). When off, writes over the limit are still sent and a warning is logged once a minute. When on, they are refused: the API returns HTTP 429 with how long to wait, MQTT sends an error response and Modbus returns "server device busy".

Writes from the Web UI, the API, MQTT, Modbus, the Scheduler and Commands all count. Commands such as `reset`, settings under `system/` and Custom Entities that are only stored on EMS-ESP don't. `/api/system/info` shows how many writes were skipped (`writesSkipped`) and limited (`writesLimited`).

## MQTT

- Use a username and password on your MQTT broker, and give EMS-ESP its own account.
- If your broker supports TLS, enable **TLS** in the MQTT settings (usually port 8883) and choose how EMS-ESP checks the broker:
  - **CA certificate**: paste the certificate of the authority that signed the broker's certificate, as text (PEM). Use this for certificates from Let's Encrypt or your own certificate authority.
  - **Certificate fingerprint**: the SHA-1 fingerprint of the broker's own certificate. Use this for a self-signed certificate. You can read it with:

    ```bash
    openssl s_client -connect <broker>:8883 </dev/null 2>/dev/null | openssl x509 -noout -fingerprint -sha1
    ```

    When the broker gets a new certificate, update the fingerprint.
  - **Nothing, not checked**: the connection is encrypted, but EMS-ESP doesn't check that it's talking to your broker. The MQTT settings page and the log warn about this.
- Anything that can publish to EMS-ESP's MQTT topics can change your heating settings. Use the broker's access control lists to limit who can publish to them.

## Firmware

- Install official builds from the [EMS-ESP releases](https://github.com/emsesp/EMS-ESP32/releases), from the Web UI's version list, or with the [EMS-ESP Flasher](https://github.com/emsesp/EMS-ESP-Flasher). The Version page shows "Official build" for these.
- Only click "Install anyway" for a custom build if you trust where it came from. See [Official and custom builds](FAQ.md#official-and-custom-builds).
- Keep EMS-ESP up to date, because security fixes come in new versions.

## Physical access

Anyone who can reach the gateway's USB port can read its flash, flash other firmware or use the serial console. Gateways ship without secure boot or flash encryption, so that you can always install any firmware you want. Keep the gateway somewhere other people can't easily get to it.

Before you sell or give away a gateway, do a factory reset (Factory Reset on the Version page, the `system/format` command, or a long press of the button). From 3.10.0 this erases all settings, including passwords and keys, from the flash.

## Reporting a security problem

If you think you've found a security problem in EMS-ESP, please don't open a public issue. Report it privately on GitHub with [Report a vulnerability](https://github.com/emsesp/EMS-ESP32/security/advisories/new), or use the [Contact Form](https://emsesp.org/About/#-contact). [SECURITY.md](https://github.com/emsesp/EMS-ESP32/blob/dev/SECURITY.md) explains what to include, which versions get security fixes and how fixes are published.
