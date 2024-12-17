import axios from "axios";

export const fetchDocuments = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authorization token is missing");
    }

    const response = await axios.get("http://localhost:3000/document", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};
