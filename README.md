# CarnavalLogistics

Plataforma municipal para coordinar la logística de plazas públicas durante festividades. El sistema gestiona aforo (capacidad de personas en recintos) y permisos comerciales para puestos temporales de forma independiente.

## Arquitectura en capas

La solución separa responsabilidades por capas y por dominio funcional. Cada módulo (Aforo y Permisos Comerciales) es autónomo y mantiene su propio flujo de datos.


### Diagrama de componentes (bloques)

```
┌───────────────────────────────────────────────┐
│ Presentación (UI)                             │
│ - AforoComponent                              │
│ - PermisosComponent                           │
└───────────────▲───────────────────────────────┘
				│
┌───────────────┴───────────────────────────────┐
│ Aplicación / Casos de uso                     │
│ - AforoService                                │
│ - PermisosService                             │
└───────────────▲───────────────────────────────┘
				│
┌───────────────┴───────────────────────────────┐
│ Dominio (Modelos compartidos)                 │
│ - AforoRecord                                 │
│ - PermisoComercial                            │
└───────────────▲───────────────────────────────┘
				│
┌───────────────┴───────────────────────────────┐
│ Infraestructura / Persistencia                │
│ - AforoRepository (in-memory)                 │
│ - PermisosRepository (in-memory)              │
└───────────────────────────────────────────────┘
```

### Responsabilidades y persistencia

- **Presentación**: componentes que muestran formularios y listados. No contienen lógica de negocio.
- **Aplicación**: servicios que orquestan reglas, validaciones y operaciones.
- **Dominio**: modelos compartidos que definen la estructura de datos.
- **Infraestructura**: repositorios por módulo. La persistencia actual es en memoria, lo que permite reemplazarla por APIs o bases de datos sin afectar las capas superiores.

### Justificación (Mantenibilidad)

- **Bajo acoplamiento**: cada módulo tiene su propio repositorio y servicio. Cambios en Aforo no impactan Permisos y viceversa.
- **Alta cohesión**: cada carpeta agrupa responsabilidades relacionadas.
- **Sustitución de persistencia**: la capa de infraestructura puede cambiar (por ejemplo, a una API REST) sin alterar componentes ni servicios.
- **Escalabilidad**: nuevos módulos pueden seguir el mismo patrón sin tocar los existentes.

## Estructura principal

- Aforo: [src/app/features/aforo](src/app/features/aforo)
- Permisos: [src/app/features/permisos](src/app/features/permisos)
- Modelos compartidos: [src/app/shared/models](src/app/shared/models)

## CI/CD con GitHub Actions

Se incluye un pipeline básico en .github/workflows/ci-cd.yml con los siguientes pasos:

1. **Checkout**: clona el repositorio en el runner.
2. **Setup Node**: configura Node.js y cachea dependencias.
3. **Install**: instala dependencias con npm ci.
4. **Test**: ejecuta pruebas unitarias en modo CI.
5. **Build**: compila el proyecto para producción.

### Ejecución local

- Desarrollo: `npm start`
- Pruebas: `npm test`
- Build: `npm run build`
