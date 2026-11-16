from flask import Blueprint,request,jsonify
from extensions import db
from models.device import Device
from utils.security import protected,current_user_id
from utils.validators import clean_text
bp=Blueprint('devices',__name__,url_prefix='/api/devices')
@bp.get('')
@protected
def list_devices(): return jsonify([x.to_dict() for x in Device.query.filter_by(user_id=current_user_id()).order_by(Device.id.desc()).all()])
@bp.post('')
@protected
def add_device():
 d=request.get_json() or {};name=clean_text(d.get('name'),100);typ=clean_text(d.get('device_type'),80)
 if not name or not typ:return jsonify(error='Device name and type are required.'),400
 x=Device(user_id=current_user_id(),name=name,device_type=typ,room=clean_text(d.get('room'),80));db.session.add(x);db.session.commit();return jsonify(x.to_dict()),201
@bp.delete('/<int:device_id>')
@protected
def delete_device():
 x=Device.query.filter_by(id=device_id,user_id=current_user_id()).first_or_404();db.session.delete(x);db.session.commit();return jsonify(message='Device removed')
