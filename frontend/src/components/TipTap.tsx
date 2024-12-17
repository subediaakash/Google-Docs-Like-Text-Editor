import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from '@tiptap/extension-heading'

const CollaborativeTiptapEditor: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const [initialContent, setInitialContent] = useState("");

  // Set up Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing collaboratively...",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      // Send content to WebSocket server
      websocketRef.current?.send(
        JSON.stringify({
          type: "update",
          docId: "test-document",
          content,
        })
      );
    },
  });

  // WebSocket Connection Setup
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({ type: "join", docId: "test-document" }));
    };

    ws.onmessage = (event) => {
      const { type, content } = JSON.parse(event.data);
      if ((type === "init" || type === "update") && content) {
        if (editor && content !== editor.getHTML()) {
          editor.commands.setContent(content);
        }
      }
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

    websocketRef.current = ws;

    return () => ws.close();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Connection Status */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Collaborative Tiptap Editor</h1>
        <span
          className={`text-sm font-semibold ${
            isConnected ? "text-green-500" : "text-red-500"
          }`}
        >
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* Toolbar */}

<div className="flex space-x-2 mb-4">
  <button
    onClick={() => editor.chain().focus().toggleBold().run()}
    className={`px-3 py-1 border rounded ${
      editor.isActive("bold")
        ? "bg-blue-500 text-white"
        : "hover:bg-gray-100"
    }`}
  >
    Bold
  </button>
  <button
    onClick={() => editor.chain().focus().toggleItalic().run()}
    className={`px-3 py-1 border rounded ${
      editor.isActive("italic")
        ? "bg-blue-500 text-white"
        : "hover:bg-gray-100"
    }`}
  >
    Italic
  </button>
  <button
    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
    className={`px-3 py-1 border rounded ${
      editor.isActive("heading", { level: 1 })
        ? "bg-blue-500 text-white"
        : "hover:bg-gray-100"
    }`}
  >
    H1
  </button>
  <button
    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    className={`px-3 py-1 border rounded ${
      editor.isActive("heading", { level: 2 })
        ? "bg-blue-500 text-white"
        : "hover:bg-gray-100"
    }`}
  >
    H2
  </button>
  <button
    onClick={() => editor.chain().focus().setParagraph().run()}
    className={`px-3 py-1 border rounded hover:bg-gray-100`}
  >
    Paragraph
  </button>
</div>


      {/* Editor */}
<div className="border rounded p-4 h-[500px] w-full overflow-auto">
  <EditorContent editor={editor} />
</div>
    </div>
  );
};

export default CollaborativeTiptapEditor;
