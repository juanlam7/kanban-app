"use client";

import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import LoginForm from "./form";
import LoginGoogle from "@/app/login/components/LoginGoogle";
import useAuth from "../hooks/useAuth";
import { redirect } from "next/navigation";

const WrapperForm = () => {
  const { isLoading, errorMessage, handleGoogleLogin } = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
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
  }, [loggedIn, handleGoogleLogin]);

  return (
    <div className="text-white p-4 md:p-16 border-[1.5px] rounded-lg border-gray-300 flex flex-col items-center justify-center gap-y-6">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <LoginForm />
          <LoginGoogle />
          <Button onClick={() => redirect("/register")}>Register</Button>
        </>
      )}
    </div>
  );
};

export default WrapperForm;
