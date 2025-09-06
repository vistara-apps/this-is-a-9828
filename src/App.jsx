import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import Header from './components/Header';
import MatchList from './components/MatchList';
import Performance from './components/Performance';
import SocialFeed from './components/SocialFeed';
import PredictionModal from './components/PredictionModal';
import NotificationCenter from './components/NotificationCenter';
import { usePaymentContext } from './hooks/usePaymentContext';
import { useUserStats } from './hooks/useUserStats';
import { useNotifications } from './hooks/useNotifications';
import { farcasterService } from './services/farcaster';
import { apiService } from './services/api';

function App() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState('matches');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [userFid, setUserFid] = useState(null); // Farcaster ID

  const { createSession } = usePaymentContext();
  const { stats: userStats, updateStats } = useUserStats();
  const {
    notifyPaymentSuccess,
    notifyPaymentFailed,
    notifyHighProbabilityMatch,
    showToast,
  } = useNotifications();

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
  };

  const handlePredictionPurchase = async (match, prediction) => {
    try {
      // Create payment session
      await createSession();
      
      const newPrediction = {
        id: Date.now(),
        matchId: match.id,
        matchName: `${match.homeTeam} vs ${match.awayTeam}`,
        league: match.league,
        prediction: prediction.prediction,
        confidence: prediction.confidence,
        timestamp: new Date().toISOString(),
        cost: 0.001,
        status: 'active'
      };
      
      // Save prediction to backend
      try {
        await apiService.savePrediction({
          ...newPrediction,
          userId: address,
        });
      } catch (saveError) {
        console.warn('Failed to save prediction to backend:', saveError);
        // Continue with local state update
      }
      
      // Update local state
      setPredictions(prev => [...prev, newPrediction]);
      updateStats(newPrediction);
      
      // Show success notification
      notifyPaymentSuccess(newPrediction.cost, match);
      showToast('Prediction purchased successfully!', 'success');
      
      // Check if this is a high probability match for notifications
      if (prediction.confidence >= 75) {
        notifyHighProbabilityMatch(match, prediction);
      }
      
      setSelectedMatch(null);
    } catch (error) {
      console.error('Payment failed:', error);
      notifyPaymentFailed(error, match);
      showToast('Payment failed. Please try again.', 'error');
    }
  };

  const handleSharePrediction = async (prediction, match) => {
    try {
      if (!userFid) {
        showToast('Connect your Farcaster account to share predictions', 'warning');
        return;
      }

      const result = await farcasterService.sharePrediction(prediction, match, userFid);
      
      if (result.success) {
        showToast('Prediction shared to Farcaster!', 'success');
        // Optionally open the cast in a new tab
        if (result.url) {
          window.open(result.url, '_blank');
        }
      }
    } catch (error) {
      console.error('Failed to share prediction:', error);
      showToast('Failed to share prediction', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Header 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            userStats={userStats}
          />
          <NotificationCenter />
        </div>
        
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

          {activeTab === 'social' && (
            <SocialFeed 
              userFid={userFid}
            />
          )}
        </main>

        {selectedMatch && (
          <PredictionModal
            match={selectedMatch}
            onClose={() => setSelectedMatch(null)}
            onPurchase={handlePredictionPurchase}
            onShare={handleSharePrediction}
          />
        )}
      </div>
    </div>
  );
}

export default App;
