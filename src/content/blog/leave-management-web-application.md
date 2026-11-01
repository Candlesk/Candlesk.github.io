---
title: "Leave Management Web Application"
description: "A full-stack web application built during my final year project at Tunisie Telecom, letting employees submit and track leave requests while administrators review and approve them."
pubDate: "May 10 2024"
heroImage: "/cover-leave.webp"
badge: "Full-Stack"
tags: ["full-stack", "web", "authentication", "database"]
---

> **Writeup status: outline.** This page is ready for the full writeup. Replace the prompts below with the real design, screens and code decisions.

## Overview

For my final year project internship at **Tunisie Telecom**, I designed and developed a web application that digitises leave requests. Employees submit and track their requests, while administrators manage approvals and access rights.

The application includes authentication, role-based access control and a relational database.

## Tech stack

`Web application` · `Authentication` · `Role-based access control` · `Relational database`

_Replace this list with the exact framework, language and database you used._

## Features

- Employee login and leave request submission.
- Request history and status tracking.
- Administrator dashboard for reviewing and approving requests.
- Role and permission management.
- Database schema for users, roles, requests and approvals.

## Data model

```text
User ---< LeaveRequest >--- Approval
  |
  +--- Role ---< Permission
```

_Replace this with the real entity relationships and key fields._

## Access control

_Explain how authentication works, how roles are enforced on the server, and how you prevented users from accessing other employees' requests._

## Screenshots

_Add the login page, employee dashboard, admin approval screen and database schema._

## Challenges and lessons learned

_Describe the main technical challenge, what you would refactor today, and what you learned about working with a real stakeholder._
