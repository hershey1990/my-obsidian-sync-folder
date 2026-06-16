---
title: Development
description: Local setup, project structure, and contribution guide
---

# Development

## Local Setup

### Prerequisites

- PHP 8.3+
- Node.js 20+
- Composer
- PostgreSQL 16
- Redis 7

### Steps

```bash
git clone https://github.com/your-org/infra-manager.git
cd infra-manager

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Copy environment
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate

# Build frontend
npm run dev

# In separate terminals:
php artisan serve
php artisan reverb:start
php artisan horizon
php artisan schedule:work
```

## Project Structure

```
infra-manager/
├── app/
│   ├── Http/
│   │   ├── Controllers/         # API Controllers
│   │   │   ├── ServerController.php
│   │   │   ├── ResourceController.php
│   │   │   ├── PlaybookController.php
│   │   │   ├── PlaybookRunController.php
│   │   │   ├── HealthCheckController.php
│   │   │   └── NotificationController.php
│   │   └── Requests/            # Form validation
│   ├── Jobs/                    # Queue jobs
│   │   ├── ExecutePlaybookJob.php
│   │   ├── RunHealthCheckJob.php
│   │   └── SendNotificationJob.php
│   ├── Models/
│   │   ├── Server.php
│   │   ├── ServerResource.php
│   │   ├── Playbook.php
│   │   ├── PlaybookStep.php
│   │   ├── PlaybookRun.php
│   │   ├── StepRun.php
│   │   ├── HealthCheckResult.php
│   │   └── NotificationChannel.php
│   ├── Services/
│   │   ├── SshService.php       # spatie/ssh wrapper
│   │   ├── TerminalSession.php  # phpseclib interactive session
│   │   ├── DiscoveryService.php # Auto-discovery logic
│   │   ├── PlaybookEngine.php   # Step executor
│   │   └── EncryptionService.php # PEM/credential management
│   └── Reverb/
│       └── TerminalChannel.php  # WebSocket handler for terminal
├── config/                      # Laravel config files
├── database/
│   └── migrations/              # Database migrations
├── resources/js/                # React frontend (Inertia)
│   ├── Pages/
│   │   ├── Dashboard.tsx
│   │   ├── Servers/
│   │   ├── Resources/
│   │   ├── Playbooks/
│   │   └── Settings/
│   └── Components/
│       ├── Terminal.tsx         # xterm.js component
│       ├── StepBuilder.tsx      # Drag & drop step editor
│       └── ui/                  # shadcn/ui components
├── routes/
│   ├── web.php                  # Inertia page routes
│   └── api.php                  # API routes
├── docker-compose.yml
└── Dockerfile
```

## Code Conventions

- PSR-12 for PHP code
- ESLint + Prettier for TypeScript/React
- All React components use `.tsx` extension (no `.jsx`)
- Tailwind CSS utility classes for styling
- shadcn/ui components (do not create custom UI components unless necessary)
- All SSH credentials must be encrypted before storage
- Never log PEM keys or connection strings
- API responses follow JSON:API convention

## Testing

```bash
# PHP tests
php artisan test

# With coverage
php artisan test --coverage

# Frontend tests
npm run test
```
