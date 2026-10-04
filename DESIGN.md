---
name: "Kubero UCT"
description: "Centro de operaciones institucional compacto para desplegar y administrar infraestructura sobre Kubernetes."
colors:
  primary: "#0075B4"
  primary-hover: "#005888"
  primary-dark-theme: "#0090DC"
  accent: "#EDC500"
  accent-text: "#7A6400"
  success: "#10B981"
  success-text: "#059669"
  error: "#EF4444"
  error-text: "#DC2626"
  metadata: "#878787"
  background-light: "#F4F6F9"
  navigation-light: "#F7F9FC"
  secondary-light: "#EAEFF5"
  surface-light: "#FFFFFF"
  text-light-theme: "#1A1A1A"
  background-dark: "#0E1620"
  navigation-dark: "#0B1119"
  surface-dark: "#16202D"
  secondary-dark: "#1B2430"
  focus-dark: "#2A374A"
  text-dark-theme: "#E2E8F0"
  subtle-border: "rgba(135, 135, 135, 0.2)"
typography:
  title:
    fontFamily: "Vista Sans, Roboto, system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  section-title:
    fontFamily: "Vista Sans, Roboto, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.05em"
  body:
    fontFamily: "Vista Sans, Roboto, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  value:
    fontFamily: "Vista Sans, Roboto, system-ui, -apple-system, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
  label:
    fontFamily: "Vista Sans, Roboto, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.025em"
  code:
    fontFamily: "Fira Code, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface-light}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.surface-light}"
    rounded: "{rounded.md}"
  button-tonal:
    backgroundColor: "{colors.secondary-light}"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.text-light-theme}"
    rounded: "{rounded.md}"
    padding: "24px"
  chip:
    backgroundColor: "{colors.secondary-light}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "4px 8px"
  input-outlined:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.text-light-theme}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: "12px 16px"
    height: "48px"
  navigation-item:
    textColor: "{colors.text-light-theme}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "48px"
  terminal:
    backgroundColor: "{colors.navigation-dark}"
    textColor: "{colors.text-dark-theme}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: "16px"
---

# Design System: Kubero UCT

## Overview

**Creative North Star: "Centro de Operaciones de Infraestructura Institucional"**

Kubero UCT se comporta visualmente como una sala de control universitaria: compacta, rigurosa y orientada a datos. La identidad institucional aparece en las decisiones que ayudan a operar —jerarquía, navegación, estados y foco— sin convertir la interfaz en una pieza promocional.

El sistema privilegia densidad eficiente, lectura rápida y superficies en capas contenidas. La marca UCT aporta autoridad y continuidad; Vuetify aporta convenciones de interacción conocidas; los datos técnicos conservan suficiente contraste y estructura para sostener sesiones prolongadas de operación.

**Key Characteristics:**

- Compacto y escaneable, con jerarquías cortas y consistentes.
- Institucional sin ornamentación gratuita.
- Equivalente en temas claro y oscuro.
- Estados operativos legibles por color, texto, iconos y contexto.
- Movimiento breve y funcional, con alternativa para movimiento reducido.

## Colors

La paleta combina azules institucionales fríos con neutros técnicos y reserva el amarillo para atención operativa.

### Primary

