# Flapp E-commerce simulación

Este proyecto es una aplicación web full-stack en React Vite y Node.js Express, simulando un flujo de e-commerce donde un cliente se comunica con un servicio de tarifas. La aplicación genera un carrito de compras aleatorio, calcula stock y tarifas desde dos distintos couriers.

## Supuestos
 - El backend recibe el precio sin descuentos para simplificar la lógica
 - El frontend muestra los descuentos al usuario porque es importante que los vea. 
 - En el carrito, el usuario puede eliminar productos individuales y modificar cantidades.
 - Para el cálculo de tarifas, si un servicio falla se usa el otro disponible; si ambos fallan, se retorna error.
 - Backend: En caso de error en algún servicio de tarifa, si uno de los servicios falla se retorna el otro. Si ambos servicios fallan, retorna error.
 - Endpoint Uder: Dimensiones que se obtienen de dummyjson (width, height, depth) se convierten a (length, height, depth)
 - Endpoint TraeloYa: Volumen se obtiene multiplicando dimensiones
 - Frontend: Se asume que el usuario ya está autenticado
 - Frontend: En las vistas el único error que se muestra es "No hay envíos disponibles :("
 - Frontend: Se accede a la vista de ingreso de datos de envío desde la vista de checkout con el botón "Cotizar Despacho"
 - Frontend: En la vista de datos de envío se tiene también un boton Cotizar Despacho que gatilla el envío de datos al Backend


## Stack

- **Frontend:** React (with Vite)
- **Backend:** Node.js (with Express)
- **Containerization:** Docker & Docker Compose

## Requisitos

- [Docker](https://www.docker.com/get-started) 
- [Node.js](https://nodejs.org/) (optional, for local development without Docker)

## Instrucciones

Docker Compose

1.  **Clonar repositorio** 

2.  **Variables de entorno:**
    Se debe configurar variables de entornos para ambos servicios en el archivo respectivo
    ### Backend (`backend/.env`)
    - `TRAELO_YA_API_KEY` - API Key para courier TraeloYa  
    - `UDER_API_KEY` - API Key para courier Uder  
    - `CORS_ORIGIN` - URL con el deploy del frontend para configuración CORS 

    ### Frontend (`frontend/.env`)
    - `VITE_API_BASE_URL` - Backend API URL (URL a `POST /api/cart` endpoint)  

3.  **Docker Compose up --build:**
    En el directorio root:

    ```bash
    docker-compose up --build
    ```

    Esto levantará los containers de docker con el frontend y el backend.

4.  **Acceso:**
    - El **frontend** se accede en [http://localhost](http://localhost).
    - La API del **backend** corre en [http://localhost:7001](http://localhost:7001).


## Proyecto

```
.
|   docker-compose.yml
|   README.md
|
+---backend
|   |   .gitignore
|   |   Dockerfile
|   |   package-lock.json
|   |   package.json
|   |
|   \---src
|       |   app.js
|       |   server.js
|       |
|       +---controllers
|       |       cartController.js
|       |
|       +---services
|       |   |   dummyJsonService.js
|       |   |
|       |   \---shipping_services
|       |           traeloYaService.js
|       |           uderService.js
|       |
|       \---tests
|               cart.test.js
|
\---frontend
    |   .gitignore
    |   Dockerfile
    |   Dockerfile.dev
    |   eslint.config.js
    |   index.html
    |   package-lock.json
    |   package.json
    |   README.md
    |   vite.config.js
    |
    +---public
    |       vite.svg
    |
    \---src
        |   App.css
        |   App.jsx
        |   index.css
        |   main.jsx
        |
        +---assets
        |       react.svg
        |
        +---components
        |       Checkout.jsx
        |       Home.jsx
        |       ShippingForm.jsx
        |
        +---context
        |       AppContext.jsx
        |
        \---services
                api.js
