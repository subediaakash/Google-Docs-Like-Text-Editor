import React, { useState, useEffect, useRef } from "react";

const CollaborativeEditor: React.FC = () => {
  const [content, setContent] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({ type: "join", docId: "test-document" }));
    };

    ws.onmessage = (event) => {
      const { type, content } = JSON.parse(event.data);
      if (type === "init" || type === "update") {
        setContent(content || "");
      }
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

    websocketRef.current = ws;

    return () => ws.close();
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    websocketRef.current?.send(
      JSON.stringify({
        type: "update",
        docId: "test-document",
        content: newContent,
      })
    );
  };

  return (
    <div>
      <h2>Collaborative Text Editor</h2>
      <p>
        Connection Status:{" "}
        <span style={{ color: isConnected ? "green" : "red" }}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </p>
      <textarea
        value={content}
        onChange={handleContentChange}
        rows={10}
        placeholder="Start collaborating..."
        style={{ width: "100%", padding: "10px", marginTop: "10px" }}
      />
    </div>
  );
};

export default CollaborativeEditor;
