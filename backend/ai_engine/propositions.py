def proposition(name, value=True): return {'name':name,'value':bool(value)}
def negate(literal): return literal[1:] if literal.startswith('!') else '!'+literal
