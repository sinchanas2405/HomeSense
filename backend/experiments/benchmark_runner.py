from ai_engine.diagnosis_engine import diagnose
from .test_cases import CASES
def run_benchmark():
    rows=[]
    for c in CASES:
        result=diagnose(c['symptoms']);ok=c['expected_rule'] in result['matched_rules'] if c['expected_rule'] else not result['matched_rules']
        rows.append({'case':c['name'],'passed':bool(ok),'expected_rule':c['expected_rule'],'matched_rules':result['matched_rules']})
    return {'total':len(rows),'passed':sum(x['passed'] for x in rows),'accuracy_percent':round(100*sum(x['passed'] for x in rows)/len(rows),1),'cases':rows}
