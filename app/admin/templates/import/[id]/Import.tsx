"use client";

import { CoderTemplate } from "@/types/coder";
import { cleanupUnusedTokens, importCoderTemplate } from "@/util/coder/template";
import { TemplateToken } from "@prisma/client";
import { redirect, useRouter } from "next/navigation";
import { startTransition, useState } from "react";

type Props = {
  template: CoderTemplate;
  token: TemplateToken;
};

export default function ImportButton({ template, token }: Props) {
  const [isImporting, setIsImporting] = useState(false);
  const { refresh } = useRouter();
  const importTemplate = async () => {
    setIsImporting(true);
    await importCoderTemplate(template, token);
    await cleanupUnusedTokens(); // Delete tokens that are not connected to any templates
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
