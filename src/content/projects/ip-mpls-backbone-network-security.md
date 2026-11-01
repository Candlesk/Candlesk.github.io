---
title: "IP/MPLS Backbone & Network Security"
description: "A complete enterprise network built in GNS3 with an IP/MPLS backbone, VPN/VRF segmentation, dual-site redundancy and end-to-end security."
pubDate: "Jun 05 2026"
heroImage: "/cover-mpls.webp"
badge: "Networking"
tags: ["networking", "mpls", "gns3", "vpn"]
---

> **Writeup status: outline.** This page is ready for the full writeup. Replace the prompts below with the real topology, configurations and test results.

## Overview

I designed and built a complete enterprise network from scratch in **GNS3**. The design uses an **IP/MPLS backbone** to connect two sites, with **VPN/VRF segmentation** to keep traffic isolated and redundancy so the network survives a link or device failure.

Security is applied end to end: device authentication, monitoring, and firewall policies between segments.

## Tech stack

`GNS3` · `IP/MPLS` · `BGP` · `OSPF` · `MP-BGP` · `VRF` · `VPN` · `Firewall policies` · `SNMP / monitoring`

## Topology

```text
Site A --- PE --- P --- P --- PE --- Site B
             \                 /
              +--- redundant --+

Each site: core / distribution / access
VRFs: management, users, servers
```

## What I built

- An IP/MPLS backbone with redundant paths between the two sites.
- VPN/VRF segmentation for management, user and server traffic.
- Dual-site redundancy and failover testing.
- Authentication, monitoring and firewall policies between security zones.

## Design decisions

_Explain why you chose the IGP/BGP layout, how you assigned VRFs and route targets, and how failover works._

## Validation

_Add the tests: failover time, routing tables before and after a link failure, and the firewall rules you verified._

## Challenges and lessons learned

_Describe the trickiest part of the configuration, the troubleshooting process, and what you would change in a production deployment._

## Screenshots

_Add GNS3 topology screenshots, routing tables and failover captures here._
