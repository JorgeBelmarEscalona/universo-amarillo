# Universo Amarillo 💛

Una pequeña experiencia visual romántica construida con HTML, CSS, JavaScript y Three.js.

## Características

- Universo animado con estrellas 3D
- Parallax con mouse / movimiento del puntero
- Ramos de flores amarillas construidos en CSS
- Frases románticas animadas
- Estrellas interactivas
- Diseño responsive para computador y teléfono
- Sin backend
- Compatible con GitHub Pages

## Publicar en GitHub Pages

1. Crea un repositorio público llamado `universo-amarillo`.
2. Sube los archivos de este proyecto a la rama `main`.
3. En GitHub entra a:
   `Settings → Pages`
4. En **Build and deployment**, selecciona:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
5. Guarda los cambios.

La URL debería quedar con esta forma:

`https://TU-USUARIO.github.io/universo-amarillo/`

## Personalización

Las frases principales están en `index.html`.

Puedes modificar:

- Nombre o dedicatoria
- Textos de cada escena
- Mensaje final
- Mensajes de las estrellas interactivas

Los mensajes de estrellas están en atributos como:

```html
<button class="wish-star" data-message="Te quiero">✦</button>
```

## Estructura

```text
universo-amarillo/
├── index.html
├── style.css
├── script.js
├── .nojekyll
└── README.md
```

## Nota

Three.js y las fuentes se cargan desde CDN, por lo que el sitio requiere conexión a internet.
