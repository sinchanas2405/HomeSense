from flask import Blueprint,request,jsonify
from extensions import db
from models.device import Device
from models.diagnosis import Diagnosis
from ai_engine.diagnosis_engine import diagnose
from utils.security import protected,current_user_id
bp=Blueprint('diagnosis',__name__,url_prefix='/api/diagnosis')
@bp.post('')
@protected
def create():
 d=request.get_json() or {};uid=current_user_id();device=Device.query.filter_by(id=d.get('device_id'),user_id=uid).first()
 symptoms=d.get('symptoms') or []
 if not device:return jsonify(error='Select one of your registered devices.'),404
 if not isinstance(symptoms,list) or not symptoms:return jsonify(error='Select at least one symptom.'),400
 result=diagnose([str(s) for s in symptoms]);row=Diagnosis(user_id=uid,device_id=device.id,device_name=device.name,symptoms=symptoms,fault=result['fault'],status=result['status'],explanation=result['explanation'],trace=result['trace'],recommendations=result['recommendations']);db.session.add(row);db.session.commit();return jsonify(result|{'diagnosis_id':row.id}),201
@bp.get('/history')
@protected
def history(): return jsonify([x.to_dict() for x in Diagnosis.query.filter_by(user_id=current_user_id()).order_by(Diagnosis.created_at.desc()).all()])
