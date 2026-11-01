---
title: "HA-WAF Security Architecture"
description: "A high-availability web application firewall edge built with HAProxy, Keepalived, ModSecurity and OWASP CRS, with ISO 27001-aligned validation and zero database exposure."
pubDate: "Jul 12 2026"
heroImage: "/cover-hawaf.webp"
badge: "Security"
tags: ["security", "waf", "high-availability", "docker", "iso-27001"]
---

## Overview

Most web security tutorials solve one problem at a time: a load balancer without a firewall, or a firewall that becomes a single point of failure. I wanted to design an edge where **availability, inspection and isolation** are solved together.

The result is a containerized HA-WAF stack that puts a redundant inspection layer in front of a real full-stack application. The database stays on an internal network and is never published to the host.

## Design goals

- **High availability** — no single failing component should stop traffic.
- **Defense in depth** — every request is inspected before it reaches the application.
- **Zero database exposure** — only the application tier can reach PostgreSQL.

## Architecture

```text
Client
  |
  v
Keepalived virtual IP
  |
  +--> HAProxy (active) ---> ModSecurity + OWASP CRS
  +--> HAProxy (standby)          |
                                  v
                           internal NGINX
                          /      |       \
                    Angular    .NET    PostgreSQL
                     SPA       API     (isolated)
```

Traffic enters through a floating virtual IP managed by Keepalived. Two HAProxy nodes share the load and provide failover. Requests then pass through ModSecurity with the OWASP Core Rule Set before reaching an internal router that separates the SPA, API and database.

## How it works

**Edge layer — Keepalived + HAProxy.** Keepalived uses VRRP to move the virtual IP to the standby node if the active one fails. Inside Docker, multicast VRRP was unreliable, so the nodes use unicast peering and the containers receive the networking capabilities they need. HAProxy balances traffic with TCP health checks; HTTP checks were being rejected by the WAF as suspicious probes.

**Inspection layer — ModSecurity + OWASP CRS.** Every request is scored against CRS rules covering SQL injection, XSS, path traversal, command injection, file inclusion and protocol attacks. Requests that cross the anomaly threshold are blocked. I started with a low paranoia level and a conservative inbound threshold to keep legitimate traffic working.

**Application layer.** The WAF protects a real .NET API and Angular SPA with JWT authentication, role-based access control and PostgreSQL persistence rather than a toy backend. Testing against a real application exposed issues that a demo would never reveal: JWT tokens, JSON bodies and `PUT`/`PATCH` requests all needed tuning.

## Integration challenges

The WAF and application started as separate Compose projects. Rather than merging them, I attached the application to the WAF's external Docker network through an override file. Two details mattered:

- Docker prefixes network names with the project directory, so the override had to reference the **actual** network name, not the logical one.
- The CRS image expects the upstream in a `BACKEND` variable, not a generic proxy setting.

I also moved HAProxy to a non-privileged host port for local testing and kept everything on the private network in the intended design. The most important operational lesson was to run ModSecurity in detection-only mode first, review what legitimate traffic triggered, and only then enable blocking.

## ISO 27001 alignment

The architecture is mapped to Annex A controls, and each control has an executable check rather than a written claim.

| Control | What the stack does |
| --- | --- |
| **A.8.20** Network security | A single inspected entry point; no direct path to the app or database |
| **A.8.21** Security of network services | Redundant HAProxy nodes with automatic Keepalived failover |
| **A.8.22** Network segregation | Isolated Docker network; PostgreSQL has no published ports |
| **A.8.23** Web filtering | ModSecurity + OWASP CRS with anomaly scoring |

## Validation

The project includes two test layers:

- A compliance script that checks network isolation, static addressing, port exposure, internal DNS, routing separation and read-only configuration mounts.
- Manual attack tests for SQL injection, XSS, path traversal and command injection, all expected to return `403`.

Failover is tested by pausing the active load balancer and confirming that the virtual IP still serves requests through the standby node.

## Stack

`HAProxy` · `Keepalived` · `ModSecurity v3` · `OWASP CRS v4` · `NGINX` · `Docker Compose` · `.NET` · `Angular` · `PostgreSQL` · `Typst`

## Lessons learned

1. **Roll out blocking gradually.** Detection-only mode prevents the WAF from breaking real users while you tune rules.
2. **Docker network names are not the names you write.** The project prefix matters when joining external networks.
3. **Health checks must fit the threat model.** A TCP probe is enough for load balancer availability and avoids WAF interference.
4. **Test with a real application.** Authentication, JSON payloads and less common HTTP methods are where WAF tuning actually happens.
5. **Compliance is stronger when it is executable.** Mapping tests to ISO controls turns security claims into repeatable evidence.

## Links

- [HA-WAF Stack repository](https://github.com/Candlesk/ha-waf-stack)
- [OWASP Core Rule Set](https://coreruleset.org/)
- [ModSecurity](https://modsecurity.org/)
- [Clean Architecture .NET/Angular application used for testing](https://github.com/nitin27may/clean-architecture-docker-dotnet-angular)
