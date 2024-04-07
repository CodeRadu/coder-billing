import Input from "@/components/Input";
import { SubmitButton } from "@/components/SubmitButton";
import { getCoderApiUser } from "@/util/coder/user";
import { finishSetup } from "@/actions/setup";

export default async function Page() {
  const apiUser = await getCoderApiUser();

  return (
    <div className="flex justify-center">
      <div className="w-[40%] p-3">
        <span className="text-xl">Setup</span>
        <div className="">
          Create a secure password for {apiUser?.name} ({apiUser?.email}).
          <form action={finishSetup}>
            <label>Password</label>
            <Input type="password" required name="password" />
            <SubmitButton>Finish Setup</SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
}
