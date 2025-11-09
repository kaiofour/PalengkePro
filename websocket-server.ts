import { WebSocketServer } from 'ws';

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
  const sendProductData = () => {
    const products = [
      { id: 1, name: 'Product A', price: 10.99, quantity: 100 },
      { id: 2, name: 'Product B', price: 20.50, quantity: 100 },
      { id: 3, name: 'Product C', price: 5.75, quantity: 100},
    ];
    ws.send(JSON.stringify(products));
    console.log('Sent product data to client');
  };

  const interval = setInterval(sendProductData, 5000);

  // Clear the interval when the client disconnects
  ws.on('close', () => {
    clearInterval(interval);
  });
});

console.log('WebSocket server started on port 8080');
