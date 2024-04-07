"use client";

import { createPortalSession } from "./portalAction";

export default function PortalButton({ customerId }: { customerId: string }) {
  const handleClick = async () => {
    const { url } = await createPortalSession(customerId);
    window.location.href = url;
  };
  return (
    <button className="btn bg-blue-500 text-white" onClick={handleClick}>
      Manage subscription
    </button>
  );
}
