from flask import Flask
from flask_cors import CORS
from extensions import db, migrate, jwt, bcrypt, mail

# Importar blueprints
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp

def create_app():
    app = Flask(__name__)

    # ---------------------------
    # CONFIGURACIONES PRINCIPALES
    # ---------------------------
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"  # O tu URL de Supabase
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "supersecret-key"

    CORS(app)

    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)

    # Registrar Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    @app.route("/")
    def home():
        return {"msg": "Backend funcionando correctamente"}

    return app


# 🔥 NECESARIO PARA GUNICORN (Railway)
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
