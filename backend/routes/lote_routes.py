from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Lote, User

lote_bp = Blueprint("lote_bp", __name__)

ESTADOS_VALIDOS = ["inactivo", "en crianza", "en venta", "vendido"]

# -------------------------------------------------------------------
# 🔹 Crear lote — SOLO ADMIN
# -------------------------------------------------------------------
@lote_bp.route("/create", methods=["POST"])
@jwt_required()
def create_lote():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != "admin":
        return jsonify({"msg": "Solo el administrador puede crear lotes"}), 403

    data = request.get_json()
    nombre = data.get("nombre")
    ubicacion = data.get("ubicacion")
    fechaInicio = data.get("fechaInicio")
    estado = "inactivo"

    if not all([nombre, ubicacion, fechaInicio]):
        return jsonify({"msg": "Todos los campos son requeridos"}), 400

    lote = Lote(
        nombre=nombre,
        ubicacion=ubicacion,
        fechaInicio=fechaInicio,
        estado=estado
    )
    db.session.add(lote)
    db.session.commit()

    return jsonify({"msg": "Lote creado correctamente"}), 201


# -------------------------------------------------------------------
# 🔹 Obtener todos los lotes
# -------------------------------------------------------------------
@lote_bp.route("/all", methods=["GET"])
@jwt_required()
def all_lotes():
    lotes = Lote.query.all()
    return jsonify([
        {
            "id": l.id,
            "nombre": l.nombre,
            "ubicacion": l.ubicacion,
            "fechaInicio": l.fechaInicio,
            "estado": l.estado
        }
        for l in lotes
    ]), 200


# -------------------------------------------------------------------
# 🔹 Cambiar estado del lote (reglas por rol)
# -------------------------------------------------------------------
@lote_bp.route("/update_state/<int:lote_id>", methods=["PUT"])
@jwt_required()
def update_state(lote_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    lote = Lote.query.get(lote_id)
    if not lote:
        return jsonify({"msg": "Lote no encontrado"}), 404

    data = request.get_json()
    nuevo_estado = data.get("estado")

    if nuevo_estado not in ESTADOS_VALIDOS:
        return jsonify({"msg": "Estado inválido"}), 400

    # ADMIN: puede cambiar a cualquier estado
    if user.role == "admin":
        lote.estado = nuevo_estado
        db.session.commit()
        return jsonify({"msg": "Estado actualizado"}), 200

    # PESCADOR: solo "en crianza" → "en venta"
    if user.role == "pescador":
        if lote.estado == "en crianza" and nuevo_estado == "en venta":
            lote.estado = nuevo_estado
            db.session.commit()
            return jsonify({"msg": "Estado actualizado"}), 200
        return jsonify({"msg": "No puedes cambiar el lote a ese estado"}), 403

    # VENDEDOR: solo "en venta" → "vendido"
    if user.role == "vendedor":
        if lote.estado == "en venta" and nuevo_estado == "vendido":
            lote.estado = nuevo_estado
            db.session.commit()
            return jsonify({"msg": "Estado actualizado"}), 200
        return jsonify({"msg": "No puedes cambiar el lote a ese estado"}), 403

    return jsonify({"msg": "No tienes permisos"}), 403
