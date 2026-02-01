const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 API KEY MIDDLEWARE (FIXED)
app.use((req, res, next) => {
  const apikey = req.headers["x-api-key"];
  const API_KEY = process.env.API_KEY || "my-secret-key-123";

  if (!apikey || apikey !== API_KEY) {
    return res.status(401).json({
      error: "Unauthorized: Invalid API KEY"
    });
  }

  next();
});

function detectScam(message) {
  if (!message) return false;

  const keywords = ["upi", "otp", "kyc", "click", "link", "verify"];
  return keywords.some(k => message.toLowerCase().includes(k));
}

function extractUPI(message) {
  if (!message) return [];
  const regex = /\b[\w.-]+@[\w.-]+\b/g;
  return message.match(regex) || [];
}

function extractLinks(message) {
  if (!message) return [];
  const regex = /https?:\/\/\S+/g;
  return message.match(regex) || [];
}

// ✅ BULLETPROOF ENDPOINT
app.post("/api/message", (req, res) => {
  const body = req.body || {};
  const message = body.message || "";

  const isScam = detectScam(message);

  res.json({
    is_scam: isScam,
    confidence: isScam ? 0.9 : 0.1,
    engagement: {
      turns: 1,
      duration_seconds: 15
    },
    extracted_intelligence: {
      bank_accounts: [],
      upi_ids: extractUPI(message),
      phishing_links: extractLinks(message)
    },
    agent_reply: isScam
      ? "I am not very sure, can you please share details again?"
      : "Hello, how can I help you?"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
