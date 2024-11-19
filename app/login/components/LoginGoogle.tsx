"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const LoginGoogle = () => {
  const handleSignIn = async () => {
    await signIn("google", { redirect: false });
  };

  return (
    <Button variant="destructive" className="mt-4" onClick={handleSignIn}>
      Continue with Google
    </Button>
  );
};

export default LoginGoogle;
