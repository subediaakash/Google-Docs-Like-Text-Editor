import { useQuery } from "@tanstack/react-query";
import DocumentService from "../utils/fetchDocuments";
import { Document } from "../utils/types";
import { Link } from "react-router-dom";

const documentService = new DocumentService("http://localhost:3000/");

function GetDocuments() {
  const { isLoading, isError, data, error } = useQuery<Document[], Error>({
    queryKey: ["documents"],
    queryFn: () => documentService.fetchAllDocuments(),
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  if (!data || data.length === 0) {
    return <span>No documents found.</span>;
  }

  return (
    <ul>
      {data.map((document) => (
        <Link
          to={`/document/${document.id}`}
          key={document.id}
          className="block border border-black m-3 p-3 hover:bg-gray-200"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <li>
            <h2>{document.title}</h2>
            <p>{document.content}</p>
          </li>
        </Link>
      ))}
    </ul>
  );
}

export default GetDocuments;
