"use client";

import { Button } from "@/components/ui/button";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import { useTheme } from "next-themes";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import LoginForm from "./form";
import LoginGoogle from "./LoginGoogle";

const WrapperForm = () => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <LocaleSwitcher />
      <LoginForm />

      <p className="mt-4 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Button variant="link" onClick={() => redirect("/register")}>
          Sign Up
        </Button>
      </p>
      <div className="flex items-center my-2">
        <div className="flex-1 border-t border-gray-400"></div>
        <span className="px-4 text-gray-500">OR</span>
        <div className="flex-1 border-t border-gray-400"></div>
      </div>

      <LoginGoogle />
    </>
  );
};

export default WrapperForm;
