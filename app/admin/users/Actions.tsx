"use client";

import Input from "@/components/Input";
import { CoderUser } from "@/types/coder";
import { importCoderUser } from "@/util/coder/user";
import { deleteUser } from "@/util/db/user";
import { Dialog } from "@headlessui/react";
import { User } from "@prisma/client";
import { redirect, useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { FaArrowRight, FaTrashCan } from "react-icons/fa6";

export function ImportUserButton({
  user,
  disabled,
}: {
  user: CoderUser;
  disabled: boolean;
}) {
  const [importUser, setImportUser] = useState<CoderUser | null>(null);
  const { refresh } = useRouter();

  return (
    <>
      <button
        className="text-blue-500 disabled:text-blue-200 flex items-center"
        disabled={disabled}
        onClick={() => setImportUser(user)}
      >
        Import <FaArrowRight className="pl-1" />
      </button>
      {importUser && (
        <ImportUserModal
          cancelAction={() => setImportUser(null)}
          confirmAction={async (password: string) => {
            await importCoderUser(user, password);
            setImportUser(null);
            startTransition(() => {
              refresh();
            });
          }}
          user={importUser}
        />
      )}
    </>
  );
}

export function DeleteUserButton({
  user,
  disabled,
}: {
  user: User;
  disabled: boolean;
}) {
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { refresh } = useRouter();

  return (
    <>
      <button
        className="text-red-500 disabled:text-red-200 flex items-center"
        disabled={disabled}
        onClick={() => setUserToDelete(user)}
      >
        Delete
      </button>
      {userToDelete && (
        <DeleteUserModal
          cancelAction={() => setUserToDelete(null)}
          confirmAction={async () => {
            await deleteUser(user.id);
            setUserToDelete(null);
            startTransition(() => {
              refresh();
            });
          }}
          user={userToDelete}
        />
      )}
    </>
  );
}

type ImportModalProps = {
  user: CoderUser;
  cancelAction: () => void;
  confirmAction: (password: string) => void;
};

function ImportUserModal({
  user,
  cancelAction,
  confirmAction,
}: ImportModalProps) {
  const [password, setPassword] = useState("");
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
                    Import User
                  </Dialog.Title>
                  <div className="mt-2">
                    <span className="text-gray-600">
                      Set a password for {user.username}.
                    </span>
                    <Input
                      placeholder="Password"
                      type="password"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 disabled:bg-blue-200 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 sm:ml-3 sm:w-auto"
                disabled={password.length == 0}
                onClick={() => confirmAction(password)}
              >
                Import
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

type DeleteModalProps = {
  user: User;
  cancelAction: () => void;
  confirmAction: () => void;
};

function DeleteUserModal({
  user,
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
                    Delete User
                  </Dialog.Title>
                  <div className="mt-2">
                    <span className="text-gray-600">
                      Are you sure you want to delete {user.username}?
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
