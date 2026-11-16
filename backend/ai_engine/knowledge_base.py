from .rules import RULES
def get_rules(): return RULES
def matching_rules(facts): return [r for r in RULES if set(r['conditions']).issubset(facts)]
