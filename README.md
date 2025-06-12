# 🎮 SquareEscape3000

A cyberpunk-themed multiplayer game where players control neon squares in a shared space. Built with React, Express, and Supabase for real-time multiplayer functionality.

![Game Preview](preview.png)

## 🚀 Features

- Real-time multiplayer gameplay
- Cyberpunk-inspired UI design
- Smooth player movement with WASD controls
- Live player list updates
- Unique player colors
- Glowing effects and grid-based game field

## 🛠️ Tech Stack

- **Frontend:**

  - React
  - TypeScript
  - HTML5 Canvas
  - CSS3 with modern effects

- **Backend:**
  - Express.js
  - Supabase (Real-time Database)

## 🎯 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:

```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd back
npm install

# Install frontend dependencies
cd ../front
npm install
```

3. Set up environment variables:

Create a `.env` file in the backend directory:

```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

4. Start the servers:

Backend:

```bash
cd back
npm start
```

Frontend:

```bash
cd front
npm start
```

5. Open your browser and navigate to `http://localhost:5173`

## 🎮 How to Play

1. Enter your name to join the game
2. Use WASD keys to move your square:
   - W: Move up
   - A: Move left
   - S: Move down
   - D: Move right
3. Your square will glow with a unique color
4. Try to explore the space and interact with other players!

## 🔧 Configuration

You can modify game settings in `front/src/services/supabase.ts`:

- `WIDTH`: Game field width
- `HEIGHT`: Game field height
- `PLAYER_SIZE`: Size of player squares
- `MOVEMENT_SPEED`: Player movement speed

## Project Demo

https://www.loom.com/share/035dca97c80e43f69703f04ddff5f956?sid=278a7989-64b9-475b-8782-92c8b4a2586b
