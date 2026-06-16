---
title: Playbooks
description: Build and run multi-step automation pipelines
---

# Playbooks

Playbooks are multi-step automation pipelines that can execute commands across SSH, local machine, Docker, and more.

## Step Types

SSH steps execute via `SshService` (powered by `spatie/ssh`), which handles PEM decryption, connection, and output streaming. Commands can stream live output to the browser via WebSocket.

| Type | Description | Runs On |
|---|---|---|
| **SSH** | Remote command via SSH | Target server |
| **LOCAL** | Command on the panel server | Panel host |
| **DOCKER** | Docker operations (pull, exec) | Target server |
| **HTTP** | HTTP request (curl) | Panel host |
| **WAIT** | Pause or wait for port/socket | Target server |
| **NOTIFY** | Send notification mid-playbook | Panel |

## Building a Playbook

### Playbook Parameters

Define variables that get injected into steps:

```yaml
parameters:
  - key: BACKUP_PATH
    label: Backup Directory
    default: ~/backups
  - key: DOCKER_COMPOSE_DIR
    label: Docker Compose Path
    default: /opt/rocketchat
```

Steps reference parameters via `{{parameter.key}}` syntax.

### Step Configuration

Each step has:

| Setting | Description |
|---|---|
| **Name** | Display label |
| **Type** | ssh, local, docker, http, wait, notify |
| **Command** | Script or command to run |
| **Target Server** | Override the playbook's default server |
| **Run If** | Condition: `{{steps.1.exit_code}} == 0` |
| **Rollback Command** | Revert action on failure |
| **Timeout** | Max execution time (default 300s) |
| **Retries** | Auto-retry count |

## Example: Full Upgrade with Backup

```yaml
name: Full Upgrade Rocket.Chat
server: rocket-chat-prod

steps:
  - name: Backup database
    type: ssh
    command: |
      cd /opt/rocketchat
      docker compose exec -T mongo mongodump --archive > backup.archive

  - name: Download backup locally
    type: local
    command: |
      rsync -avz {{server.ip}}:/opt/rocketchat/backup.archive \
        ./backups/rocketchat-{{now}}.archive
    rollback_command: echo "Backup preserved locally"

  - name: Upload to S3
    type: local
    command: s3cmd put ./backups/rocketchat-{{now}}.archive s3://backups/
    rollback_command: echo "Backup still available locally"

  - name: Pull latest images
    type: docker
    command: docker compose pull
    timeout: 180

  - name: Restart services
    type: ssh
    command: docker compose up -d
    rollback_command: docker compose down && docker compose up -d

  - name: Health check
    type: http
    command: https://chat.example.com/api/info
    timeout: 30
```

## Scheduling

| Field | Description |
|---|---|
| Cron Expression | Standard 5-field cron syntax |
| Timezone | Server timezone for execution |
| Enabled | Toggle schedule on/off |

## Execution & Rollback

When a step fails:

1. The failed step's `rollback_command` executes
2. All previously successful steps execute their rollback commands in reverse order
3. The playbook run status is set to `rolled_back`
4. A notification is sent

If a step has no rollback command, it is skipped during rollback.
