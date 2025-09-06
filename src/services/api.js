import axios from 'axios';

// API Configuration
const SPORTMONKS_API_KEY = import.meta.env.VITE_SPORTMONKS_API_KEY || 'demo-key';
const SPORTMONKS_BASE_URL = 'https://api.sportmonks.com/v3/football';

// Create API clients
export const sportmonksApi = axios.create({
  baseURL: SPORTMONKS_BASE_URL,
  headers: {
    'Authorization': `Bearer ${SPORTMONKS_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.goalpredict.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sportmonks API endpoints
export const sportmonksEndpoints = {
  fixtures: '/fixtures',
  predictions: '/predictions/probabilities/fixtures',
  teams: '/teams',
  leagues: '/leagues',
  standings: '/standings',
  statistics: '/statistics',
};

// API service functions
export const apiService = {
  // Fetch live matches
  async getUpcomingMatches(date = null, leagues = []) {
    try {
      if (SPORTMONKS_API_KEY === 'demo-key') {
        // Return mock data when no API key is provided
        const { mockMatches } = await import('../data/mockData.js');
        return { data: mockMatches };
      }

      const params = {
        include: 'teams,league,predictions',
        filter: 'fixtureStartingAt',
        ...(date && { date }),
        ...(leagues.length > 0 && { leagues: leagues.join(',') }),
      };

      const response = await sportmonksApi.get(sportmonksEndpoints.fixtures, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      // Fallback to mock data on error
      const { mockMatches } = await import('../data/mockData.js');
      return { data: mockMatches };
    }
  },

  // Fetch match predictions
  async getMatchPredictions(fixtureId) {
    try {
      if (SPORTMONKS_API_KEY === 'demo-key') {
        return {
          data: {
            predictions: {
              home_win: 0.45,
              draw: 0.25,
              away_win: 0.30,
              over_2_5: 0.65,
              under_2_5: 0.35,
              both_teams_score: 0.70,
            }
          }
        };
      }

      const response = await sportmonksApi.get(`${sportmonksEndpoints.predictions}/${fixtureId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      throw error;
    }
  },

  // Fetch team statistics
  async getTeamStats(teamId, season = null) {
    try {
      if (SPORTMONKS_API_KEY === 'demo-key') {
        return {
          data: {
            goals_for: 45,
            goals_against: 23,
            wins: 15,
            draws: 8,
            losses: 5,
            clean_sheets: 12,
          }
        };
      }

      const params = {
        include: 'statistics',
        ...(season && { season }),
      };

      const response = await sportmonksApi.get(`/teams/${teamId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching team stats:', error);
      throw error;
    }
  },

  // Fetch leagues
  async getLeagues() {
    try {
      if (SPORTMONKS_API_KEY === 'demo-key') {
        return {
          data: [
            { id: 1, name: 'Premier League', country: 'England' },
            { id: 2, name: 'La Liga', country: 'Spain' },
            { id: 3, name: 'Bundesliga', country: 'Germany' },
            { id: 4, name: 'Serie A', country: 'Italy' },
            { id: 5, name: 'Ligue 1', country: 'France' },
          ]
        };
      }

      const response = await sportmonksApi.get(sportmonksEndpoints.leagues);
      return response.data;
    } catch (error) {
      console.error('Error fetching leagues:', error);
      throw error;
    }
  },

  // Save user prediction
  async savePrediction(predictionData) {
    try {
      const response = await baseApi.post('/predictions', predictionData);
      return response.data;
    } catch (error) {
      console.error('Error saving prediction:', error);
      // Mock successful save for demo
      return {
        id: Date.now(),
        ...predictionData,
        timestamp: new Date().toISOString(),
        status: 'active'
      };
    }
  },

  // Get user predictions
  async getUserPredictions(userId) {
    try {
      const response = await baseApi.get(`/users/${userId}/predictions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user predictions:', error);
      // Return mock data
      const { mockUserPredictions } = await import('../data/mockData.js');
      return mockUserPredictions;
    }
  },

  // Get user statistics
  async getUserStats(userId) {
    try {
      const response = await baseApi.get(`/users/${userId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Return mock stats
      return {
        totalPredictions: 151,
        winRate: 63,
        accuracy: 68.3,
        winStreak: 5,
        totalEarnings: 0.045,
        bestStreak: 8,
        favoriteLeague: 'Premier League',
        successfulPredictions: 95,
      };
    }
  },
};

// Error handling interceptor
sportmonksApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.warn('API rate limit exceeded, falling back to mock data');
    }
    return Promise.reject(error);
  }
);

baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
