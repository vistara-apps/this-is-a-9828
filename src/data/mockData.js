export const mockMatches = [
  {
    id: 1,
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    league: "Premier League",
    startTime: "2024-01-20T15:00:00Z",
    status: "upcoming",
    aiPrediction: "Manchester United Win",
    aiConfidence: 73,
    odds: {
      home: 2.10,
      draw: 3.20,
      away: 2.85
    }
  },
  {
    id: 2,
    homeTeam: "Barcelona",
    awayTeam: "Real Madrid",
    league: "La Liga",
    startTime: "2024-01-20T18:30:00Z",
    status: "upcoming",
    aiPrediction: "Draw",
    aiConfidence: 65,
    odds: {
      home: 2.40,
      draw: 3.10,
      away: 2.60
    }
  },
  {
    id: 3,
    homeTeam: "Bayern Munich",
    awayTeam: "Dortmund",
    league: "Bundesliga", 
    startTime: "2024-01-21T14:30:00Z",
    status: "upcoming",
    aiPrediction: "Bayern Munich Win",
    aiConfidence: 81,
    odds: {
      home: 1.85,
      draw: 3.40,
      away: 3.20
    }
  },
  {
    id: 4,
    homeTeam: "PSG",
    awayTeam: "Marseille",
    league: "Ligue 1",
    startTime: "2024-01-21T20:00:00Z",
    status: "upcoming",
    aiPrediction: "PSG Win",
    aiConfidence: 78,
    odds: {
      home: 1.95,
      draw: 3.30,
      away: 3.10
    }
  },
  {
    id: 5,
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    league: "Premier League",
    startTime: "2024-01-22T16:00:00Z",
    status: "upcoming",
    aiPrediction: "Arsenal Win",
    aiConfidence: 69,
    odds: {
      home: 2.20,
      draw: 3.15,
      away: 2.90
    }
  }
];

export const mockUserPredictions = [
  {
    id: 1,
    matchId: 1,
    prediction: "Manchester United Win",
    confidence: 73,
    timestamp: "2024-01-19T10:30:00Z",
    cost: 0.001,
    status: "active"
  }
];