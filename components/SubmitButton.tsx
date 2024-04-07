"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="btn bg-blue-500 text-white"
      disabled={pending}
    >
      {children}
    </button>
  );
}
