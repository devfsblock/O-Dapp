import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
// Import platform UI components
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { KeyIcon } from "./ui/key-icon";

const INVITATION_FLAG = "invitationVerified";

export default function InvitationCodeScreen() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // No auto-redirect here. Only handle redirect on successful code entry.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validCode = process.env.NEXT_PUBLIC_INVITATION_CODE;
    if (code.trim() === validCode) {
      localStorage.setItem(INVITATION_FLAG, "true");
      router.replace("/login");
    } else {
      setError("Invalid invitation code. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-black">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-white">Welcome to OanicAI Beta!</h1>
        <p className="mb-6 text-center text-gray-400">
          OanicAI is currently open to early access members and trusted community groups only.<br />
          If you have an invitation code, please enter it below.
        </p>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <KeyIcon />
            </span>
            <Input
              type="text"
              placeholder="Invitation Code"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="pl-10 pr-3 py-2 w-full bg-gray-800 text-white border border-gray-700 focus:border-[#4F6BFE] focus:ring-2 focus:ring-[#4F6BFE]"
              required
            />
          </div>
          <Button
            type="submit"
            className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#4F6BFE] to-purple-600 px-6 py-2 font-medium text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70"
          >
            <span className="relative z-10">Submit</span>
            <span className="absolute inset-0 z-0 bg-gradient-to-br from-[#4F6BFE] to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
          </Button>
        </form>
        {error && <div className="text-red-400 text-sm text-center mt-2 w-full">{error}</div>}
        <div className="mt-8">
          <div className="text-justify text-sm text-gray-400">
            <span className="block text-center">Thank you for being part of our journey!</span><br />
            If you don’t have an invitation code yet, kindly reach out to our team or wait until the public beta becomes available.<br />
            <div className="w-full h-0.5 mx-auto rounded-full bg-gradient-to-r from-[#4F6BFE] via-blue-400 to-purple-600 mt-6 mb-2" />
            <span className="block text-center">For the latest updates, follow us on our official <a href="https://x.com/oanic_ai" target="_blank" rel="noopener noreferrer" className="text-[#4F6BFE] underline">X</a> account and <a href="https://t.me/oanicai" target="_blank" rel="noopener noreferrer" className="text-[#4F6BFE] underline">Telegram</a>.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
