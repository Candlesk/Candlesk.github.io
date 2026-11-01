---
title: "SOC Lab"
description: "A simulated security operations center built with pfSense, Suricata and Wazuh to detect, investigate and respond to cyber threats."
pubDate: "Apr 18 2026"
heroImage: "/cover-soc.webp"
badge: "Blue Team"
tags: ["blue-team", "soc", "wazuh", "suricata"]
---

> **Writeup status: outline.** This page is ready for the full writeup. Replace the prompts below with the real lab, detections and investigations.

## Overview

I built a simulated **Security Operations Center** to practice detection and response against realistic attacks. The lab combines network security monitoring with host-based detection and centralised log analysis.

**pfSense** segments and controls the network, **Suricata** provides intrusion detection, and **Wazuh** collects and correlates security events.

## Tech stack

`pfSense` · `Suricata` · `Wazuh` · `SIEM` · `MITRE ATT&CK` · `Linux` · `Windows`

## Lab architecture

```text
Attack machine
      |
      v
   pfSense  --- Suricata IDS ---> Wazuh manager
      |                              |
      +--> Victim network            +--> Dashboards / alerts
             |-- Windows endpoint
             |-- Linux endpoint
```

## What I built

- A segmented lab network with pfSense firewall rules.
- Suricata IDS rules and alerting.
- Wazuh agents on Linux and Windows endpoints.
- A workflow for triaging alerts, pivoting into logs and documenting investigations.

## Detection scenarios

_List the attacks you simulated (for example port scanning, brute force, suspicious PowerShell) and the alerts they produced._

## MITRE ATT&CK mapping

_Map each scenario to the relevant technique and show the evidence captured in Wazuh._

## Investigation notes

_Add one full investigation: alert, timeline, affected host, and conclusion._

## Challenges and lessons learned

_Describe tuning out noise, writing detection rules and what you would add next._

## Screenshots

_Add Wazuh dashboards, Suricata alerts and the lab topology._
