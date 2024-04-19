"use client";

import Link from "next/link";
import { FaComputer, FaWallet } from "react-icons/fa6";

export default function SideBar() {
  return (
    <div className="fixed left-0 h-screen w-16 m-0 flex flex-col bg-gray-200 shadow-lg">
      <i>
        <Link href="/dashboard">
          <SideBarIcon icon={<FaComputer size={32} />} text="Workspaces" />
        </Link>
      </i>
      <i>
        <Link href="/dashboard/stripe">
          <SideBarIcon icon={<FaWallet size={32} />} text="Billing" />
        </Link>
      </i>
    </div>
  );
}

function SideBarIcon({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="relative flex items-center justify-center w-16 h-16 text-gray-800 hover:bg-gray-500 transition-all duration-200 ease-in-out cursor-pointer group">
      {icon}
      <span className="absolute w-auto p-2 m-2 min-w-max left-16 rounded-md shadow-md text-white bg-gray-900 text-xs font-bold transition-all duration-100 origin-left scale-0 group-hover:scale-100">
        {text}
      </span>
    </div>
  );
}
