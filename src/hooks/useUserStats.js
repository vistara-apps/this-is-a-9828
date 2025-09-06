import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { apiService } from '../services/api';

export const useUserStats = () => {
  const { address } = useAccount();
  const [stats, setStats] = useState({
    totalPredictions: 0,
    winRate: 0,
    accuracy: 0,
    winStreak: 0,
    totalEarnings: 0,
    bestStreak: 0,
    favoriteLeague: '',
    successfulPredictions: 0,
    recentPredictions: [],
    monthlyStats: [],
    leagueStats: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserStats = useCallback(async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [userStats, userPredictions] = await Promise.all([
        apiService.getUserStats(address),
        apiService.getUserPredictions(address)
      ]);

      // Calculate additional stats from predictions
      const enhancedStats = calculateEnhancedStats(userStats, userPredictions);
      
      setStats(enhancedStats);
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(err.message || 'Failed to fetch user statistics');
      
      // Set default stats on error
      setStats({
        totalPredictions: 0,
        winRate: 0,
        accuracy: 0,
        winStreak: 0,
        totalEarnings: 0,
        bestStreak: 0,
        favoriteLeague: '',
        successfulPredictions: 0,
        recentPredictions: [],
        monthlyStats: [],
        leagueStats: {},
      });
    } finally {
      setLoading(false);
    }
  }, [address]);

  const calculateEnhancedStats = (baseStats, predictions) => {
    if (!predictions || predictions.length === 0) {
      return {
        ...baseStats,
        recentPredictions: [],
        monthlyStats: [],
        leagueStats: {},
      };
    }

    // Calculate recent predictions (last 10)
    const recentPredictions = predictions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    // Calculate monthly stats for the last 6 months
    const monthlyStats = calculateMonthlyStats(predictions);

    // Calculate league-specific stats
    const leagueStats = calculateLeagueStats(predictions);

    // Calculate current win streak
    const currentWinStreak = calculateCurrentWinStreak(predictions);

    return {
      ...baseStats,
      winStreak: currentWinStreak,
      recentPredictions,
      monthlyStats,
      leagueStats,
    };
  };

  const calculateMonthlyStats = (predictions) => {
    const monthlyData = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[key] = {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        total: 0,
        wins: 0,
        winRate: 0,
        earnings: 0,
      };
    }

    // Process predictions
    predictions.forEach(prediction => {
      const date = new Date(prediction.timestamp);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthlyData[key]) {
        monthlyData[key].total++;
        if (prediction.status === 'won') {
          monthlyData[key].wins++;
          monthlyData[key].earnings += prediction.payout || 0;
        }
        monthlyData[key].winRate = Math.round((monthlyData[key].wins / monthlyData[key].total) * 100);
      }
    });

    return Object.values(monthlyData).reverse();
  };

  const calculateLeagueStats = (predictions) => {
    const leagueData = {};

    predictions.forEach(prediction => {
      const league = prediction.league || 'Unknown';
      
      if (!leagueData[league]) {
        leagueData[league] = {
          total: 0,
          wins: 0,
          winRate: 0,
          earnings: 0,
        };
      }

      leagueData[league].total++;
      if (prediction.status === 'won') {
        leagueData[league].wins++;
        leagueData[league].earnings += prediction.payout || 0;
      }
      leagueData[league].winRate = Math.round((leagueData[league].wins / leagueData[league].total) * 100);
    });

    return leagueData;
  };

  const calculateCurrentWinStreak = (predictions) => {
    if (!predictions || predictions.length === 0) return 0;

    const sortedPredictions = predictions
      .filter(p => p.status === 'won' || p.status === 'lost')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    let streak = 0;
    for (const prediction of sortedPredictions) {
      if (prediction.status === 'won') {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const updateStats = useCallback((newPrediction) => {
    setStats(prevStats => ({
      ...prevStats,
      totalPredictions: prevStats.totalPredictions + 1,
      recentPredictions: [newPrediction, ...prevStats.recentPredictions.slice(0, 9)],
    }));
  }, []);

  const getStatsByTimeframe = useCallback((timeframe = '30d') => {
    const now = new Date();
    let startDate;

    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        return stats;
    }

    const filteredPredictions = stats.recentPredictions.filter(
      prediction => new Date(prediction.timestamp) >= startDate
    );

    const total = filteredPredictions.length;
    const wins = filteredPredictions.filter(p => p.status === 'won').length;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

    return {
      totalPredictions: total,
      successfulPredictions: wins,
      winRate,
      accuracy: winRate, // Simplified for now
    };
  }, [stats]);

  // Fetch stats when address changes
  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  // Auto-refresh stats every 10 minutes
  useEffect(() => {
    if (!address) return;

    const interval = setInterval(() => {
      fetchUserStats();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [address, fetchUserStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchUserStats,
    updateStats,
    getStatsByTimeframe,
  };
};
