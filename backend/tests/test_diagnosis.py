from ai_engine.diagnosis_engine import diagnose
def test_diagnosis_result_shape(): assert {'fault','trace','recommendations'} <= diagnose(['overheating']).keys()
