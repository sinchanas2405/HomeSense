from .inference import forward_chain
from .planning import safe_action_plan
def diagnose(symptoms):
    facts,fired,trace=forward_chain(symptoms)
    from .rules import RULES
    matched=[r for r in RULES if r['id'] in fired]
    fault='; '.join(r['conclusion'] for r in matched) if matched else 'No known fault pattern identified'
    explanation='The engine matched the reported symptoms against its IF–THEN knowledge rules.' if matched else 'No current rule matches these symptoms. Add more observations or consult device support.'
    return {'fault':fault,'status':'Possible issue identified' if matched else 'Needs further assessment','explanation':explanation,'trace':trace,'matched_rules':[r['id'] for r in matched],'recommendations':safe_action_plan(fault)}
