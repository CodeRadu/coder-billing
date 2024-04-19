"use client";

import { CoderTemplate } from "@/types/coder";
import { deleteTemplate } from "@/util/db/template";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";

export function DeleteTemplateButton({
  template,
  disabled,
}: {
  template: CoderTemplate;
  disabled: boolean;
}) {
  const [templateToDelete, setTemplateToDelete] =
    useState<CoderTemplate | null>(null);
  const { refresh } = useRouter();

  return (
    <>
      <button
        className="text-red-500 disabled:text-red-200 flex items-center"
        disabled={disabled}
        onClick={() => setTemplateToDelete(template)}
      >
        Delete
      </button>
      {templateToDelete && (
        <DeleteTemplateModal
          cancelAction={() => setTemplateToDelete(null)}
          confirmAction={async () => {
            await deleteTemplate(template.id);
            setTemplateToDelete(null);
            startTransition(() => {
              refresh();
            });
          }}
          template={templateToDelete}
        />
      )}
    </>
  );
}

type DeleteModalProps = {
  template: CoderTemplate;
  cancelAction: () => void;
  confirmAction: () => void;
};

function DeleteTemplateModal({
  template,
  cancelAction,
  confirmAction,
}: DeleteModalProps) {
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
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FaTrashCan />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Delete Template
                  </Dialog.Title>
                  <div className="mt-2">
                    <span className="text-gray-600">
                      Are you sure you want to delete{" "}
                      {template.display_name || template.name}?
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 disabled:bg-red-200 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 sm:ml-3 sm:w-auto"
                onClick={() => confirmAction()}
              >
                Delete
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
