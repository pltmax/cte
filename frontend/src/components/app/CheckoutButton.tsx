"use client";

import { useTransition } from "react";

interface CheckoutButtonProps {
  action: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function CheckoutButton({
  action,
  children,
  className,
  disabled,
}: CheckoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={disabled || isPending}
      onClick={() => startTransition(action)}
      className={className}
    >
      {isPending ? "Chargement…" : children}
    </button>
  );
}
