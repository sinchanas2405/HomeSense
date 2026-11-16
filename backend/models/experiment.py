from extensions import db
from datetime import datetime,timezone
class Experiment(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    result=db.Column(db.JSON,default=dict)
    created_at=db.Column(db.DateTime,default=lambda:datetime.now(timezone.utc))
