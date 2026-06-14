---
title: Quick Start
description: Get up and running in 5 minutes
---

# Quick Start

## 1. Add Your First Server

1. Go to **Servers > Add Server**
2. Fill in:
   - **Name**: e.g., `Rocket.Chat Production`
   - **IP**: Your server's public IP
   - **Port**: 22 (default)
   - **Username**: `ubuntu` or `root`
3. Upload your `.pem` private key file
4. Click **Test Connection** — you should see "Connected successfully"
5. Click **Save**

## 2. Auto-Discover Services

1. Open the server detail page
2. Click **Discover Services**
3. The panel will SSH into the server and run discovery commands
4. Found services appear in a confirmation list:
   - `rocketchat/rocket.chat:6.5.0` → assign type: Rocket.Chat
   - `mongo:7.0` → assign type: MongoDB
5. Click **Confirm** to create Resource entries

## 3. Create Your First Playbook

1. Go to **Playbooks > Create Playbook**
2. Name it `Full Upgrade`
3. Select the target server
4. Add steps:

   ```
   [SSH]   → bash scripts/backup.sh
   [LOCAL] → rsync -avz remote:backups/ ./local/
   [SSH]   → docker compose pull && up -d
   [SSH]   → curl -f http://localhost:3000
   ```

5. Click **Save**

## 4. Run It

1. Open the playbook
2. Click **Run Now**
3. Watch each step execute in real time
4. If a step fails, rollback runs automatically

## 5. Schedule It

1. In the playbook detail page, click **Schedule**
2. Set cron expression: `0 3 * * 0` (every Sunday at 3 AM)
3. Done. The panel will run it automatically.
