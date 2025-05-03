const BASE_URL = "http://localhost:4000";

export async function fetchChats(filters = {}) {
  // Calls your Node route: POST /api/livechat/list_chats
  const res = await fetch(`${BASE_URL}/api/livechat/list_chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filters }), // optional filters
  });

  if (!res.ok) {
    throw new Error("Failed to fetch chats via Node proxy");
  }

  const data = await res.json();
  // data.chats is from LiveChat’s "list_chats" response
  return data.chats;
}

export async function fetchSingleChat(chatId) {
  // Calls your Node route: POST /api/livechat/get_chat
  const res = await fetch(`${BASE_URL}/api/livechat/get_chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chat_id: chatId }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch single chat via Node proxy");
  }

  const data = await res.json();
  // data.chat is from LiveChat’s "get_chat" response
  return data.chat;
}

export async function sendMessage(chatId, message) {
  // Calls your Node route: POST /api/livechat/send_event
  const res = await fetch(`${BASE_URL}/api/livechat/send_event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message, // We pass "text" instead of "event: { ... }"
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to send message via Node proxy");
  }

  const data = await res.json();
  // data is from LiveChat’s "send_event" response
  return data;
}
