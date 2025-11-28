import psycopg2
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
import os
from extensions import db

def create_app():
    app = Flask(__name__)
    CORS(app)

    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL no está definida en Railway")

    # Forzar SSL requerido por Supabase
      if "sslmode" not in DATABASE_URL:
        if "?" in DATABASE_URL:
            DATABASE_URL += "&sslmode=require"
        else:
            DATABASE_URL += "?sslmode=require"
    

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

    jwt = JWTManager(app)
    mail = Mail(app)

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

    conn = psycopg2.connect(
        DATABASE_URL,
        sslmode="require"
    )
    return conn


if __name__ == "__main__":
    app.run(debug=False, use_reloader=False)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=False)


app = create_app()

