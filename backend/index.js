const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const helmet = require('helmet');
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || "development";

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// GETs top 100 coins by market cap from CoinGecko API
// API documentation here: https://www.coingecko.com/api/documentations/v3#/coins/get_coins_markets
app.get("/api/coins", (req, res) => {
  const CoinGeckoBaseURL = "https://api.coingecko.com/api/v3";
  const path = "/coins/markets";
  const query = {
    vs_currency: "usd",
    page: 1
  };
  const header = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  async function fetchCoins() {
    try {
      const response = await axios.get(
        `${CoinGeckoBaseURL}${path}`,
        {
          headers: header,
          params: query
        }
      );
      const coinData = await response.data;
      res.json({ coins: coinData });
    } catch (err) {
      console.log(err);
    }
  }
  fetchCoins();
});

if (ENV == "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("/*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/build/index.html"),
      (err) => {
        if (err) {
          res.status(500).send(err);
        }
      }
    );
  });
};

app.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});