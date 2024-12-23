import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

interface FormData {
  documentId: string;
  userId: string;
  accessType: "EDIT" | "VIEW";
}

interface Document {
  id: string;
  title: string;
}

interface User {
  id: string;
  name: string;
}

const DocumentPermissionForm = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    documentId: "",
    userId: "",
    accessType: "EDIT",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const [documentsResponse, usersResponse] = await Promise.all([
          axios.get("http://localhost:3000/document", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("http://localhost:3000/users", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setDocuments(documentsResponse.data as Document[]);
        setUsers(usersResponse.data as User[]);
      } catch (err) {
        toast.error("Failed to fetch documents or users. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/document/permission",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update permissions");
      }

      toast.success("Permission updated successfully!");
      setTimeout(() => {
        navigate("/documents");
      }, 1000);
    } catch (err) {
      toast.error("Error updating permission. Please try again.");
      console.error("Error updating permission:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors />
      <Card className="w-full max-w-md mx-auto mt-6">
        <CardHeader>
          <CardTitle>Document Permissions</CardTitle>
          <CardDescription>
            Assign view or edit permissions to users for specific documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="document">Document</Label>
              <Select
                onValueChange={(value) => handleChange("documentId", value)}
                defaultValue={formData.documentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a document" />
                </SelectTrigger>
                <SelectContent>
                  {documents.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Select
                onValueChange={(value) => handleChange("userId", value)}
                defaultValue={formData.userId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Permission Type</Label>
              <RadioGroup
                defaultValue={formData.accessType}
                onValueChange={(value) =>
                  handleChange("accessType", value as "EDIT" | "VIEW")
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="VIEW" id="view" />
                  <Label htmlFor="view">View</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="EDIT" id="edit" />
                  <Label htmlFor="edit">Edit</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Update Permission"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentPermissionForm;
