import AuthLayout from "@/components/ui/AuthLayout";
import WrapperForm from "./components/WrapperForm";

export default function LoginPage() {
  return (
    <AuthLayout title="Kanban" subtitle="Login to manage your tasks">
      <WrapperForm />
    </AuthLayout>
  );
}