"use client";

import Input from "@/components/Input";
import LoadingSpinner from "@/components/Loading";
import ReloadButton from "./Reload";
import PricingTable from "./PricingTable";
import { ReactNode, useEffect, useState } from "react";
import { PricingType, Template, TemplateResource } from "@prisma/client";
import { useRouter } from "next/navigation";
import FixedPricing from "./FixedPricing";

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  const router = useRouter();

  const [inputValues, setInputValues] = useState<any>({});

  const { id: templateId } = params;
  const [template, setTemplate] = useState<Template & { resources: TemplateResource[] } | null>(null);

  useEffect(() => {
    async function fetchTemplate() {
      const template = await fetch(`/api/templates/${templateId}`).then((res) => res.json());
      if (template.error) return router.push("/admin/templates");
      setTemplate(template);
    }
    fetchTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId])

  useEffect(() => {
    console.table(template)
  }, [template])

  const handlePricingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!template) return;
    const newTemplate = { ...template, pricingType: e.target.value as PricingType };
    setTemplate(newTemplate);
  }

  const handleInputChange = (values: any) => {
    setInputValues(values);
  }

  const handleFixedPriceChange = (newPrice: string) => {
    setTemplate({ ...template!, priceId: newPrice });
  }

  const submitTemplate = async () => {
    const newTemplate = template;
    for (const inputValue of Object.entries(inputValues)) {
      // Get the resource id from the input name
      const resourceId = inputValue[0].split("_")[1];
      // Get the price type from the input name
      const priceType = inputValue[0].split("_")[2];
      // Get the value from the input
      let value = inputValue[1] as string;

      if (isNaN(parseFloat(value))) value = "0";

      // Replace the price in the resource object
      newTemplate!.resources = newTemplate!.resources.map((resource) => {
        if (resource.id === resourceId) {
          if (priceType === "startedPrice") {
            resource.startedPrice = parseFloat(value);
          } else {
            resource.stoppedPrice = parseFloat(value);
          }
        }
        return resource;
      })
    }
    // Update the template using the API
    await fetch(`/api/templates/${templateId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTemplate),
    }).then((res) => {
      if (res.ok) {
        router.push("/admin/templates");
      }
    });
  }

  return (
    <>
      {template === null ? <LoadingSpinner size={64} /> : <div className="">
        <span className="text-2xl">Edit template {template?.displayName}</span>
        {/* <div className="relative top-0 right-0">
          <ReloadButton template={template} />
        </div> */}
        <div className="p-3">
          <label htmlFor="pricingType">Pricing type</label>
          <Input type="select" name="pricingType" onChange={handlePricingTypeChange} defaultValue={template.pricingType.toString()}>
            <option value="usageBased">Usage based</option>
            <option value="fixed">Fixed</option>
          </Input>
        </div>
        {(() => {
          switch (template.pricingType) {
            case "usageBased":
              return <PricingTable template={template} onValuesChanged={handleInputChange} />;
            case "fixed":
              return <FixedPricing onPriceChange={handleFixedPriceChange} template={template} />;
          }
        })()}
        <button className="btn bg-green-500" onClick={submitTemplate}>Save</button>
      </div>
      }
    </>
  );
}