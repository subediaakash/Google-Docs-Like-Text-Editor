import express from "express";
import { verifyToken } from "../../middlewares/auth.middleware";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const userRouter = express.Router();
userRouter.use(verifyToken);

userRouter.get("", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
      where: {
        NOT: {
          id: req.user?.id,
        },
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default userRouter;