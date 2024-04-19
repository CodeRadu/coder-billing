"use client";

import { useState } from "react";

type Props = {
  children?: React.ReactNode;
  action?: (formData: FormData) => Promise<string | void>; // string represents an error message
  submitButtonChildren: React.ReactNode | string;
};

function SubmitButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      className="btn bg-blue-500 disabled:bg-blue-200 text-white"
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default function Form({
  children,
  action,
  submitButtonChildren,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  return (
    <form
      className="flex flex-col space-y-3"
      action={async (formData: FormData) => {
        if (!action) return;
        const result = await action(formData);
        if (result) setError(result);
        else setError(null);
        setSuccess(!result);
      }}
    >
      {error && <span className="text-red-500">{error}</span>}
      {success && <span className="text-green-500">Success</span>}
      {children}
      <SubmitButton>{submitButtonChildren}</SubmitButton>
    </form>
  );
}
