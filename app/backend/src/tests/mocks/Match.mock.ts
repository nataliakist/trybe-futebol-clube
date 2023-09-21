const match = {
  "id": 1,
  "homeTeamId": 16,
  "homeTeamGoals": 1,
  "awayTeamId": 8,
  "awayTeamGoals": 1,
  "inProgress": false,
  "homeTeam": {
    "teamName": "São Paulo"
  },
  "awayTeam": {
    "teamName": "Grêmio"
  }
};

const matches = [match];

const matchesInProgress = [
  {
    "id": 41,
    "homeTeamId": 16,
    "homeTeamGoals": 2,
    "awayTeamId": 9,
    "awayTeamGoals": 0,
    "inProgress": true,
    "homeTeam": {
      "teamName": "São Paulo"
    },
    "awayTeam": {
      "teamName": "Internacional"
    }
  },
  {
    "id": 42,
    "homeTeamId": 6,
    "homeTeamGoals": 1,
    "awayTeamId": 1,
    "awayTeamGoals": 0,
    "inProgress": true,
    "homeTeam": {
      "teamName": "Ferroviária"
    },
    "awayTeam": {
      "teamName": "Avaí/Kindermann"
    }
  }
];

const matchesFinished = [
  {
    "id": 1,
    "homeTeamId": 16,
    "homeTeamGoals": 1,
    "awayTeamId": 8,
    "awayTeamGoals": 1,
    "inProgress": false,
    "homeTeam": {
      "teamName": "São Paulo"
    },
    "awayTeam": {
      "teamName": "Grêmio"
    }
  },
  {
    "id": 2,
    "homeTeamId": 9,
    "homeTeamGoals": 1,
    "awayTeamId": 14,
    "awayTeamGoals": 1,
    "inProgress": false,
    "homeTeam": {
      "teamName": "Internacional"
    },
    "awayTeam": {
      "teamName": "Santos"
    }
  }
]

const newMatch =  {
  id: 41,
  homeTeamId: 12,
  homeTeamGoals: 4,
  awayTeamId: 8,
  awayTeamGoals: 1,
  inProgress: 0,
};

const sendMatch = {
  homeTeamId: 12,
  homeTeamGoals: 4,
  awayTeamId: 8,
  awayTeamGoals: 1,
};

const sendEqualTeamsMatch = {
  homeTeamId: 12,
  homeTeamGoals: 4,
  awayTeamId: 12,
  awayTeamGoals: 1,
};

export {
  match,
  matches,
  matchesInProgress,
  matchesFinished,
  newMatch,
  sendMatch,
  sendEqualTeamsMatch,
}