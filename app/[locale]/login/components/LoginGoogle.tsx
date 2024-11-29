"use client";

import { Button } from "@/components/ui/button";
import { getSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useTranslations } from "next-intl";

const LoginGoogle = () => {
  const { isLoading, handleGoogleLogin, errorMessage } = useAuth();
  const t = useTranslations("LoginPage");

  useEffect(() => {
    const initLogin = async () => {
      const session = await getSession();
      if (!session?.idToken) return;

      try {
        await handleGoogleLogin(session.idToken);
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    };

    initLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignIn = async () => {
    await signIn("google", { redirect: false });
  };

  return (
    <>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <Button variant="destructive" className="mt-4" onClick={handleSignIn}>
        {isLoading ? t("logging") : t("continue_google")}
      </Button>
    </>
  );
};

export default LoginGoogle;
