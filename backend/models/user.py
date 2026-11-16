from extensions import db
from werkzeug.security import generate_password_hash,check_password_hash
class User(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(100),nullable=False)
    email=db.Column(db.String(160),unique=True,nullable=False,index=True)
    password_hash=db.Column(db.String(255),nullable=False)
    def set_password(self,p): self.password_hash=generate_password_hash(p)
    def check_password(self,p): return check_password_hash(self.password_hash,p)
    def public(self): return {'id':self.id,'name':self.name,'email':self.email}
