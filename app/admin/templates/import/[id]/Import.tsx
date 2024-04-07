"use client";

import { CoderTemplate } from "@/types/coder";
import { importCoderTemplate } from "@/util/coder/template";
import { redirect, useRouter } from "next/navigation";
import { startTransition, useState } from "react";

type Props = {
  template: CoderTemplate;
};

export default function ImportButton({ template }: Props) {
  const [isImporting, setIsImporting] = useState(false);
  const { refresh } = useRouter();
  const importTemplate = async () => {
    setIsImporting(true);
    await importCoderTemplate(template);
    startTransition(() => {
      refresh();
    });
  };
  return (
    <button
      className="btn bg-blue-500 disabled:bg-blue-200 text-white"
      onClick={importTemplate}
      disabled={isImporting}
    >
      {" "}
      Import{" "}
    </button>
  );
}
