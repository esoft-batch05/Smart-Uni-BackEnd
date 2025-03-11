const express = require("express");
const sendEmail = require("../controllers/emailController");

const router = express.Router();

router.post("/send", async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await sendEmail(to, subject, text, html);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email failed to send", error: error.message });
  }
});

module.exports = router;
