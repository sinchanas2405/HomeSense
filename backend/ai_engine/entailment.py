
from .inference import forward_chain


def entails(facts, conclusion):
    """
    Check whether a conclusion logically follows
    from the supplied facts and knowledge-base rules.
    """

    if not isinstance(facts, (list, set, tuple)):
        raise ValueError("Facts must be a list, set or tuple.")

    if not isinstance(conclusion, str) or not conclusion.strip():
        raise ValueError("A valid conclusion is required.")

    derived_facts, fired_rules, trace = forward_chain(facts)

    result = conclusion in derived_facts

    trace.append(
        f"Entailment check: {conclusion} is "
        f"{'ENTAILED' if result else 'NOT ENTAILED'}."
    )

    return result
