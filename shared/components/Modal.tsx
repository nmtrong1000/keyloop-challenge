"use client";

import { useEffect, type ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/**
 * Plain div-based overlay, not the native <dialog> element — jsdom (used by
 * the Jest suite) doesn't implement HTMLDialogElement.showModal().
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-inverse-surface/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 flex w-full max-w-md flex-col gap-4 whitespace-normal rounded bg-surface-container-lowest p-6 shadow-elevated"
      >
        <div className="flex items-center justify-between gap-4">
          {title ? (
            <h2 className="font-headline text-headline-md text-on-surface">{title}</h2>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer text-on-surface-variant hover:text-on-surface"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
