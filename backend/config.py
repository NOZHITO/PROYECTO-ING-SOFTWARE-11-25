import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    if SQLALCHEMY_DATABASE_URI and "sslmode" not in SQLALCHEMY_DATABASE_URI:
        if "?" in SQLALCHEMY_DATABASE_URI:
            SQLALCHEMY_DATABASE_URI += "&sslmode=require"
        else:
            SQLALCHEMY_DATABASE_URI += "?sslmode=require"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = os.getenv("SECRET_KEY", "clave_secreta_backup")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt_backup")

    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = MAIL_USERNAME
