import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen  gap-4">
      <Link
        href={{ pathname: "/client", query: { name: "Client" } }}
        className="w-60 px-8 py-5 bg-green-400 border-none border-r-8 rounded-md text-lg text-white font-bold"
      >
        Client
      </Link>
      <Link
        href={{
          pathname: "/accountmanager",
          query: { name: "Accountmnagaer" },
        }}
        className="w-60 px-8 py-5 bg-green-400 border-none border-r-8 rounded-md text-lg text-white font-bold"
      >
        Acoount Manager
      </Link>
    </div>
  );
}
