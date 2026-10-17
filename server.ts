
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
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

// Helper to write data
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

app.get("/api/audio", async (req, res) => {
  const targetUrl = (req.query.url as string) || '';
  if (!targetUrl) {
    const localAudio = path.join(__dirname, "public", "audio.mp3");
    if (fs.existsSync(localAudio)) return res.sendFile(localAudio);
    return res.status(400).json({ error: "URL query parameter is required" });
  }

  // Fast-path: if requesting default audio file, serve local file directly with 206 range support
  if (targetUrl.includes("1siGJh72zzAClKLIZT5qMW_f4w5mHX-Bm") || targetUrl.includes("audio.mp3") || targetUrl.includes("audio.m4a")) {
    const localAudio = path.join(__dirname, "public", "audio.mp3");
    const distAudio = path.join(__dirname, "dist", "audio.mp3");
    if (fs.existsSync(localAudio)) {
      return res.sendFile(localAudio);
    } else if (fs.existsSync(distAudio)) {
      return res.sendFile(distAudio);
    }
  }

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    if (req.headers.range) {
      headers['Range'] = req.headers.range;
    }

    const response = await fetch(targetUrl, {
      headers,
      redirect: 'follow'
    });

    res.status(response.status);

    const responseHeaders = [
      'content-type',
      'content-length',
      'content-range',
      'accept-ranges',
      'cache-control'
    ];

    responseHeaders.forEach(header => {
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
});

app.post("/api/data", authenticate, (req, res) => {
  const newData = req.body;
  const success = writeData(newData);
  
  res.json({ 
    success: true, 
    persisted: success,
    message: success ? "Changes saved to disk." : "Changes applied to session." 
  });
});

// --- VITE MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.use((req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
