from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
jwt = JWTManager()
mail = Mail()
bcrypt = Bcrypt()

db = SQLAlchemy(session_options={"autoflush": False})

