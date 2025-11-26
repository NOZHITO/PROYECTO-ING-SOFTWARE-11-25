import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Base de datos SQLite
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'database.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Claves secretas
    SECRET_KEY = "clave_secreta_para_el_proyecto_granja_camarones"
    JWT_SECRET_KEY = "jwt_clave_super_secreta"

    # Configuración de correo (para recuperación de contraseña)
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'tu_correo@gmail.com'         # <-- cambia esto
    MAIL_PASSWORD = 'tu_token_de_aplicacion'      # <-- usa un token de app, no tu contraseña normal
    MAIL_DEFAULT_SENDER = MAIL_USERNAME
