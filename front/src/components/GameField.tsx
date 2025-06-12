import { useEffect, useRef } from "react";
import type { Player } from "../services/supabase";
import { GAME_CONFIG } from "../services/supabase";

interface GameFieldProps {
  players: Player[];
}

export function GameField({ players }: GameFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

    // Draw grid
    ctx.strokeStyle = "rgba(0, 243, 255, 0.1)";
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x < GAME_CONFIG.WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, GAME_CONFIG.HEIGHT);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y < GAME_CONFIG.HEIGHT; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(GAME_CONFIG.WIDTH, y);
      ctx.stroke();
    }

    // Draw players with glow effect
    players.forEach((player) => {
      // Draw glow
      const gradient = ctx.createRadialGradient(
        player.x + GAME_CONFIG.PLAYER_SIZE / 2,
        player.y + GAME_CONFIG.PLAYER_SIZE / 2,
        0,
        player.x + GAME_CONFIG.PLAYER_SIZE / 2,
        player.y + GAME_CONFIG.PLAYER_SIZE / 2,
        GAME_CONFIG.PLAYER_SIZE
      );
      gradient.addColorStop(0, player.color);
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.fillRect(
        player.x - GAME_CONFIG.PLAYER_SIZE / 2,
        player.y - GAME_CONFIG.PLAYER_SIZE / 2,
        GAME_CONFIG.PLAYER_SIZE * 2,
        GAME_CONFIG.PLAYER_SIZE * 2
      );

      // Draw player
      ctx.fillStyle = player.color;
      ctx.fillRect(
        player.x,
        player.y,
        GAME_CONFIG.PLAYER_SIZE,
        GAME_CONFIG.PLAYER_SIZE
      );

      // Add inner highlight
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        player.x + 2,
        player.y + 2,
        GAME_CONFIG.PLAYER_SIZE - 4,
        GAME_CONFIG.PLAYER_SIZE - 4
      );
    });
  }, [players]);

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.WIDTH}
        height={GAME_CONFIG.HEIGHT}
        style={{
          border: "2px solid var(--neon-blue)",
          borderRadius: "8px",
          boxShadow: "0 0 20px rgba(0, 243, 255, 0.2)",
          background: "#000000",
        }}
      />
    </div>
  );
}
