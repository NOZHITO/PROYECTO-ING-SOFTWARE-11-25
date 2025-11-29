from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_bcrypt import Bcrypt
from extensions import db, migrate, jwt, bcrypt, mail
from flask_migrate import Migrate


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()
mail = Mail()



