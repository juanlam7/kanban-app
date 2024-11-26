/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GoogleAuthProvider,
  EmailAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const loginToFirebaseWithCredential = async (credential: any) => {
    try {
      await signInWithCredential(auth, credential);
      router.replace("/es");
      router.refresh();
    } catch (error) {
      setErrorMessage("Authentication failed. Please try again.");
      console.error("Error during Firebase authentication:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response: any = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        throw new Error("Login failed. Please try again.");
      }

      const credential = EmailAuthProvider.credential(email, password);
      await loginToFirebaseWithCredential(credential);

      toast({ title: "Login Successful" });
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.message);
      toast({ title: "Login Failed", description: error.message });
    }
  };

  const handleGoogleLogin = async (idToken: string) => {
    setIsLoading(true);
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      await loginToFirebaseWithCredential(credential);
      toast({ title: "Login Successful" });
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage("Authentication failed. Please try again.");
      toast({ title: "Login Failed", description: error.message });
    }
  };

  return { isLoading, errorMessage, handleLogin, handleGoogleLogin };
};

export default useAuth;
