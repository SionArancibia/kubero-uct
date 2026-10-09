# Actividad y auditoría

El audit log está habilitado por defecto. El rol `admin` ya incluye `audit:read`
en la configuración inicial de roles. Una instalación con `KUBERO_AUDIT=false`
conserva esa desactivación explícita: para activarlo, establece
`KUBERO_AUDIT=true` en el entorno del servidor y reinícialo. No se recuperan
eventos anteriores que no se hayan registrado. No se modifican roles existentes.

Actividad muestra 20 registros por página y permite filtrar por nombre exacto
de pipeline, acción, parte del nombre de usuario y fechas. El intervalo de fechas
usa la zona horaria del navegador e incluye todo el día final seleccionado.
Los filtros se aplican con «Aplicar filtros»; cambiar de página conserva los
criterios aplicados. «Actualizar» vuelve a consultar la página actual.

`GET /api/audit` conserva `audit`, `count` y `limit`, y añade `page` y `enabled`.
Acepta `limit` (1–100), `page` (desde 1), `pipeline`, `action`, `username`, `from`
y `to` (ISO 8601; límite final exclusivo). El servidor filtra y cuenta antes de
paginar y ordena por fecha e ID descendentes. Nuevos eventos pueden desplazar
filas entre páginas; «Actualizar» permite refrescar la consulta.

Los permisos existentes siguen siendo obligatorios. El equipo `admin` mantiene
su acceso global; los demás usuarios solo consultan pipelines autorizados,
incluso cuando solicitan otro pipeline mediante filtros. No se cambian el esquema
Prisma, recursos Kubernetes ni contratos con CLI u operador. No se necesitan
migraciones ni dependencias adicionales. Para revertir, restaurar los componentes,
servicio y controlador y desactivar `KUBERO_AUDIT` si corresponde.
