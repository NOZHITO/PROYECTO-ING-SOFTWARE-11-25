from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db, bcrypt, mail
from flask_mail import Message
from models import User
import secrets
from datetime import timedelta, datetime # 🔥 Importar datetime de Python

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

        # Usamos .filter_by.first() para verificar la existencia.
        if User.query.filter_by(email=email).first():
            return jsonify({"msg": "El correo ya está registrado"}), 400

        # Hashear y crear usuario
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
# 🔹 Login de trabajador (pescador o vendedor)
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
        # Aseguramos que solo devuelva workers, no otros admins si los hubiera
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
        username = data.get("username")
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
            username=username,
            email=email,
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
def delete_user(id
