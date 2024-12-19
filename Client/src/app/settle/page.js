"use client";
import React, { useEffect, useState } from "react";
import useLiveOrders from "../../Hooks/useLiveOrders";
import { io } from "socket.io-client";

export default function SettlementApp() {
  const [socket, setSocket] = useState();
  const { orders, sendOrderAction, readyState } = useLiveOrders();

  useEffect(() => {
    const socket = io("https://localhost:3001");
  }, []);

  const handleAction = (orderId, action) => {
    sendOrderAction(orderId, action); // Send action to WebSocket server
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Settlement Dashboard</h1>

      {/* WebSocket Status */}
      <p>
        WebSocket Status: {readyState === 1 ? "Connected" : "Connecting..."}
      </p>

      {/* Active Orders */}
      <div>
        <h2>Active Orders</h2>
        <ul>
          {orders.active.map((order) => (
            <li key={order.id} className="border p-2 my-2">
              {order.asset} - {order.quantity} @ {order.price}{" "}
              <button
                onClick={() => handleAction(order.id, "accept")}
                className="bg-green-500 text-white px-2 ml-2"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction(order.id, "reject")}
                className="bg-red-500 text-white px-2 ml-2"
              >
                Reject
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Order History */}
      <div>
        <h2>Order History</h2>
        <ul>
          {orders.history.map((order) => (
            <li key={order.id} className="border p-2 my-2">
              {order.asset} - {order.quantity} @ {order.price} -{" "}
              <strong>{order.status}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
