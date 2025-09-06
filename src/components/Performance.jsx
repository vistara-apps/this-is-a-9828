import React from 'react';
import { TrendingUp, Target, Trophy, Zap } from 'lucide-react';

const Performance = ({ stats, predictions }) => {
  const recentPredictions = predictions.slice(-5);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Performance Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span className="text-text-secondary text-sm">Total Predictions</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{stats.totalPredictions}</div>
          <div className="text-xs text-green-400">+12 this week</div>
        </div>

        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-accent" />
            <span className="text-text-secondary text-sm">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{stats.accuracy}%</div>
          <div className="text-xs text-green-400">+2.1% vs last month</div>
        </div>

        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="w-5 h-5 text-accent" />
            <span className="text-text-secondary text-sm">Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{stats.winRate}%</div>
          <div className="text-xs text-green-400">Above average</div>
        </div>

        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-5 h-5 text-accent" />
            <span className="text-text-secondary text-sm">Win Streak</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{stats.winStreak}</div>
          <div className="text-xs text-yellow-400">Current streak</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface rounded-lg p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Recent Predictions</h3>
        
        {recentPredictions.length > 0 ? (
          <div className="space-y-3">
            {recentPredictions.map(prediction => (
              <div key={prediction.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                <div>
                  <div className="text-sm text-text-primary">{prediction.prediction}</div>
                  <div className="text-xs text-text-secondary">
                    {new Date(prediction.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-accent">${prediction.cost}</div>
                  <div className={`text-xs ${prediction.status === 'won' ? 'text-green-400' : 
                                             prediction.status === 'lost' ? 'text-red-400' : 
                                             'text-yellow-400'}`}>
                    {prediction.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-text-secondary text-sm">No predictions yet</p>
            <p className="text-text-secondary text-xs">Start predicting to see your performance</p>
          </div>
        )}
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-surface rounded-lg p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Weekly Performance</h3>
        <div className="h-32 bg-gray-800 rounded-md flex items-center justify-center">
          <span className="text-text-secondary text-sm">Chart visualization coming soon</span>
        </div>
      </div>
    </div>
  );
};

export default Performance;