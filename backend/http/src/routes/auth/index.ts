import { Router } from "express";
import { login, register } from "../../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/signup", register);
authRouter.post("/signin", login);
