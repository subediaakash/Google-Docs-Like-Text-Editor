import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";

interface UserData {
  userDetails: {
    id: string;
    name: string;
    email: string;
  };
  documentStats: {
    createdDocumentsCount: number;
    sharedDocumentsCount: number;
  };
  documents: {
    created: Array<{
      id: string;
      title: string;
      createdAt: string;
    }>;
    sharedWithUser: Array<{
      id: string;
      title: string;
      owner: {
        name: string;
        email: string;
      };
    }>;
  };
}

export default function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<{ success: boolean; data: UserData }>(
          "http://localhost:3000/users/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (err) {
        setError("An error occurred while fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No user data available</div>;

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${userData.userDetails.name}`}
                alt={userData.userDetails.name}
              />
              <AvatarFallback>
                {userData.userDetails.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">
                {userData.userDetails.name}
              </h2>
              <p className="text-gray-500">{userData.userDetails.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold">
                  {userData.documentStats.createdDocumentsCount}
                </p>
                <p className="text-sm text-gray-500">Created Documents</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold">
                  {userData.documentStats.sharedDocumentsCount}
                </p>
                <p className="text-sm text-gray-500">Shared Documents</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Created Documents</h3>
              <ul className="space-y-2">
                {userData.documents.created.slice(0, 5).map((doc) => (
                  <li
                    key={doc.id}
                    className="flex justify-between items-center"
                  >
                    <span>{doc.title}</span>
                    <Badge variant="secondary">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Shared Documents</h3>
              <ul className="space-y-2">
                {userData.documents.sharedWithUser.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex justify-between items-center"
                  >
                    <span>{doc.title}</span>
                    <Badge>Shared by {doc.owner.name}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
