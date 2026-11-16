from ai_engine.backward_chaining import backward_chain
def test_backward_chain(): assert backward_chain('Possible power supply or connection fault',['device_not_powering'])['entailed']
