import React from 'react';
import MatchCard from './MatchCard';
import { mockMatches } from '../data/mockData';

const MatchList = ({ onMatchSelect, userPredictions }) => {
  const upcomingMatches = mockMatches.filter(match => match.status === 'upcoming');

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Upcoming Matches</h2>
      
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
  );
};

export default MatchList;