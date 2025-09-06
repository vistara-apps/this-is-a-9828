import React from 'react';
import { Clock, Star, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const MatchCard = ({ match, userPrediction, onSelect }) => {
  const confidenceColor = match.aiConfidence >= 80 ? 'text-green-400' : 
                         match.aiConfidence >= 60 ? 'text-yellow-400' : 
                         'text-orange-400';

  return (
    <div 
      className="prediction-card cursor-pointer hover:border border-primary/30"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-text-secondary">{match.league}</span>
          {match.aiConfidence >= 75 && (
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
          )}
        </div>
        <div className="flex items-center space-x-1 text-xs text-text-secondary">
          <Clock className="w-3 h-3" />
          <span>{format(new Date(match.startTime), 'HH:mm')}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
              {match.homeTeam.slice(0, 2)}
            </div>
            <span className="text-sm font-medium text-text-primary">{match.homeTeam}</span>
          </div>
          <span className="text-text-secondary text-xs">vs</span>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold">
              {match.awayTeam.slice(0, 2)}
            </div>
            <span className="text-sm font-medium text-text-primary">{match.awayTeam}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-xs text-text-secondary">AI Prediction</div>
            <div className="text-sm font-bold text-primary">{match.aiPrediction}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-text-secondary">Confidence</div>
            <div className={`text-sm font-bold ${confidenceColor}`}>{match.aiConfidence}%</div>
          </div>
        </div>

        {userPrediction ? (
          <div className="flex items-center space-x-1 text-accent">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs">Predicted</span>
          </div>
        ) : (
          <button className="betting-button-primary text-xs">
            Get Prediction
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;