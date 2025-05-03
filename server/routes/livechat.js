// server/routes/livechat.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// Load from environment
const { LIVECHAT_PAT, LIVECHAT_ACCOUNT_ID } = process.env;

// The base URL for the LiveChat Agent Web API v3.5 (per docs)
const LIVECHAT_BASE_URL = "https://api.livechatinc.com/v3.5/agent/action";

// For region-based tokens: if your token starts with "fra:", set X-Region: "fra"
const regionHeader = LIVECHAT_PAT?.startsWith("fra:")
  ? { "X-Region": "fra" }
  : {};

// Build a function to generate the Basic Auth header: "Basic base64(accountId:PAT)"
function getBasicAuthHeader() {
  const raw = `${LIVECHAT_ACCOUNT_ID}:${LIVECHAT_PAT}`;
  // e.g. "9f1c25f7-c15e-4e92-b604-36c551e591ad:dal:mzxzIIfPts32NBlJ5uJv281nE38"
  const base64 = Buffer.from(raw).toString("base64");
  return `Basic ${base64}`;
}

/**
 * GET /api/livechat/chats
 * Wraps the "list_chats" method from the LiveChat docs.
 */
router.get("/chats", async (req, res) => {
  try {
    const response = await axios.post(
      `${LIVECHAT_BASE_URL}/list_chats`,
      // Minimal payload: can be empty or add filters if you like
      {},
      {
        headers: {
          Authorization: getBasicAuthHeader(),
          "Content-Type": "application/json",
          ...regionHeader,
        },
      }
    );

    // If successful, response.data should have the "chats_summary" array
    return res.json(response.data);
  } catch (error) {
    console.error("Error listing chats:", error.message);
    // Log the *full* error response to see the root cause
    console.error("Response data:", error?.response?.data);

    return res.status(500).json({ error: "Failed to list chats." });
  }
});

/**
 * GET /api/livechat/chats/:chatId
 * Wraps the "get_chat" method from the LiveChat docs.
 */
router.get("/chats/:chatId", async (req, res) => {
  const { chatId } = req.params;
  try {
    const response = await axios.post(
      `${LIVECHAT_BASE_URL}/get_chat`,
      { chat_id: chatId },
      {
        headers: {
          Authorization: getBasicAuthHeader(),
          "Content-Type": "application/json",
          ...regionHeader,
        },
      }
    );
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching chat details:", error.message);
    console.error("Response data:", error?.response?.data);

    return res.status(500).json({ error: "Failed to fetch chat details." });
  }
});

/**
 * POST /api/livechat/chats/:chatId/send
 * Wraps the "send_event" method from the LiveChat docs (sending a message).
 */
router.post("/chats/:chatId/send", async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;

  try {
    const response = await axios.post(
      `${LIVECHAT_BASE_URL}/send_event`,
      {
        chat_id: chatId,
        event: {
          type: "message",
          text: message,
          visibility: "all", // "all" means both customer and agents see it
        },
      },
      {
        headers: {
          Authorization: getBasicAuthHeader(),
          "Content-Type": "application/json",
          ...regionHeader,
        },
      }
    );
    return res.json(response.data);
  } catch (error) {
    console.error("Error sending message:", error.message);
    console.error("Response data:", error?.response?.data);

    return res.status(500).json({ error: "Failed to send message." });
  }
});

module.exports = router;
