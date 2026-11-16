from ai_engine.diagnosis_engine import diagnose
def test_power_rule(): assert 'R1' in diagnose(['device_not_powering'])['matched_rules']
def test_unknown_symptom(): assert not diagnose(['unknown'])['matched_rules']
