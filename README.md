# GenoKids V4

Aplicación local en HTML, CSS, JavaScript vanilla y SVG para preparar un genograma profesional, recoger elecciones infantiles en una capa separada y hacer una revisión visual no interpretativa.

V4 vive en `genokids-v4/`. No modifica `genokids/` ni `genokids-v2/`.

## Ejecutar

No requiere instalación ni dependencias.

```powershell
cd C:\Users\HP\.openclaw\workspace\genokids-v4
node serve.js
```

Abrir <http://127.0.0.1:4176/>. El servidor escucha `127.0.0.1` por defecto. Se puede cambiar con las variables `HOST` y `PORT` del entorno.

## Verificar

Con `node serve.js` activo:

```powershell
node --check app.js
node --check browser-smoke.js
node tests.js
node browser-smoke.js
```

`browser-smoke.js` busca Edge o Chrome instalado y usa Chrome DevTools Protocol sin paquetes. Comprueba HTTP 200, consola, viewport móvil 390×844, ausencia de overflow horizontal, galería sin solapes, flujo infantil, arrastre pointer, movimiento por teclado, actualización de geometría, unión persistente y escritorio 1440×900.

## Arquitectura V4

El estado tiene capas independientes:

- `people`: nombre, rol, símbolo, fallecimiento, identificación, fecha y posición geométrica interna. Las coordenadas nunca se muestran como campos.
- `unions`: pareja y estado (`couple`, `separated`, `divorced`).
- `descentLinks`: una filiación parte explícitamente de una `union` o una `person` y llega a una hija o hijo.
- `emotionalLinks`: relaciones descriptivas convencionales entre cualquier par.
- `households`: grupos de integrantes.
- `childResponse`: miniatura, explicación literal, orden y cambios; no modifica estructura ni parentescos.

La persistencia usa únicamente una clave propia de V4 en `sessionStorage`. `sanitizeState()` filtra referencias rotas, IDs duplicados y valores desconocidos; también migra la forma V2 `parentChildLinks` y nombres emocionales anteriores si una estructura vieja se entrega al saneador. V4 no lee la clave de V2.

## Decisiones de geometría

- **Unión:** `computeUnionGeometry()` conserva un tramo horizontal y un punto medio incluso si una persona fue arrastrada verticalmente; conectores cortos unen el tramo con ambos nodos.
- **Descendencia:** `computeDescentGeometry()` usa el centro de la unión como origen. Hijo único recibe una línea directa. Varios hijos comparten tronco vertical, barra de hermanos y ramales. Una fuente individual sigue siendo compatible.
- **Actualización:** pointer drag y flechas modifican la posición interna y vuelven a crear todo el SVG inmediatamente. Mayús + flecha mueve en pasos mayores.
- **Hogares:** `computeHouseholdGeometry()` crea un contorno con encabezado. Si un nodo ajeno cae dentro del rectángulo envolvente, genera fragmentos por integrante para no encerrarlo accidentalmente. Un integrante recibe un contorno propio.
- **Emocionales:** cercana (doble), fusionada (triple), distante (punteada), conflictiva (zigzag), fusionada-conflictiva (triple con zigzag) y cortada/rota (línea con dos barras). Color y patrón son redundantes; la leyenda accesible los rotula.

## Accesibilidad y uso táctil

- Objetivos interactivos de 44 px o mayores, foco visible, etiquetas y regiones anunciadas.
- Selección de persona por clic/tap, arrastre pointer para mouse/touch y flechas como alternativa de teclado.
- Persona identificada con doble contorno; fallecimiento con diagonal, daga visual y estado incluido en la ficha/lista.
- Galería de 213 miniaturas en CSS Grid con filas y tamaños controlados, `overflow` y `contain`; cuatro columnas a 390 px y seis en escritorio.
- El modo infantil no expone herramientas de parentesco. La explicación se guarda literalmente y por separado.

## Privacidad y alcance

- Sin backend, nube, cuentas, exportación, diagnóstico, puntajes ni interpretación automática.
- El servidor incluido solo entrega archivos estáticos; no recibe ni almacena el estado.
- `sessionStorage` se limita a la pestaña y se puede borrar con “Reiniciar datos de esta sesión”, tras confirmación explícita.
- Unicode emoji puede verse distinto según el sistema operativo; no se asigna significado psicológico a ninguna miniatura.

## Límites reales

- El trazado no optimiza automáticamente cruces en familias grandes; el profesional coloca personas por arrastre.
- Cuando un hogar contiene un nodo ajeno dentro de su envolvente, el modo seguro usa contornos fragmentados por integrante en lugar de calcular un polígono topológico mínimo.
- Las fechas son texto breve, no un modelo temporal normalizado.
- La salida adulta mediante suma es una barrera de interfaz, no autenticación.

## Archivos

- `index.html`: pantallas, formularios y controles.
- `styles.css`: diseño responsive, táctil y patrones visuales.
- `app.js`: estado, saneamiento, validación, geometría, SVG, persistencia y flujos.
- `tests.js`: 14 pruebas unitarias/de contrato, incluidas las geometrías requeridas.
- `browser-smoke.js`: smoke E2E headless opcional.
- `serve.js`: servidor estático local en puerto 4176.
- `assets/README.md`: reserva documentada para recursos locales futuros.
