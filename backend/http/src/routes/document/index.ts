import express from "express";
import { DocumentController } from "../../controllers/document.controller";
import { verifyToken } from "../../middlewares/auth.middleware";

const documentRouter = express.Router();
documentRouter.use(verifyToken);

documentRouter.post("", DocumentController.createDocument);

documentRouter.get("", DocumentController.getAllDocuments);

documentRouter.get("/:id", DocumentController.getDocument);

documentRouter.put("/:id", DocumentController.updateDocument);

documentRouter.post("/permission", DocumentController.givePermission);

export default documentRouter;
