from ai_engine.resolution import resolve
def test_resolution(): assert resolve(['A','B'],['!A','C'])==['B','C']
