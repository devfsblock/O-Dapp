'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPass) {
      setAuthenticated(true);
    } else {
      router.push("/dashboard");
    }
  };

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md w-full max-w-xs"
        >
          <label className="block mb-2 font-semibold">Admin Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2 mb-4"
            placeholder="Enter password"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    );
  }
  return <div>{children}</div>;
}