from flask import Blueprint,request,jsonify
from flask_jwt_extended import create_access_token
from extensions import db
from models.user import User
from utils.validators import valid_email,clean_text
bp=Blueprint('auth',__name__,url_prefix='/api/auth')
def response(user): return jsonify(access_token=create_access_token(identity=str(user.id)),user=user.public())
@bp.post('/register')
def register():
 d=request.get_json() or {};name=clean_text(d.get('name'),100);email=clean_text(d.get('email'),160).lower();pw=d.get('password','')
 if not name or not valid_email(email) or len(pw)<8:return jsonify(error='Enter a name, valid email and password of at least 8 characters.'),400
 if User.query.filter_by(email=email).first():return jsonify(error='Email is already registered.'),409
 u=User(name=name,email=email);u.set_password(pw);db.session.add(u);db.session.commit();return response(u),201
@bp.post('/login')
def login():
 d=request.get_json() or {};u=User.query.filter_by(email=clean_text(d.get('email'),160).lower()).first()
 if not u or not u.check_password(d.get('password','')):return jsonify(error='Invalid email or password.'),401
 return response(u)
