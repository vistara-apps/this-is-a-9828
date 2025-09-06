import React, { useState } from 'react';
import { Filter, RefreshCw, Calendar, Trophy } from 'lucide-react';
import MatchCard from './MatchCard';
import { useMatches } from '../hooks/useMatches';

const MatchList = ({ onMatchSelect, userPredictions }) => {
  const [showFilters, setShowFilters] = useState(false);
  const {
    matches,
    loading,
    error,
    filters,
    updateFilters,
    refreshMatches,
    getUpcomingMatches,
    getLiveMatches,
  } = useMatches();

  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    const hours = timeframe === '24h' ? 24 : timeframe === '48h' ? 48 : 168; // 7 days
    // This would filter matches in the hook if we implemented time-based filtering
  };

  const handleLeagueFilter = (league) => {
    const newLeagues = filters.leagues.includes(league)
      ? filters.leagues.filter(l => l !== league)
      : [...filters.leagues, league];
    updateFilters({ leagues: newLeagues });
  };

  const availableLeagues = [...new Set(matches.map(match => match.league))];
  const upcomingMatches = matches.filter(match => match.status === 'upcoming');
  const liveMatches = getLiveMatches();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Loading Matches...</h2>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="prediction-card animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-600 rounded w-24"></div>
              </div>
              <div className="h-3 bg-gray-600 rounded w-16"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-600 rounded w-24"></div>
              </div>
              <div className="h-8 bg-gray-600 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="prediction-card text-center py-8">
        <div className="text-red-400 text-2xl mb-2">⚠️</div>
        <h3 className="text-text-primary font-medium mb-2">Error Loading Matches</h3>
        <p className="text-text-secondary text-sm mb-4">{error}</p>
        <button
          onClick={refreshMatches}
          className="betting-button-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Matches {liveMatches.length > 0 && `(${liveMatches.length} live)`}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshMatches}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-base"
            title="Refresh matches"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 transition-colors duration-base ${
              showFilters ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
            }`}
            title="Filter matches"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="prediction-card mb-4">
          <h3 className="text-text-primary font-medium mb-3">Filters</h3>
          
          {/* Timeframe Filter */}
          <div className="mb-4">
            <label className="text-text-secondary text-sm mb-2 block">Timeframe</label>
            <div className="flex space-x-2">
              {['24h', '48h', '7d'].map(timeframe => (
                <button
                  key={timeframe}
                  onClick={() => handleTimeframeChange(timeframe)}
                  className={`px-3 py-1 rounded text-sm transition-all duration-base ${
                    selectedTimeframe === timeframe
                      ? 'bg-accent text-white'
                      : 'bg-surface text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>

          {/* League Filter */}
          {availableLeagues.length > 0 && (
            <div>
              <label className="text-text-secondary text-sm mb-2 block">Leagues</label>
              <div className="flex flex-wrap gap-2">
                {availableLeagues.map(league => (
                  <button
                    key={league}
                    onClick={() => handleLeagueFilter(league)}
                    className={`px-3 py-1 rounded text-sm transition-all duration-base ${
                      filters.leagues.includes(league)
                        ? 'bg-accent text-white'
                        : 'bg-surface text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {league}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <h3 className="text-text-primary font-medium">Live Matches</h3>
          </div>
          <div className="space-y-3">
            {liveMatches.map(match => {
              const userPrediction = userPredictions.find(p => p.matchId === match.id);
              return (
                <MatchCard
                  key={match.id}
                  match={match}
                  userPrediction={userPrediction}
                  onSelect={() => onMatchSelect(match)}
                  isLive={true}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Matches */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="w-4 h-4 text-text-secondary" />
          <h3 className="text-text-primary font-medium">
            Upcoming Matches ({upcomingMatches.length})
          </h3>
        </div>
        
        {upcomingMatches.length === 0 ? (
          <div className="prediction-card text-center py-8">
            <Trophy className="w-8 h-8 text-text-secondary mx-auto mb-2" />
            <p className="text-text-secondary">No upcoming matches found</p>
            <p className="text-text-secondary text-sm mt-1">
              {filters.leagues.length > 0 
                ? 'Try adjusting your league filters'
                : 'Check back later for new matches'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingMatches.map(match => {
              const userPrediction = userPredictions.find(p => p.matchId === match.id);
              return (
                <MatchCard
                  key={match.id}
                  match={match}
                  userPrediction={userPrediction}
                  onSelect={() => onMatchSelect(match)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchList;
