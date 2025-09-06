import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TrendingUp, Trophy, Target } from 'lucide-react';

const Header = ({ activeTab, setActiveTab, userStats }) => {
  return (
    <header className="py-4 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">GoalPredict</h1>
            <p className="text-xs text-text-secondary">AI-powered predictions</p>
          </div>
        </div>
        <ConnectButton />
      </div>

      {/* Navigation */}
      <nav className="flex space-x-1 bg-surface rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-base ${
            activeTab === 'matches'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Matches
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-base ${
            activeTab === 'performance'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Performance
        </button>
      </nav>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-accent mr-1" />
            <span className="text-lg font-bold text-text-primary">{userStats.totalPredictions}</span>
          </div>
          <p className="text-xs text-text-secondary">Predictions</p>
        </div>
        <div className="bg-surface rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Trophy className="w-4 h-4 text-accent mr-1" />
            <span className="text-lg font-bold text-text-primary">{userStats.winRate}%</span>
          </div>
          <p className="text-xs text-text-secondary">Win Rate</p>
        </div>
        <div className="bg-surface rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-accent mr-1" />
            <span className="text-lg font-bold text-text-primary">{userStats.accuracy}%</span>
          </div>
          <p className="text-xs text-text-secondary">Accuracy</p>
        </div>
      </div>
    </header>
  );
};

export default Header;