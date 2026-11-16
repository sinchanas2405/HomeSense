from extensions import db
from datetime import datetime,timezone
class Diagnosis(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False,index=True)
    device_id=db.Column(db.Integer,db.ForeignKey('device.id'),nullable=False)
    device_name=db.Column(db.String(100),nullable=False)
    symptoms=db.Column(db.JSON,default=list)
    fault=db.Column(db.String(160),nullable=False)
    status=db.Column(db.String(40),default='Completed')
    explanation=db.Column(db.Text,default='')
    trace=db.Column(db.JSON,default=list)
    recommendations=db.Column(db.JSON,default=list)
    created_at=db.Column(db.DateTime,default=lambda:datetime.now(timezone.utc))
    def to_dict(self): return {'id':self.id,'device_name':self.device_name,'symptoms':self.symptoms,'fault':self.fault,'status':self.status,'explanation':self.explanation,'trace':self.trace,'recommendations':self.recommendations,'created_at':self.created_at.isoformat()}
