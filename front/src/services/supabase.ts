const API_URL = 'http://localhost:3000';

export type Player = {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
};

export const GAME_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  PLAYER_SIZE: 20,
  MOVEMENT_SPEED: 5,
} as const;

export const api = {
  createPlayer: async (player: Player) => {
    const response = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(player),
    });
    if (!response.ok) throw new Error('Failed to create player');
    return response.json();
  },

  updatePlayerPosition: async (playerId: string, x: number, y: number) => {
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ x, y }),
    });
    if (!response.ok) throw new Error('Failed to update player position');
    return response.json();
  },

  getPlayers: async () => {
    const response = await fetch(`${API_URL}/players`);
    if (!response.ok) throw new Error('Failed to fetch players');
    return response.json();
  },

  deletePlayer: async (playerId: string) => {
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete player');
  },
};
