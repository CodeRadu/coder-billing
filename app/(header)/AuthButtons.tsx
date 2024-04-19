"use client";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AuthButtons() {
  const session = useSession();

  if (session.status === "authenticated") return SignoutButton();
  return SigninButton();
}

function SigninButton() {
  function click() {
    redirect("/login");
  }
  return (
    <button
      onClick={click}
      className="btn text-sm font-semibold leading-6 text-gray-900"
    >
      Log in <span aria-hidden="true">&rarr;</span>
    </button>
  );
}

function SignoutButton() {
  return (
    <button
      onClick={() => {
        signOut({ callbackUrl: "/" });
      }}
      className="btn text-sm font-semibold leading-6 text-gray-900"
    >
      Sign out
    </button>
  );
}
