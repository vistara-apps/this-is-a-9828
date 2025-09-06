import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Repeat2, ExternalLink, User, Clock } from 'lucide-react';
import { farcasterService } from '../services/farcaster';
import { formatDistanceToNow } from 'date-fns';

const SocialFeed = ({ userFid }) => {
  const [feed, setFeed] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('following');

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        
        const [followingFeed, trendingFeed] = await Promise.all([
          farcasterService.getPredictionFeed(userFid),
          farcasterService.getTrendingPredictions()
        ]);

        setFeed(followingFeed.casts || []);
        setTrending(trendingFeed.casts || []);
      } catch (error) {
        console.error('Error fetching social feed:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userFid) {
      fetchFeed();
    }
  }, [userFid]);

  const handleCastClick = (cast) => {
    if (cast.embeds && cast.embeds[0]?.url) {
      window.open(cast.embeds[0].url, '_blank');
    }
  };

  const handleProfileClick = (author) => {
    window.open(`https://warpcast.com/${author.username}`, '_blank');
  };

  const CastCard = ({ cast }) => (
    <div className="prediction-card hover:cursor-pointer" onClick={() => handleCastClick(cast)}>
      <div className="flex items-start space-x-3">
        <div 
          className="w-10 h-10 rounded-full bg-surface flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleProfileClick(cast.author);
          }}
        >
          {cast.author.pfp_url ? (
            <img 
              src={cast.author.pfp_url} 
              alt={cast.author.display_name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-text-secondary" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span 
              className="font-medium text-text-primary cursor-pointer hover:text-accent"
              onClick={(e) => {
                e.stopPropagation();
                handleProfileClick(cast.author);
              }}
            >
              {cast.author.display_name}
            </span>
            <span className="text-text-secondary text-sm">@{cast.author.username}</span>
            <div className="flex items-center text-text-secondary text-sm">
              <Clock className="w-3 h-3 mr-1" />
              {formatDistanceToNow(new Date(cast.timestamp), { addSuffix: true })}
            </div>
          </div>
          
          <p className="text-text-primary text-sm mb-3 whitespace-pre-wrap">
            {cast.text}
          </p>
          
          {cast.embeds && cast.embeds[0]?.url && (
            <div className="flex items-center text-accent text-sm mb-3">
              <ExternalLink className="w-3 h-3 mr-1" />
              <span>View full prediction</span>
            </div>
          )}
          
          <div className="flex items-center space-x-6 text-text-secondary">
            <div className="flex items-center space-x-1 hover:text-red-400 cursor-pointer">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{cast.reactions?.likes || 0}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-green-400 cursor-pointer">
              <Repeat2 className="w-4 h-4" />
              <span className="text-sm">{cast.reactions?.recasts || 0}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{cast.reactions?.replies || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex space-x-1 bg-surface rounded-lg p-1 mb-6">
          <div className="flex-1 py-2 px-3 rounded-md bg-primary text-white text-sm font-medium text-center">
            Loading...
          </div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="prediction-card animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-600"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-1/3"></div>
                <div className="h-3 bg-gray-600 rounded w-full"></div>
                <div className="h-3 bg-gray-600 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const currentFeed = activeTab === 'following' ? feed : trending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Community Predictions</h2>
      </div>

      {/* Tab Navigation */}
      <nav className="flex space-x-1 bg-surface rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('following')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-base ${
            activeTab === 'following'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Following ({feed.length})
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-base ${
            activeTab === 'trending'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Trending ({trending.length})
        </button>
      </nav>

      {/* Feed Content */}
      {currentFeed.length === 0 ? (
        <div className="prediction-card text-center py-8">
          <div className="text-text-secondary mb-2">
            {activeTab === 'following' ? '👥' : '🔥'}
          </div>
          <p className="text-text-secondary">
            {activeTab === 'following' 
              ? 'No predictions from people you follow yet. Follow some predictors on Farcaster!'
              : 'No trending predictions right now. Check back later!'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentFeed.map((cast) => (
            <CastCard key={cast.hash} cast={cast} />
          ))}
        </div>
      )}

      {/* Connect to Farcaster CTA */}
      {!userFid && (
        <div className="prediction-card text-center py-6 border-2 border-dashed border-gray-600">
          <div className="text-accent text-2xl mb-2">🎯</div>
          <h3 className="text-text-primary font-medium mb-2">Connect to Farcaster</h3>
          <p className="text-text-secondary text-sm mb-4">
            Connect your Farcaster account to see predictions from the community and share your own!
          </p>
          <button className="betting-button-primary">
            Connect Farcaster
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
