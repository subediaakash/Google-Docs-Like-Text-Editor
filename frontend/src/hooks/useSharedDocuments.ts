import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Owner {
  id: string;
  name: string;
  email: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  owner: Owner;
  accessType: string;
}

interface ApiResponse {
  success: boolean;
  data: Document[];
}

const fetchSharedDocuments = async (): Promise<Document[]> => {
  const { data } = await axios.get<ApiResponse>(
    "http://localhost:3000/document/shared",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return data.data;
};

export function useSharedDocuments() {
  return useQuery({
    queryKey: ["sharedDocuments"],
    queryFn: fetchSharedDocuments,
  });
}
