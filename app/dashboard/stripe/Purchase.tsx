"use client";

import { Dialog } from "@headlessui/react";
import LoadingSpinner from "@/components/Loading";
import { FaArrowRight, FaPlus, FaTrashCan } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { Template } from "@prisma/client";
import Input from "@/components/Input";
import { Label } from "@/components/ui/label";
import Stripe from "stripe";

async function handlePurchase(selected: string) {
  // Get the selected template
  let res = await (await fetch(`/api/templates/${selected}`)).json();
  const price = res.priceId;

  // Update subscription
  res = await fetch(`/api/stripe/subscriptions/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ priceId: price }),
  })

  if (res.status !== 200) {
    alert("Failed to update subscription");
  }
  alert("Subscription updated successfully");
}

export default function PurchaseButton({ disabled }: { disabled: boolean }) {
  const [purchase, setPurchase] = useState(false);

  return <button disabled={disabled} title="Purchase workspace" className="p-2 bg-transparent hover:bg-gray-200 rounded-md duration-100 disabled:text-gray-300 disabled:hover:bg-transparent" onClick={() => { setPurchase(true) }}>
    <FaPlus />
    {purchase && (
      <PurchaseModal cancelAction={() => { setPurchase(false) }} confirmAction={(selected) => {
        handlePurchase(selected);
        setPurchase(false);
      }} />
    )}
  </button>
}

type PurchaseModalProps = {
  cancelAction: () => void;
  confirmAction: (selected: string) => void;
};

function PurchaseModal({
  cancelAction,
  confirmAction,
}: PurchaseModalProps) {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    async function fetchTemplates() {
      const res = await fetch("/api/templates");
      const data = await res.json();
      setTemplates(data);
    }
    fetchTemplates();
  }, [])

  useEffect(() => {
    console.log(templates)
  }, [templates])

  return (
    <Dialog
      as="div"
      className="relative z-10"
      onClose={cancelAction}
      open={true}
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FaArrowRight />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Purchase Workspace
                  </Dialog.Title>
                  <div className="mt-2">
                    {templates.length == 0 && (<span>Loading...</span>)}
                    <Label>Choose a template:</Label>
                    <Input type="select" name="template" value={selected} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelected(e.target.value)}>
                      <option>Select a template</option>
                      {templates.map((template: Template) => {
                        return <option key={template.id} value={template.id}>{template.displayName}</option>
                      })}
                    </Input>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 disabled:bg-blue-200 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 sm:ml-3 sm:w-auto"
                onClick={() => confirmAction(selected)}
              >
                Update subscription
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => cancelAction()}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}