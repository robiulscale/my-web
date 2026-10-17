import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const SECRET = process.env.JWT_SECRET || "fallback-secret";
const DATA_FILE = path.join(process.cwd(), "data.json");

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors());

// In-memory cache for serverless environments where filesystem may be read-only
let memoryData: any = null;

// Helper to read data safely
const readData = () => {
  if (memoryData) return memoryData;

  const candidatePaths = [
    DATA_FILE,
    path.join(__dirname, "..", "data.json"),
    path.join(__dirname, "data.json"),
    path.resolve("./data.json")
  ];

  for (const filePath of candidatePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        memoryData = JSON.parse(content);
        return memoryData;
      }
    } catch (err) {
      console.warn(`Could not read data from ${filePath}:`, err);
    }
  }

  return null;
};

// Helper to write data
const writeData = (data: any) => {
  memoryData = data;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.warn("Could not write to disk (likely serverless/Vercel read-only filesystem):", error);
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

// --- HANDLERS ---

const handleGetData = (req: any, res: any) => {
  const data = readData();
  if (!data) return res.status(500).json({ error: "Could not load data" });
  res.json(data);
};

const handlePostLogin = (req: any, res: any) => {
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
};

const handlePostLogout = (req: any, res: any) => {
  res.clearCookie("admin_token");
  res.json({ success: true });
};

const handleAuthCheck = (req: any, res: any) => {
  res.json({ authenticated: true });
};

const handlePostData = (req: any, res: any) => {
  const newData = req.body;
  const success = writeData(newData);
  res.json({
    success: true,
    persisted: success,
    message: success
      ? "Changes saved to disk."
      : "Changes applied to session (Vercel serverless environment is stateless)."
  });
};

const handleGetAudio = async (req: any, res: any) => {
  const targetUrl = (req.query.url as string) || "";
  if (!targetUrl) {
    const localAudio = path.join(process.cwd(), "public", "audio.mp3");
    if (fs.existsSync(localAudio)) return res.sendFile(localAudio);
    return res.status(400).json({ error: "URL query parameter is required" });
  }

  // Fast-path: if requesting default audio file, serve local file directly with 206 range support
  if (
    targetUrl.includes("1siGJh72zzAClKLIZT5qMW_f4w5mHX-Bm") ||
    targetUrl.includes("audio.mp3") ||
    targetUrl.includes("audio.m4a")
  ) {
    const localAudio = path.join(process.cwd(), "public", "audio.mp3");
    const distAudio = path.join(process.cwd(), "dist", "audio.mp3");
    if (fs.existsSync(localAudio)) {
      return res.sendFile(localAudio);
    } else if (fs.existsSync(distAudio)) {
      return res.sendFile(distAudio);
    }
  }

  try {
    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    };
    if (req.headers.range) {
      headers["Range"] = req.headers.range;
    }

    const response = await fetch(targetUrl, {
      headers,
      redirect: "follow"
    });

    res.status(response.status);

    const responseHeaders = [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
      "cache-control"
    ];

    responseHeaders.forEach((header) => {
      const value = response.headers.get(header);
      if (value) {
        res.setHeader(header, value);
      }
    });

    if (response.body) {
      const reader = response.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            break;
          }
          res.write(Buffer.from(value));
        }
      } catch (streamErr) {
        console.error("Stream piping error:", streamErr);
        res.destroy();
      }
    } else {
      res.end();
    }
  } catch (err: any) {
    console.error("Audio proxy error:", err);
    res.status(500).json({ error: "Failed to proxy audio: " + err.message });
  }
};

// Router setup: Handles routes both with and without "/api" prefix for full Vercel compatibility
const router = express.Router();

router.get("/data", handleGetData);
router.post("/login", handlePostLogin);
router.post("/logout", handlePostLogout);
router.get("/auth-check", authenticate, handleAuthCheck);
router.post("/data", authenticate, handlePostData);
router.get("/audio", handleGetAudio);

app.use("/api", router);
app.use("/", router);

export default app;
