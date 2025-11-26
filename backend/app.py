from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from extensions import db, jwt, mail, bcrypt
from routes.auth_routes import auth_bp
from routes.lote_routes import lote_bp
from routes.admin_routes import admin_bp
from routes.proveedor_routes import proveedor_bp


import os

def create_app():
    app = Flask(__name__)
    CORS(app)

    # ------------------ Configuración base de datos ------------------
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////data/database.db?timeout=30"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ------------------ JWT y seguridad ------------------
    app.config["SECRET_KEY"] = "supersecretkey"
    app.config["JWT_SECRET_KEY"] = "supersecretkey"

    # ------------------ Configuración de correo ------------------
    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
    app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_USERNAME")

    # ------------------ Inicialización de extensiones ------------------
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    migrate = Migrate(app, db)

    # ------------------ Registrar rutas ------------------
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(lote_bp, url_prefix="/api/lotes")
    app.register_blueprint(proveedor_bp, url_prefix="/api/proveedores")

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()

    port = int(os.environ.get("PORT", 8080))

    app.run(
        host="0.0.0.0",   # Necesario para Railway
        port=port,        # Puerto dinámico
        debug=False,
        use_reloader=False
    )
