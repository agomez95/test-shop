<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Test-Shop API

1. Clonar el proyecto

2. Instalar las dependencias
```
npm i
```
3. Hacer una copia del archivo ```.env.template``` y renombrar a  ```.env```

4.  Levantar la base de datos creando el contenedor
````
docker-compose up -d
````
5. Correr el seed para llenar de productos el api
```
http://localhost:3000/api/seed/
```
6. Crear el folder "static" y en su interior otro folder de "products"
