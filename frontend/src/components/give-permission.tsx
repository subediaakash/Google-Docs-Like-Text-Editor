import { useEffect, useState } from "react";
import { useForm } from "../hooks/useForm";
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

interface FormData {
  documentId: string;
  userId: string;
  permissionType: "EDIT" | "VIEW";
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

  const { formData, handleSubmit } = useForm<FormData>({
    documentId: "",
    userId: "",
    permissionType: "VIEW",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const documentsResponse = await fetch("/api/documents");
        const usersResponse = await fetch("/api/users");

        const documentsData = await documentsResponse.json();
        const usersData = await usersResponse.json();

        setDocuments(documentsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Permission updated successfully");
      }
    } catch (error) {
      console.error("Error updating permission:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle>Document Permissions</CardTitle>
        <CardDescription>
          Assign view or edit permissions to users for specific documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="document">Document</Label>
            <Select
              onValueChange={(value) => {
                formData.documentId = value;
              }}
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
              onValueChange={(value) => {
                formData.userId = value;
              }}
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
              defaultValue={formData.permissionType}
              onValueChange={(value) => {
                formData.permissionType = value as "EDIT" | "VIEW";
              }}
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
  );
};

export default DocumentPermissionForm;
