import React from "react";
import { BubbleMenu as TiptapBubbleMenu, Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Link,
  Strikethrough,
  Code,
  Highlighter,
} from "lucide-react";

interface BubbleMenuProps {
  editor: Editor;
}

const BubbleMenu: React.FC<BubbleMenuProps> = ({ editor }) => {
  const addLink = () => {
    const url = window.prompt("Enter the URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="bg-white shadow-lg border border-gray-200 rounded-lg flex p-1 gap-1"
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded hover:bg-gray-100 ${
          editor.isActive("bold") ? "bg-gray-200" : ""
        }`}
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded hover:bg-gray-100 ${
          editor.isActive("italic") ? "bg-gray-200" : ""
        }`}
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1 rounded hover:bg-gray-100 ${
          editor.isActive("strike") ? "bg-gray-200" : ""
        }`}
      >
        <Strikethrough size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-1 rounded hover:bg-gray-100 ${
          editor.isActive("code") ? "bg-gray-200" : ""
        }`}
      >
        <Code size={16} />
      </button>
      <button
        onClick={addLink}
        className={`p-1 rounded hover:bg-gray-100 ${
          editor.isActive("link") ? "bg-gray-200" : ""
        }`}
      >
        <Link size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-1 rounded hover:bg-gray-100 ${
          editor.isActive("highlight") ? "bg-gray-200" : ""
        }`}
      >
        <Highlighter size={16} />
      </button>
    </TiptapBubbleMenu>
  );
};

export default BubbleMenu;
