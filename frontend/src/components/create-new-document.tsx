import React, { useState, useEffect, useCallback, useRef } from "react";
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

// Todo : Redirecting to document page after clicking on new document . This is to remove this page and redundancy

interface DocumentCreateResponse {
  id: string;
  title: string;
}

interface SaveStatus {
  saving: boolean;
  lastSaved: Date | null;
  error: string | null;
}

const NewDocument: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [showTitleModal, setShowTitleModal] = useState(true);
  const [title, setTitle] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({
    saving: false,
    lastSaved: null,
    error: null,
  });

  const lastContentRef = useRef<string>(" ");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const saveDocument = async (content: string) => {
    if (!docId) return;

    setSaveStatus((prev) => ({ ...prev, saving: true, error: null }));

    try {
      await axios.put(
        `http://localhost:3000/document/${docId}`,
        {
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      lastContentRef.current = content;
      setSaveStatus({
        saving: false,
        lastSaved: new Date(),
        error: null,
      });
    } catch (error) {
      console.error("Failed to save document:", error);
      setSaveStatus((prev) => ({
        ...prev,
        saving: false,
        error: "Failed to save changes",
      }));
    }
  };

  const debouncedSave = useCallback(
    (content: string) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      if (content !== lastContentRef.current) {
        saveTimeoutRef.current = setTimeout(() => {
          saveDocument(content);
        }, 1000);
      }
    },
    [docId]
  );

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
    content: "<p>Welcome to the collaborative text editor</p>",
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
      debouncedSave(contents);
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

        lastContentRef.current = editor.getHTML();

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
                lastContentRef.current = data.content;
              }
              break;
            case "update":
              if (data.content) {
                const currentOnUpdate = editor.options.onUpdate;
                editor.setOptions({ onUpdate: () => {} });
                editor.commands.setContent(data.content);
                editor.setOptions({ onUpdate: currentOnUpdate });
                lastContentRef.current = data.content;
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
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editor, showTitleModal]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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
        <BubbleMenu editor={editor}>
          <div className="flex gap-2 bg-white shadow-lg rounded-lg p-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded ${
                editor.isActive("bold") ? "bg-gray-200" : ""
              }`}
            >
              Bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded ${
                editor.isActive("italic") ? "bg-gray-200" : ""
              }`}
            >
              Italic
            </button>
          </div>
        </BubbleMenu>
        <div className="bg-white shadow-sm rounded-lg mt-4 p-8">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <EditorContent
            editor={editor}
            className="prose max-w-none focus:outline-none"
          />
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              {saveStatus.saving && (
                <span className="text-yellow-600">Saving...</span>
              )}
              {saveStatus.error && (
                <span className="text-red-600">{saveStatus.error}</span>
              )}
              {saveStatus.lastSaved && (
                <span>
                  Last saved: {saveStatus.lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDocument;
