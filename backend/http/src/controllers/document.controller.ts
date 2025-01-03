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

      const newDocument = await prisma.$transaction(async (tx) => {
        const document = await tx.document.create({
          data: {
            title,
            content: content || "",
            ownerId: req.user!.id,
          },
        });

        await tx.documentPermission.create({
          data: {
            userId: req.user!.id,
            documentId: document.id,
            accessType: "EDIT",
          },
        });

        return document;
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
        res.status(403).json({
          error: "Document not found or access denied",
        });
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
      const { content } = req.body;

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
      console.log(documentId, userId, accessType);

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
  static getSharedDocumentsByOtherUsers = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const sharedDocuments = await prisma.document.findMany({
        // Here i want to  get documents where the owner is NOT the current user
        where: {
          AND: [
            { NOT: { ownerId: userId } },
            {
              // Here i did this because i wanted to check weather the user is having the permission or not
              DocumentPermission: {
                some: {
                  userId: userId,
                },
              },
            },
          ],
        },
        // Here i am including the owner of the document and the DocumentPermission
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          DocumentPermission: {
            where: {
              userId: userId,
            },
            select: {
              accessType: true,
            },
          },
        },
      });

      const formattedDocuments = sharedDocuments.map((doc) => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        owner: {
          id: doc.owner.id,
          name: doc.owner.name,
          email: doc.owner.email,
        },
        accessType: doc.DocumentPermission[0]?.accessType,
      }));

      return res.status(200).json({
        success: true,
        data: formattedDocuments,
      });
    } catch (error: any) {
      console.error("Error fetching shared documents:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
}
