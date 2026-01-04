---
title: EMS Library
id: ems-library
description: Comprehensive reference for EMS telegram protocols and entity definitions
hide_table_of_contents: true
tags:
  - devices
  - protocol
  - reference
---

# EMS library

:::info
This page is a comprehensive summary of EMS telegram details collected by the EMS-ESP community. This page is dynamically built using the CSV files in the `data` folder and the `telegram_metadata.json` file that describes the telegram's purpose and where it is typically used.

Please contribute!
:::

## Table of Contents

- [Basic Telegrams](#basic-telegrams) `(0x0001 - 0x0013)`
- [System Telegrams](#system-telegrams) `(0x0026 - 0x0027)`
- [Error and Status Telegrams](#error-and-status-telegrams) `(0x00BF - 0x00FB)`
- [Thermostat Telegrams](#thermostat-telegrams) `(0x0165 - 0x0178)`
- [Hybrid Module Telegrams](#hybrid-module-telegrams) `(0x099A)`

import TelegramSearchAll from '@site/src/components/TelegramSearchAll';

<TelegramSearchAll />

---

## Basic Telegrams

Telegrams 0x0001 through 0x0013 contain basic system information and identification data.

import TelegramTable from '@site/src/components/TelegramTable';

<TelegramTable csvFile="basic_telegrams.csv" title="Basic Telegrams" />

---

## System Telegrams

Telegrams 0x0026 and 0x0027 contain system-level configuration and status information.

<TelegramTable csvFile="system_telegrams.csv" title="System Telegrams" />

---

## Error and Status Telegrams

Telegrams 0x00BF through 0x00FB contain error reporting, status information, and system diagnostics.

<TelegramTable csvFile="error_status_telegrams.csv" title="Error and Status Telegrams" />

---

## Thermostat Telegrams

Telegrams 0x0165 through 0x04A2 contain thermostat configuration, programming, and control data.

<TelegramTable csvFile="thermostat_telegrams.csv" title="Thermostat Telegrams" />

---

## Hybrid Module Telegrams

Telegrams 0x099A contain hybrid module monitoring and control data.

<TelegramTable csvFile="hybrid_module_telegrams.csv" title="Hybrid Module Telegrams" />
