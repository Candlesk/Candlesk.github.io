---
title: "DevSecOps & Cloud Security Pipeline"
description: "An automated Jenkins CI/CD pipeline with SonarQube, OWASP Dependency-Check and Trivy, deploying a containerized application to AWS EC2 with secure credential management."
pubDate: "Aug 20 2026"
heroImage: "/cover-devsecops.webp"
badge: "DevSecOps"
tags: ["devsecops", "aws", "ci-cd", "docker"]
---

> **Writeup status: outline.** This page is ready for the full writeup. Replace the prompts below with the real configuration, screenshots and results.

## Overview

During my summer internship at **Tek-up**, I built an end-to-end DevSecOps and cloud security pipeline. The goal was to move security checks into the CI/CD workflow instead of running them after deployment.

The pipeline builds, scans and ships a containerized application to **AWS EC2**, while failing the build when quality or security gates are not met.

## Tech stack

`AWS` · `Jenkins` · `Docker` · `SonarQube` · `OWASP Dependency-Check` · `Trivy` · `Grafana` · `Git`

## Pipeline architecture

```text
Git push
   |
   v
Jenkins pipeline
   |-- Checkout
   |-- Build
   |-- SonarQube code quality gate
   |-- OWASP Dependency-Check (SCA)
   |-- Trivy image scan
   |-- Docker build & push
   |-- Deploy to AWS EC2
   v
Grafana dashboards / notifications
```

## What I built

- Jenkins pipeline stages for build, static analysis, dependency scanning and container image scanning.
- Quality and security gates that stop the pipeline on critical findings.
- Docker image build and automated deployment to an AWS EC2 instance.
- Secure handling of credentials and secrets instead of hardcoding them in the pipeline.

## Results

_Add the numbers here: number of vulnerabilities caught before deployment, pipeline duration, and gate thresholds._

## Challenges and lessons learned

_Describe the hardest part of the build, how you debugged it, and what you would improve next (for example hardened runners, image signing, or infrastructure as code)._

## Screenshots

_Add pipeline runs, SonarQube dashboard, Trivy reports and the deployed application here._
