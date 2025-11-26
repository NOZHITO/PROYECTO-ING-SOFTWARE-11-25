from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db, bcrypt, mail
from flask_mail import Message
from models import User
import secrets
from datetime import timedelta

auth_bp = Blueprint("auth_bp", __name__)

# ============================================================
# 🔹 Registrar un administrador
# ============================================================
@auth_bp.route("/register_admin", methods=["POST"])
def register_admin():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirmPassword")

        if not all([name, email, password, confirm_password]):
            return jsonify({"msg": "Todos los campos son requeridos"}), 400

        if password != confirm_password:
            return jsonify({"msg": "Las contraseñas no coinciden"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"msg": "El correo ya está registrado"}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        new_admin = User(name=name, email=email, password=hashed_password, role="admin")

        db.session.add(new_admin)
        db.session.commit()

        return jsonify({"msg": "Administrador creado correctamente"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error en register_admin: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


# ============================================================
# 🔹 Login de administrador
# ============================================================
@auth_bp.route("/login_admin", methods=["POST"])
def login_admin():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email, role="admin").first()
        if not user:
            return jsonify({"error": "Administrador no encontrado"}), 404

        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "Contraseña incorrecta"}), 401

        token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=12))

        return jsonify({"token": token, "role": user.role}), 200

    except Exception as e:
        print(f"Error en login_admin: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


# -------------------------------------------------------------------
# 🔹 Login de pescador o vendedor
# -------------------------------------------------------------------
@auth_bp.route("/login", methods=["POST"])
def login_worker():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Faltan campos obligatorios"}), 400

        # Buscar usuario por username (NO admins)
        user = User.query.filter(
            User.username == username,
            User.role.in_(["pescador", "vendedor"])
        ).first()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "Contraseña incorrecta"}), 401

        # Crear token
        access_token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(hours=12)
        )

        return jsonify({
            "token": access_token,
            "role": user.role,
            "name": user.name,
            "msg": "Inicio de sesión exitoso"
        }), 200

    except Exception as e:
        print("Error en login_worker:", e)
        return jsonify({"msg": "Error interno del servidor"}), 500

# ============================================================
# 🔹 Obtener usuarios (admin)
# ============================================================
@auth_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    try:
        users = User.query.filter(User.role != "admin").all()

        return jsonify([
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role
            }
            for u in users
        ]), 200

    except Exception as e:
        print(f"Error en get_users: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


# ============================================================
# 🔹 Crear usuarios (solo roles pescador y vendedor)
# ============================================================
@auth_bp.route("/create_user", methods=["POST"])
@jwt_required()
def create_user():
    try:
        data = request.get_json()
        name = data.get("name")
        username = data.get("username")   # 🔥 AGREGADO
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")

        if role not in ["pescador", "vendedor"]:
            return jsonify({"msg": "Rol inválido"}), 400

        if not all([name, username, password]):
            return jsonify({"msg": "Nombre, usuario y contraseña son requeridos"}), 400

        # Email es opcional para trabajadores, pero username NO
        if User.query.filter_by(username=username).first():
            return jsonify({"msg": "El nombre de usuario ya existe"}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        new_user = User(
            name=name,
            username=username,   # 🔥 GUARDAR username
            email=email,         # opcional
            password=hashed_password,
            role=role
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "Usuario creado correctamente"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error en create_user: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


# ============================================================
# 🔹 Eliminar usuario
# ============================================================
@auth_bp.route("/delete_user/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    try:
        user = User.query.get(id)

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        if user.role == "admin":
            return jsonify({"msg": "No puedes eliminar administradores"}), 403

        db.session.delete(user)
        db.session.commit()

        return jsonify({"msg": "Usuario eliminado correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error en delete_user: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


# ============================================================
# 🔹 RECUPERAR CONTRASEÑA
# ============================================================
@auth_bp.route("/forgot_password", methods=["POST"])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get("email")

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        token = secrets.token_hex(16)
        user.reset_token = token
        db.session.commit()

        msg = Message(
            subject="Recuperación de contraseña",
            recipients=[email],
            body=f"Tu token de recuperación de contraseña es:\n\n{token}"
        )
        mail.send(msg)

        return jsonify({"msg": "Correo enviado"}), 200

    except Exception as e:
        print(f"Error en forgot_password: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


# ============================================================
# 🔹 RESET PASSWORD
# ============================================================
@auth_bp.route("/reset_password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json()
        token = data.get("token")
        new_password = data.get("new_password")

        user = User.query.filter_by(reset_token=token).first()

        if not user:
            return jsonify({"msg": "Token inválido"}), 400

        hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")
        user.password = hashed_password
        user.reset_token = None

        db.session.commit()

        return jsonify({"msg": "Contraseña restablecida correctamente"}), 200

    except Exception as e:
        print(f"Error en reset_password: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500
