# FilmsProyect

[![Framework: Angular](https://img.shields.io/badge/Framework-Angular-DD0031)](#)
[![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6)](#)
[![Style: SCSS](https://img.shields.io/badge/Style-SCSS-CC6699)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#licencia)

Aplicación **Angular** para **buscar y explorar películas** usando una API pública (TMDb/OMDb u otra). Incluye **búsqueda con debounce**, **listado en grid**, **detalle**, estados de carga/error y configuración por **environments**.

---

## Índice
- [Características](#características)
- [Arquitectura-y-stack](#arquitectura-y-stack)
- [Requisitos](#requisitos)
- [Puesta-en-marcha](#puesta-en-marcha)
- [Configuración-de-api](#configuración-de-api)
- [Scripts-disponibles](#scripts-disponibles)
- [Estructura-de-carpetas](#estructura-de-carpetas)
- [Buenas-prácticas](#buenas-prácticas)
- [Capturas](#capturas)
- [Roadmap](#roadmap)
- [Autor](#autor)
- [Licencia](#licencia)

---

## ✨ Características
- **Búsqueda** por título con **debounce** y gestión de estados (loading/empty/error).
- **Listado** en **grid responsivo** con póster, año y rating.
- **Detalle** de película con metadatos clave.
- **Servicios** Angular (`HttpClient`) y **tipado** con interfaces TS.
- **Environments** para separar **dev/prod** (URL y clave de API).
- Preparado para **lint** y **tests**.

---

## 🧱 Arquitectura y stack
- **Angular 18** (TypeScript, RxJS, Routing)
- **SCSS** o Angular Material (si lo habilitas)
- **API pública** (TMDb/OMDb u otra compatible)
- (Opcional) **Interceptors** para base URL y manejo de errores

---

## 🧰 Requisitos
- **Node.js 18+**
- **npm** (o **pnpm**/**yarn**, si prefieres)

---

## 🚀 Puesta en marcha
```bash
# 1) Instalar dependencias
npm install

# 2) Arrancar en desarrollo
npm run start
# http://localhost:4200

# 3) Compilar producción
npm run build
# salida -> dist/
```

---

## 🔧 Configuración de API
Edita `src/environments/environment.ts` y `src/environments/environment.prod.ts`:

```ts
// environment.ts (dev)
export const environment = {
  production: false,
  apiUrl: 'https://api.themoviedb.org/3', // o la API que uses
  apiKey: 'REEMPLAZA_CON_TU_API_KEY'
};

// environment.prod.ts (prod)
export const environment = {
  production: true,
  apiUrl: 'https://api.themoviedb.org/3',
  apiKey: 'REEMPLAZA_CON_TU_API_KEY'
};
```

**Ejemplo de uso en un servicio:**
```ts
// src/app/core/services/movies.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private base = environment.apiUrl;
  private key  = environment.apiKey;

  constructor(private http: HttpClient) {}

  search(query: string, page = 1) {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('api_key', this.key);

    return this.http.get(`${this.base}/search/movie`, { params });
  }

  getById(id: string) {
    const params = new HttpParams().set('api_key', this.key);
    return this.http.get(`${this.base}/movie/${id}`, { params });
  }
}
```

*(Si usas OMDb, ajusta endpoints y parámetros: `?apikey=...&s=...` / `?apikey=...&i=...`)*

---

## 📦 Scripts disponibles
```bash
npm run start     # dev (http://localhost:4200)
npm run build     # producción -> dist/
npm run test      # unit tests (si configurado)
npm run lint      # lint del proyecto
```

---

## 🗂️ Estructura de carpetas
```
src/
  app/
    core/
      services/           # MoviesService, interceptors
      models/             # interfaces TS (Movie, PageResult, etc.)
      guards/             # (opcional)
      interceptors/       # (opcional) baseUrl, error handling
    features/
      list/               # página de listado + componentes
      detail/             # página de detalle
      shared/             # componentes compartidos (Card, Rating...)
    app.routes.ts         # rutas
  assets/
  environments/
angular.json
```

---

## ✅ Buenas prácticas
- **Interceptors** para prefijar `apiUrl` y capturar errores HTTP.
- **Tipado estricto**: evita `any`, define interfaces (`Movie`, `SearchResponse`).
- **Estados de UI**: loading/empty/error visibles al usuario.
- **Accesibilidad**: `alt` en imágenes, foco accesible, contrastes.
- **Variables de entorno**: nunca subas tu **API Key** pública a un repo si no debe serlo.
- (Opcional) **CI**: workflow simple que haga `npm ci && npm run build`.

---

## 🖼️ Capturas
Añade imágenes en `docs/` y enlázalas aquí:

| Búsqueda | Detalle |
|---|---|
| ![search](docs/search.png) | ![detail](docs/detail.png) |

---

## 🗺️ Roadmap
- [ ] Paginación con botones/scroll infinito
- [ ] Filtros (género, año, orden)
- [ ] Guardar favoritos en local/session storage
- [ ] Tests E2E (Playwright/Cypress)
- [ ] Deploy (Vercel/Netlify) + enlace en About

---

## 👤 Autor
**Marcos Morales** · moralesgonzalezmarcos104@gmail.com

---

## 📄 Licencia
Este proyecto se distribuye bajo licencia **MIT**.  
Incluye el archivo `LICENSE` en la raíz.
