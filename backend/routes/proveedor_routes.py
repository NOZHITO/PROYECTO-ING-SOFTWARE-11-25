from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Proveedor, User

proveedor_bp = Blueprint("proveedor_bp", __name__)

# -------------------------------------------------------------------
# 🔹 Crear proveedor (admin o pescador)
# -------------------------------------------------------------------
@proveedor_bp.route("/create", methods=["POST"])
@jwt_required()
def create_proveedor():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role not in ["admin", "pescador"]:
        return jsonify({"msg": "No tienes permisos para crear proveedores"}), 403

    data = request.get_json()
    nombre = data.get("nombre")
    telefono = data.get("telefono")
    ubicacion = data.get("ubicacion")

    if not all([nombre, telefono, ubicacion]):
        return jsonify({"msg": "Todos los campos son requeridos"}), 400

    proveedor = Proveedor(
        nombre=nombre,
        telefono=telefono,
        ubicacion=ubicacion,
        creado_por=user.id
    )
    db.session.add(proveedor)
    db.session.commit()

    return jsonify({"msg": "Proveedor registrado correctamente"}), 201


# -------------------------------------------------------------------
# 🔹 Listar proveedores
# -------------------------------------------------------------------
@proveedor_bp.route("/all", methods=["GET"])
@jwt_required()
def listar_proveedores():
    proveedores = Proveedor.query.all()
    result = [
        {
            "id": p.id,
            "nombre": p.nombre,
            "telefono": p.telefono,
            "ubicacion": p.ubicacion
        }
        for p in proveedores
    ]
    return jsonify(result), 200
