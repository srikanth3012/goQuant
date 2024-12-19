"use client";
import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { io } from "socket.io-client";
import HistoryOrders from "@/Components/HistoryOrders";
import ActiveOrders from "@/Components/ActiveOrders";
import { useSearchParams } from "next/navigation";

const OrderSchema = z.object({
  asset: z.string().nonempty("Asset is required"),
  quantity: z.number().min(0.01, "Quantity must be at least 0.01"),
  price: z.number().min(0.01, "Price must be at least 0.01"),
  // date: z.instanceof(Date, "Date is required"),
});

export default function Client() {
  const [symbols, setSymbols] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [socket, setSocket] = useState();
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Guest";
  const [date, setDate] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(OrderSchema),
  });

  useEffect(() => {
    const newSocket = io("http://localhost:5000/");
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    if (!socket) return;

    setTimeout(() => setSocket(socket), 10000);

    socket.on("activedItems", (data) => setActiveOrders(data));
    socket.on("orderHistory", (data) => setOrderHistory(data));

    return () => {
      socket.disconnect();
      socket.off("activedItems");
      socket.off("orderHistory");
    };
  }, [socket]);

  useEffect(() => {
    fetch("https://api.binance.com/api/v3/exchangeInfo")
      .then((response) => response.json())
      .then((response) => {
        const availableSymbols = response?.symbols?.map((s) => s.symbol);
        setSymbols(availableSymbols);
      })
      .catch((error) => console.error("Error fetching symbols:", error));
  }, []);

  const onSubmit = (data) => {
    const newOrder = { ...data, id: Date.now(), expiration: date.toString() };
    setActiveOrders([newOrder, ...activeOrders]);
    socket.emit("activeItems", newOrder);
  };

  const completeOrder = useCallback(
    (order) => {
      setActiveOrders(activeOrders.filter((o) => o.id !== order.id));
      setOrderHistory((prev) => [...prev, order]);
      socket.emit("orderHistory", { ...order, status: "Completed" });
    },
    [activeOrders, orderHistory]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Order Placement</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Asset</label>
          <select
            {...register("asset")}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Select an asset</option>
            {symbols.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.asset && (
            <p className="text-red-500 text-sm">{errors.asset.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input
            type="number"
            step="0.01"
            {...register("quantity", { valueAsNumber: true })}
            className="w-full border rounded px-2 py-1"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm">{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="w-full border rounded px-2 py-1"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Expiration</label>
          <div className="w-max border rounded-md px-2 py-1">
            <DatePicker
              selected={date}
              onChange={(newDate) => setDate(newDate)}
              className="w-full px-5 py-2"
              calendarClassName="bg-white border border-gray-200 rounded-md shadow-lg p-4"
              showTimeSelect
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="yyyy-MM-dd h:mm aa"
              placeholderText="Pick specific date and time"
              minDate={new Date()}
            />
          </div>
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Place Order
        </button>
      </form>

      <ActiveOrders
        name={name}
        activeOrders={activeOrders}
        handleAction={completeOrder}
      />

      <HistoryOrders name={name} orderHistory={orderHistory} />
    </div>
  );
}
