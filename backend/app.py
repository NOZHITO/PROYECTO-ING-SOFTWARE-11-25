import os
import psycopg2
from flask import Flask
from flask_cors import CORS
from extensions import db, jwt, mail, bcrypt
from config import Config

def create_app():
    app = Flask(__name__)

    # ====== CORS ======
    CORS(app)

    # ====== Cargar Config base ======
    app.config.from_object(Config)

    # ====== Conexión Supabase ======
    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL no está definida en Railway")

    # Forzar SSL para Supabase
    if "sslmode" not in DATABASE_URL:
        if "?" in DATABASE_URL:
            DATABASE_URL += "&sslmode=require"
        else:
            DATABASE_URL += "?sslmode=require"

    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ====== Sobrescribir config de correo usando variables ======
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
    app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_USERNAME")

    # ====== Inicializar extensiones ======
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    bcrypt.init_app(app)

    return app


def get_db_connection():
    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL no configurada")

    if "sslmode" not in DATABASE_URL:
        if "?" in DATABASE_URL:
            DATABASE_URL += "&sslmode=require"
        else:
            DATABASE_URL += "?sslmode=require"

    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    return conn


# 🚀 gunicorn lo usa
app = create_app()
