import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Folder, PlusCircle } from "lucide-react";
import DocumentService from "../utils/fetchDocuments";
import { Document } from "../utils/types";

const documentService = new DocumentService("http://localhost:3000/");

function GetDocuments() {
  const { isLoading, isError, data, error } = useQuery<Document[], Error>({
    queryKey: ["documents"],
    queryFn: () => documentService.fetchAllDocuments(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error?.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Documents</h1>
        <Link
          to="/new"
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          <PlusCircle className="w-5 h-5 mr-2 text-black" />
          <span className="text-black font-bold">Create New Document</span>
        </Link>
      </div>

      {!data || data.length === 0 ? (
        <div className="text-center text-gray-500 p-4">No documents found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((document) => (
            <Link
              to={`/document/${document.id}`}
              key={document.id}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              <div className="p-6 flex items-center space-x-4">
                <Folder className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 truncate">
                    {document.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Last modified: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default GetDocuments;
