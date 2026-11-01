---
title: "DevSecOps & Cloud Security Pipeline"
description: "An automated Jenkins CI/CD pipeline with SonarQube, OWASP Dependency-Check and Trivy, deploying a containerized application to AWS EC2 with secure credential management."
pubDate: "Aug 20 2026"
heroImage: "/cover-devsecops.webp"
badge: "DevSecOps"
tags: ["devsecops", "aws", "ci-cd", "docker", "jenkins", "sonarqube", "trivy"]
---

## Overview

Security checks are often performed at the end of a project, when fixing a vulnerability is slow and expensive. For this project I built a pipeline where those checks run automatically on every change, and a failed check stops the release before it reaches the server.

The workflow goes from a GitHub commit to a running container on AWS EC2. Along the way it performs static analysis, dependency scanning, filesystem scanning and containerization, and it keeps credentials out of the source code.

## Pipeline at a glance

```text
GitHub
  |
  v
Jenkins
  |-- SonarQube static analysis + Quality Gate
  |-- OWASP Dependency-Check (SCA)
  |-- Trivy filesystem scan
  |-- Docker build
  |-- Docker Hub push
  v
AWS EC2 (running container)
```

Each stage has a separate job: source retrieval, quality analysis, dependency review, vulnerability scanning, image build, registry publication and deployment. The full workflow is described in a Jenkinsfile stored with the application, so the delivery process is versioned alongside the code.

## What each stage contributes

| Stage | Tool | Purpose |
| --- | --- | --- |
| Source | GitHub + Git | Version control and pipeline trigger |
| Orchestration | Jenkins | Runs every stage and enforces the order |
| Code analysis | SonarQube | Bugs, vulnerabilities, code smells and duplication |
| Quality decision | SonarQube Quality Gate | Blocks the pipeline when conditions are not met |
| Dependency analysis | OWASP Dependency-Check | Finds known CVEs in third-party packages |
| Filesystem scan | Trivy | Detects vulnerable packages and files in the project |
| Packaging | Docker | Creates a repeatable runtime image |
| Registry | Docker Hub | Stores the image used for deployment |
| Hosting | AWS EC2 | Runs the application container |

**Source control.** Git tracks changes, while GitHub provides the remote repository Jenkins pulls from. The Jenkinsfile and Dockerfile live in the same repository, which makes the pipeline reproducible.

**Static analysis.** SonarQube inspects the code without executing it and reports security and maintainability problems. Its Quality Gate turns those reports into a pass/fail condition rather than a dashboard someone may ignore.

**Dependency security.** OWASP Dependency-Check compares the project's libraries against public vulnerability data, including the National Vulnerability Database. An NVD API key is supplied through Jenkins Credentials to keep the vulnerability data current.

**Filesystem scanning.** Trivy adds a second scanner with different detection rules. It covers the project tree and can be extended to scan the final container image for operating system packages.

**Build and release.** Docker packages the application with its runtime and Nginx configuration. Jenkins tags the image, pushes it to Docker Hub and starts a container on the EC2 host. The application is exposed on host port `8081`, mapped to port `80` inside the container, and AWS Security Groups limit which ports are reachable.

## Security principles applied

- **Shift left** — code and dependencies are examined before an image is published.
- **Layered detection** — SonarQube, Dependency-Check and Trivy catch different classes of problems; no single scanner covers everything.
- **Automated gates** — the Quality Gate decides whether the pipeline may continue.
- **Secret management** — Docker Hub, SonarQube and NVD credentials are stored in Jenkins, not in the Jenkinsfile.
- **Consistent deployment** — the same Docker image is built once and deployed, instead of rebuilding dependencies on the server.

## Problems encountered

Integrating the tools was harder than writing the pipeline itself.

- **Jenkins and Java setup** — repository and package issues required checking the JDK installation and Jenkins service logs before the server would start reliably.
- **SonarQube connectivity** — `localhost` and container hostnames do not mean the same thing from inside Jenkins. Getting the address right, then configuring the SonarQube webhook, was necessary for the Quality Gate result to return to the pipeline.
- **Dependency-Check updates** — vulnerability data downloads failed until the NVD API key was configured correctly.
- **Docker permissions** — the Jenkins service account initially could not talk to the Docker daemon.
- **Docker client/daemon mismatch** — an outdated Docker CLI used an API version the daemon no longer accepted, so Jenkins had to use a compatible client.
- **Node.js version** — the original image used Node 16, but project dependencies required Node 18 or newer. Moving the build image to Node 20 fixed dependency installation.
- **Container name conflicts** — repeated deployments failed when the previous container still existed. The deployment step now removes the old container before starting the new one.

## Results

The finished pipeline retrieves the application, runs all security checks, builds and publishes the image, and deploys it to EC2 without manual steps. Security reports and Jenkins logs provide a trace of what happened on each run.

<figure>
  <img src="/devsecops-results.webp" alt="Pipeline, deployment and monitoring overview" class="w-full rounded-lg" />
  <figcaption class="text-sm opacity-70 text-center mt-2">Pipeline, deployment and monitoring overview.</figcaption>
</figure>

More importantly, the project showed me where tool integration breaks in practice: service discovery between containers, permissions, API compatibility and secret handling. Those are the parts that a simple "tools installed" checklist does not cover.

## What I would add next

- Scan the final Docker image with Trivy before pushing it.
- Add OWASP ZAP for dynamic testing of the running application.
- Provision the AWS infrastructure with Terraform instead of manual setup.
- Move from a single EC2 host to a container orchestrator such as Kubernetes.
- Add centralized monitoring and alerting with Prometheus and Grafana.
- Generate an SBOM and sign the published images.

## Stack

`AWS EC2` · `Jenkins` · `Docker` · `Docker Hub` · `SonarQube` · `OWASP Dependency-Check` · `Trivy` · `Node.js` · `Nginx` · `GitHub`
