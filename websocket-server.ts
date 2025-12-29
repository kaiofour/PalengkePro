import { WebSocketServer } from 'ws';
import { createClient } from '@supabase/supabase-js';

// 1. Setup Supabase (Using the keys you provided)
const supabaseUrl = "https://jhbbadkrniujdizfyzez.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoYmJhZGtybml1amRpemZ5emV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MTc5ODUsImV4cCI6MjA3MzQ5Mzk4NX0.G146vBMCVIQWRJoES3rNZjpb-q3e6gU_-YGyTd_sLgw";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. Start WebSocket Server on Port 8080
const wss = new WebSocketServer({ port: 8080 });

console.log('WebSocket server started on port 8080');

wss.on('connection', ws => {
  console.log('Client connected from PalengKita');

  // 3. Send data immediately when they connect
  sendProductData(ws);

  // 4. Send updates every 3 seconds (Polling)
  const interval = setInterval(() => sendProductData(ws), 3000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

async function sendProductData(ws: any) {
  try {
    // Fetch products from Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('product_name', { ascending: true });

    if (error) {
      console.error('Supabase Error:', error.message);
      return;
    }

    // Send to Laravel Client
    if (products) {
      ws.send(JSON.stringify(products));
    }
  } catch (err) {
    console.error('Server Error:', err);
  }
}