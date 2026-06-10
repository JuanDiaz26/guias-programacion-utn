# Proyecto de Programación — UTN (2 guías)

Sitio web con **dos guías** de la materia **Programación 2**
(UTN — Facultad Regional, Comisión 2), cada una en su propia página y navegables
entre sí desde el menú superior:

- **Guía 1 — Fundamentos del Desarrollo Backend** (`index.html`)
- **Guía 2 — Conexión a Bases de Datos** (`guia-2.html`)

Tema visual: dark / editorial-terminal, con tipografía monoespaciada + serif y
acentos en verde y cyan.

## Enlaces

- **Repositorio:** https://github.com/JuanDiaz26/guias-programacion-utn
- **Guía 1 (inicio):** https://juandiaz26.github.io/guias-programacion-utn/
- **Guía 2:** https://juandiaz26.github.io/guias-programacion-utn/guia-2.html

## Estructura del proyecto

```
.
├── index.html        # Guía 1 — Fundamentos del Desarrollo Backend (inicio)
├── guia-2.html       # Guía 2 — Conexión a Bases de Datos
├── css/
│   └── styles.css    # Estilos (variables, layout, responsive)
├── js/
│   └── main.js       # Animaciones de scroll + navegación activa (IntersectionObserver)
├── favicon.svg
└── README.md
```

## Cómo verlo

Abrir `index.html` en cualquier navegador moderno (doble clic) y usar el switcher
**Guía 1 / Guía 2** del menú, o entrar directo al sitio publicado en GitHub Pages
(enlaces de arriba).

Para servirlo en local:

```bash
python -m http.server 8080
# Abrir http://localhost:8080
```

## Detalles técnicos

- HTML, CSS y JavaScript puros, sin frameworks.
- Variables CSS (`:root { --accent: ... }`) para todo el sistema de colores.
- Diseño responsive (mobile-first) con media queries.
- Animaciones de aparición al hacer scroll con la API `IntersectionObserver`.
- Navegación sticky con resaltado de la sección activa.
- Única dependencia externa: Google Fonts (JetBrains Mono + Fraunces).

---

# Guía 1 — Fundamentos del Desarrollo Backend

## 1. Definiciones

### Prisma (v7)
ORM (Object-Relational Mapping) moderno para **Node.js** y **TypeScript**. Un ORM
es una capa que traduce entre los objetos del código y las tablas de la base de
datos. Prisma ofrece:
- Un **schema declarativo** (un archivo donde se describen los modelos/tablas).
- **Migraciones automáticas** (genera los cambios en la BD a partir del schema).
- Un **cliente type-safe** (autocompletado y errores detectados antes de ejecutar).

Permite interactuar con la base de datos **sin escribir SQL crudo**, de forma
segura y mantenible. Funciona con bases relacionales y no relacionales.

### Node.js
**Entorno de ejecución** de JavaScript del lado del servidor, construido sobre el
motor **V8 de Chrome**. Permite ejecutar JS fuera del navegador. Se usa para
construir aplicaciones de red escalables, **APIs REST** y servidores de alto
rendimiento. Su modelo *asíncrono y orientado a eventos* lo hace eficiente para
manejar muchas conexiones a la vez.

### MySQL
**Sistema de Gestión de Bases de Datos Relacional (RDBMS)** de código abierto.
Organiza los datos en **tablas** que se relacionan entre sí mediante **claves
primarias** (identifican cada fila de forma única) y **claves foráneas** (apuntan
a la clave primaria de otra tabla). Almacena, consulta y gestiona datos de forma
estructurada usando el lenguaje **SQL**.

### Express
**Framework minimalista** para Node.js. Se monta encima de Node para simplificar la
creación de servidores web: crear servidores HTTP, definir **rutas**, manejar
**parámetros** y **encadenar middlewares** de forma sencilla y organizada.

### Middleware
**Función que se ejecuta entre la llegada de un request (solicitud) y el envío de un
response (respuesta).** Tiene acceso al request, al response y a la función
`next()`. Se usa para autenticación, logging (registro), validación de datos,
manejo de errores y CORS. Puede **modificar** el request/response o **pasar el
control** al siguiente middleware llamando a `next()`.

## 2. Express vs Node Puro

