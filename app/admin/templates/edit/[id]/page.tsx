import Input from "@/components/Input";
import { getPrisma } from "@/util/db";
import { redirect } from "next/navigation";
import { startTransition } from "react";

const prisma = getPrisma();

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const { id: templateId } = params;
  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });
  if (!template) redirect("/admin/templates");
  const editTemplate = async (formData: FormData) => {
    "use server";
    const startedPrice = Number(formData.get("price-started"));
    const stoppedPrice = Number(formData.get("price-stopped"));
    if (isNaN(startedPrice) || isNaN(stoppedPrice)) return;
    await prisma.template.update({
      where: {
        id: templateId,
      },
      data: {
        startedPrice,
        stoppedPrice,
      },
    });
    startTransition(() => {
      redirect(`/admin/templates`);
    });
  };
  return (
    <div className="">
      <span className="text-2xl">Edit template {template?.displayName}</span>
      <form action={editTemplate} className="p-1 w-[50%]">
        <label>Price per hour while started</label>
        <Input
          placeholder="$0.01/hour"
          name="price-started"
          defaultValue={template.startedPrice}
        />
        <label>Price per hour while stopped</label>
        <Input
          placeholder="$0.001/hour"
          name="price-stopped"
          defaultValue={template.stoppedPrice}
        />
        <button className="btn">Save</button>
      </form>
    </div>
  );
}
