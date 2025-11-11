import { WebSocketServer } from 'ws';
import { getProducts } from './app/api/products/products';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anonymous key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', message => {
    console.log(`Received message: ${message}`);
    // Optionally, send a response back to the client
    ws.send(`Server received: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', error => {
    console.error('WebSocket error:', error);
  });

  // Example: Send product data every 5 seconds
  const sendProductData = async () => {
    try {
      const products = await getProducts();
      ws.send(JSON.stringify(products));
      console.log('Sent product data to client');
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const interval = setInterval(sendProductData, 5000);

  // Clear the interval when the client disconnects
  ws.on('close', () => {
    clearInterval(interval);
  });
});

console.log('WebSocket server started on port 8080');
