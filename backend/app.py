import os
import psycopg2
from flask import Flask
from flask_cors import CORS
from extensions import db, jwt, mail, bcrypt
from flask_migrate import Migrate
# IMPORTA LOS MODELOS ANTES DE create_all
from models import User, Lote, Proveedor

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app)

    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise RuntimeError("❌ DATABASE_URL no está definida en Railway")

    # 💡 Limpia cualquier sslmode anterior
    DATABASE_URL = DATABASE_URL.replace("?sslmode=disable", "").replace("&sslmode=disable", "")

    # Forzar SSL requerido por Supabase
    if "sslmode" not in DATABASE_URL:
        if "?" in DATABASE_URL:
            DATABASE_URL += "&sslmode=require"
        else:
            DATABASE_URL += "?sslmode=require"

    # Config SQLAlchemy
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Config JWT
    app.config["SECRET_KEY"] = "supersecretkey"
    app.config["JWT_SECRET_KEY"] = "supersecretkey"

    # Config correo
    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
    app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_USERNAME")

    # Inicializar extensiones
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

with app.app_context():
    try:
        from models import User, Lote, Proveedor  # 👈 IMPORTANTE

        connection = db.engine.connect()
        print("✅ Conectado correctamente a Supabase")
        connection.close()

        db.create_all()
        print("✅ Intentando crear tablas")

    except Exception as e:
        print("❌ Error al conectar con Supabase:", e)



app = create_app()

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0")
