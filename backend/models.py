from extensions import db
from datetime import datetime

# -------------------------------------------------------------------
# 🔹 Modelo de Usuario
# -------------------------------------------------------------------
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=True)  # para login de trabajadores
    email = db.Column(db.String(120), unique=True, nullable=True)     # para login de admin
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # admin, worker, pescador, vendedor, proveedor
    reset_token = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.name} ({self.role})>"


# -------------------------------------------------------------------
# 🔹 Modelo de Lote
# -------------------------------------------------------------------
class Lote(db.Model):
    __tablename__ = "lotes"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    ubicacion = db.Column(db.String(150), nullable=False)
    fechaInicio = db.Column(db.String(20), nullable=False)
    estado = db.Column(db.String(50), default="activo")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Lote {self.nombre} - {self.estado}>"

# -------------------------------------------------------------------
# 🔹 Modelo de Proovedores
# -------------------------------------------------------------------

class Proveedor(db.Model):
    __tablename__ = "proveedores"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    telefono = db.Column(db.String(50), nullable=False)
    ubicacion = db.Column(db.String(150), nullable=False)
    creado_por = db.Column(db.Integer, db.ForeignKey("users.id"))  # admin o pescador