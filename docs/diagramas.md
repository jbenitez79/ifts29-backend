# Diagramas UML - TodoStock S.A.

## 1. Diagrama de Casos de Uso

```mermaid
graph TD
    Admin["👤 Administrador"] --> UC1["Gestionar Clientes<br/>(CRUD)"]
    Admin --> UC2["Gestionar Productos<br/>(CRUD)"]
    Admin --> UC3["Gestionar Proveedores<br/>(CRUD)"]
    Admin --> UC4["Gestionar Pedidos<br/>(CRUD)"]
    Admin --> UC5["Gestionar Cuentas<br/>Corrientes"]
    Admin --> UC6["Gestionar Usuarios<br/>(Register)"]
    Admin --> UC7["Ver Dashboard"]

    Operador["👤 Operador"] --> UC1
    Operador --> UC4
    Operador --> UC5
    Operador --> UC7

    UC1 --> UC8["<<include>><br/>Autenticarse"]
    UC2 --> UC8
    UC3 --> UC8
    UC4 --> UC8
    UC5 --> UC8
    UC6 --> UC8
    UC7 --> UC8
```

---

## 2. Diagrama de Clases

```mermaid
classDiagram
    class Usuario {
        +String nombre
        +String email
        +String password
        +String rol
        +Date createdAt
        +Date updatedAt
    }

    class Cliente {
        +String nombre
        +String apellido
        +String email
        +String telefono
        +String cuit
        +String domicilio
        +String localidad
        +String provincia
        +String pais
        +String codigoPostal
        +Date fechaNacimiento
        +Date createdAt
        +Date updatedAt
    }

    class Producto {
        +String nombre
        +String descripcion
        +Number precio
        +Number stock
        +Number stock_minimo
        +Date createdAt
        +Date updatedAt
    }

    class Proveedor {
        +String nombre
        +String cuit
        +String telefono
        +String email
        +String domicilio
        +String localidad
        +String provincia
        +String pais
        +String rubro
        +String condicionDePago
        +Boolean activo
        +Date createdAt
        +Date updatedAt
    }

    class PedidoProducto {
        +ObjectId producto
        +Number cantidad
        +Number precio
    }

    class Pedido {
        +ObjectId cliente
        +Array~PedidoProducto~ productos
        +Date fecha
        +String estado
        +Number total
        +Date createdAt
        +Date updatedAt
    }

    class Movimiento {
        +Date fecha
        +String tipo
        +Number monto
        +String descripcion
    }

    class CuentaCorriente {
        +ObjectId cliente
        +Number saldo
        +Number limiteCredito
        +String estado
        +Array~Movimiento~ historial
        +Date createdAt
        +Date updatedAt
    }

    Pedido "*" --> "1" Cliente : pertenece
    Pedido "*" --> "*" Producto : contiene (via PedidoProducto)
    CuentaCorriente "1" --> "1" Cliente : asociada a
    PedidoProducto --> Producto : referencia
```

---

## 3. Diagrama de Secuencia - Login y Consulta de Productos

```mermaid
sequenceDiagram
    actor U as Usuario
    participant V as Vista (Pug)
    participant C as AuthController
    participant M as Usuario (Modelo)
    participant J as JWT
    participant MW as AuthMiddleware
    participant PC as ProductoController
    participant PM as Producto (Modelo)

    U->>V: GET /login
    V-->>U: Página login

    U->>V: POST /login (email, password)
    V->>C: loginUsuario(req, res)
    C->>M: Usuario.findOne({ email })
    M-->>C: usuario encontrado
    C->>C: bcrypt.compare(password, hash)
    C->>J: jwt.sign(payload, secret)
    J-->>C: token JWT
    C->>V: res.cookie('jwt', token)
    C->>V: res.redirect('/index')
    V-->>U: Redirección a dashboard

    U->>V: GET /productos
    V->>MW: verificar cookie jwt
    MW->>J: jwt.verify(token, secret)
    J-->>MW: payload decodificado
    MW->>V: req.usuario = decoded
    MW->>PC: next()
    PC->>PM: Producto.find()
    PM-->>PC: lista de productos
    PC-->>V: res.render('productos/index', {productos})
    V-->>U: Página con listado de productos
```

