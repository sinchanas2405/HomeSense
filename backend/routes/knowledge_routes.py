from flask import Blueprint,jsonify
from ai_engine.rules import RULES
bp=Blueprint('knowledge',__name__,url_prefix='/api/knowledge')
@bp.get('/rules')
def rules(): return jsonify(RULES)
