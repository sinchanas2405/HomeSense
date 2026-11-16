from flask import Blueprint,jsonify
from flask_jwt_extended import jwt_required,get_jwt_identity
from models.device import Device
from models.diagnosis import Diagnosis
from ai_engine.rules import RULES
bp=Blueprint('dashboard',__name__,url_prefix='/api/dashboard')
@bp.get('')
@jwt_required()
def dashboard():
 uid=int(get_jwt_identity());return jsonify(device_count=Device.query.filter_by(user_id=uid).count(),diagnosis_count=Diagnosis.query.filter_by(user_id=uid).count(),rule_count=len(RULES))
