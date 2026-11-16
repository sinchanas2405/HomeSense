def state_space(start, transitions, max_steps=50):
    seen={start}; frontier=[start]; order=[]
    while frontier and len(order)<max_steps:
        state=frontier.pop(0); order.append(state)
        for nxt in transitions.get(state,[]):
            if nxt not in seen: seen.add(nxt);frontier.append(nxt)
    return order
