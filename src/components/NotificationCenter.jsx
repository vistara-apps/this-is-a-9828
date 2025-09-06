import React, { useState } from 'react';
import { Bell, X, Settings, Check, CheckCheck, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../hooks/useNotifications';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const {
    notifications,
    unreadCount,
    preferences,
    markAsRead,
    markAllAsRead,
    clearAll,
    removeNotification,
    updatePreferences,
  } = useNotifications();

  const getNotificationIcon = (type) => {
    const icons = {
      match_alert: '🎯',
      prediction_result: '🏆',
      payment_success: '✅',
      payment_failed: '❌',
      feature_announcement: '🚀',
      toast: 'ℹ️',
    };
    return icons[type] || '📢';
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'border-l-red-500';
    if (type === 'prediction_result') return 'border-l-green-500';
    if (type === 'payment_success') return 'border-l-blue-500';
    return 'border-l-gray-500';
  };

  const NotificationItem = ({ notification }) => (
    <div
      className={`p-4 border-l-4 ${getNotificationColor(notification.type, notification.priority)} ${
        notification.read ? 'bg-surface opacity-75' : 'bg-surface'
      } hover:bg-opacity-80 transition-all duration-base`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="text-lg">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className={`text-sm font-medium ${
                notification.read ? 'text-text-secondary' : 'text-text-primary'
              }`}>
                {notification.title}
              </h4>
              <div className="flex items-center space-x-2">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-accent hover:text-accent-dark p-1"
                    title="Mark as read"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-text-secondary hover:text-red-400 p-1"
                  title="Remove notification"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
            {notification.message && (
              <p className={`text-sm ${
                notification.read ? 'text-text-secondary' : 'text-text-primary'
              } mb-2`}>
                {notification.message}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
              </span>
              {!notification.read && (
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Notification Settings</h3>
        <button
          onClick={() => setShowSettings(false)}
          className="text-text-secondary hover:text-text-primary"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-text-primary font-medium">High Probability Matches</label>
            <p className="text-text-secondary text-sm">Get notified about matches with high confidence predictions</p>
          </div>
          <input
            type="checkbox"
            checked={preferences.highProbabilityMatches}
            onChange={(e) => updatePreferences({ highProbabilityMatches: e.target.checked })}
            className="w-4 h-4 text-accent bg-surface border-gray-600 rounded focus:ring-accent"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-text-primary font-medium">Push Notifications</label>
            <p className="text-text-secondary text-sm">Receive browser notifications</p>
          </div>
          <input
            type="checkbox"
            checked={preferences.pushNotifications}
            onChange={(e) => updatePreferences({ pushNotifications: e.target.checked })}
            className="w-4 h-4 text-accent bg-surface border-gray-600 rounded focus:ring-accent"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-text-primary font-medium">Farcaster Notifications</label>
            <p className="text-text-secondary text-sm">Share notifications to Farcaster</p>
          </div>
          <input
            type="checkbox"
            checked={preferences.farcasterNotifications}
            onChange={(e) => updatePreferences({ farcasterNotifications: e.target.checked })}
            className="w-4 h-4 text-accent bg-surface border-gray-600 rounded focus:ring-accent"
          />
        </div>

        <div>
          <label className="text-text-primary font-medium mb-2 block">Minimum Confidence</label>
          <input
            type="range"
            min="50"
            max="95"
            step="5"
            value={preferences.minimumConfidence}
            onChange={(e) => updatePreferences({ minimumConfidence: parseInt(e.target.value) })}
            className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-text-secondary text-sm mt-1">
            <span>50%</span>
            <span className="text-accent font-medium">{preferences.minimumConfidence}%</span>
            <span>95%</span>
          </div>
        </div>

        <div>
          <label className="text-text-primary font-medium mb-2 block">Favorite Leagues</label>
          <div className="space-y-2">
            {['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1', 'Champions League'].map(league => (
              <label key={league} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preferences.favoriteLeagues.includes(league)}
                  onChange={(e) => {
                    const newLeagues = e.target.checked
                      ? [...preferences.favoriteLeagues, league]
                      : preferences.favoriteLeagues.filter(l => l !== league);
                    updatePreferences({ favoriteLeagues: newLeagues });
                  }}
                  className="w-4 h-4 text-accent bg-surface border-gray-600 rounded focus:ring-accent"
                />
                <span className="text-text-primary text-sm">{league}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-secondary hover:text-text-primary transition-colors duration-base"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-bg border border-surface rounded-lg shadow-modal z-50 max-h-96 overflow-hidden">
          {showSettings ? (
            <NotificationSettings />
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b border-surface">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">
                    Notifications {unreadCount > 0 && `(${unreadCount})`}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {notifications.length > 0 && (
                      <>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-accent hover:text-accent-dark p-1"
                            title="Mark all as read"
                          >
                            <CheckCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={clearAll}
                          className="text-text-secondary hover:text-red-400 p-1"
                          title="Clear all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setShowSettings(true)}
                      className="text-text-secondary hover:text-text-primary p-1"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-text-secondary hover:text-text-primary p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-8 h-8 text-text-secondary mx-auto mb-2" />
                    <p className="text-text-secondary">No notifications yet</p>
                    <p className="text-text-secondary text-sm mt-1">
                      You'll see updates about your predictions here
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-surface">
                    {notifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter;
