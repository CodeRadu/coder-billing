"use client";
import { updateCoderTemplate } from "@/util/coder/template";
import { Template } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FiRefreshCcw } from "react-icons/fi";

export default function ReloadButton({ template }: { template: Template }) {
  const router = useRouter();
  // Reimport the template from coder
  return (
    <button
      className="btn bg-gray-200 disabled:bg-gray-100 flex items-center"
      onClick={async () => {
        await updateCoderTemplate(template)
        router.refresh();
      }}
    >
      <FiRefreshCcw className="mr-1" />
      Refresh
    </button>
  );
}
