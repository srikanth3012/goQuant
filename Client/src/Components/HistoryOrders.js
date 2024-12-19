import React from "react";

const HistoryOrders = ({ name, orderHistory }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Order History</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Asset</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Price</th>

            <th className="border px-4 py-2">
              {name === "Client" ? "Expiration" : "Status"}
            </th>
          </tr>
        </thead>
        <tbody>
          {orderHistory?.map((order) => (
            <tr key={order.id}>
              <td className="border px-4 py-2">{order.asset}</td>
              <td className="border px-4 py-2">{order.quantity}</td>
              <td className="border px-4 py-2">{order.price}</td>

              <td className="border px-4 py-2">
                {name === "Client"
                  ? order.expiration.replace("T", " ").slice(0, 25)
                  : order?.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryOrders;
