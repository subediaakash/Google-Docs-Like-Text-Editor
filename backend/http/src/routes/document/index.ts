import express from "express";
import { DocumentController } from "../../controllers/document.controller";
import { verifyToken } from "../../middlewares/auth.middleware";

const documentRouter = express.Router();

documentRouter.post("/create", verifyToken, DocumentController.createDocument);

documentRouter.get("/", verifyToken, DocumentController.getAllDocuments);

documentRouter.get("/:id", verifyToken, DocumentController.getDocument);

documentRouter.put("/:id", verifyToken, DocumentController.updateDocument);

export default documentRouter;
