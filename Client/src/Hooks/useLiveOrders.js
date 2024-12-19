import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";

const SOCKET_URL = "ws://localhost:3000/"; // Replace with your server's WebSocket URL

export default function useLiveOrders() {
  const [orders, setOrders] = useState({
    active: [{ asset: "BTC", quantity: 20, price: 400 }],
    history: [],
  });

  const { sendMessage, lastMessage, readyState } = useWebSocket(SOCKET_URL, {
    onOpen: () => console.log("WebSocket Connected"),
    onClose: () => console.log("WebSocket Disconnected"),
    onError: (e) => console.error("WebSocket Error:", e),
    shouldReconnect: () => true, // Auto-reconnect on disconnect
  });

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage !== null) {
      const messageData = JSON.parse(lastMessage.data);

      switch (messageData.type) {
        case "new_order":
          setOrders((prev) => ({
            ...prev,
            active: [...prev.active, messageData.order],
          }));
          break;
        case "order_update":
          setOrders((prev) => ({
            active: prev.active.map((order) =>
              order.id === messageData.order.id ? messageData.order : order
            ),
            history:
              messageData.order.status !== "Pending"
                ? [...prev.history, messageData.order]
                : prev.history,
          }));
          break;
        default:
          console.warn("Unhandled message type:", messageData.type);
      }
    }
  }, [lastMessage]);

  // Function to send actions to the WebSocket server
  const sendOrderAction = (orderId, action) => {
    const message = { action, orderId };
    sendMessage(JSON.stringify(message));
  };

  return { orders, sendOrderAction, readyState };
}