| | Node.js puro | Express |
|---|---|---|
| **Nivel** | Bajo nivel | Abstracción de alto nivel |
| **Servidor** | Hay que crearlo a mano con `http.createServer` | `express()` lo simplifica |
| **Rutas** | Se parsean manualmente (`req.url`, `req.method`) | Routing declarativo: `app.get('/ruta', ...)` |
| **Parámetros** | Manuales | `req.params`, `req.query` listos para usar |
| **Middlewares** | No hay sistema integrado | Sistema de middlewares incorporado |
| **Resultado** | Más código, más control | Menos código, más estructura |

Express **no reemplaza** a Node, lo **complementa**: abstrae la complejidad de bajo
nivel para escribir menos código repetitivo y más legible.

```js
// Node puro
const http = require('http');
http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') { res.end('Hola mundo'); }
}).listen(3000);

// Express
const app = require('express')();
app.get('/', (req, res) => res.send('Hola mundo'));
app.listen(3000);
```

## 3. ¿Qué es un Middleware?

Un middleware es una **función intermedia** en el ciclo de vida de una petición. Se
ejecuta **entre** que llega el `request` y se devuelve el `response`.

```
[Request] → [Middleware 1] → [Middleware 2] → [Route Handler] → [Response]
```

Cada middleware puede:
- **Ejecutar código** (ej: registrar la petición).
- **Modificar** el request o el response.
- **Cortar** el ciclo (ej: rechazar por falta de autenticación).
- **Pasar el control** al siguiente con `next()`.

Si un middleware **no llama** a `next()` ni envía una respuesta, la petición queda
"colgada". Por eso `next()` es la pieza que conecta la cadena. Casos de uso típicos:
autenticación, logging, validación de datos, manejo de errores y CORS.

## 4. Reglas de Negocio y Relaciones en la Base de Datos

### Reglas de negocio (Constraints / Restricciones)
Reglas que la **propia base de datos** hace cumplir para garantizar la
**integridad de los datos**:

| Constraint | Qué hace |
|---|---|
| `NOT NULL` | El campo no puede quedar vacío |
| `UNIQUE` | No se permiten valores repetidos |
| `CHECK` | El valor debe cumplir una condición (ej: edad > 0) |
| `DEFAULT` | Asigna un valor por defecto si no se especifica |
| `PRIMARY KEY` | Identifica cada fila de forma única |
| `FOREIGN KEY` | Enlaza una tabla con la clave primaria de otra |

Ejemplo: *"Un pedido no puede existir sin un cliente asociado."* → se garantiza con
una `FOREIGN KEY`, que impide registros huérfanos.

### Relaciones entre entidades

| Tipo | Nombre | Ejemplo | Cómo se implementa |
|---|---|---|---|
| **1:1** | One to One | Usuario → Perfil | FK única en una de las dos tablas |
| **1:N** | One to Many | Cliente → Pedidos | FK en el lado "muchos" (Pedidos) |
| **N:M** | Many to Many | Estudiantes ↔ Materias | **Tabla intermedia** con dos FK |

En la relación **N:M** no se pueden enlazar dos tablas directamente: se necesita una
**tabla intermedia** (ej: `inscripciones`) que guarda los pares estudiante–materia.

## 5. HeidiSQL vs XAMPP

Dos herramientas que se usan **juntas** pero cumplen roles distintos.

**XAMPP** — Paquete de software que incluye **A**pache (servidor web),
**M**ySQL/MariaDB (base de datos), **P**HP y **P**erl. Sirve para montar un
**entorno de desarrollo local completo** en pocos minutos, sin configurar cada
componente a mano. Es decir, **levanta** el servidor y la base de datos.

**HeidiSQL** — Cliente gráfico para administrar bases de datos (MySQL, MariaDB,
PostgreSQL, etc.). Sirve para visualizar tablas, ejecutar consultas SQL,
importar/exportar datos y administrar la base de forma **visual**, sin línea de
comandos. Se **conecta** a una base que ya está corriendo para gestionarla.

Diferencias clave:
- **XAMPP** *levanta* el servidor y la base. **HeidiSQL** se *conecta* a esa base
  para administrarla.
- **XAMPP** es un **entorno de ejecución** completo. **HeidiSQL** es solo una
  **interfaz de administración**.
