import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import DocumentService from "../utils/fetchDocuments";
import { Document } from "../utils/types";
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
import axios from "axios";
import styles from "./editor/editorStyle";

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <>Id not found</>;

  const wsRef = useRef<WebSocket | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );

  const documentService = new DocumentService("http://localhost:3000/");

  const { isLoading, isError, data, error } = useQuery<Document, Error>({
    queryKey: ["document", id],
    queryFn: () => documentService.fetchDocumentById(id),
  });

  const mutation = useMutation({
    mutationFn: (content: string) =>
      axios.put(
        `http://localhost:3000/document/${id}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      ),
    onSuccess: () => {
      setLastSaved(new Date());
      setSaveStatus("saved");
    },
    onError: (error) => {
      console.error("Failed to save document:", error);
      setSaveStatus("error");
    },
  });

  const formatLastSaved = (date: Date | null) => {
    if (!date) return "";

    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 5) return "Just now";
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing something amazing...",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Typography,
      Image,
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TextStyle,
      Color,
      Underline,
    ],
    content: data?.content || "",
    editable: true,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      if (content !== lastContentRef.current) {
        lastContentRef.current = content;
        setSaveStatus("saving");

        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
          wsRef.current?.send(
            JSON.stringify({ type: "update", content, docId: id })
          );
          mutation.mutate(content);
        }, 500);
      }
    },
  });

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    return () => {
      styleElement.remove();
    };
  }, []);

  useEffect(() => {
    if (editor && data) {
      wsRef.current = new WebSocket("ws://localhost:8080");
      wsRef.current.onopen = () => {
        wsRef.current?.send(JSON.stringify({ type: "join", docId: id }));
      };

      wsRef.current.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "update" && msg.content !== lastContentRef.current) {
          const currentOnUpdate = editor.options.onUpdate;
          editor.setOptions({ onUpdate: () => {} });
          editor.commands.setContent(msg.content);
          editor.setOptions({ onUpdate: currentOnUpdate });
          lastContentRef.current = msg.content;
          setLastSaved(new Date());
        }
      };

      wsRef.current.onclose = () => console.log("WebSocket disconnected");

      return () => wsRef.current?.close();
    }
  }, [editor, data, id]);

  useEffect(() => {
    if (data?.content && editor) {
      editor.commands.setContent(data.content);
      setLastSaved(new Date(data.updatedAt));
    }
  }, [data, editor]);

  if (isLoading)
    return (
      <div className="editor-container flex items-center justify-center">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="editor-container flex items-center justify-center">
        Error: {error?.message}
      </div>
    );
  if (!data || !editor) return null;

  return (
    <div className="editor-container">
      <div className="editor-header ">
        <h1 className="document-title">{data.title}</h1>
        <div className="save-status px-3">
          {saveStatus === "saving" && (
            <span className="text-gray-500">Saving...</span>
          )}
          {saveStatus === "saved" && lastSaved && (
            <span className="text-slate-600 font-base text-sm">
              Last saved: {formatLastSaved(lastSaved)}
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-red-500">Failed to save</span>
          )}
        </div>
      </div>
      <div className="menu-bar-container">
        <MenuBar editor={editor} />
      </div>
      <div className="editor-content-container">
        <BubbleMenu editor={editor} className="bubble-menu">
          <button onClick={() => editor.chain().focus().toggleBold().run()}>
            Bold
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}>
            Italic
          </button>
        </BubbleMenu>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default DocumentDetail;
