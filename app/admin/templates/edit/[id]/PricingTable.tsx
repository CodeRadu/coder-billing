"use client";

import Input from "@/components/Input";
import { Prisma, Template, TemplateResource } from "@prisma/client";
import { useEffect, useState } from "react";

export default function PricingTable({ template, onValuesChanged }: { template: Template & { resources: TemplateResource[] }, onValuesChanged: (values: any) => void }) {
  const [inputValues, setInputValues] = useState(() => {
    const initialValues: any = {}
    template.resources.forEach((resource) => {
      initialValues[`resource_${resource.id}_startedPrice`] = resource.startedPrice?.toString() || "";
      initialValues[`resource_${resource.id}_stoppedPrice`] = resource.stoppedPrice?.toString() || "";
    })
    return initialValues
  })

  useEffect(() => {
    onValuesChanged(inputValues)
  }, [inputValues, onValuesChanged])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev: any) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return <form className="p-1">
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
                    name={`resource_${resource.id}_startedPrice`}
                    defaultValue={resource.startedPrice?.toString()}
                    onChange={handleChange}
                    placeholder="0.00/hour"
                  />
                </td>
                <td>
                  <Input
                    type="text"
                    name={`resource_${resource.id}_stoppedPrice`}
                    defaultValue={resource.stoppedPrice?.toString()}
                    onChange={handleChange}
                    placeholder="0.00/hour"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </form>
}