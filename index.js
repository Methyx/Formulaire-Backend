const express = require("express");
const cors = require("cors");
const formData = require("form-data");
require("dotenv").config();

const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "api",
  key: process.env.API_KEY,
});

const app = express();
app.use(express.json());
app.use(cors());

app.post("/form", async (req, res) => {
  try {
    const messageData = {
      from: `${req.body.firstname} ${req.body.lastname} <${req.body.email}>`,
      to: "methyx95@gmail.com",
      subject: req.body.subject,
      text: req.body.message,
    };
    const responseMailgun = await client.messages.create(
      process.env.DOMAIN,
      messageData
    );
    // console.log(responseMailgun);
    res.json({ message: "reçu", mailgun: responseMailgun });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  try {
    res.status(401).json({ message: "unauthorized" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is OK");
});
