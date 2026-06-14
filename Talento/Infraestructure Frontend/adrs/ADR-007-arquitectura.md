---
title: "ADR-007: Arquitectura del software"
status: accepted
date: 2026-06-14
---

# ADR-007: Arquitectura del software

## Contexto

El proyecto necesita una estructura de código que sea mantenible, testeable, y comprensible para desarrolladores con experiencia variada. Se consideraron:

- **Hexagonal / Ports & Adapters**: Separación total entre dominio e infraestructura. Sobredimensionado para un proyecto con un solo delivery mechanism (HTTP). Cada puerto y adaptador añade archivos de interfaz sin beneficio real.
- **Full DDD**: Value Objects, Domain Events, Aggregates. La lógica de negocio del proyecto es orquestación de comandos SSH, no reglas de dominultra complejas. DDD añadiría friction sin justificación.
- **Repository Pattern**: Abstraer Eloquent detrás de interfaces. Para un proyecto que siempre usará PostgreSQL, es boilerplate puro.
- **Action / Use Case Pattern**: Clases que representan operaciones únicas del sistema, orquestando servicios y modelos.

## Decisión

**Layered Architecture con Application Layer explícita (Action Pattern)**

```
┌─────────────────────────────────────────────┐
│  Presentation Layer                          │
│  Controllers / Reverb Handlers / Console     │
├─────────────────────────────────────────────┤
│  Application Layer (Actions)                 │
│  CreateServerAction, RunPlaybookAction, etc  │
├─────────────────────────────────────────────┤
│  Domain Layer (Models)                       │
│  Server, Playbook, StepRun, etc              │
├─────────────────────────────────────────────┤
│  Infrastructure Layer (Services)             │
│  SshService, PlaybookEngine, DiscoveryService│
└─────────────────────────────────────────────┘
```

### Responsabilidades por capa

**1. Presentation Layer** — `app/Http/Controllers/` + `routes/`

- Recibe el request HTTP
- Valida entrada (Form Requests)
- Delega al Action correspondiente
- Devuelve respuesta JSON (API Resource)

```php
class ServerController extends Controller
{
    public function store(CreateServerRequest $request)
    {
        $server = (new CreateServerAction)->execute($request->validated());
        return ServerResource::make($server);
    }
}
```

**2. Application Layer** — `app/Actions/`

- Un caso de uso = una clase
- Orquesta la interacción entre Models y Services
- No sabe de HTTP (recibe DTOs o arrays, no Requests)
- No sabe de bases de datos (usa Models sin Repository)

```php
class CreateServerAction
{
    public function __construct(
        private SshService $sshService,
        private DiscoveryService $discoveryService,
    ) {}

    public function execute(array $data): Server
    {
        $data['pem_key'] = Encrypter::encryptString($data['pem_key']);
        $server = Server::create($data);

        if ($this->sshService->testConnection($server)) {
            $this->discoveryService->discover($server);
        }

        return $server;
    }
}
```

**3. Domain Layer** — `app/Models/`

- Modelos Eloquent anémicos (relationships, scopes, accessors)
- Sin lógica de negocio compleja
- Representan el estado persistido del sistema

```php
class Server extends Model
{
    protected $encrypted = ['pem_key'];

    public function resources(): HasMany
    {
        return $this->hasMany(ServerResource::class);
    }

    public function playbooks(): HasMany
    {
        return $this->hasMany(Playbook::class);
    }

    public function scopeOnline(Builder $query): void
    {
        $query->where('status', 'online');
    }
}
```

**4. Infrastructure Layer** — `app/Services/`

- Lógica que depende de sistemas externos (SSH, WebSocket, S3, Redis)
- Se inyectan en Actions vía constructor (Laravel auto-resuelve)
- Son las únicas clases que se mockean en tests unitarios de Actions

```php
class SshService
{
    public function testConnection(Server $server): bool { ... }
    public function execute(Server $server, string $command): CommandResult { ... }
}
```

### Diagrama de flujo

```
POST /api/servers
  │
  ▼
ServerController@store
  │  valida con CreateServerRequest
  ▼
CreateServerAction::execute($data)
  │  Server::create()
  │  SshService::testConnection()
  │  DiscoveryService::discover()
  ▼
ServerResource::make($server)
  │
  ▼
JSON Response
```

```
POST /api/playbooks/{id}/run
  │
  ▼
PlaybookRunController@run
  │
  ▼
RunPlaybookAction::execute($playbook)
  │  PlaybookEngine::execute($playbook, callback)
  │    ├── SshService::execute()
  │    ├── Reverb::broadcast()  (output en vivo)
  │    ├── StepRun::create()
  │    └── Rollback si falla
  │  NotificationService::send()
  ▼
PlaybookRunResource::make($run)
```

### ¿Por qué NO otros patrones?

| Patrón | Razón para no usarlo |
|---|---|
| **Repository** | Eloquent ya es el Repository. Una interfaz adicional no aporta nada porque nunca cambiaremos de base de datos. Es código muerto. |
| **Hexagonal** | Un solo delivery mechanism (HTTP). Los "adapters" serían Controllers y Reverb handlers — no necesitan más abstracción. |
| **DDD táctico** | Value Objects y Domain Events añaden complejidad. La lógica del proyecto es "conectar SSH → ejecutar comando → notificar". No hay reglas de dominio que justifiquen DDD. |
| **Service Layer con Services gigantes** | Separar cada caso de uso en su propia clase evita Services de 2000 líneas y facilita testing unitario. |

### Tests

```php
// Action test — mock services, test lógica
class CreateServerActionTest extends TestCase
{
    public function test_encrypts_pem_key_before_saving()
    {
        $action = new CreateServerAction(
            $this->mock(SshService::class),
            $this->mock(DiscoveryService::class),
        );
        // ...
    }
}

// Service test — integración real SSH
class SshServiceTest extends TestCase
{
    public function test_connects_with_pem_key()
    {
        // Usa contenedor Docker con SSH para test real
    }
}

// Controller test — test HTTP + assertions
class ServerControllerTest extends TestCase
{
    public function test_creates_server()
    {
        $response = $this->postJson('/api/servers', [...]);
        $response->assertStatus(201);
    }
}
```

## Consecuencias

- Positivas: estructura clara y familiar para cualquier desarrollador Laravel
- Positivas: Actions son testeables unitariamente sin HTTP
- Positivas: Controllers se mantienen delgados (~3 líneas cada uno)
- Positivas: no hay abstracciones innecesarias (Repository, Interfaces, etc.)
- Negativas: si el proyecto crece mucho, los Actions podrían duplicar lógica entre casos de uso similares (se resuelve con Traits o Services compartidos)
- Negativas: arquitectos ultra-ortodoxos podrían extrañar interfaces formales entre capas
