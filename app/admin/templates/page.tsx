import { getAllCoderTemplates } from "@/util/coder/template";
import { getAllTemplates } from "@/util/db/template";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { DeleteTemplateButton } from "./Delete";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Templates",
};

export default async function Page() {
  const templates = await getAllCoderTemplates();
  const importedTemplates = await getAllTemplates();
  return (
    <div className="">
      <span className="text-2xl">Templates</span>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Last updated</th>
              <th scope="col">Version ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr key={template.id}>
                <td>{template.display_name || template.name}</td>
                <td>{new Date(template.updated_at).toLocaleString()}</td>
                <td>{template.active_version_id}</td>
                <td>
                  {importedTemplates.find((t) => t.id == template.id) !=
                  null ? (
                    <>
                      <Link
                        className="text-green-500 disabled:text-green-200 flex items-center"
                        href={`/admin/templates/edit/${template.id}`}
                      >
                        Edit <FaArrowRight className="pl-1" />
                      </Link>
                      <DeleteTemplateButton
                        disabled={false}
                        template={template}
                      />
                    </>
                  ) : (
                    <Link
                      className="text-blue-500 disabled:text-blue-200 flex items-center"
                      href={`/admin/templates/import/${template.id}`}
                    >
                      Configure Billing <FaArrowRight className="pl-1" />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
