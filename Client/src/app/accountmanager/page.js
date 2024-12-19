"use client";

import { useState, useEffect, useCallback } from "react";
import ActiveOrders from "@/Components/ActiveOrders";
import HistoryOrders from "@/Components/HistoryOrders";
import { useSearchParams } from "next/navigation";
import { io } from "socket.io-client";

export default function Settlement() {
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [socket, setSocket] = useState(null);
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  // Initialize socket connection
  useEffect(() => {
    if (!socket) return;
    const newSocket = io("http://localhost:5000");

    setTimeout(() => setSocket(newSocket), 5000);

    socket.on("activedItems", (data) => setActiveOrders(data || []));
    socket.on("orderHistory", (data) => setOrderHistory(data || []));

    return () => {
      socket.off();
    };
  }, [socket]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
  }, []);

  // Handle action (modify or complete orders)
  const handleAction = useCallback(
    (order, action) => {
      const modifiedOrder = { ...order, status: `${action}ed` };

      if (action === "modify") {
        const updatedOrders = activeOrders.map((item) =>
          item?.id === order.id ? modifiedOrder : item
        );
        setActiveOrders(updatedOrders);
        socket.emit("activeItems", modifiedOrder);
      } else {
        setOrderHistory((prev) => [...prev, modifiedOrder]);
        setActiveOrders((prev) => prev.filter((item) => item?.id !== order.id));
        socket.emit("orderHistory", modifiedOrder);
      }
    },
    [activeOrders, socket]
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settlement Interface</h1>

      {/* Active Orders */}
      <ActiveOrders
        name={name}
        activeOrders={activeOrders}
        handleAction={handleAction}
        setSelectedOrder={setSelectedOrder}
      />

      {/* Modify Order Section */}
      {selectedOrder && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Modify Order</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Quantity</label>
              <input
                type="number"
                value={selectedOrder.quantity}
                onChange={(e) =>
                  setSelectedOrder((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block font-medium">Price</label>
              <input
                type="number"
                value={selectedOrder.price}
                onChange={(e) =>
                  setSelectedOrder((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  handleAction(selectedOrder, "modify");
                  setSelectedOrder(null);
                }}
                className="bg-blue-500 text-white rounded px-4 py-2"
              >
                Save Changes
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-500 text-white rounded px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order History */}
      <HistoryOrders orderHistory={orderHistory} />
    </div>
  );
}
