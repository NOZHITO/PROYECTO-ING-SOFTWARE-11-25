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

    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL no está definida en Railway")

    # Asegurar SSL para Supabase
    if "sslmode" not in DATABASE_URL:
        DATABASE_URL += "?sslmode=require"

    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config["SECRET_KEY"] = "supersecretkey"
    app.config["JWT_SECRET_KEY"] = "supersecretkey"

    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
    app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_USERNAME")

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    Migrate(app, db)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(lote_bp, url_prefix="/api/lotes")
    app.register_blueprint(proveedor_bp, url_prefix="/api/proveedores")

    return app


print("ENV VARS DISPONIBLES:", os.environ)
print("DATABASE_URL =", os.getenv("DATABASE_URL"))

app = create_app()

def get_db_connection():
    database_url = os.getenv("DATABASE_URL")

    conn = psycopg2.connect(database_url)
    return conn

# luego en cada ruta
conn = get_db_connection()
cur = conn.cursor()

cur.execute("SELECT * FROM usuarios;")

conn.close()  # SIEMPRE

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=False, use_reloader=False)
