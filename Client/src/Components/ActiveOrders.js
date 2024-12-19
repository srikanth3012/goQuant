import React, { memo } from "react";

const ActiveOrders = ({
  name,
  activeOrders,
  handleAction,
  setSelectedOrder,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Active Orders</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Asset</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Price</th>
            {name === "Client" && (
              <th className="border px-4 py-2">Expiration</th>
            )}
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {activeOrders?.map((order) => (
            <tr key={order.id}>
              <td className="border px-4 py-2">{order.asset}</td>
              <td className="border px-4 py-2">{order.quantity}</td>
              <td className="border px-4 py-2">{order.price}</td>
              {name === "Client" && (
                <td className="border px-4 py-2">
                  {order?.expiration?.replace("T", " ").slice(0, 25)}
                </td>
              )}
              <td className="border px-4 py-2">
                {name === "Client" ? (
                  <button
                    onClick={() => handleAction(order)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Complete
                  </button>
                ) : (
                  <div className="flex justify-evenly">
                    <button
                      onClick={() => handleAction(order, "accept")}
                      className="bg-green-500 text-white rounded px-2 py-1"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(order, "reject")}
                      className="bg-red-500 text-white rounded px-2 py-1"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-yellow-500 text-white rounded px-2 py-1"
                    >
                      Modify
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(ActiveOrders);
