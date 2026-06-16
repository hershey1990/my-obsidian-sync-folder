---
title: "ADR-008: SshService con spatie/ssh"
status: accepted
date: 2026-06-15
---

# ADR-008: SshService con spatie/ssh

## Contexto

El proyecto necesita ejecutar comandos SSH contra servidores remotos en cuatro módulos distintos:

- **Servers**: test de conexión al crear/editar un server
- **Resources**: auto-discovery (docker ps, systemctl) y health checks
- **Playbooks**: ejecución de steps tipo `ssh` con output en vivo y rollback
- **Health**: comandos de health check automáticos

Cada módulo podría implementar su propia lógica SSH. Eso llevaría a:
- Duplicación del manejo de PEMs (decrypt → temp file → cleanup)
- Distintas convenciones de error handling
- Dificultad para mockear en tests

## Decisión

**Crear un servicio centralizado `SshService` en `app/Services/` que wrappea `spatie/ssh`** y expone una interfaz unificada para los cuatro consumidores.

### Dependencia externa

[spatie/ssh](https://github.com/spatie/ssh) — vía `composer require spatie/ssh`

Es un wrapper ligero sobre el binario `ssh` del sistema que:
- Usa Symfony Process por debajo
- Soporta private keys, timeouts, puertos personalizados
- Ofrece `execute()` y `executeAsync()` con callback de output
- Soporta `upload()` / `download()` vía SCP

No se eligió `phpseclib` para comandos porque:
- `spatie/ssh` es más simple y probado para ejecución de comandos
- `phpseclib` se reserva para la Terminal interactiva (sesiones persistentes vía Reverb), que requiere control bidireccional a nivel de socket

### DTO: `CommandResult`

```php
class CommandResult
{
    public function __construct(
        public readonly int $exitCode,
        public readonly string $output,
    ) {}

    public function successful(): bool
    public function failed(): bool
}
```

Sin getters ni setters — `public readonly` properties.

### `SshService` API

```php
class SshService
{
    /**
     * Verifica que podemos conectar y ejecutar un comando simple.
     * Usado por Servers (test connection).
     */
    public function testConnection(Server $server): bool;

    /**
     * Ejecuta uno o más comandos y espera el resultado completo.
     * Usado por Playbooks (steps ssh), Health (checks), Resources (discovery).
     */
    public function execute(
        Server $server,
        string|array $command,
        ?int $timeout = 300,
    ): CommandResult;

    /**
     * Ejecuta comandos con callback de output en vivo.
     * Usado por Playbooks para streaming a WebSocket y por la Terminal.
     */
    public function executeAsync(
        Server $server,
        string|array $command,
        ?callable $onOutput = null,
        ?int $timeout = 300,
    ): CommandResult;

    /**
     * Sube archivos/directorios vía SCP.
     * Usado por Playbooks (steps LOCAL que necesitan staging).
     */
    public function upload(
        Server $server,
        string $localPath,
        string $remotePath,
    ): bool;

    /**
     * Descarga archivos/directorios vía SCP.
     */
    public function download(
        Server $server,
        string $remotePath,
        string $localPath,
    ): bool;
}
```

### Manejo de PEMs

El `Server` model almacena `pem_key` encriptada con `Crypt::encryptString()`.

`SshService` sigue este flujo:

```
1. Crypt::decryptString($server->pem_key)
2. Escribir a temp file en sys_get_temp_dir() con permiso 0600
3. Pasar ruta a Ssh::usePrivateKey($tmpPath)
4. Ejecutar comando
5. Eliminar temp file (finally block)
```

Nunca se persiste la key en disco fuera del temp file, y el temp file se limpia siempre.

### Integración con la arquitectura existente

```
┌──────────────────────────────────────────────────┐
│  Presentation Layer                              │
│  Controllers  ──validan request──► Form Requests │
├──────────────────────────────────────────────────┤
│  Application Layer (Actions)                     │
│  CreateServerAction  TestConnectionAction        │
│  RunPlaybookAction   RunHealthCheckAction        │
│       │                                         │
├───────┼──────────────────────────────────────────┤
│       ▼                                         │
│  Infrastructure Layer (Services)                │
│  SshService  ◄── spatie/ssh                     │
│  PlaybookEngine  ◄── SshService                 │
│  DiscoveryService ◄── SshService                │
│  HealthService    ◄── SshService                │
└──────────────────────────────────────────────────┘
```

Los Actions inyectan `SshService` via constructor y Laravel lo auto-resuelve:

```php
class RunPlaybookAction
{
    public function __construct(
        private SshService $ssh,
        private PlaybookEngine $engine,
    ) {}
}
```

### Consideraciones técnicas

- **StrictHostKeyChecking**: deshabilitado con `->disableStrictHostKeyChecking()` para evitar prompts en servidores nuevos. La verificación de host key no aporta valor en este contexto (los servidores son propios y gestionados desde el panel).
- **Timeout default**: 30s por comando, configurable vía `$timeout`.
- **Cleanup**: el archivo temporal del PEM se elimina en `finally` dentro de cada método público.

## Consecuencias

- Positivas: un solo punto de cambio si migramos de `spatie/ssh` a otra librería
- Positivas: el manejo de PEMs (decrypt → temp → cleanup) está en un solo lugar
- Positivas: los cuatro módulos consumidores reciben el mismo `CommandResult` y el mismo error handling
- Positivas: `SshService` se mockea fácilmente en tests unitarios de Actions
- Negativas: todos los módulos comparten la misma configuración de conexión (StrictHostKeyChecking off, etc.). Si un módulo necesita comportamiento distinto, habrá que agregar configuración por método.

## Referencias

- [spatie/ssh — GitHub](https://github.com/spatie/ssh)
- [spatie/ssh — Packagist](https://packagist.org/packages/spatie/ssh)
- ADR-007: Arquitectura del software (Layered + Action Pattern)
