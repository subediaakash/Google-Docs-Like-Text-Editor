import axios, { AxiosInstance } from "axios";

class DocumentService {
  private api: AxiosInstance;

  constructor(baseURL: string) {
    if (!baseURL) {
      throw new Error("Base URL must be provided");
    }

    this.api = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
  }

  async fetchAllDocuments(): Promise<any[]> {
    try {
      const response = await this.api.get("/document");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  }

  async fetchDocumentById(id: string | number): Promise<any> {
    try {
      if (!id) {
        throw new Error("Document ID is required");
      }
      const response = await this.api.get(`/document/${id}`);
      console.log(response.data);
      console.log("response is reaching here");

      return response.data;
    } catch (error: any) {
      console.error(`Error fetching document with ID ${id}:`, error);
      throw error;
    }
  }
}

export default DocumentService;
