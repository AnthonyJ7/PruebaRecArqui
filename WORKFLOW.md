# Flujo de trabajo del proyecto CarnavalLogistics

## Objetivo
CarnavalLogistics coordina la logística de plazas públicas durante festividades, separando el control de aforo y la gestión de permisos comerciales en módulos independientes.

## Flujo funcional (alto nivel)
1. **Inicio de la aplicación**
   - Se carga el shell principal y el router dirige por defecto al módulo de Aforo.
2. **Gestión de Aforo**
   - El usuario registra plazas con su capacidad y ocupación inicial.
   - Se visualizan métricas globales y tarjetas por plaza.
   - La ocupación se ajusta con controles rápidos (+/-) y se actualiza el estado visual (Normal/Alerta/Crítico).
3. **Gestión de Permisos Comerciales**
   - El usuario emite permisos para comerciantes temporales.
   - Se listan permisos con su estado (Vigente/Suspendido).
   - Se puede suspender o reactivar cada permiso.
4. **Persistencia actual**
   - Cada módulo persiste en memoria mediante su repositorio.
   - Puede sustituirse por API o base de datos sin alterar la UI ni los servicios.

## Flujo técnico por capas
1. **Presentación (UI)**
   - Componentes de Aforo y Permisos muestran formularios, métricas y listados.
2. **Aplicación / Casos de uso**
   - Servicios encapsulan reglas de negocio y orquestan operaciones.
3. **Dominio**
   - Modelos tipados (AforoRecord, PermisoComercial) garantizan consistencia.
4. **Infraestructura**
   - Repositorios por módulo encapsulan la persistencia.

## Interacción de módulos
- Aforo y Permisos son independientes: no comparten servicios ni repositorios.
- Los modelos se ubican en una carpeta compartida para mantener consistencia de datos.

## Flujo CI/CD
1. **Commit / Pull Request**
   - Dispara la ejecución del pipeline.
2. **Instalación de dependencias**
   - Se ejecuta `npm ci` para reproducibilidad.
3. **Pruebas unitarias**
   - Se ejecuta `npm test -- --watch=false --browsers=ChromeHeadless`.
4. **Build de producción**
   - Se ejecuta `npm run build`.

## Operación local
- **Desarrollo**: `npm start`
- **Pruebas**: `npm test`
- **Build**: `npm run build`
