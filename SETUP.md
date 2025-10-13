# Setup Instructions

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- La API de Star Wars corriendo en `http://localhost:3000`

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` (opcional):
```bash
# Crear archivo .env en la raíz del proyecto
VITE_API_URL=http://localhost:3000
```

## Desarrollo

Ejecutar en modo desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## Build para Producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`.

## Preview del Build

```bash
npm run preview
```

## Estructura del Proyecto

```
starwars-web/
├── public/          # Archivos estáticos
├── src/
│   ├── components/  # Componentes reutilizables
│   │   ├── Navbar.tsx
│   │   ├── FilmCard.tsx
│   │   ├── Loading.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/     # Contextos de React
│   │   └── AuthContext.tsx
│   ├── pages/       # Páginas/Vistas
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── FilmList.tsx
│   │   ├── FilmDetail.tsx
│   │   ├── FilmForm.tsx
│   │   └── SyncPage.tsx
│   ├── services/    # Servicios de API
│   │   └── api.ts
│   ├── types/       # Tipos TypeScript
│   │   └── index.ts
│   ├── App.tsx      # Componente principal
│   ├── main.tsx     # Punto de entrada
│   └── index.css    # Estilos globales
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Características

### Páginas Públicas
- **Home** (`/`): Página de inicio
- **Login** (`/login`): Iniciar sesión
- **Register** (`/register`): Registrarse
- **Film List** (`/films`): Ver todas las películas

### Páginas Protegidas (Requieren autenticación)
- **Film Detail** (`/films/:id`): Ver detalle de una película

### Páginas de Admin (Requieren rol admin)
- **New Film** (`/films/new`): Crear nueva película
- **Edit Film** (`/films/:id/edit`): Editar película
- **Sync** (`/sync`): Sincronizar películas desde API externa

## Uso

### 1. Registrarse
1. Ir a `/register`
2. Llenar el formulario (todos los campos son requeridos)
3. Al registrarse, se loguea automáticamente

### 2. Iniciar Sesión
1. Ir a `/login`
2. Ingresar usuario y contraseña
3. Serás redirigido a `/films`

### 3. Ver Películas
1. Ir a `/films`
2. Puedes filtrar por:
   - Todas
   - Desde API
   - Locales
   - Modificadas

### 4. Ver Detalle de Película
1. Hacer click en cualquier película
2. Requiere estar autenticado

### 5. Crear/Editar Película (Solo Admin)
1. Click en "Nueva Película" en el navbar
2. Llenar el formulario
3. Click en "Crear" o "Actualizar"

### 6. Sincronizar Películas (Solo Admin)
1. Click en "Sincronizar" en el navbar
2. Click en "Sincronizar Ahora"
3. Ver resultados de la sincronización

## Notas Importantes

- **Autenticación**: Los tokens se almacenan en `localStorage`
- **Rol Admin**: Para crear un usuario admin, modificar el rol en la BD
- **API URL**: Por defecto apunta a `http://localhost:3000`
- **Rutas Protegidas**: Redirigen a `/login` si no estás autenticado
- **Rutas de Admin**: Redirigen a `/` si no eres admin

## Troubleshooting

### Error de CORS
Si hay error de CORS, asegúrate de que la API esté configurada correctamente.

### Token Expirado
Si el token expira, la app redirige automáticamente a `/login`.

### No puedo crear películas
Verifica que tu usuario tenga el rol `admin` en la base de datos.

