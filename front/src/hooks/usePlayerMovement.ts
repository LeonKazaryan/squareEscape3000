import { useCallback, useEffect } from 'react';
import { GAME_CONFIG, api } from '../services/supabase';
import type { Player } from '../services/supabase';

export const usePlayerMovement = (playerId: string, initialPosition: { x: number; y: number }) => {
  const updatePosition = useCallback(async (newX: number, newY: number) => {
    try {
      await api.updatePlayerPosition(playerId, newX, newY);
    } catch (error) {
      console.error('Error updating position:', error);
    }
  }, [playerId]);

  const handleKeyPress = useCallback(async (event: KeyboardEvent) => {
    const { key } = event;
    
    try {
      const players = await api.getPlayers();
      const currentPlayer = players.find((p: Player) => p.id === playerId);
      if (!currentPlayer) return;

      let newX = currentPlayer.x;
      let newY = currentPlayer.y;

      switch (key.toLowerCase()) {
        case 'w':
          newY = Math.max(0, currentPlayer.y - GAME_CONFIG.MOVEMENT_SPEED);
          break;
        case 's':
          newY = Math.min(GAME_CONFIG.HEIGHT - GAME_CONFIG.PLAYER_SIZE, currentPlayer.y + GAME_CONFIG.MOVEMENT_SPEED);
          break;
        case 'a':
          newX = Math.max(0, currentPlayer.x - GAME_CONFIG.MOVEMENT_SPEED);
          break;
        case 'd':
          newX = Math.min(GAME_CONFIG.WIDTH - GAME_CONFIG.PLAYER_SIZE, currentPlayer.x + GAME_CONFIG.MOVEMENT_SPEED);
          break;
        default:
          return;
      }

      if (newX !== currentPlayer.x || newY !== currentPlayer.y) {
        await updatePosition(newX, newY);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error handling keypress:', error.message);
      } else {
        console.error('Unknown error handling keypress');
      }
    }
  }, [playerId, updatePosition]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return { updatePosition };
};
