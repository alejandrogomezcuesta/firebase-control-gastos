# Práctica: Web de control de gastos con Firebase

## Objetivo
Desarrollar una aplicación web de control de gastos que permita a los usuarios iniciar sesión con Google y guardar sus registros de gastos en Firestore. El proyecto debe estar publicado en GitHub Pages y el código debe estar en un repositorio público de GitHub.

## Requisitos mínimos

1. Crear una página web funcional con HTML, CSS y JavaScript.
2. Usar Firebase Authentication para permitir el acceso mediante Google.
   - El inicio de sesión debe hacerse usando el proveedor de Google.
   - No se aceptan usuarios anónimos ni un inicio de sesión manual sin Firebase.
3. Usar Cloud Firestore para almacenar los datos de gastos.
   - Cada usuario debe ver solamente sus propios gastos.
   - Guardar al menos la fecha, la categoría, la descripción y el importe.
4. Publicar la aplicación en GitHub Pages.
   - El repositorio debe contener todo el código fuente.
   - La URL de GitHub Pages debe ser accesible públicamente.

## Funcionalidades a implementar

- Registro/login con cuenta de Google.
- Interfaz para añadir nuevos gastos.
- Interfaz para editar y borrar los gastos.
- Interfa para que haya una gráfica de cuándo se ha gastado de forma visual.
- Listado de gastos del usuario autenticado.
- Mostrar el total de gastos y un resumen básico.
- Guardar los datos en Firestore de manera segura.

## Consideraciones importantes

- No olvides configurar correctamente el dominio de autenticación en Firebase.
  - Un error frecuente es dejar fuera el dominio de GitHub Pages o el dominio local de prueba.
  - Asegúrate de incluir los orígenes autorizados en la configuración de Firebase Authentication.
- El código debe estar subido a GitHub y el despliegue debe hacerse con GitHub Pages.
- El acceso mediante Firebase debe restringirse para que cada usuario solo pueda leer y escribir sus propios documentos.

## Extras obligatorios

1. Limitar el uso de las credenciales de Google Cloud al dominio de GitHub Pages.
   - Configura los permisos de OAuth y las credenciales de Cloud para que solo tu app de GitHub Pages pueda usarlas.
   - Esto evita que otra persona use tus credenciales y realice gastos no deseados en la suscripción del proyecto.
2. Mejorar las reglas de seguridad de Firestore.
   - No utilices una base de datos de prueba abierta.
   - Define reglas que comprueben que el usuario autenticado solo accede a sus documentos.
   - Asegúrate de que las reglas funcionan también cuando pase más de un mes y no dependan de reglas temporales de prueba.

## Entregables

- Repositorio de GitHub con el código fuente.
- URL de GitHub Pages donde esté publicada la aplicación.
