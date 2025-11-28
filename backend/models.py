from extensions import db
from datetime import datetime

# =========================================================
# 👤 Modelo de Usuario (User)
# =========================================================
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=True) # Para workers
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='worker', nullable=False) # 'admin', 'pescador', 'vendedor'
    
    # 🔥 Campos agregados para la recuperación de contraseña segura
    reset_token = db.Column(db.String(32), unique=True, nullable=True)
    reset_token_expiration = db.Column(db.DateTime, nullable=True)
    
    # Relaciones: Un usuario (pescador/vendedor) puede tener muchos Lotes
    lotes = db.relationship('Lote', backref='owner', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

# =========================================================
# 📦 Modelo de Lote (Lote)
# =========================================================
class Lote(db.Model):
    __tablename__ = 'lotes'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre_producto = db.Column(db.String(100), nullable=False)
    peso_kg = db.Column(db.Float, nullable=False)
    fecha_captura = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    vendido = db.Column(db.Boolean, default=False, nullable=False)

    # Clave foránea al usuario que creó o capturó el lote
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) 
    
    # Clave foránea al proveedor
    proveedor_id = db.Column(db.Integer, db.ForeignKey('proveedores.id'), nullable=True) 

    def __repr__(self):
        return f'<Lote {self.nombre_producto} - {self.peso_kg}kg>'

# =========================================================
# 🚚 Modelo de Proveedor (Proveedor)
# =========================================================
class Proveedor(db.Model):
    __tablename__ = 'proveedores'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=True, nullable=False)
    contacto = db.Column(db.String(120), nullable=True)

    # Relación: Un proveedor puede recibir muchos lotes
    lotes = db.relationship('Lote', backref='supplier', lazy=True)

    def __repr__(self):
        return f'<Proveedor {self.nombre}>'
