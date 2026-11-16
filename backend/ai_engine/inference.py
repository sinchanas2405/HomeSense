
from .knowledge_base import matching_rules


def forward_chain(initial_facts):
    facts = set(initial_facts)
    trace = [
        f"Initial facts: {', '.join(sorted(facts)) or 'none'}"
    ]

    fired = []
    changed = True

    while changed:
        changed = False

        for rule in matching_rules(facts):
            if rule['id'] in fired:
                continue

            fired.append(rule['id'])

            conclusion = rule['conclusion']

            trace.append(
                f"{rule['id']} fired: {rule['name']} → {conclusion}"
            )

            if conclusion not in facts:
                facts.add(conclusion)
                changed = True

    if not fired:
        trace.append('No rule matched the supplied symptoms.')

    return facts, fired, trace
