
from .rules import RULES


def backward_chain(goal, facts):
    known_facts = set(facts)
    trace = [f"Starting goal: {goal}"]
    visiting = set()

    def prove(target):
        if target in known_facts:
            trace.append(f"Fact already known: {target}")
            return True

        if target in visiting:
            trace.append(f"Cycle detected while proving: {target}")
            return False

        supporting_rules = [
            rule for rule in RULES
            if rule['conclusion'] == target
        ]

        if not supporting_rules:
            trace.append(f"No rule or known fact supports: {target}")
            return False

        visiting.add(target)

        for rule in supporting_rules:
            trace.append(
                f"Testing rule {rule['id']}: {rule['name']}"
            )

            conditions_proved = True

            for condition in rule['conditions']:
                trace.append(f"Trying to prove condition: {condition}")

                if not prove(condition):
                    conditions_proved = False
                    trace.append(
                        f"Condition not proved: {condition}"
                    )
                    break

            if conditions_proved:
                visiting.remove(target)
                trace.append(f"Goal proved: {target}")
                return True

        visiting.remove(target)
        trace.append(f"Goal could not be proved: {target}")
        return False

    result = prove(goal)

    return {
        'entailed': result,
        'trace': trace
    }
