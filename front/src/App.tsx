import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { GameField } from "./components/GameField";
import { PlayerList } from "./components/PlayerList";
import { usePlayerMovement } from "./hooks/usePlayerMovement";
import { useRealtimePlayers } from "./hooks/useRealtimePlayers";
import { GAME_CONFIG, api } from "./services/supabase";
import type { Player } from "./services/supabase";
import "./App.css";

function App() {
  const [playerId] = useState(() => uuidv4());
  const [playerName, setPlayerName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const players = useRealtimePlayers();

  const initialPosition = {
    x: Math.floor(
      Math.random() * (GAME_CONFIG.WIDTH - GAME_CONFIG.PLAYER_SIZE)
    ),
    y: Math.floor(
      Math.random() * (GAME_CONFIG.HEIGHT - GAME_CONFIG.PLAYER_SIZE)
    ),
  };

  usePlayerMovement(playerId, initialPosition);

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    const newPlayer: Player = {
      id: playerId,
      name: playerName.trim(),
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`,
      x: initialPosition.x,
      y: initialPosition.y,
    };

    try {
      console.log("Sending player data:", newPlayer);
      await api.createPlayer(newPlayer);
      setIsJoined(true);
    } catch (error) {
      console.error("Error joining game:", error);
      setError(error instanceof Error ? error.message : "Failed to join game");
    }
  };

  useEffect(() => {
    const cleanup = async () => {
      if (isJoined) {
        try {
          await api.deletePlayer(playerId);
        } catch (error) {
          console.error("Error cleaning up player:", error);
        }
      }
    };

    window.addEventListener("beforeunload", cleanup);
    return () => {
      window.removeEventListener("beforeunload", cleanup);
      void cleanup();
    };
  }, [playerId, isJoined]);

  if (!isJoined) {
    return (
      <div className="login-container">
        <div className="game-title">
          <h1>SquareEscape3000</h1>
          <div className="title-decoration"></div>
        </div>
        <form onSubmit={handleJoinGame} className="login-form">
          <div className="form-content">
            {error && <p className="error-message">{error}</p>}
            <div className="input-group">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="name-input"
              />
              <button type="submit" className="join-button">
                Join Game
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>SquareEscape3000</h1>
        <div className="player-count">Players Online: {players.length}</div>
      </div>
      <div className="game-content">
        <div className="game-field-container">
          <GameField players={players} />
          <div className="controls-info">
            <p>Use W/A/S/D keys to move your square</p>
            <p>Current Players: {players.length}</p>
          </div>
        </div>
        <PlayerList players={players} currentPlayerId={playerId} />
      </div>
    </div>
  );
}

export default App;
