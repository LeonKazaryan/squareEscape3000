import { useEffect, useState } from 'react';
import type { Player } from '../services/supabase';
import { api } from '../services/supabase';

export const useRealtimePlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await api.getPlayers();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    // Initial fetch
    void fetchPlayers();

    // Poll for updates every second
    const interval = setInterval(() => {
      void fetchPlayers();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return players;
}; 