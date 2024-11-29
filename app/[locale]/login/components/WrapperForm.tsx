"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import LoginForm from "./form";
import LoginGoogle from "./LoginGoogle";

const WrapperForm = () => {
  const { setTheme } = useTheme();
  const t = useTranslations("LoginPage");

  useEffect(() => {
    setTheme("light");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <LoginForm />

      <p className="mt-4 text-center text-sm text-gray-600">
        {t("dont_have_account")}
        <Button variant="link" onClick={() => redirect("/register")}>
          {t("sign_up")}
        </Button>
      </p>
      <div className="flex items-center my-2">
        <div className="flex-1 border-t border-gray-400"></div>
        <span className="px-4 text-gray-500">{t("or")}</span>
        <div className="flex-1 border-t border-gray-400"></div>
      </div>

      <LoginGoogle />
    </>
  );
};

export default WrapperForm;
