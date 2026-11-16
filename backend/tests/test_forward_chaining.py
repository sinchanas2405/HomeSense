from ai_engine.inference import forward_chain
def test_forward_chain(): assert 'R2' in forward_chain(['frequent_disconnects'])[1]
