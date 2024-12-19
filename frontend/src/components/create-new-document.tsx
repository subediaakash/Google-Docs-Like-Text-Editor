import React, { useState, useEffect } from "react";
import axios from "axios";
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
import MenuBar from "./editor/menu-bar";
import { BubbleMenu } from "@tiptap/react";
import TitleModal from "./editor/title-modal";

interface DocumentCreateResponse {
  id: string;
  title: string;
}

const NewDocument: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [showTitleModal, setShowTitleModal] = useState(true);
  const [title, setTitle] = useState("");

  const createNewDocument = async () => {
    try {
      const response = await axios.post<DocumentCreateResponse>(
        "http://localhost:3000/document",
        {
          title: title,
          content: "<p>Welcome to your new text editor!</p>",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      setDocId(response.data.id);
      return response.data.id;
    } catch (error) {
      console.error("Failed to create document:", error);
      return null;
    }
  };

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
    content: "<p>Welcome to the multiple collaborative text editor</p>",
    onUpdate: ({ editor }) => {
      const contents = editor.getHTML();

      if (docId && socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "update",
            docId: docId,
            content: contents,
          })
        );
      }
    },
  });

  useEffect(() => {
    if (editor && !showTitleModal) {
      const initializeDocument = async () => {
        const newDocId = await createNewDocument();

        if (!newDocId) {
          console.error("Failed to create document");
          return;
        }

        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {
          console.log("WebSocket Connected");
          ws.send(
            JSON.stringify({
              type: "join",
              docId: newDocId,
            })
          );
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (!editor) return;

          switch (data.type) {
            case "init":
              if (data.content) {
                editor.commands.setContent(data.content);
              }
              break;
            case "update":
              if (data.content) {
                const currentOnUpdate = editor.options.onUpdate;
                editor.setOptions({ onUpdate: () => {} });
                editor.commands.setContent(data.content);
                editor.setOptions({ onUpdate: currentOnUpdate });
              }
              break;
          }
        };

        ws.onclose = () => {
          console.log("WebSocket Disconnected");
        };

        setSocket(ws);
      };

      initializeDocument();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [editor, showTitleModal]);
  const handleTitleSubmit = (submittedTitle: string) => {
    setTitle(submittedTitle);
    setShowTitleModal(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showTitleModal && <TitleModal onSubmit={handleTitleSubmit} />}
      <div className="max-w-4xl mx-auto">
        <MenuBar editor={editor} />
        <BubbleMenu editor={editor} children={undefined} />
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

export default NewDocument;
