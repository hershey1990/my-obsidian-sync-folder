---
title: Overview
description: Centralized server and infrastructure management panel
---

# Infraestructure Manager

An open-source, self-hosted web panel for managing servers, automating operations, and monitoring infrastructure — all via SSH.

## Purpose

Companies migrating from SaaS to self-hosted open-source alternatives (Rocket.Chat → Slack, Vaultwarden → 1Password, Outline → Confluence) end up managing multiple VPSs with different services, databases, and external dependencies. This panel provides a single interface to:

- Connect to servers via SSH with `.pem` keys
- Discover running services automatically
- Define and execute automation playbooks (backups, updates, maintenance)
- Schedule recurring jobs
- Monitor health and receive notifications
- Access an interactive terminal from the browser

## Key Features

| Feature | Description |
|---|---|
| **Server Management** | Add servers with IP and PEM key. Test connection, auto-discover services. |
| **Service Resources** | Document local services and external dependencies (DBs, object storage, etc.) with connection info. |
| **Playbooks** | Multi-step automation pipelines with SSH, local, Docker, HTTP, and notification steps. |
| **Scheduling** | Cron-based execution for recurring maintenance. |
| **Interactive Terminal** | Full web-based SSH terminal via WebSocket. |
| **Health Checks** | Periodic checks with visual status and alerts. |
| **Notifications** | Slack, Discord, Email, and Webhook integration. |
| **Audit Trail** | Full execution history with logs for every playbook run. |

## Stack

| Component | Technology |
|---|---|
| Backend | Laravel 11 |
| Frontend | Inertia + React + TypeScript |
| UI Library | Tailwind CSS + shadcn/ui |
| Job Queue | Laravel Horizon + Redis |
| SSH (commands) | spatie/ssh |
| SSH (terminal) | phpseclib via Laravel Reverb |
| WebSocket | Laravel Reverb |
| Database | PostgreSQL |
| Infrastructure | Docker Compose |
