import { Request, Response, NextFunction } from "express";
import { AccessType, PrismaClient } from "@prisma/client";

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
  static async givePermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { documentId, userId, accessType } = req.body;
      const requesterId = req.user?.id;

      if (!documentId || !userId || !accessType) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const validAccessTypes: AccessType[] = ["READ", "EDIT", "COMMENT"];
      if (!validAccessTypes.includes(accessType)) {
        res.status(400).json({
          error: "Invalid access type",
          validTypes: validAccessTypes,
        });
        return;
      }

      const document = await prisma.document.findUnique({
        where: { id: documentId },
        include: { sharedWith: true },
      });

      if (!document) {
        res.status(404).json({ error: "Document not found" });
        return;
      }

      if (document.ownerId !== requesterId) {
        res
          .status(403)
          .json({ error: "Only document owner can assign permissions" });
        return;
      }

      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!targetUser) {
        res.status(404).json({ error: "Target user not found" });
        return;
      }

      const isAlreadyShared = document.sharedWith.some(
        (user) => user.id === userId
      );

      await prisma.$transaction(async (tx) => {
        const existingPermission = await tx.documentPermission.findFirst({
          where: {
            documentId,
            userId,
          },
        });

        if (existingPermission) {
          await tx.documentPermission.update({
            where: { id: existingPermission.id },
            data: { accessType },
          });
        } else {
          await tx.documentPermission.create({
            data: {
              documentId,
              userId,
              accessType,
            },
          });
        }

        if (!isAlreadyShared) {
          await tx.document.update({
            where: { id: documentId },
            data: {
              sharedWith: {
                connect: { id: userId },
              },
            },
          });
        }
      });

      res.status(200).json({
        message: "Permission successfully assigned",
        accessType,
      });
    } catch (error) {
      console.error("Permission assignment error:", error);
      next(error);
    }
  }
}
