const express = require("express");
const app = express();
require("dotenv").config();
const liveChatRoutes = require("./routes/livechat");
const axios = require("axios");

app.use(express.json());
app.use("/api/livechat", liveChatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    const response = await axios.post(
      "https://api.livechatinc.com/v3.5/agent/action/set_routing_status",
      { status: "accepting_chats" },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.LIVECHAT_ACCOUNT_ID}:${process.env.LIVECHAT_PAT}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Agent status set to accepting_chats:", response.data);
  } catch (err) {
    console.error(
      "Failed to set agent status:",
      err.response?.data || err.message
    );
  }
});
