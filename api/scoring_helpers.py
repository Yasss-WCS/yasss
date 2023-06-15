def calculate_relative_placement(d):
    max_score = len(d)
    competitors = list(d.keys())
    judges = list(d[competitors[0]].keys())
    num_judges = len(judges)
    majority = num_judges // 2 + 1

    scores = {c: [0]*max_score for c in competitors}
    for c in competitors:
        for j in judges:
            placement = d[c][j]
            for i in range(int(placement)):
                scores[c][i] += 1

    results = []
    for c in competitors:
        cumulative = 0
        for i, s in enumerate(scores[c]):
            cumulative += s
            if cumulative >= majority:
                results.append((c, i, cumulative, sum([(i+1)*scores[c][i] for i in range(max_score)])))
                break

    results.sort(key=lambda x: (x[1], -x[2], x[3]))

    # Resolve ties by treating it as a two-competitor contest
    for i in range(len(results)-1):
        if results[i][1:] == results[i+1][1:]:
            c1 = results[i][0]
            c2 = results[i+1][0]
            c1_wins = sum([d[c1][j] < d[c2][j] for j in judges])
            c2_wins = sum([d[c1][j] > d[c2][j] for j in judges])
            if c1_wins < c2_wins:
                results[i], results[i+1] = results[i+1], results[i]
            elif c1_wins == c2_wins:  # If still tied, just order alphabetically
                if results[i][0] > results[i+1][0]:
                    results[i], results[i+1] = results[i+1], results[i]

    # Create final dictionary with placement
    d2 = {results[i][0]: i+1 for i in range(len(results))}
    return d2
