from extensions import db
class Device(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False,index=True)
    name=db.Column(db.String(100),nullable=False)
    device_type=db.Column(db.String(80),nullable=False)
    room=db.Column(db.String(80),default='')
    status=db.Column(db.String(30),default='active')
    def to_dict(self): return {'id':self.id,'name':self.name,'device_type':self.device_type,'room':self.room,'status':self.status}