- Se usan juntos: XAMPP corre MySQL → HeidiSQL lo gestiona visualmente.

---

# Guía 2 — Conexión a Bases de Datos

## 1. ¿Cómo se conectan los lenguajes a una base de datos?

> C, C++, C#, JavaScript, Java, Python, HTTP, HTML y CSS.

Un lenguaje se conecta mediante un **driver/conector** (una librería que implementa
el protocolo de la base). El patrón es siempre el mismo: **importar driver → abrir
conexión** (host, puerto, usuario, contraseña, base) **→ enviar SQL → recibir
resultados → cerrar**.

| Lenguaje | Cómo se conecta |
|---|---|
| **C** | API en C del motor (MySQL C API / `libmysqlclient`) u ODBC |
| **C++** | Conectores OO: MySQL Connector/C++, `libpqxx`, ODBC, Qt SQL |
| **C#** | **ADO.NET** + proveedor (`Microsoft.Data.SqlClient`, `MySql.Data`); ORM: Entity Framework |
| **JavaScript** | En Node.js: drivers `mysql2` / `pg` o Prisma. En el navegador **no** se conecta directo: usa una API |
| **Java** | **JDBC** (API estándar + driver); ORMs: Hibernate / JPA |
| **Python** | **DB-API 2.0**: `mysql-connector`, `psycopg2`, `sqlite3`; ORM: SQLAlchemy / Django |

**Los que NO se conectan a una base de datos:**
- **HTML** → lenguaje de **presentación/estructura**. Solo muestra datos ya obtenidos.
- **CSS** → lenguaje de **estilos**. Puramente visual, sin lógica ni datos.
- **HTTP** → **protocolo de transporte** (el "cartero"). No es un lenguaje; es el
  canal por donde viaja la petición.

Las tres capas: presentación (HTML/CSS) · transporte (HTTP) · lógica/datos (lenguaje
backend). Solo el lenguaje del servidor se conecta a la base:

```
Navegador (HTML/CSS) → [HTTP] → Servidor (lenguaje) → Base de Datos
```

## 2. El ecosistema: ¿qué es cada uno y cómo se conecta?

> JsonServer, SQL, MySQL, PostgreSQL, Prisma 7, HeidiSQL, XAMPP, SQLite, MariaDB y Cassandra.

No todo es una base de datos. La clasificación ayuda a entender cómo encaja cada uno.

| Tecnología | Categoría | Qué es / cómo se conecta |
|---|---|---|
| **SQL** | Lenguaje | El idioma para consultar bases relacionales. No es una BD |
| **MySQL** | Motor SQL | RDBMS open-source. Puerto **3306**, con driver |
| **MariaDB** | Motor SQL | Fork de MySQL, compatible 1:1 (mismo puerto 3306) |
| **PostgreSQL** | Motor SQL | Objeto-relacional avanzado. Puerto **5432** |
| **SQLite** | Motor SQL | **Embebido, sin servidor**: la base es un archivo `.db` |
| **Cassandra** | Motor NoSQL | Distribuida wide-column. Se consulta con **CQL**, puerto 9042 |
| **Prisma 7** | ORM | Capa entre el código y la base. Se conecta con `DATABASE_URL` |
| **HeidiSQL** | Herramienta | Cliente gráfico que **se conecta** a un motor para administrarlo |
| **XAMPP** | Herramienta | Entorno local que **levanta** el motor (Apache + MariaDB/MySQL) |
| **JSON Server** | Mock API | API REST **falsa** desde un `db.json`. Se usa por **HTTP**. No es una BD |

## 3. Código de conexión

> C#, JavaScript, Python y JSON Server.

Todos siguen el mismo patrón: **conectar → consultar → recorrer → cerrar**. El
código completo y comentado está en la página (`guia-2.html`, Sección 03), con
ejemplos para **C# (ADO.NET)**, **JavaScript (mysql2 / Node)**, **Python
(mysql-connector)** y **JSON Server** (levantar la API + consumirla con `fetch`).

---

## Autor

- **Alumno:** Juan Gabriel Díaz
- **Materia:** Programación 2 — Comisión 2
- **Institución:** UTN — Facultad Regional
- **Año:** 2026
