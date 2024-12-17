import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth";
import documentRouter from "./routes/document";
import cors from 'cors'

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());

app.use("/auth", authRouter);
app.use("/document", documentRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
