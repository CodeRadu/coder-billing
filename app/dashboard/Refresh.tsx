"use client";
import { useRouter } from "next/navigation";
import { FiRefreshCcw } from "react-icons/fi";

export default function RefreshButton() {
  const router = useRouter();
  return (
    <button
      className="btn bg-gray-200 disabled:bg-gray-100 flex items-center"
      onClick={() => {
        router.refresh();
      }}
    >
      <FiRefreshCcw className="mr-1" />
      Refresh
    </button>
  );
}
