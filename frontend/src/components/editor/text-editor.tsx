import React, { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import MenuBar from "./menu-bar";
import BubbleMenu from "./bubble-menu";

const TextEditor: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [docId, setDocId] = useState<string>("doc-1");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing something amazing...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextStyle,
      Color,
      Underline,
    ],
    content: "<p>Welcome to your new text editor!</p>",
    onUpdate: ({ editor }) => {
      const contents = editor.getHTML();
      console.log(contents);

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "update",
            docId: docId,
            content: editor.getHTML(),
          })
        );
      }
    },
  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WebSocket Connected");
      ws.send(
        JSON.stringify({
          type: "join",
          docId: docId,
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "init":
          if (editor && data.content) {
            editor.commands.setContent(data.content);
          }
          break;
        case "update":
          if (editor && data.content) {
            editor.setOptions({
              onUpdate: () => {},
            });

            editor.commands.setContent(data.content);

            editor.setOptions({
              onUpdate: ({ editor }) => {
                if (socket && socket.readyState === WebSocket.OPEN) {
                  socket.send(
                    JSON.stringify({
                      type: "update",
                      docId: docId,
                      content: editor.getHTML(),
                    })
                  );
                }
              },
            });
          }
          break;
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [editor, docId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <MenuBar editor={editor} />
        {editor && <BubbleMenu editor={editor} />}
        <div className="bg-white shadow-sm rounded-lg mt-4 p-8">
          <EditorContent
            editor={editor}
            className="prose max-w-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
