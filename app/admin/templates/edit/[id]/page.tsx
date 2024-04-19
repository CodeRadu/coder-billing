import Input from "@/components/Input";
import { getPrisma } from "@/util/db";
import { redirect } from "next/navigation";

const prisma = getPrisma();

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const id = params.id;
  const template = await prisma.template.findUnique({
    where: { id },
  });
  return {
    title: `Edit template ${template?.displayName || template?.name}`,
  };
}

export default async function Page({ params }: Props) {
  const { id: templateId } = params;
  const template = await prisma.template.findUnique({
    where: { id: templateId },
    include: { resources: true },
  });
  if (!template) redirect("/admin/templates");
  const editTemplate = async (formData: FormData) => {
    "use server";
    const template = await prisma.template.findUnique({
      where: { id: formData.get("templateId") as string },
      include: { resources: true },
    });
    const resources = template!.resources.map((resource) => {
      const startedPrice = formData.get(
        `resource-${resource.id}-started-price`
      ) as string;
      const stoppedPrice = formData.get(
        `resource-${resource.id}-stopped-price`
      ) as string;
      return {
        id: resource.id,
        startedPrice: parseFloat(startedPrice) || null,
        stoppedPrice: parseFloat(stoppedPrice) || null,
      };
    });
    resources.forEach(async (resource) => {
      await prisma.templateResource.update({
        where: { id: resource.id },
        data: {
          startedPrice: resource.startedPrice,
          stoppedPrice: resource.stoppedPrice,
        },
      });
    });
    redirect("/admin/templates");
  };
  return (
    <div className="">
      <span className="text-2xl">Edit template {template?.displayName}</span>
      <form action={editTemplate} className="p-1">
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Resource name</th>
                <th>Resource type</th>
                <th>Started price</th>
                <th>Stopped price</th>
              </tr>
            </thead>
            <tbody>
              <input type="hidden" name="templateId" value={template.id} />
              {template.resources.map((resource) => {
                return (
                  <tr key={resource.id}>
                    <td>{resource.name}</td>
                    <td>{resource.type}</td>
                    <td>
                      <Input
                        type="text"
                        name={`resource-${resource.id}-started-price`}
                        defaultValue={resource.startedPrice?.toString()}
                        placeholder="0.00/hour"
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        name={`resource-${resource.id}-stopped-price`}
                        defaultValue={resource.stoppedPrice?.toString()}
                        placeholder="0.00/hour"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button className="btn bg-green-500">Save</button>
      </form>
    </div>
  );
}
