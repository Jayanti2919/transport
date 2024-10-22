const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const geocodeApiKey = process.env.GEOCODE_API_KEY;

const router = express.Router();

router.route("/geocode").post(async (req, res) => {
  const { address } = req.body;
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${geocodeApiKey}`
    );
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: "Failed to geocode address" });
  }
});

module.exports = router;
