import { getCoderTemplate } from "@/util/coder/template";
import { env } from "@/util/env";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ImportButton from "./Import";
import { getTemplate } from "@/util/db/template";
import { redirect } from "next/navigation";
import { getPrisma } from "@/util/db";

type Props = {
  params: {
    id: string;
  };
};

const prisma = getPrisma();

export async function generateMetadata({ params }: Props) {
  const id = params.id;
  const template = await getCoderTemplate(id);
  return {
    title: `Import template ${template?.display_name || template?.name}`,
  };
}

export default async function Page({ params }: Props) {
  const template = await getCoderTemplate(params.id);
  const importedTemplate = await getTemplate(params.id);
  const newToken = await prisma.templateToken.create({ data: {} });
  if (importedTemplate) redirect(`/admin/templates/edit/${params.id}`);
  return (
    <div>
      <span className="text-2xl">
        Import{" "}
        {template.display_name
          ? `${template.display_name} (${template.name})`
          : template.name}
      </span>
      <div className="p-5">
        Modify the <code className="bg-gray-200 rounded p-1">main.tf</code> file
        to include a webhook to Coder Billing. This webhook will tell Coder
        Billing when the workspace has been started, stopped or deleted.
        <div className="p-5">
          Add the <code className="bg-gray-200 rounded p-1">http</code> data
          source anywhere in <code className="bg-gray-200 rounded p-1">main.tf</code>:
          <SyntaxHighlighter language="terraform" showLineNumbers={true}>
            {`...
data "http" "billing_wh" {
  url = "${env.NEXTAUTH_URL}/api/workspaces/${template.name}"
  method = "POST"
  request_headers = {
    Authorization: "Bearer $\{file("./billing-token.txt")\}"
  }
  request_body = <<EOB
    {
      "workspaceId": "$\{data.coder_workspace.me.id\}",
      "transition": "$\{data.coder_workspace.me.transition\}"
    }
  EOB
  lifecycle {
    postcondition {
      condition = contains([200], self.status_code)
      error_message = "Failed to send billing webhook"
    }
  }
}
...`}
          </SyntaxHighlighter>
          And add the following token to the{" "}
          <code className="bg-gray-200 rounded p-1">billing-token.txt</code>{" "}
          file:
          <SyntaxHighlighter language="plaintext" showLineNumbers={true}>
            {newToken.id}
          </SyntaxHighlighter>
        </div>
        <ImportButton template={template} token={newToken} />
      </div>
    </div>
  );
}
