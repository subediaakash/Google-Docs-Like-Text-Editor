import React, { useState } from "react";

interface TitleModalProps {
  onSubmit: (title: string) => void;
}

const TitleModal: React.FC<TitleModalProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Enter Document Title</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            className="w-full p-2 border border-gray-300 rounded mb-4"
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Document
          </button>
        </form>
      </div>
    </div>
  );
};

export default TitleModal;
