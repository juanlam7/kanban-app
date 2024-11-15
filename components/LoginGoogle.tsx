"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

const LoginGoogle = () => {
  const handleSignIn = async () => {
    await signIn("google", { redirect: false });
  };

  return (
    <Button variant="destructive" className="mt-4" onClick={handleSignIn}>
      Sign in with Google
    </Button>
  );
};

export default LoginGoogle;
