# auth_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from extensions import db, bcrypt
from models import User
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

        new_admin = User(
            name=name,
            email=email,
            password=hashed_password,
            role="admin"
        )

        db.session.add(new_admin)
        db.session.commit()

        return jsonify({"msg": "Administrador creado correctamente"}), 201

    except Exception as e:
        db.session.rollback()
        print("❌ Error en register_admin:", e)
        return jsonify({"msg": "Error interno del servidor"}), 500


# ============================================================
# 🔹 Login administrador
# ============================================================
@auth_bp.route("/login_admin", methods=["POST"])
def login_admin():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        admin = User.query.filter_by(email=email, role="admin").first()

        if not admin:
            return jsonify({"error": "Administrador no encontrado"}), 404

        if not bcrypt.check_password_hash(admin.password, password):
            return jsonify({"error": "Contraseña incorrecta"}), 401

        token = create_access_token(
            identity=str(admin.id),
            expires_delta=timedelta(hours=12)
        )

        return jsonify({"token": token, "role": admin.role}), 200

    except Exception as e:
        print("❌ Error en login_admin:", e)
        return jsonify({"msg": "Error interno del servidor"}), 500
