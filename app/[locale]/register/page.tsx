import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import FormPage from "./form";
import AuthLayout from "@/components/ui/AuthLayout";

export default async function RegisterPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/es");
  }

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Start managing your tasks today"
    >
      <FormPage />
    </AuthLayout>
  );
}
