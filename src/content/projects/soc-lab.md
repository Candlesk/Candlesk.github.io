---
title: "SOC Lab"
description: "A simulated security operations center built with pfSense, Suricata and Wazuh to detect, investigate and respond to cyber threats."
pubDate: "Apr 18 2026"
heroImage: "/cover-soc.webp"
badge: "Blue Team"
tags: ["blue-team", "soc", "wazuh", "suricata", "pfsense", "mitre-attack"]
---

## Overview

A SIEM dashboard is only useful if someone knows what to do when it lights up. I built this lab to practise the full detection loop in a controlled network: generate an attack, collect the evidence, triage the alert, and decide what should happen next.

The lab is intentionally small. It contains an attacker machine, a pfSense firewall, a monitored victim network, and a Wazuh deployment that centralizes events from the firewall, the IDS and the endpoints.

## Objectives

- Segment attack traffic from the monitored hosts.
- Capture network evidence with an IDS.
- Collect host and authentication events in a SIEM.
- Map detections to MITRE ATT&CK techniques.
- Practise triage and documentation, not just alert generation.

## Architecture

```text
Attacker VM
     |
     v
+-------------------+
|      pfSense      |  firewall, NAT, routing
+---------+---------+
          |
          |  mirrored / monitored traffic
          v
+-------------------+          +----------------------+
|      Suricata     | -------> |    Wazuh manager     |
|    IDS alerts     |  logs    |  rules + dashboards  |
+-------------------+          +----------+-----------+
                                         |
                         +---------------+---------------+
                         |                               |
                  Linux endpoint                  Windows endpoint
                  (Wazuh agent)                   (Wazuh agent + Sysmon)
```

pfSense controls where traffic can go. Suricata watches the traffic that crosses the monitored interface. Wazuh collects alerts from Suricata alongside authentication, process and file events from the endpoints, so a network alert can be correlated with what happened on the host.

## Tool roles

| Tool | Role in the lab |
| --- | --- |
| **pfSense** | Network segmentation, firewall rules, NAT and routing between the attack and victim networks |
| **Suricata** | Signature-based intrusion detection on the monitored interface, with alerts written to `eve.json` |
| **Wazuh** | Central log collection, rule-based correlation, file integrity monitoring and dashboards |
| **Sysmon** | Detailed Windows process, network and file telemetry forwarded to Wazuh |
| **MITRE ATT&CK** | Common language for describing what each simulated attack actually does |

## Building the lab

**1. Network segmentation.** The attacker sits on a separate network from the victim hosts. pfSense routes between them and blocks everything that is not needed for the scenario. This keeps the lab contained and makes the firewall logs meaningful.

**2. Firewall telemetry.** pfSense logs are forwarded to Wazuh, which gives a record of blocked and allowed connections. That context is useful when an IDS alert needs to be confirmed or dismissed.

**3. Intrusion detection.** Suricata runs in IDS mode with the Emerging Threats Open ruleset. Its `eve.json` output is shipped to the Wazuh manager, where Suricata alerts appear next to host events instead of in a separate silo.

**4. Endpoint visibility.** Linux and Windows virtual machines run Wazuh agents. On Windows, Sysmon adds process creation, network connection and file creation events. Without that telemetry, a SIEM only sees logins and misses most of the attack chain.

**5. Detection content.** Wazuh's built-in rules cover common authentication and system events. I added local rules for lab-specific behaviour, such as repeated SSH failures from the same source, and tuned noisy rules so the dashboard stayed usable.

## Detection scenarios

Each scenario follows the same process: run the attack, find the first alert, pivot into the raw events, build a short timeline, and write a conclusion.

- **Network discovery.** An `nmap` scan produces Suricata alerts for scanning behaviour and pfSense connection logs that show which ports were probed.
- **SSH brute force.** Repeated failed logins trigger Wazuh authentication rules. The source IP is correlated with firewall and IDS events to confirm whether the traffic was blocked or reached the host.
- **Suspicious PowerShell.** An encoded PowerShell command on the Windows endpoint is captured by Sysmon and surfaced through Wazuh, providing process, parent process and user context.
- **File integrity change.** A monitored file is modified on a Linux host, producing a Wazuh FIM alert that can be tied back to the session that changed it.

For example, a lab-specific Wazuh rule can escalate repeated SSH failures:

```xml
<group name="soclab,authentication_failures,">
  <rule id="100100" level="10" frequency="6" timeframe="120">
    <if_matched_sid>5760</if_matched_sid>
    <same_source_ip />
    <description>SOC Lab: repeated SSH authentication failures</description>
  </rule>
</group>
```

## MITRE ATT&CK mapping

| Technique | ID | Evidence in the lab |
| --- | --- | --- |
| Network Service Discovery | T1046 | Suricata scan alerts and pfSense connection records |
| Brute Force | T1110 | Wazuh SSH authentication failures grouped by source IP |
| PowerShell | T1059.001 | Sysmon process creation with encoded command lines |
| Indicator Removal on Host | T1070 | File integrity alerts for cleared or modified logs |

The mapping is not decoration. It forces each scenario to be described in terms of attacker behaviour, which makes the detection logic easier to review and improve.

## Investigation workflow

1. **Triage the alert.** Identify the rule, severity, source, destination and time.
2. **Confirm the activity.** Check whether the traffic was allowed by pfSense and whether the endpoint logged a matching event.
3. **Build a timeline.** Order firewall, IDS and host events around the first suspicious action.
4. **Assess impact.** Determine which host was involved, which account was used, and whether anything changed.
5. **Recommend a response.** Block the source, isolate the host, reset credentials, or close the alert as a false positive.
6. **Improve the detection.** Add or tune a rule so the next occurrence is easier to catch.

## Results

The lab produces a single investigation view instead of three disconnected tools. A network alert can be confirmed with firewall logs, enriched with endpoint telemetry, and documented with a clear timeline.

The most useful outcome was learning where detection breaks down: missing Windows process telemetry, noisy authentication rules, and alerts that lack enough context to decide whether they matter. Those gaps are exactly what a real SOC analyst has to work around.

## Lessons learned

- **Telemetry beats dashboards.** A good dashboard cannot compensate for missing endpoint or network data.
- **Context is the hard part.** An IP address is not an incident; the user, process and timeline make it one.
- **Tune before adding rules.** A noisy rule set trains you to ignore alerts, which is worse than having fewer detections.
- **Document every investigation.** The written timeline is often more valuable than the alert itself.

## Next steps

- Add more Windows coverage with Sysmon configuration tuned to the lab scenarios.
- Automate attack simulations and compare the expected detections with the alerts that actually fired.
- Add threat intelligence enrichment for source IPs and file hashes.
- Build dashboards that show detection coverage by ATT&CK technique.
- Introduce a SOAR workflow for common containment actions.

## Stack

`pfSense` · `Suricata` · `Wazuh` · `Sysmon` · `MITRE ATT&CK` · `Linux` · `Windows`
