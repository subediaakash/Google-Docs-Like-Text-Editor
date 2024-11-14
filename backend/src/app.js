import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const prisma = new PrismaClient();

app.use(express.json());

const documentConnections = new Map();
    
app.listen(3000, () => {
  console.log("App listening on the port 3000");
});
