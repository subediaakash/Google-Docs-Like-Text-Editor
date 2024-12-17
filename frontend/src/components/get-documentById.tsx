import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DocumentService from "../utils/fetchDocuments";
import { Document } from "../utils/types";

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <header className="bg-gray-50 border-b border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
        </header>
        <section className="p-6">
          <article className="prose max-w-none text-gray-700">
            {data.content}
          </article>
        </section>
      </div>
    </div>
  );
};

export default DocumentDetail;
