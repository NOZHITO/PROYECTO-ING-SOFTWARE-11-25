from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_bcrypt import Bcrypt
from extensions import db, migrate, jwt, bcrypt, mail

db = SQLAlchemy(session_options={"autoflush": False})
jwt = JWTManager()
mail = Mail()
bcrypt = Bcrypt()


