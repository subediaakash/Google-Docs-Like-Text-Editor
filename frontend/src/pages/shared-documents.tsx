import { useSharedDocuments } from "../hooks/useSharedDocuments";
import { DocumentCard } from "../components/document-card";
import { Loader2Icon } from "lucide-react";
import { FileQuestion } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useNavigate } from "react-router-dom";

export function SharedDocumentsContent() {
  const navigate = useNavigate();
  const { data: documents, isLoading, error } = useSharedDocuments();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        An error occurred while fetching the documents.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Shared Documents</h1>
      {documents && documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      ) : (
        <Card className="w-full max-w-md mx-auto shadow-lg rounded-lg border border-gray-200">
          <CardHeader className="bg-gray-100 py-4 rounded-t-lg">
            <CardTitle className="flex items-center justify-center gap-3 text-lg font-semibold text-gray-700">
              <FileQuestion className="h-7 w-7 text-gray-500" />
              No Shared Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-center text-gray-600 text-sm">
              Oops! It looks like your document sharing circle is a bit shy.
              <br />
              No worries though, great collaborations often start with a single
              share!
            </p>
            <p className="text-center mt-6 text-gray-600">
              Why not break the ice? Share one of your documents and watch the
              collaboration magic unfold!
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  navigate("/share");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
              >
                Share a Document
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
