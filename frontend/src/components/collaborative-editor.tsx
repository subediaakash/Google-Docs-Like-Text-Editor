import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Message {
  type: string;
  content?: string;
}

const CollaborativeEditor: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const documentId = 'test-document'; // You can make this dynamic

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);

      ws.send(JSON.stringify({
        type: 'join',
        docId: documentId
      }));
    };

    ws.onmessage = (event) => {
      const data: Message = JSON.parse(event.data);
      
      switch (data.type) {
        case 'init':
          setContent(data.content || '');
          break;
        case 'update':
          if (data.content !== undefined) {
            setContent(data.content);
          }
          break;
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setIsConnected(false);
    };

    websocketRef.current = ws;

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [documentId]);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup;
  }, [connectWebSocket]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({
        type: 'update',
        docId: documentId,
        content: newContent
      }));
    }
  };

  return (
    <div className="collaborative-editor">
      <h2>Collaborative Text Editor</h2>
      <div className="connection-status">
        Connection Status: 
        <span 
          style={{ 
            color: isConnected ? 'green' : 'red',
            marginLeft: '10px'
          }}
        >
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Start collaborating..."
        rows={10}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '10px'
        }}
      />
    </div>
  );
};

export default CollaborativeEditor;
