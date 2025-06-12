import type { Player } from "../services/supabase";

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string;
}

export function PlayerList({ players, currentPlayerId }: PlayerListProps) {
  return (
    <div className="player-list">
      <h2>Players</h2>
      <div className="player-list-container">
        {players.map((player) => (
          <div
            key={player.id}
            className={`player-item ${
              player.id === currentPlayerId ? "current-player" : ""
            }`}
          >
            <div
              className="player-color"
              style={{ backgroundColor: player.color }}
            />
            <span className="player-name">{player.name}</span>
            {player.id === currentPlayerId && (
              <span className="player-tag">YOU</span>
            )}
          </div>
        ))}
      </div>
      <style>{`
        .player-list {
          width: 250px;
          background: rgba(255, 255, 255, 0.05);
          padding: 20px;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .player-list h2 {
          margin: 0 0 20px 0;
          color: var(--neon-blue);
          text-align: center;
          font-size: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .player-list-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .player-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .player-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .current-player {
          border: 1px solid var(--neon-pink);
          box-shadow: 0 0 10px rgba(255, 0, 255, 0.2);
        }

        .player-color {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .player-name {
          flex: 1;
          color: white;
          font-size: 0.9rem;
        }

        .player-tag {
          background: linear-gradient(45deg, var(--neon-blue), var(--neon-pink));
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
          color: white;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
