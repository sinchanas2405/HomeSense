from flask import Blueprint, request, jsonify

from ai_engine.inference import forward_chain
from ai_engine.backward_chaining import backward_chain
from ai_engine.entailment import entails
from ai_engine.resolution import resolve, resolution_proof
from ai_engine.propositions import negate

bp = Blueprint(
    'algorithms',
    __name__,
    url_prefix='/api/algorithms'
)


# List available AI algorithms
@bp.get('')
def algorithms():
    return jsonify([
        {
            'name': 'Forward Chaining',
            'type': 'Data-driven inference',
            'endpoint': '/api/algorithms/forward'
        },
        {
            'name': 'Backward Chaining',
            'type': 'Goal-driven inference',
            'endpoint': '/api/algorithms/backward'
        },
        {
            'name': 'Resolution',
            'type': 'Propositional logic',
            'endpoint': '/api/algorithms/resolution'
        },
        {
            'name': 'Entailment',
            'type': 'Logical consequence',
            'endpoint': '/api/algorithms/entailment'
        }
    ])


# Forward Chaining
@bp.post('/forward')
def run_forward():
    data = request.get_json() or {}
    facts = data.get('facts', [])

    if not isinstance(facts, list):
        return jsonify(error='Facts must be a list.'), 400

    if not all(isinstance(f, str) and f.strip() for f in facts):
        return jsonify(error='Every fact must be a non-empty string.'), 400

    derived, fired, trace = forward_chain(facts)

    return jsonify({
        'algorithm': 'Forward Chaining',
        'initial_facts': facts,
        'derived_facts': sorted(derived),
        'fired_rules': fired,
        'trace': trace
    })


# Backward Chaining
@bp.post('/backward')
def run_backward():
    data = request.get_json() or {}

    goal = data.get('goal')
    facts = data.get('facts', [])

    if not isinstance(goal, str) or not goal.strip():
        return jsonify(error='A valid goal is required.'), 400

    if not isinstance(facts, list):
        return jsonify(error='Facts must be a list.'), 400

    if not all(isinstance(f, str) and f.strip() for f in facts):
        return jsonify(error='Every fact must be a non-empty string.'), 400

    result = backward_chain(goal.strip(), facts)

    return jsonify({
        'algorithm': 'Backward Chaining',
        'goal': goal,
        **result
    })


# Entailment
@bp.post('/entailment')
def run_entailment():
    data = request.get_json() or {}

    facts = data.get('facts', [])
    conclusion = data.get('conclusion')

    if not isinstance(facts, list):
        return jsonify(error='Facts must be a list.'), 400

    if not all(isinstance(f, str) and f.strip() for f in facts):
        return jsonify(error='Every fact must be a non-empty string.'), 400

    if not isinstance(conclusion, str) or not conclusion.strip():
        return jsonify(error='A valid conclusion is required.'), 400

    result = entails(facts, conclusion.strip())

    return jsonify({
        'algorithm': 'Entailment',
        'facts': facts,
        'conclusion': conclusion,
        'entailed': result
    })


# Resolution
@bp.post('/resolution')
def run_resolution():
    data = request.get_json() or {}

    # Complete resolution proof using CNF clauses
    if 'clauses' in data:
        clauses = data.get('clauses')

        if not isinstance(clauses, list):
            return jsonify(error='Clauses must be a list.'), 400

        for clause in clauses:
            if not isinstance(clause, list):
                return jsonify(error='Each clause must be a list.'), 400

            if not all(
                isinstance(literal, str)
                and literal.strip()
                and literal == literal.strip()
                for literal in clause
            ):
                return jsonify(error='Invalid propositional literal.'), 400

        goal = data.get('goal')

        if goal is not None:
            if not isinstance(goal, str) or not goal.strip():
                return jsonify(error='Goal must be a valid string.'), 400

            # Add the negated goal for resolution refutation
            clauses = clauses + [[negate(goal.strip())]]

        result = resolution_proof(clauses)

        response = {
            'algorithm': 'Resolution',
            'clauses': clauses,
            **result
        }

        if goal is not None:
            response['goal'] = goal
            response['entailed'] = result['unsatisfiable']

        return jsonify(response)

    # Single-step resolution (backward compatibility)
    clause1 = data.get('clause1', [])
    clause2 = data.get('clause2', [])

    if not isinstance(clause1, list) or not isinstance(clause2, list):
        return jsonify(error='Both clauses must be lists.'), 400

    literals = clause1 + clause2

    if not all(
        isinstance(x, str) and x.strip() and x == x.strip()
        for x in literals
    ):
        return jsonify(error='Invalid clause literal.'), 400

    if len(set(clause1)) != len(clause1):
        return jsonify(error='Clause 1 contains duplicates.'), 400

    if len(set(clause2)) != len(clause2):
        return jsonify(error='Clause 2 contains duplicates.'), 400

    if any(negate(x) in clause1 for x in clause1):
        return jsonify(error='Clause 1 contains contradictory literals.'), 400

    if any(negate(x) in clause2 for x in clause2):
        return jsonify(error='Clause 2 contains contradictory literals.'), 400

    result = resolve(clause1, clause2)

    return jsonify({
        'algorithm': 'Resolution',
        'clause1': clause1,
        'clause2': clause2,
        'resolvent': result,
        'resolvable': result is not None
    })