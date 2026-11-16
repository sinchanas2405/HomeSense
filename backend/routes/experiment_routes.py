from flask import Blueprint,jsonify
from flask_jwt_extended import jwt_required,get_jwt_identity
from extensions import db
from models.experiment import Experiment
from experiments.benchmark_runner import run_benchmark
bp=Blueprint('experiments',__name__,url_prefix='/api/experiments')
@bp.post('/run')
@jwt_required()
def run():
 result=run_benchmark();row=Experiment(user_id=int(get_jwt_identity()),result=result);db.session.add(row);db.session.commit();return jsonify(result)
