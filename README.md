# GenoKids — primera versión definitiva

Aplicación web estática en HTML, CSS, JavaScript vanilla y SVG para preparar genogramas profesionales, conservar relaciones emocionales descriptivas y recoger respuestas infantiles en una capa separada. Esta versión conserva íntegramente la notación y el flujo de V6 y permite que la niña o el niño omita personas durante el juego.

## Ejecutar localmente

No requiere instalación ni dependencias.

```powershell
cd C:\Users\HP\.openclaw\workspace\genokids-v6
node serve.js
```

Abrir <http://127.0.0.1:4177/>. El servidor escucha `127.0.0.1`; `HOST` y `PORT` permiten cambiarlo.

## Verificar

Con `node serve.js` activo:

```powershell
node --check app.js
node --check tests.js
node --check browser-smoke.js
node tests.js
node browser-smoke.js
```

El smoke usa Edge o Chrome y Chrome DevTools Protocol sin paquetes. Comprueba HTTP 200, consola, móvil 390×844, escritorio 1440×900, persistencia, mascota, edades y fechas, fallecimiento, uniones, offsets movibles, texto independiente y separación del modo infantil.

## Modo infantil y omisiones

- Cada persona humana puede recibir una miniatura o marcarse como **omitida por ahora**; las mascotas no entran al juego.
- La omisión permite continuar y completar el tablero sin exigir una miniatura.
- Antes de finalizar se puede volver atrás y reemplazar una omisión por una miniatura, o cambiar una elección por omisión.
- En el tablero infantil, una omisión se muestra con un guion neutral y texto accesible «Sin elección infantil»; no tiene significado psicológico ni interpretativo.
- Las omisiones se guardan únicamente dentro de `childResponse`. Nunca modifican `people`, `unions`, `descentLinks`, `emotionalLinks` ni `households`.

## Notación heredada de V6

- **Mascota:** tipo `pet` y silueta negra de perro, como el ejemplo del documento. Puede tener nombre, especie, edad y estado fallecido. No puede formar una unión humana/de pareja ni una filiación humana.
- **Edad:** número de 0 a 130 dentro del símbolo humano.
- **Fechas personales:** nacimiento a la izquierda; fallecimiento a la derecha solo cuando la persona o mascota está marcada como fallecida.
- **Fallecimiento:** dos diagonales forman una X completa sobre el símbolo.
- **Matrimonio:** línea continua y etiqueta `m FECHA` inicialmente centrada.
- **Divorcio:** línea principal continua, `m FECHA` a la izquierda, dos barras de ruptura inicialmente al centro y `d FECHA` a la derecha.
- **Unión libre:** línea discontinua.
- **Elementos de unión:** las etiquetas de matrimonio/divorcio y las barras de ruptura son seleccionables. Pointer/tacto y flechas izquierda/derecha las mueven dentro de la línea; Mayús usa un paso mayor. Los offsets quedan persistidos.
- **Fecha del genograma:** se muestra en la esquina inferior derecha del SVG cuando está definida.
- **Texto independiente:** anotación profesional libre, separada de relaciones emocionales y respuesta infantil; admite crear, editar, mover, seleccionar y eliminar.

## Biblioteca y migración

- V6 usa únicamente `localStorage` con la clave propia `genokids-v6-library`.
- No consulta, copia ni borra automáticamente la clave de V5.
- Cada registro conserva ID estable, nombre, fecha de creación, última modificación y estado saneado.
- Guardar actualiza el registro actual sin duplicarlo; crear nuevo agrega otro.
- La importación V5 es manual desde un archivo JSON. `migrateV5Library()` acepta una biblioteca V5 o un estado suministrado; `mergeImportedLibrary()` hace *upsert* por ID, por lo que un ID existente se actualiza en vez de duplicarse.
- El saneamiento migra el campo V5 `date`: para una persona fallecida con un intervalo como `1951–2021`, separa nacimiento y fallecimiento; si no hay separación inequívoca, lo conserva como nacimiento y deja fallecimiento vacío.
- Fechas del genograma ausentes en V5 se dejan vacías para no inventar información histórica; pueden definirse manualmente.
- JSON corrupto o referencias incompatibles se descartan de forma acotada y dejan una biblioteca utilizable.

Los datos quedan solo en ese navegador y dispositivo. No hay backend, nube, sincronización, cuentas, exportación ni publicación.

## Capas independientes

- **Estructura profesional:** `people` (personas y mascotas), `unions`, `descentLinks`, `households`, `annotations` y `genogramDate`.
- **Relaciones emocionales:** `emotionalLinks`, descriptivas y visibles solo en vistas profesionales.
- **Respuesta infantil:** `childResponse`, con miniatura u omisión, explicación literal, orden y cambios; solo recorre personas humanas y no altera estructura ni parentescos.

La herramienta no genera diagnósticos, puntuaciones ni interpretación clínica. Las miniaturas no tienen significado psicológico preasignado. El texto independiente es una anotación visual libre, no una observación clínica estructurada.

## Accesibilidad y responsive

- Etiquetas asociadas, errores y estados anunciados, foco visible y controles táctiles de al menos 44 px.
- Alternativas de teclado para personas, mascotas, textos y elementos de unión.
- Biblioteca, constructor y galería adaptados a móvil y escritorio.
- El modo infantil no expone herramientas profesionales, textos independientes ni relaciones emocionales. «Omitir por ahora» es un botón táctil y de teclado con estado accesible `aria-pressed`.

## Decisiones reversibles

- Las fechas se conservan como texto breve porque el PDF muestra años y no define un formato temporal único. La fecha del genograma sí usa `AAAA-MM-DD` mediante un campo de fecha.
- `Separación` se conserva como compatibilidad con V5: línea continua y una barra movible; el PDF especifica de forma directa matrimonio, divorcio y unión libre.
- Las mascotas pueden participar en hogares y relaciones emocionales descriptivas, pero no en uniones de pareja ni filiación humana. El PDF prohíbe expresamente la unión con humanos y no define esas otras dos capas.
- El símbolo de mascota reproduce una silueta vectorial local de perro; no depende de emoji o fuente del sistema.

## Publicación

La versión pública canónica se sirve mediante GitHub Pages en <https://lgabocarde.github.io/genokids/>. El QR local `assets/genokids-qr.png` contiene únicamente esa URL HTTPS pública; no contiene datos familiares, clínicos ni identificadores.

## Archivos

- `index.html`: biblioteca, formularios, importación controlada y pantallas.
- `styles.css`: responsive, accesibilidad táctil y selección visual.
- `app.js`: estado V6, migración, saneamiento, geometría, persistencia, SVG e interacciones.
- `tests.js`: pruebas unitarias y de contrato, incluidas omisiones, reversibilidad, persistencia y separación de capas.
- `browser-smoke.js`: smoke E2E móvil y escritorio.
- `serve.js`: servidor estático local en el puerto 4177.

## Límites

- El trazado no optimiza automáticamente cruces en familias grandes.
- El texto independiente usa una sola línea SVG; textos muy largos se conservan, pero no se ajustan automáticamente en varias líneas.
- Las fechas personales y de unión no se validan como cronología clínica.
- La suma para salida adulta es una barrera de interfaz, no autenticación.
