import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Folder, PlusCircle, Loader2, Share2 } from "lucide-react";
import { Document } from "../utils/types";
import axios from "axios";
import { format } from "date-fns";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function GetDocuments() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState("");

  const {
    isLoading,
    isError,
    data,
    error: queryError,
  } = useQuery<Document[], Error>({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/document", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    },
  });

  const createDocument = async () => {
    if (!title.trim()) {
      setError("Title cannot be empty!");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        "http://localhost:3000/document",
        {
          title: title.trim(),
          content: "<p></p>",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.id) {
        setIsModalOpen(false);
        navigate(`/document/${response.data.id}`);
      } else {
        throw new Error("No document ID received from server");
      }
    } catch (err: any) {
      console.error("Error creating document:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create document. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isCreating) {
      createDocument();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setError("");
  };

  const shareDocument = () => {
    // Implement share functionality here
    console.log("Share document functionality to be implemented");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{queryError?.message || "An unexpected error occurred"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Documents</h1>
        <div className="space-x-2">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create New Document
          </Button>
          <Button
            onClick={shareDocument}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Document
          </Button>
        </div>
      </div>

      {!data || data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Folder className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-500">No documents found.</p>
            <Button onClick={() => setIsModalOpen(true)} className="mt-4">
              Create Your First Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((document) => (
            <Card
              key={document.id}
              className="hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Folder className="w-8 h-8 text-primary" />
                <CardTitle className="text-xl font-semibold text-gray-800 truncate">
                  {document.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Last modified: {format(new Date(document.updatedAt), "PPP")}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate(`/document/${document.id}`)}
                >
                  Open Document
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
            <DialogDescription>
              Enter a title for your new document. Press Enter or click Create
              when you're done.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isCreating}
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={createDocument}
              disabled={isCreating || !title.trim()}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
