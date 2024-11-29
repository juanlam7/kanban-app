import AuthLayout from "@/components/ui/AuthLayout";
import WrapperForm from "./components/WrapperForm";
import { getTranslations, setRequestLocale } from "next-intl/server";

type RouteParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: RouteParams }) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "LoginPage",
  });

  return {
    title: t("tab_title"),
  };
}

export default async function LoginPage({ params }: { params: RouteParams }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: "LoginPage",
  });

  return (
    <AuthLayout title={t("title")} subtitle={t("sub_title")}>
      <WrapperForm />
    </AuthLayout>
  );
}
