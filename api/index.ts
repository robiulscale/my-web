
import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const SECRET = process.env.JWT_SECRET || "fallback-secret";
const DATA_FILE = path.join(process.cwd(), "data.json");

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors());

// Helper to read data
const readData = () => {
  try {
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading data.json:", error);
    return null;
  }
};

// Helper to write data (Note: This will only work in environments with persistent FS)
const writeData = (data: any) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing data.json:", error);
    return false;
  }
};

// Middleware to check admin auth
const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// --- API ROUTES ---

app.get("/api/data", (req, res) => {
  const data = readData();
  if (!data) return res.status(500).json({ error: "Could not load data" });
  res.json(data);
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || "admin@robiul.com";
  const adminPass = process.env.ADMIN_PASSWORD || "admin123";

  if (email === adminEmail && password === adminPass) {
    const token = jwt.sign({ email }, SECRET, { expiresIn: "24h" });
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    });
    return res.json({ success: true });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("admin_token");
  res.json({ success: true });
});

app.get("/api/auth-check", authenticate, (req, res) => {
  res.json({ authenticated: true });
});

app.post("/api/data", authenticate, (req, res) => {
  const newData = req.body;
  // On Vercel, this will fail because the filesystem is read-only.
  // We attempt it, but return success: true regardless so the UI updates in memory.
  const success = writeData(newData);
  
  res.json({ 
    success: true, 
    persisted: success,
    message: success ? "Changes saved to disk." : "Changes applied to session. (Note: Vercel is stateless, download config to save permanently.)" 
  });
});

export default app;
