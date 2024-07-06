const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const corsOptions = {
  origin: "https://monk-commerce-client.netlify.app",
  optionsSuccessStatus: 200,
};
const port = 5000;
app.use(cors(corsOptions));
const apiKey = process.env.API_KEY;
app.get("/api/task/products/search", async (req, res) => {
  const { search, page } = req.query;
  const url = `http://stageapi.monkcommerce.app/task/products/search?search=${search}&page=${page}&limit=10`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
