import { useQuery } from "@tanstack/react-query";
import { fetchDocuments } from "../utils/fetchDocuments";

function GetDocuments() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <ul>
      {data.map((document: any) => (
        <li key={document.id} className="border border-black m-3">
          <h2>{document.title}</h2>
          <p>{document.content}</p>
        </li>
      ))}
    </ul>
  );
}

export default GetDocuments;