---

## 4. Diagrama de Secuencia - Creación de Pedido

```mermaid
sequenceDiagram
    actor A as Admin
    participant V as Vista (Pug)
    participant C as PedidoController
    participant M as Pedido (Modelo)
    participant CL as Cliente (Modelo)
    participant PR as Producto (Modelo)

    A->>V: GET /pedidos/crear
    V->>CL: Cliente.find()
    CL-->>V: lista de clientes
    V->>PR: Producto.find()
    PR-->>V: lista de productos
    V-->>A: Formulario de pedido

    A->>V: POST /pedidos (cliente, productos)
    V->>C: crearPedido(req, res)
    C->>C: calcular total
    C->>M: Pedido.create({...})
    M-->>C: pedido creado
    C-->>V: res.redirect('/pedidos')
    V-->>A: Listado de pedidos actualizado
```

---

## 5. Modelo Entidad-Relación (DER)

```mermaid
erDiagram
    USUARIO {
        ObjectId id PK
        string nombre
        string email UK
        string password
        string rol "admin | operador"
        date createdAt
        date updatedAt
    }

    CLIENTE {
        ObjectId id PK
        string nombre
        string apellido
        string email UK
        string telefono
        string cuit UK
        string domicilio
        string localidad
        string provincia
        string pais
        string codigoPostal
        date fechaNacimiento
        date createdAt
        date updatedAt
    }

    PRODUCTO {
        ObjectId id PK
        string nombre
        string descripcion
        number precio
        number stock
        number stock_minimo
        date createdAt
        date updatedAt
    }

    PROVEEDOR {
        ObjectId id PK
        string nombre
        string cuit UK
        string telefono
        string email
        string domicilio
        string localidad
        string provincia
        string pais
        string rubro
        string condicionDePago
        boolean activo
        date createdAt
        date updatedAt
    }

    PEDIDO {
        ObjectId id PK
        ObjectId cliente FK
        date fecha
        string estado "pendiente | aprobado | enviado | entregado | cancelado"
        number total
        date createdAt
        date updatedAt
    }

    PEDIDO_PRODUCTO {
        ObjectId producto FK
        number cantidad
        number precio
    }

    CUENTA_CORRIENTE {
        ObjectId id PK
        ObjectId cliente FK UK
        number saldo
        number limiteCredito
        string estado "activo | con_deuda"
        date createdAt
        date updatedAt
    }

    MOVIMIENTO {
        date fecha
        string tipo "PAGO | CARGO"
        number monto
        string descripcion
    }

    CLIENTE ||--o{ PEDIDO : "tiene"
    PEDIDO ||--|{ PEDIDO_PRODUCTO : "contiene"
    PEDIDO_PRODUCTO }|--|| PRODUCTO : "referencia"
    CLIENTE ||--o| CUENTA_CORRIENTE : "posee"
    CUENTA_CORRIENTE ||--o{ MOVIMIENTO : "registra"
```

---

## 6. Diagrama de Secuencia - Cargo/Pago en Cuenta Corriente

```mermaid
sequenceDiagram
    actor A as Admin
    participant V as Vista (Pug)
    participant C as CCController
    participant M as CuentaCorriente
    participant CL as Cliente

    A->>V: POST /cuentas/cargo (idCliente, monto, descripcion)
    V->>C: registrarCargo(req, res)
    C->>M: CuentaCorriente.findOne({cliente: id})
    M-->>C: cuenta encontrada
    C->>C: calcular nuevo saldo
    C->>M: cuenta.save() con nuevo movimiento
    M-->>C: cuenta actualizada
    C-->>V: res.redirect('/cuentas')
    V-->>A: Listado actualizado

    A->>V: POST /cuentas/pago (idCliente, monto, descripcion)
    V->>C: registrarPago(req, res)
    C->>M: CuentaCorriente.findOne({cliente: id})
    M-->>C: cuenta encontrada
    C->>C: calcular nuevo saldo (resta)
    C->>M: cuenta.save() con nuevo movimiento
    M-->>C: cuenta actualizada
    C-->>V: res.redirect('/cuentas')
    V-->>A: Listado actualizado
```
