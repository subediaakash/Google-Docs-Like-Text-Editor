import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { nanoid } from 'nanoid';

interface Document {
  content: string;
  collaborators: Set<WebSocket>;
}

interface MessageData {
  type: string;
  docId?: string;
  content?: string;
}

const server = http.createServer();
server.listen(8080, () => {
  console.log('Server listening on port 8080');
});

const wss = new WebSocketServer({ server });
const documents: Map<string, Document> = new Map();
const connections: Map<WebSocket, { id: string }> = new Map();

wss.on('connection', (ws) => {
  const clientId = nanoid();
  connections.set(ws, { id: clientId });

  ws.on('message', (message) => {
    const data = JSON.parse(message.toString()) as MessageData;
    switch (data.type) {
      case 'join':
        if (data.docId) handleJoin(ws, data.docId);
        break;
      case 'update':
        if (data.docId && data.content) handleUpdate(ws, data.docId, data.content);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  });

  ws.on('close', () => {
    connections.delete(ws);
    documents.forEach((doc) => {
      doc.collaborators.delete(ws);
    });
  });
});

function handleJoin(ws: WebSocket, docId: string) {
  if (!documents.has(docId)) {
    documents.set(docId, { content: '', collaborators: new Set() });
  }
  const doc = documents.get(docId)!;
  doc.collaborators.add(ws);
  ws.send(
    JSON.stringify({
      type: 'init',
      content: doc.content,
    })
  );
}

function handleUpdate(ws: WebSocket, docId: string, content: string) {
  if (!documents.has(docId)) return;
  const doc = documents.get(docId)!;
  doc.content = content;
  doc.collaborators.forEach(client => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: "update",
        content
      }));
    }
  });
}
