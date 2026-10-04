# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Los usuarios principales son equipos de desarrollo y operaciones (DevOps) de la Universidad Católica de Temuco que necesitan desplegar, observar y administrar aplicaciones institucionales sobre Kubernetes. El producto también contempla administradores responsables de usuarios, equipos, roles, permisos y configuración de la plataforma.

## Product Purpose

Kubero UCT proporciona una plataforma institucional de autoservicio para desplegar y operar aplicaciones en Kubernetes sin exigir conocimiento especializado del clúster. El éxito consiste en que los equipos puedan llevar aplicaciones desde código fuente o imágenes de contenedor hasta entornos utilizables, y luego supervisarlas y mantenerlas desde una interfaz coherente y segura.

## Positioning

Es una adaptación institucional de Kubero para la Universidad Católica de Temuco: combina el modelo PaaS nativo de Kubernetes y los flujos GitOps de Kubero con identidad UCT, operación multiusuario y controles de acceso organizados por equipos y roles.

## Operating Context

- Los equipos trabajan con pipelines y fases de revisión, pruebas, staging y producción.
- Las aplicaciones pueden originarse en repositorios Git, imágenes de contenedor o plantillas de servicios.
- La operación cotidiana incluye despliegues, builds, métricas, logs, eventos, consola web, tareas programadas, reinicios, add-ons y notificaciones.
- La administración comprende cuentas, equipos, roles, tokens y configuración de integraciones y despliegue.
- El sistema interactúa con Kubernetes y con repositorios Git alojados o autogestionados.

## Capabilities and Constraints

- Frontend web existente en Vue 3 y Vuetify 3; API existente en NestJS y TypeScript.
- Los recursos se gestionan de forma nativa en Kubernetes y los contratos compartidos con el CLI, el operador y los CRDs viven en repositorios externos a este checkout.
- Deben preservarse la separación entre equipos y roles, la autorización por recurso y las protecciones de operaciones sensibles.
- La interfaz debe funcionar en temas claro y oscuro.
- Los cambios no deben exponer secretos en la interfaz, logs, capturas, plantillas ni respuestas API.
- Los requisitos institucionales internos son vinculantes; su catálogo detallado aún no está documentado en este repositorio y debe confirmarse cuando afecte una tarea.

## Brand Commitments

- Nombre de producto: Kubero UCT.
- Identidad institucional de la Universidad Católica de Temuco y su Facultad de Ingeniería.
- Uso de los activos institucionales existentes, incluida la marca UCT presente en `client/src/assets/logouct-header.png`.
- Voz sobria, institucional y orientada a una herramienta técnica de operación.
- Soporte equivalente de la identidad y la legibilidad en temas claro y oscuro.

## Evidence on Hand

- Descripción funcional y arquitectura de Kubero en `README.md`.
- Implementación de pipelines, aplicaciones, métricas, logs, consola, add-ons, notificaciones y administración en `client/src/views/` y `client/src/components/`.
- Rutas de producto en `client/src/router/index.ts`.
- Activos de marca en `client/src/assets/`.
- Tokens y reglas institucionales UCT en `.agents/skills/uct-kubero-design/SKILL.md` y `client/src/styles/uct-theme.scss`.
- Pruebas Playwright con soporte de axe en `client/`.
- No hay en este checkout evidencia aprobada de testimonios, benchmarks, métricas de adopción o afirmaciones institucionales adicionales; no deben fabricarse.

## Product Principles

1. Hacer accesible la operación sobre Kubernetes sin ocultar el estado técnico necesario para tomar decisiones seguras.
2. Mantener autorización explícita y separación clara entre usuarios, equipos y roles en todas las superficies.
3. Presentar despliegues, estados, métricas y errores con alta legibilidad y acciones inequívocas.
4. Integrar la identidad UCT de forma consistente, sobria y funcional en lugar de tratarla como decoración.
5. Conservar compatibilidad con los contratos externos del CLI, el operador y los CRDs, documentando toda coordinación necesaria.

## Accessibility & Inclusion

La accesibilidad es un requisito permanente del producto. Las interfaces deben ser operables con teclado, comunicar estados y errores sin depender solo del color, mantener contraste suficiente en temas claro y oscuro y usar nombres accesibles para controles e iconos. El estándar formal o nivel de conformidad institucional aún no está especificado y debe confirmarse antes de asumir uno.
