---
title: Notifications
description: Configure alerts for playbook runs, health checks, and server status
---

# Notifications

## Supported Channels

| Channel | Configuration |
|---|---|
| **Slack** | Incoming webhook URL |
| **Discord** | Webhook URL |
| **Email** | SMTP settings (uses Laravel mail config) |
| **Webhook** | Custom HTTP endpoint |

## Adding a Channel

1. Go to **Settings > Notifications**
2. Click **Add Channel**
3. Select type (Slack, Discord, Email, Webhook)
4. Enter the webhook URL or email configuration
5. Test the connection with a sample message
6. Save

## Playbook Notifications

Configure per playbook which events trigger notifications:

| Event | Description |
|---|---|
| Run Started | Playbook execution begins |
| Run Completed | All steps succeeded |
| Run Failed | A step failed |
| Run Rolled Back | Rollback completed |

Set these in **Playbook > Edit > Notifications**.

## Health Check Notifications

When a health check returns a `warning` or `critical` status, a notification is sent automatically to configured channels. The rate is limited to prevent notification floods (cooldown: 15 minutes per check).

## Server Status Notifications

Notifications are sent when:

- A server goes from online to offline (or vice versa)
- A server hasn't been seen for more than 24 hours
