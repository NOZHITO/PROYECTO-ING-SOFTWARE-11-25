import os
from flask import Flask
from flask_cors import CORS
from extensions import db, jwt, mail, bcrypt
from flask_migrate import Migrate

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app)

    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise RuntimeError("❌ DATABASE_URL no está definida en Railway")

    # Asegurar SSL para Supabase
    if "sslmode" not in DATABASE_URL:
        if "?" in DATABASE_URL:
            DATABASE_URL += "&sslmode=require"
        else:
            DATABASE_URL += "?sslmode=require"

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

    # 👇 IMPORTANTE: Registra los modelos
    from models import User, Lote, Proveedor
        @app.route("/init_db")
    def init_db():
        try:
            from models import User, Lote, Proveedor
            db.create_all()
            return "✅ Tablas creadas correctamente en Supabase"
        except Exception as e:
            return f"❌ Error creando tablas: {str(e)}"

return app


# Gunicorn usa esto
app = create_app()

