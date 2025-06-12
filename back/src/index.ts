import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient, PostgrestError } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

console.log('Initializing Supabase with URL:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

// Types
interface Player {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

// Test Supabase connection and table structure
app.get('/health', async (req, res) => {
  try {
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('players')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('Supabase connection error:', testError);
      return res.status(500).json({ 
        error: 'Failed to connect to Supabase',
        details: testError
      });
    }

    // Try to create a test player
    const testPlayer: Player = {
      id: 'test-' + Date.now(),
      name: 'test',
      color: '#000000',
      x: 0,
      y: 0
    };

    const { data: insertData, error: insertError } = await supabase
      .from('players')
      .insert([testPlayer])
      .select();

    if (insertError) {
      console.error('Test insert failed:', insertError);
      return res.status(500).json({
        error: 'Failed to insert test player',
        details: insertError,
        message: insertError.message,
        hint: insertError.hint,
        code: insertError.code
      });
    }

    // Clean up test player
    await supabase
      .from('players')
      .delete()
      .eq('id', testPlayer.id);

    res.json({ 
      status: 'healthy', 
      supabase: 'connected',
      tableTest: 'passed',
      insertTest: 'passed'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      error: 'Health check failed',
      details: error
    });
  }
});

// Routes
app.post('/players', async (req, res) => {
  try {
    console.log('Received request to create player with data:', JSON.stringify(req.body, null, 2));
    
    const playerData: Player = req.body;
    
    // Validate player data
    if (!playerData.id || !playerData.name || !playerData.color || 
        typeof playerData.x !== 'number' || typeof playerData.y !== 'number') {
      const validationError = {
        id: !playerData.id ? 'missing' : 'ok',
        name: !playerData.name ? 'missing' : 'ok',
        color: !playerData.color ? 'missing' : 'ok',
        x: typeof playerData.x !== 'number' ? `invalid type: ${typeof playerData.x}` : 'ok',
        y: typeof playerData.y !== 'number' ? `invalid type: ${typeof playerData.y}` : 'ok'
      };
      console.error('Invalid player data. Validation results:', validationError);
      return res.status(400).json({ error: 'Invalid player data', details: validationError });
    }

    console.log('Attempting to insert player into Supabase with data:', playerData);
    const { data, error } = await supabase
      .from('players')
      .insert([playerData])
      .select();

    if (error) {
      console.error('Supabase error creating player:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return res.status(500).json({ 
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    }

    console.log('Player created successfully:', data[0]);
    res.json(data[0]);
  } catch (error) {
    const err = error as Error;
    console.error('Unexpected error creating player:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ 
      error: 'Failed to create player', 
      message: err.message,
      stack: err.stack 
    });
  }
});

app.get('/players', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*');

    if (error) {
      console.error('Error fetching players:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

app.patch('/players/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { x, y } = req.body;

    if (typeof x !== 'number' || typeof y !== 'number') {
      return res.status(400).json({ error: 'Invalid position data' });
    }

    const { data, error } = await supabase
      .from('players')
      .update({ x, y })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating player:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data[0]);
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ error: 'Failed to update player' });
  }
});

app.delete('/players/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting player:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Environment:', {
    supabaseUrl: process.env.SUPABASE_URL ? 'Set' : 'Missing',
    supabaseKey: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing'
  });
}); 