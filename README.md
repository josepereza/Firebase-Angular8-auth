Esta aplicación esta diseñada para ser usada como boilerplate o inicio rápido, en caso de querer empezar un proyecto
en Angular 8 con registro de cuenta, inicio de sesión con/sin redes sociales y/o modo anónimo.

Estas formas de acceso están implementadas con la plataforma Firebase que es propiedad de Google.

Además tiene algunas caracteristicas extra como:
  - Un navbar implementado en app.component
  - Control de URL no contempladas.
  - Redirecciones de URL antes/despues de iniciar sesión.

Cosas a tener en cuenta o requisitos extras:

- Cada plataforma puede requerir una cuenta propia, por ejemplo:

- Es necesario tener una cuenta de Google y usar Firebase y generar un proyecto nuevo en la plataforma requerida
  * https://firebase.google.com
- En necesario tener una cuenta en Facebook developers para poder usar login con esta plataforma y generar un pryecto nuevo
  * https://developers.facebook.com

Pasos generales de instalacion realizados

- Instalar angular material, Schematics esta disponible de base en Material
  * ng add @angular/material
- Instalar los modulos de Firebase
  * npm install firebase @angular/fire --save
- Instalar Compodoc
  * npm install -g @compodoc/compodoc
