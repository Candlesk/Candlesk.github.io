---
title: "HA-WAF Security Architecture"
description: "A containerized high availability web application firewall combining HAProxy, Keepalived and ModSecurity with OWASP CRS, protecting a full-stack application with zero database exposure."
pubDate: "Jul 12 2026"
heroImage: "/cover-hawaf.webp"
badge: "Security"
tags: ["security", "waf", "high-availability", "iso-27001"]
---

> **Writeup status: outline.** This page is ready for the full writeup. Replace the prompts below with the real architecture, rules and test evidence.

## Overview

I built a containerized **high availability web application firewall** to protect a full-stack application. **HAProxy** and **Keepalived** provide load balancing and failover, while **ModSecurity** with the **OWASP Core Rule Set** inspects and blocks malicious requests.

The application sits behind the security edge, and the database is never exposed to the public network. The project also maps ISO 27001:2022 controls to the architecture and includes automated tests for attack prevention and failover.

## Tech stack

`HAProxy` · `Keepalived` · `ModSecurity` · `OWASP CRS` · `Docker` · `.NET` · `Angular` · `PostgreSQL` · `ISO 27001:2022`

## Architecture

```text
Client
  |
  v
Virtual IP (Keepalived)
  |
  +--> HAProxy (active) ---> ModSecurity / OWASP CRS ---> App (.NET / Angular)
  +--> HAProxy (standby)                                    |
                                                            v
                                                     PostgreSQL
                                                (internal network only)
```

## What I built

- Active/standby HAProxy nodes with Keepalived health checks and a floating virtual IP.
- ModSecurity with OWASP CRS in front of the application.
- A full-stack .NET/Angular/PostgreSQL application deployed behind the security edge.
- Network segmentation so the database is reachable only from the application layer.
- ISO 27001:2022 control mapping for the architecture.
- Automated tests for attack prevention and failover validation.

## ISO 27001:2022 controls

_List the controls you mapped and how the architecture satisfies each one._

## Attack tests

_Add the payloads and results: SQL injection, XSS, path traversal and command injection attempts, with blocked/allowed evidence._

## Failover validation

_Add the failover test: how you stopped the active node, the time to switch to standby, and the client impact._

## Challenges and lessons learned

_Describe rule tuning, false positives, and how you kept the database isolated._

## Screenshots

_Add HAProxy stats, ModSecurity logs, blocked request examples and the architecture diagram._
