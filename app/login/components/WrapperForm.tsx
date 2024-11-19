"use client";

import LoginGoogle from "@/app/login/components/LoginGoogle";
import { Button } from "@/components/ui/button";
import { getSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import LoginForm from "./form";

const WrapperForm = () => {
  const { isLoading, errorMessage, handleGoogleLogin } = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
    const initLogin = async () => {
      if (loggedIn) return;

      const session = await getSession();
      if (!session?.idToken) return;

      try {
        await handleGoogleLogin(session.idToken);
        setLoggedIn(true);
      } catch (error) {
        console.error("Error during Google login:", error);
        setLoggedIn(false);
      }
    };

    initLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, handleGoogleLogin]);

  return (
    <>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <LoginForm />

          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Button variant="link" onClick={() => redirect("/register")}>
              Sign Up
            </Button>
          </p>

          <LoginGoogle />
        </>
      )}
    </>
  );
};

export default WrapperForm;
