"use client"

import { toast as sonnerToast } from 'sonner';

export type ToastVariant = 'default' | 'destructive' | 'success' | 'error';

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

// Simple wrapper for Sonner toast notifications
function toast({ title, description, variant = 'default' }: ToastOptions) {
  const message = title || description || '';
  console.log("toast called ", title, description, variant);
  switch (variant) {
    case 'destructive':
    case 'error':
      sonnerToast.error(message, { description });
      break;
    case 'success':
    case 'default':
      sonnerToast.success(message, { description });
      break;
    default:
      sonnerToast(message, { description });
  }
}

function useToast() {
  return { toast };
}

export { useToast, toast };
