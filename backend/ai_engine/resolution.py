from .propositions import negate


def is_tautology(clause):
    """Return True if a clause contains both A and !A."""
    return any(negate(literal) in clause for literal in clause)


def resolve_all(clause1, clause2):
    """Generate every possible resolvent from two clauses."""
    results = set()

    for literal in clause1:
        opposite = negate(literal)

        if opposite in clause2:
            resolvent = (
                (set(clause1) - {literal})
                | (set(clause2) - {opposite})
            )

            if not is_tautology(resolvent):
                results.add(tuple(sorted(resolvent)))

    return sorted(results)


def resolve(clause1, clause2):
    """Perform one resolution step and return one resolvent."""
    results = resolve_all(clause1, clause2)

    if not results:
        return None

    return list(results[0])


def resolution_proof(clauses, max_steps=1000):
    """
    Apply repeated resolution to CNF clauses.

    An empty clause means a contradiction has been proved.
    """

    if not isinstance(clauses, (list, tuple)):
        raise ValueError("Clauses must be a list.")

    if not isinstance(max_steps, int) or isinstance(max_steps, bool) or max_steps < 1:
        raise ValueError("max_steps must be a positive integer.")

    known = set()
    trace = []

    for clause in clauses:
        if not isinstance(clause, (list, tuple, set)):
            raise ValueError("Each clause must be a list, tuple or set.")

        if not all(
            isinstance(literal, str)
            and literal.strip()
            and literal == literal.strip()
            for literal in clause
        ):
            raise ValueError("Every literal must be a non-empty string.")

        normalized = tuple(sorted(set(clause)))

        if is_tautology(normalized):
            trace.append(
                f"Skipped tautological clause: {list(normalized)}"
            )
            continue

        if normalized not in known:
            known.add(normalized)
            trace.append(f"Initial clause: {list(normalized)}")

        if not normalized:
            return {
                "unsatisfiable": True,
                "limit_reached": False,
                "derived_clauses": [[]],
                "trace": trace + ["Empty clause found. Contradiction proved."]
            }

    steps = 0

    while True:
        current = sorted(known)
        new_clauses = set()

        for i in range(len(current)):
            for j in range(i + 1, len(current)):

                clause1 = current[i]
                clause2 = current[j]

                resolvents = resolve_all(clause1, clause2)

                for resolvent in resolvents:

                    if resolvent in known or resolvent in new_clauses:
                        continue

                    steps += 1

                    trace.append(
                        f"Resolve {list(clause1)} and "
                        f"{list(clause2)} → {list(resolvent)}"
                    )

                    if not resolvent:
                        return {
                            "unsatisfiable": True,
                            "limit_reached": False,
                            "derived_clauses": [
                                list(c) for c in sorted(known | new_clauses)
                            ] + [[]],
                            "trace": trace + [
                                "Empty clause derived. Contradiction proved."
                            ]
                        }

                    new_clauses.add(resolvent)

                    if steps >= max_steps:
                        return {
                            "unsatisfiable": False,
                            "limit_reached": True,
                            "derived_clauses": [
                                list(c) for c in sorted(known | new_clauses)
                            ],
                            "trace": trace + [
                                "Resolution step limit reached."
                            ]
                        }

        if not new_clauses:
            break

        known.update(new_clauses)

    return {
        "unsatisfiable": False,
        "limit_reached": False,
        "derived_clauses": [list(c) for c in sorted(known)],
        "trace": trace + [
            "No more new resolvents can be derived."
        ]
    }