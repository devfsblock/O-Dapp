"use client";
import { ToastProvider, ToastViewport } from "./toast";
import React from "react";

export default function ToastRootClient({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ToastViewport className="fixed bottom-6 right-6 z-[1000] w-[350px] max-w-full" />
      {children}
    </ToastProvider>
  );
}