- **Azul Operativo UCT** (#0075B4): identifica acciones primarias, enlaces, navegación activa y títulos de sección en el tema claro.
- **Azul de Señal UCT** (#0090DC): mantiene la identidad y el contraste de las mismas funciones en superficies oscuras.
- **Azul Operativo Profundo** (#005888): comunica interacción hover o énfasis contenido, no una segunda marca.

### Secondary

- **Amarillo de Atención Institucional** (#EDC500): destaca estados de espera, construcción o advertencia y acentos secundarios que necesitan visibilidad inmediata.
- **Ocre de Lectura** (#7A6400): conserva legibilidad cuando el amarillo se usa como fondo tonal claro.

### Tertiary

- **Verde de Operación** (#10B981): confirma ejecución saludable o finalización exitosa.
- **Rojo de Incidencia** (#EF4444): señala fallos, errores y acciones destructivas.

### Neutral

- **Pizarra Operativa** (#0B1119): navegación y terminales en el entorno oscuro.
- **Panel Nocturno** (#16202D): superficie de tarjetas en tema oscuro.
- **Fondo Técnico Oscuro** (#0E1620): plano base del tema oscuro.
- **Papel de Operaciones** (#F4F6F9): plano base sobrio del tema claro.
- **Superficie Blanca** (#FFFFFF): tarjetas y paneles principales en tema claro.
- **Grafito de Lectura** (#1A1A1A) y **Texto de Consola** (#E2E8F0): pares de texto principales para claro y oscuro.
- **Gris de Metadatos** (#878787): etiquetas, metadatos y contenido secundario.

**The Operational Color Rule.** El azul identifica interacción y estructura; el amarillo, verde y rojo comunican estados. Ningún color de estado debe convertirse en decoración ambiental.

**The Dual-Theme Rule.** Toda asignación de color debe resolver explícitamente los temas claro y oscuro mediante roles semánticos de Vuetify, nunca mediante un valor pensado para un solo fondo.

## Typography

**Display Font:** Vista Sans, con Roboto y system-ui como respaldos.

**Body Font:** Vista Sans, con Roboto y system-ui como respaldos.

**Label/Mono Font:** Fira Code, con SFMono-Regular, Menlo, Consolas y monospace como respaldos técnicos.

**Character:** La tipografía es compacta y factual. El peso, la caja y el espaciado distinguen nombres, etiquetas y valores sin recurrir a escalas dramáticas.

### Hierarchy

- **Title** (600, 1.25rem, 1.3): encabezado principal de una vista o entidad.
- **Section title** (600, 0.75rem, 0.05em): agrupación operacional en mayúsculas, como fases de pipeline.
- **Value** (500, 0.9375rem): nombres, endpoints y datos de configuración que necesitan lectura prioritaria.
- **Body** (400, 0.875rem): explicación, formularios y contenido cotidiano.
- **Label** (500, 0.75rem, 0.025em): metadatos y nombres de campo en mayúsculas.
- **Code** (500, 0.8125rem): hashes, comandos, pods, logs y valores que requieren alineación técnica.

**The Data Voice Rule.** Los identificadores técnicos usan la familia monoespaciada; la interfaz, navegación y explicación permanecen en la familia institucional.

**The Short Hierarchy Rule.** Una pantalla operativa no necesita más de título, sección, etiqueta, valor y cuerpo; las variaciones ad hoc debilitan el escaneo.

## Layout

La estructura principal usa una navegación lateral permanente y compacta de 56px. Los grupos secundarios se abren en un panel de 256px superpuesto junto al rail, con encabezado de 72px y elementos de al menos 48px de alto.

El ritmo base se construye sobre pasos de 4px y 8px. Las superficies usan normalmente 16–24px de espacio interior; las separaciones entre secciones y columnas principales usan 24px. Las vistas de pipeline mantienen columnas operativas de 360–420px y prefieren desplazamiento horizontal antes que comprimir datos críticos.

En anchos reducidos, las rejillas de Vuetify apilan formularios y paneles. Las tablas y boards densos deben conservar contexto mediante scroll explícito, truncado con acceso al valor completo y acciones accesibles, no mediante reducción tipográfica.

**The Density Without Compression Rule.** Reducir espacio es válido; reducir controles, contraste o texto por debajo de su escala establecida no lo es.

## Elevation & Depth

El sistema trabaja en capas contenidas. Las tarjetas se separan mediante contraste tonal y un borde translúcido; la elevación ordinaria es mínima. Las sombras se reservan para superficies que realmente cruzan el plano de trabajo, como login, diálogos y navegación secundaria.

### Shadow Vocabulary

- **Capa lateral estructural** (`8px 0 24px rgba(14, 22, 32, 0.18)`): separa el panel secundario del área operativa.
- **Elevación baja de superficie** (Vuetify elevation 1): da presencia mínima a tarjetas interactivas sin crear una cuadrícula de sombras.
- **Elevación modal** (Vuetify elevation 4): concentra la atención en autenticación y superficies temporales.

**The Earned Elevation Rule.** Una sombra solo aparece cuando una superficie está temporalmente encima, se mueve sobre otra o necesita capturar el foco.

## Shapes

La geometría usa curvas contenidas: 4px para chips y estados compactos, 6px para énfasis de navegación y 8px para tarjetas, botones, terminales y controles principales. Los avatares y progresos pueden usar forma completa cuando su semántica lo exige. Los bordes son finos y de bajo contraste; nunca compiten con el estado o el contenido.

**The Utility Curve Rule.** Las esquinas suavizan la herramienta sin volverla lúdica; evita radios grandes en contenedores operativos.

## Components

### Buttons

Contenidos y utilitarios: texto legible, acción directa y una sola jerarquía dominante por grupo.

- **Shape:** curva moderada (8px) y texto sin transformación automática a mayúsculas.
- **Primary:** azul operativo, texto blanco y espaciado compacto; se reserva para la acción principal.
- **Hover / Focus:** el hover profundiza el azul; el foco visible usa un contorno sólido de 3px con separación de 2px en navegación crítica.
- **Secondary / Ghost:** las variantes tonal y text reducen peso sin perder el color semántico; error se reserva para acciones destructivas.

### Chips

- **Style:** forma rectangular compacta (4px), peso 600 y fondo tonal de baja opacidad.
- **State:** color, texto e icono trabajan juntos; running, building y failed no dependen solo del matiz.

### Cards / Containers

- **Corner Style:** curva moderada (8px).
- **Background:** superficie semántica clara u oscura según el tema.
- **Shadow Strategy:** borde primero, elevación baja solo cuando la tarjeta es interactiva.
- **Border:** gris institucional al 20% de opacidad.
- **Internal Padding:** 16–24px, reducido a 8–12px en filas de datos compactas.

### Inputs / Fields

- **Style:** variante outlined para entrada principal y filled para datos de solo lectura o depuración.
- **Focus:** azul semántico de tema; el label permanece visible y el icono anticipa el tipo de dato.
- **Error / Disabled:** el error combina color y mensaje; disabled mantiene legibilidad y expresa la restricción de permisos.

### Navigation

El rail primario usa iconos MDI, densidad compacta y estado activo azul. El panel secundario conserva superficies del tema, títulos de peso 600 y foco de teclado inequívoco. Las entradas que dependen de permisos desaparecen o se deshabilitan de acuerdo con la capacidad real del usuario.

### Pipeline Card

La tarjeta de aplicación es el patrón distintivo del sistema: reúne identidad, repositorio, estado, métricas y acciones en una superficie compacta. Sus divisores y filas alternas organizan datos; el color no sustituye etiquetas ni unidades.

### Terminal

La terminal mantiene Pizarra Operativa, Texto de Consola, tipografía monoespaciada y curva de 8px en ambos temas. No adopta el fondo de tarjeta porque su continuidad visual ayuda a reconocer una sesión técnica.

## Do's and Don'ts

### Do:

- **Do** usar roles semánticos de Vuetify para que cada componente responda correctamente a temas claro y oscuro.
- **Do** mantener etiquetas compactas, unidades visibles y alineación estable para métricas y estados.
- **Do** combinar color con texto, icono o forma en estados operativos.
- **Do** respetar foco visible, navegación por teclado y movimiento reducido.
- **Do** conservar el logotipo UCT con proporciones intactas y texto alternativo significativo.

### Don't:

- **Don't** reintroducir el morado histórico de Kubero como acento de producto; la identidad activa es azul UCT.
- **Don't** usar amarillo, verde o rojo como decoración sin semántica de estado.
- **Don't** añadir sombras a cada tarjeta ni convertir la profundidad contenida en relieve ornamental.
- **Don't** mezclar valores hexadecimales de un solo tema cuando existe un rol semántico equivalente.
- **Don't** reducir texto o controles para encajar datos densos; usa scroll, agrupación y truncado accesible.
