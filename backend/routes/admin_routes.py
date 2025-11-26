from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db, bcrypt
from models import User

admin_bp = Blueprint("admin_bp", __name__)

# ---------------------------------------------------------------
# 🔹 Crear nuevo usuario (solo admin)
# ---------------------------------------------------------------
@admin_bp.route("/create_user", methods=["POST"])
@jwt_required()
def create_user():
    try:
        admin_id = get_jwt_identity()
        admin = User.query.get(admin_id)

        if not admin or admin.role != "admin":
            return jsonify({"msg": "Acceso denegado. Solo administradores pueden crear usuarios."}), 403

        data = request.get_json()
        name = data.get("name")
        username = data.get("username")
        password = data.get("password")
        role = data.get("role", "worker")

        if not all([name, username, password]):
            return jsonify({"msg": "Faltan campos obligatorios."}), 400

        # Validar duplicados
        if User.query.filter_by(name=username).first():
            return jsonify({"msg": "El nombre de usuario ya existe."}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        new_user = User(name=name, email=username, password=hashed_password, role=role)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": f"Usuario '{name}' creado exitosamente"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error al crear usuario: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


# ---------------------------------------------------------------
# 🔹 Listar todos los usuarios
# ---------------------------------------------------------------
@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    try:
        admin_id = get_jwt_identity()
        admin = User.query.get(admin_id)

        if not admin or admin.role != "admin":
            return jsonify({"msg": "Acceso denegado."}), 403

        users = User.query.all()
        users_list = [
            {"id": u.id, "name": u.name, "username": u.email, "role": u.role}
            for u in users
        ]
        return jsonify(users_list), 200

    except Exception as e:
        print(f"Error al obtener usuarios: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


# ---------------------------------------------------------------
# 🔹 Ver contraseñas (solo admin)
# ---------------------------------------------------------------
@admin_bp.route("/view_passwords", methods=["POST"])
@jwt_required()
def view_passwords():
    try:
        data = request.get_json()
        admin_password = data.get("admin_password")

        admin_id = get_jwt_identity()
        admin = User.query.get(admin_id)

        if not admin or admin.role != "admin":
            return jsonify({"msg": "Acceso denegado."}), 403

        if not bcrypt.check_password_hash(admin.password, admin_password):
            return jsonify({"msg": "Contraseña de administrador incorrecta."}), 401

        users = User.query.all()
        passwords = [
            {"username": u.email, "password": u.password}
            for u in users
        ]
        return jsonify({"passwords": passwords}), 200

    except Exception as e:
        print(f"Error al ver contraseñas: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500
