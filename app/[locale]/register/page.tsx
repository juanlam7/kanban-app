import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import FormPage from "./form";
import AuthLayout from "@/components/ui/AuthLayout";
import { getTranslations, setRequestLocale } from "next-intl/server";

type RouteParams = Promise<{ locale: string[] }>;

export async function generateMetadata({ params }: { params: RouteParams }) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "RegisterPage",
  });

  return {
    title: t("tab_title"),
  };
}

export default async function RegisterPage({ params }: { params: RouteParams }) {
  const { locale } = await params;
  setRequestLocale(locale[0]);
  const t = await getTranslations({
    locale,
    namespace: "RegisterPage",
  });
  
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <AuthLayout title={t("title")} subtitle={t("sub_title")}>
      <FormPage />
    </AuthLayout>
  );
}
