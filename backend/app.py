from flask import Flask,jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config
from extensions import db,jwt
load_dotenv()
def create_app():
 app=Flask(__name__);app.config.from_object(Config);db.init_app(app);jwt.init_app(app)
 origins=app.config.get('CORS_ORIGINS','http://localhost:5173')
 CORS(app,origins=[x.strip() for x in origins.split(',')])
 from models import User,Device,Diagnosis,Experiment
 from routes.auth_routes import bp as auth
 from routes.device_routes import bp as devices
 from routes.diagnosis_routes import bp as diagnosis
 from routes.knowledge_routes import bp as knowledge
 from routes.algorithm_routes import bp as algorithms
 from routes.experiment_routes import bp as experiments
 from routes.dashboard_routes import bp as dashboard
 for route in [auth,devices,diagnosis,knowledge,algorithms,experiments,dashboard]:app.register_blueprint(route)
 @app.get('/api/health')
 def health():return jsonify(status='ok',service='HomeSense API')
 with app.app_context():db.create_all()
 return app
app=create_app()
if __name__=='__main__':app.run(host='127.0.0.1',port=5000,debug=True)
