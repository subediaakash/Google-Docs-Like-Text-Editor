import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <>Id not found</>;
  }

  const documentService = new DocumentService("http://localhost:3000/");
  const { isLoading, isError, data, error } = useQuery<Document, Error>({
    queryKey: ["document", id],
    queryFn: () => documentService.fetchDocumentById(id),
  });

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
    content: data?.content || "",
    editable: true, // Set to false if you want read-only mode
  });

  // Update editor content when data is loaded
  React.useEffect(() => {
    if (data?.content && editor) {
      editor.commands.setContent(data.content);
    }
  }, [data, editor]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading document...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
        <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Occurred
          </h2>
          <p className="text-gray-700 mb-6">
            {error?.message || "Failed to fetch document"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Document Not Found
          </h2>
          <p className="text-gray-600">
            The requested document could not be retrieved.
          </p>
        </div>
      </div>
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <header className="bg-gray-50 border-b border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
          </header>

          <div className="p-6">
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

            <div className="mt-4">
              <EditorContent
                editor={editor}
                className="prose max-w-none focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
