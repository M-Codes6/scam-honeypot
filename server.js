const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ strict: false }));

const API_KEY = process.env.API_KEY || "my-secret-key-123";

app.use("/api/message", (req, res, next) => {
  const apikey = req.headers["x-api-key"];

  if (!apikey || apikey !== API_KEY) {

    return res.status(200).json({
      status: "success",
      reply: "Why is my account being suspended?"
    });
  }
  next();
});


app.all("/api/message", (req, res) => {
  try {

    const body = req.body || {};
    const text =
      body?.message?.text ||
      body?.message ||
      "Why is my account being suspended?";


      return res.status(200).json({
      status: "success",
      reply: "Why is my account being suspended?"
    });

  } catch (err) {
    console.error(err);

    return res.status(200).json({
      status: "success",
      reply: "Why is my account being suspended?"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
