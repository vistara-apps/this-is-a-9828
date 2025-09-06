import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

export const useNotifications = () => {
  const { address } = useAccount();
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({
    highProbabilityMatches: true,
    favoriteTeams: [],
    favoriteLeagues: ['Premier League', 'La Liga', 'Champions League'],
    minimumConfidence: 70,
    pushNotifications: true,
    emailNotifications: false,
    farcasterNotifications: true,
  });
  const [unreadCount, setUnreadCount] = useState(0);

  // Add a new notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Auto-remove notification after 10 seconds if it's a toast
    if (notification.type === 'toast') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 10000);
    }

    return newNotification.id;
  }, []);

  // Remove a notification
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notification => {
        if (notification.id === notificationId && !notification.read) {
          setUnreadCount(count => Math.max(0, count - 1));
          return { ...notification, read: true };
        }
        return notification;
      })
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Update notification preferences
  const updatePreferences = useCallback((newPreferences) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
    
    // Save to localStorage
    if (address) {
      localStorage.setItem(
        `goalpredict_notifications_${address}`,
        JSON.stringify({ ...preferences, ...newPreferences })
      );
    }
  }, [address, preferences]);

  // Check if a match meets notification criteria
  const shouldNotifyForMatch = useCallback((match, prediction) => {
    if (!preferences.highProbabilityMatches) return false;
    
    // Check confidence threshold
    if (prediction.confidence < preferences.minimumConfidence) return false;
    
    // Check favorite teams
    if (preferences.favoriteTeams.length > 0) {
      const hasFavoriteTeam = preferences.favoriteTeams.some(team => 
        match.homeTeam.includes(team) || match.awayTeam.includes(team)
      );
      if (hasFavoriteTeam) return true;
    }
    
    // Check favorite leagues
    if (preferences.favoriteLeagues.includes(match.league)) return true;
    
    return false;
  }, [preferences]);

  // Create different types of notifications
  const notifyHighProbabilityMatch = useCallback((match, prediction) => {
    if (!shouldNotifyForMatch(match, prediction)) return;

    addNotification({
      type: 'match_alert',
      title: '🎯 High Probability Match',
      message: `${match.homeTeam} vs ${match.awayTeam}: ${prediction.prediction} (${prediction.confidence}% confidence)`,
      data: { match, prediction },
      priority: 'high',
    });
  }, [addNotification, shouldNotifyForMatch]);

  const notifyPredictionResult = useCallback((prediction, result) => {
    const isWin = result === 'won';
    addNotification({
      type: 'prediction_result',
      title: isWin ? '🎉 Prediction Won!' : '😔 Prediction Lost',
      message: `Your prediction for ${prediction.matchName} ${isWin ? 'was correct' : 'was incorrect'}`,
      data: { prediction, result },
      priority: isWin ? 'high' : 'normal',
    });
  }, [addNotification]);

  const notifyPaymentSuccess = useCallback((amount, match) => {
    addNotification({
      type: 'payment_success',
      title: '✅ Payment Successful',
      message: `Paid ${amount} USDC for ${match.homeTeam} vs ${match.awayTeam} prediction`,
      data: { amount, match },
      priority: 'normal',
    });
  }, [addNotification]);

  const notifyPaymentFailed = useCallback((error, match) => {
    addNotification({
      type: 'payment_failed',
      title: '❌ Payment Failed',
      message: `Failed to purchase prediction for ${match.homeTeam} vs ${match.awayTeam}`,
      data: { error, match },
      priority: 'high',
    });
  }, [addNotification]);

  const notifyNewFeature = useCallback((feature) => {
    addNotification({
      type: 'feature_announcement',
      title: '🚀 New Feature Available',
      message: feature.description,
      data: { feature },
      priority: 'normal',
    });
  }, [addNotification]);

  const showToast = useCallback((message, type = 'info') => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };

    addNotification({
      type: 'toast',
      title: `${icons[type]} ${message}`,
      priority: type === 'error' ? 'high' : 'normal',
    });
  }, [addNotification]);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (address) {
      const saved = localStorage.getItem(`goalpredict_notifications_${address}`);
      if (saved) {
        try {
          const savedPreferences = JSON.parse(saved);
          setPreferences(prev => ({ ...prev, ...savedPreferences }));
        } catch (error) {
          console.error('Error loading notification preferences:', error);
        }
      }
    }
  }, [address]);

  // Request notification permission
  useEffect(() => {
    if (preferences.pushNotifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [preferences.pushNotifications]);

  // Send browser notification for high priority alerts
  useEffect(() => {
    notifications.forEach(notification => {
      if (
        notification.priority === 'high' &&
        !notification.read &&
        preferences.pushNotifications &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: `goalpredict-${notification.id}`,
        });
      }
    });
  }, [notifications, preferences.pushNotifications]);

  return {
    notifications,
    unreadCount,
    preferences,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    updatePreferences,
    // Specific notification methods
    notifyHighProbabilityMatch,
    notifyPredictionResult,
    notifyPaymentSuccess,
    notifyPaymentFailed,
    notifyNewFeature,
    showToast,
  };
};
