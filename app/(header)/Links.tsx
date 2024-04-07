"use client";

import { getUser } from "@/util/db/user";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Link = {
  href: string;
  label: string;
  protected?: boolean;
  admin?: boolean;
};

const links: Link[] = [
  { href: "/dashboard", label: "Dashboard", protected: true },
  { href: "/admin/templates", label: "Templates", admin: true },
  { href: "/admin/users", label: "Users", admin: true },
];

export default function Links() {
  const [user, setUser] = useState<User | null>(null);
  const session = useSession();

  useEffect(() => {
    if (!session.data) return setUser(null);
    getUser(session.data).then(setUser);
  }, [session.data]);

  return (
    <>
      {links.map((link) => {
        if (link.protected && !session.data) return null;
        if (link.admin && (!user || !user.admin)) return null;
        return (
          <Link
            href={link.href}
            key={link.href}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
