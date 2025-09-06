import React, { useState } from 'react';
import Header from './components/Header';
import MatchList from './components/MatchList';
import Performance from './components/Performance';
import PredictionModal from './components/PredictionModal';
import { usePaymentContext } from './hooks/usePaymentContext';

function App() {
  const [activeTab, setActiveTab] = useState('matches');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [userStats, setUserStats] = useState({
    totalPredictions: 151,
    winRate: 63,
    accuracy: 68.3,
    winStreak: 5
  });

  const { createSession } = usePaymentContext();

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
  };

  const handlePredictionPurchase = async (match, prediction) => {
    try {
      await createSession();
      
      const newPrediction = {
        id: Date.now(),
        matchId: match.id,
        prediction,
        timestamp: new Date(),
        cost: 0.001,
        status: 'active'
      };
      
      setPredictions(prev => [...prev, newPrediction]);
      setUserStats(prev => ({
        ...prev,
        totalPredictions: prev.totalPredictions + 1
      }));
      
      setSelectedMatch(null);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-xl mx-auto px-4">
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          userStats={userStats}
        />
        
        <main className="pb-20">
          {activeTab === 'matches' && (
            <MatchList 
              onMatchSelect={handleMatchSelect}
              userPredictions={predictions}
            />
          )}
          
          {activeTab === 'performance' && (
            <Performance 
              stats={userStats}
              predictions={predictions}
            />
          )}
        </main>

        {selectedMatch && (
          <PredictionModal
            match={selectedMatch}
            onClose={() => setSelectedMatch(null)}
            onPurchase={handlePredictionPurchase}
          />
        )}
      </div>
    </div>
  );
}

export default App;