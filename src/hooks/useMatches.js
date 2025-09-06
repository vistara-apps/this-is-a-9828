import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const useMatches = (initialFilters = {}) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: null,
    leagues: [],
    status: 'upcoming',
    ...initialFilters
  });

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getUpcomingMatches(
        filters.date,
        filters.leagues
      );
      
      let filteredMatches = response.data || [];
      
      // Apply status filter
      if (filters.status) {
        filteredMatches = filteredMatches.filter(match => 
          match.status === filters.status
        );
      }
      
      // Sort by start time
      filteredMatches.sort((a, b) => 
        new Date(a.startTime) - new Date(b.startTime)
      );
      
      setMatches(filteredMatches);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(err.message || 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refreshMatches = useCallback(() => {
    fetchMatches();
  }, [fetchMatches]);

  const getMatchById = useCallback((matchId) => {
    return matches.find(match => match.id === matchId);
  }, [matches]);

  const getMatchesByLeague = useCallback((league) => {
    return matches.filter(match => match.league === league);
  }, [matches]);

  const getUpcomingMatches = useCallback((hours = 24) => {
    const now = new Date();
    const futureTime = new Date(now.getTime() + (hours * 60 * 60 * 1000));
    
    return matches.filter(match => {
      const matchTime = new Date(match.startTime);
      return matchTime >= now && matchTime <= futureTime;
    });
  }, [matches]);

  const getLiveMatches = useCallback(() => {
    return matches.filter(match => match.status === 'live');
  }, [matches]);

  // Auto-refresh matches every 5 minutes
  useEffect(() => {
    fetchMatches();
    
    const interval = setInterval(() => {
      fetchMatches();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [fetchMatches]);

  return {
    matches,
    loading,
    error,
    filters,
    updateFilters,
    refreshMatches,
    getMatchById,
    getMatchesByLeague,
    getUpcomingMatches,
    getLiveMatches,
  };
};
