import React, { useState, useEffect } from 'react';
import { X, Brain, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { useAIPrediction } from '../hooks/useAIPrediction';

const PredictionModal = ({ match, onClose, onPurchase }) => {
  const [loading, setLoading] = useState(false);
  const { generatePrediction } = useAIPrediction();
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    generateDetailedPrediction();
  }, [match]);

  const generateDetailedPrediction = async () => {
    setLoading(true);
    try {
      const analysis = await generatePrediction(match);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Failed to generate prediction:', error);
      setAiAnalysis({
        prediction: match.aiPrediction,
        confidence: match.aiConfidence,
        reasoning: "Unable to generate detailed analysis at this time.",
        keyFactors: ["Team form", "Head-to-head record", "Player availability"]
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    onPurchase(match, aiAnalysis?.prediction || match.aiPrediction);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface rounded-t-xl border-b border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">AI Prediction</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Match Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold mb-1">
                  {match.homeTeam.slice(0, 2)}
                </div>
                <span className="text-sm text-text-primary">{match.homeTeam}</span>
              </div>
              <span className="text-text-secondary">vs</span>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-sm font-bold mb-1">
                  {match.awayTeam.slice(0, 2)}
                </div>
                <span className="text-sm text-text-primary">{match.awayTeam}</span>
              </div>
            </div>
            <p className="text-xs text-text-secondary">{match.league}</p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Brain className="w-8 h-8 text-primary mx-auto mb-2 animate-pulse" />
              <p className="text-text-secondary">AI is analyzing the match...</p>
            </div>
          ) : (
            <>
              {/* AI Prediction */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-text-primary">AI Prediction</span>
                </div>
                <div className="text-xl font-bold text-primary mb-1">
                  {aiAnalysis?.prediction || match.aiPrediction}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-text-secondary">
                    Confidence: <span className="text-accent font-semibold">
                      {aiAnalysis?.confidence || match.aiConfidence}%
                    </span>
                  </span>
                </div>
              </div>

              {/* Analysis */}
              {aiAnalysis?.reasoning && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-text-primary flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Analysis</span>
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {aiAnalysis.reasoning}
                  </p>
                </div>
              )}

              {/* Key Factors */}
              {aiAnalysis?.keyFactors && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-text-primary flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Key Factors</span>
                  </h3>
                  <ul className="space-y-1">
                    {aiAnalysis.keyFactors.map((factor, index) => (
                      <li key={index} className="text-sm text-text-secondary flex items-start space-x-2">
                        <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pricing */}
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-text-primary">Premium Prediction</span>
                  </div>
                  <span className="text-lg font-bold text-accent">$0.001 USDC</span>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Get full AI analysis and detailed insights
                </p>
              </div>

              {/* Purchase Button */}
              <button
                onClick={handlePurchase}
                className="w-full betting-button-primary py-3 text-base font-semibold"
              >
                Purchase Prediction
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionModal;