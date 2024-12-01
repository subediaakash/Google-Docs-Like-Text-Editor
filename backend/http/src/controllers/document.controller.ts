import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DocumentController {
  static async createDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { title, content } = req.body;

      const newDocument = await prisma.document.create({
        data: {
          title,
          content: content || "",
          ownerId: req.user.id,
        },
      });

      res.status(201).json(newDocument);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ error: "Failed to create document" });
    }
  }

  static async getAllDocuments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const documents = await prisma.document.findMany({
        where: {
          OR: [
            { ownerId: req.user.id },
            {
              DocumentPermission: {
                some: {
                  userId: req.user.id,
                },
              },
            },
          ],
        },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  }

  static async getDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { id } = req.params;

      const document = await prisma.document.findFirst({
        where: {
          id,
          OR: [
            { ownerId: req.user.id },
            {
              DocumentPermission: {
                some: {
                  userId: req.user.id,
                },
              },
            },
          ],
        },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!document) {
        res.status(403).json({ error: "Document not found or access denied" });
        return;
      }

      res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ error: "Failed to fetch document" });
    }
  }

  static async updateDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { id } = req.params;
      const { title, content } = req.body;

      const existingDocument = await prisma.documentPermission.findFirst({
        where: {
          documentId: id,
          userId: req.user.id,
          accessType: "EDIT",
        },
      });

      if (!existingDocument) {
        const ownerCheck = await prisma.document.findFirst({
          where: {
            id,
            ownerId: req.user.id,
          },
        });

        if (!ownerCheck) {
          res.status(403).json({ error: "Cannot update document" });
          return;
        }
      }

      const updatedDocument = await prisma.document.update({
        where: { id },
        data: {
          title,
          content,
        },
      });

      res.json(updatedDocument);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: "Failed to update document" });
    }
  }
}
