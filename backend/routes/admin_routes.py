# admin_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db, bcrypt
from models import User

admin_bp = Blueprint("admin_bp", __name__)

# ============================================================
# 🔹 Crear usuario (pescador o vendedor)
# ============================================================
@admin_bp.route("/create_user", methods=["POST"])
@jwt_required()
def create_user():
    try:
        admin_id = get_jwt_identity()
        admin = User.query.get(admin_id)

        if not admin or admin.role != "admin":
            return jsonify({"msg": "Solo los administradores pueden crear usuarios."}), 403

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

        if User.query.filter_by(username=username).first():
            return jsonify({"msg": "El username ya existe"}), 400

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
        print("❌ Error en create_user:", e)
        return jsonify({"msg": "Error interno del servidor"}), 500


# ============================================================
# 🔹 Listar usuarios NO administradores
# ============================================================
@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    try:
        admin_id = get_jwt_identity()
        admin = User.query.get(admin_id)

        if not admin or admin.role != "admin":
            return jsonify({"msg": "Acceso denegado"}), 403

        users = User.query.filter(User.role != "admin").all()

        return jsonify([
            {
                "id": u.id,
                "name": u.name,
                "username": u.username,
                "email": u.email,
                "role": u.role
            }
            for u in users
        ]), 200

    except Exception as e:
        print("❌ Error en get_users:", e)
        return jsonify({"msg": "Error interno del servidor"}), 500


# ============================================================
# 🔹 Eliminar usuario
# ============================================================
@admin_bp.route("/delete_user/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    try:
        admin_id = get_jwt_identity()
        admin = User.query.get(admin_id)

        if not admin or admin.role != "admin":
            return jsonify({"msg": "Acceso denegado"}), 403

        user = User.query.get(id)
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        if user.role == "admin":
            return jsonify({"msg": "No puedes eliminar administradores"}), 400

        db.session.delete(user)
        db.session.commit()

        return jsonify({"msg": "Usuario eliminado correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print("❌ Error en delete_user:", e)
        return jsonify({"msg": "Error interno del servidor"}), 500
