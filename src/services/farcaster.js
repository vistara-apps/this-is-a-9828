import axios from 'axios';

// Farcaster API Configuration
const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY || 'demo-key';
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2/farcaster';

// Create Neynar API client
export const neynarApi = axios.create({
  baseURL: NEYNAR_BASE_URL,
  headers: {
    'Authorization': `Bearer ${NEYNAR_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Farcaster service functions
export const farcasterService = {
  // Create a prediction frame
  async createPredictionFrame(prediction, match) {
    try {
      if (NEYNAR_API_KEY === 'demo-key') {
        // Return mock frame URL for demo
        return {
          frameUrl: `https://goalpredict.app/frames/prediction/${prediction.id}`,
          castHash: `0x${Date.now().toString(16)}`,
        };
      }

      const frameData = {
        text: `🎯 New AI Prediction: ${match.homeTeam} vs ${match.awayTeam}\n\n` +
              `📊 Prediction: ${prediction.prediction}\n` +
              `🎲 Confidence: ${prediction.confidence}%\n` +
              `⚽ League: ${match.league}\n\n` +
              `Check out the full analysis on GoalPredict!`,
        embeds: [{
          url: `https://goalpredict.app/frames/prediction/${prediction.id}`
        }]
      };

      const response = await neynarApi.post('/casts', frameData);
      return response.data;
    } catch (error) {
      console.error('Error creating prediction frame:', error);
      throw error;
    }
  },

  // Share prediction to Farcaster
  async sharePrediction(prediction, match, userFid) {
    try {
      if (NEYNAR_API_KEY === 'demo-key') {
        return {
          success: true,
          castHash: `0x${Date.now().toString(16)}`,
          url: `https://warpcast.com/~/conversations/0x${Date.now().toString(16)}`,
        };
      }

      const castText = this.formatPredictionCast(prediction, match);
      
      const castData = {
        text: castText,
        signer_uuid: userFid,
        embeds: [{
          url: `https://goalpredict.app/prediction/${prediction.id}`
        }]
      };

      const response = await neynarApi.post('/casts', castData);
      return {
        success: true,
        castHash: response.data.cast.hash,
        url: `https://warpcast.com/~/conversations/${response.data.cast.hash}`,
      };
    } catch (error) {
      console.error('Error sharing prediction:', error);
      throw error;
    }
  },

  // Get user's Farcaster profile
  async getUserProfile(fid) {
    try {
      if (NEYNAR_API_KEY === 'demo-key') {
        return {
          fid: fid,
          username: 'demo_user',
          display_name: 'Demo User',
          pfp_url: 'https://i.imgur.com/placeholder.jpg',
          follower_count: 150,
          following_count: 89,
        };
      }

      const response = await neynarApi.get(`/user/bulk?fids=${fid}`);
      return response.data.users[0];
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Get prediction feed from followed users
  async getPredictionFeed(userFid, limit = 10) {
    try {
      if (NEYNAR_API_KEY === 'demo-key') {
        return {
          casts: [
            {
              hash: '0x123',
              author: {
                fid: 456,
                username: 'crypto_analyst',
                display_name: 'Crypto Analyst',
                pfp_url: 'https://i.imgur.com/analyst.jpg',
              },
              text: '🎯 Arsenal vs Chelsea prediction: Arsenal Win (75% confidence)\n\nArsenal\'s home form has been exceptional with 8 wins in last 10 games. Chelsea struggling away from home.',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              reactions: { likes: 23, recasts: 8, replies: 5 },
              embeds: [{
                url: 'https://goalpredict.app/prediction/789'
              }]
            },
            {
              hash: '0x456',
              author: {
                fid: 789,
                username: 'football_guru',
                display_name: 'Football Guru',
                pfp_url: 'https://i.imgur.com/guru.jpg',
              },
              text: '⚽ Barcelona vs Real Madrid: Draw (68% confidence)\n\nEl Clasico is always unpredictable, but both teams are in great form. Expecting a high-scoring draw.',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              reactions: { likes: 45, recasts: 15, replies: 12 },
              embeds: [{
                url: 'https://goalpredict.app/prediction/790'
              }]
            }
          ]
        };
      }

      const response = await neynarApi.get(`/feed/following?fid=${userFid}&limit=${limit}&filter_type=embed_url&embed_url=goalpredict.app`);
      return response.data;
    } catch (error) {
      console.error('Error fetching prediction feed:', error);
      throw error;
    }
  },

  // Get trending predictions
  async getTrendingPredictions(limit = 20) {
    try {
      if (NEYNAR_API_KEY === 'demo-key') {
        return {
          casts: [
            {
              hash: '0x789',
              author: {
                fid: 101,
                username: 'top_predictor',
                display_name: 'Top Predictor',
                pfp_url: 'https://i.imgur.com/top.jpg',
              },
              text: '🔥 HOT PREDICTION: Manchester City vs Liverpool\n\nCity Win (82% confidence)\n\nCity\'s attacking prowess at home is unmatched. Liverpool missing key defenders.',
              timestamp: new Date(Date.now() - 1800000).toISOString(),
              reactions: { likes: 89, recasts: 34, replies: 28 },
              embeds: [{
                url: 'https://goalpredict.app/prediction/791'
              }]
            }
          ]
        };
      }

      const response = await neynarApi.get(`/feed/trending?limit=${limit}&filter_type=embed_url&embed_url=goalpredict.app`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending predictions:', error);
      throw error;
    }
  },

  // Format prediction for Farcaster cast
  formatPredictionCast(prediction, match) {
    const emoji = this.getPredictionEmoji(prediction.prediction);
    const confidenceLevel = this.getConfidenceLevel(prediction.confidence);
    
    return `${emoji} ${match.homeTeam} vs ${match.awayTeam}\n\n` +
           `📊 Prediction: ${prediction.prediction}\n` +
           `${confidenceLevel} Confidence: ${prediction.confidence}%\n` +
           `⚽ ${match.league}\n` +
           `💰 Cost: ${prediction.cost} USDC\n\n` +
           `Powered by AI analysis on GoalPredict 🎯`;
  },

  // Get emoji based on prediction type
  getPredictionEmoji(prediction) {
    if (prediction.toLowerCase().includes('win')) return '🏆';
    if (prediction.toLowerCase().includes('draw')) return '🤝';
    if (prediction.toLowerCase().includes('over')) return '⬆️';
    if (prediction.toLowerCase().includes('under')) return '⬇️';
    return '⚽';
  },

  // Get confidence level emoji
  getConfidenceLevel(confidence) {
    if (confidence >= 80) return '🔥';
    if (confidence >= 70) return '💪';
    if (confidence >= 60) return '👍';
    return '🤔';
  },

  // Create frame metadata for prediction sharing
  createFrameMetadata(prediction, match) {
    return {
      'fc:frame': 'vNext',
      'fc:frame:image': `https://goalpredict.app/api/frames/prediction/${prediction.id}/image`,
      'fc:frame:button:1': 'View Full Analysis',
      'fc:frame:button:1:action': 'link',
      'fc:frame:button:1:target': `https://goalpredict.app/prediction/${prediction.id}`,
      'fc:frame:button:2': 'Get My Prediction',
      'fc:frame:button:2:action': 'link',
      'fc:frame:button:2:target': 'https://goalpredict.app',
      'og:title': `${match.homeTeam} vs ${match.awayTeam} - AI Prediction`,
      'og:description': `${prediction.prediction} with ${prediction.confidence}% confidence`,
      'og:image': `https://goalpredict.app/api/frames/prediction/${prediction.id}/image`,
    };
  },
};

// Error handling interceptor
neynarApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.warn('Farcaster API rate limit exceeded');
    }
    return Promise.reject(error);
  }
);
