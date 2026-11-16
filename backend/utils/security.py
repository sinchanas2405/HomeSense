from functools import wraps
from flask_jwt_extended import verify_jwt_in_request,get_jwt_identity
def current_user_id(): return int(get_jwt_identity())
def protected(fn):
    @wraps(fn)
    def wrapper(*a,**kw): verify_jwt_in_request(); return fn(*a,**kw)
    return wrapper
