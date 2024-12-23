import { Request, Response, NextFunction } from "express";
import { AccessType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class UserController {
  static getUserInfo = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      const userInfo = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          // To - get the documents created by user
          createdDocuments: {
            select: {
              id: true,
              title: true,
              createdAt: true,
            },
          },
          // To get the documents shared with user
          permissionDocuments: {
            select: {
              id: true,
              title: true,
              owner: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          // Get detailed permissions
          DocumentPermission: {
            select: {
              accessType: true,
              document: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      });

      if (!userInfo) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Format response data
      const response = {
        userDetails: {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
        },
        documentStats: {
          createdDocumentsCount: userInfo.createdDocuments.length,
          sharedDocumentsCount: userInfo.permissionDocuments.length,
        },
        documents: {
          created: userInfo.createdDocuments.map((doc) => ({
            id: doc.id,
            title: doc.title,
            createdAt: doc.createdAt,
          })),
          sharedWithUser: userInfo.permissionDocuments.map((doc) => ({
            id: doc.id,
            title: doc.title,
            owner: doc.owner,
          })),
        },
        permissions: userInfo.DocumentPermission.map((perm) => ({
          documentTitle: perm.document.title,
          accessType: perm.accessType,
        })),
      };

      return res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error: any) {
      console.error("Error fetching user info:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
}
