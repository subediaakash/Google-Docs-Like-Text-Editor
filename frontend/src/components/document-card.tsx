import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CalendarIcon, FileIcon, UserIcon } from "lucide-react";
import { Document } from "../hooks/useSharedDocuments";
import { Link } from "react-router-dom";
interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileIcon className="h-5 w-5" />
          {document.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <UserIcon className="h-4 w-4" />
          {document.owner.name}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          Last updated: {new Date(document.updatedAt).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/document/${document.id}`}>
          <Button variant="outline" className="w-full">
            View Document
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
