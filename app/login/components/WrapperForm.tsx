"use client";

import { auth } from "@/lib/firebaseConfig";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginForm from "../form";
import LoginGoogle from "@/components/LoginGoogle";

const loginToFirebaseWithGoogleCredential = async (idToken: string) => {
  const credential = GoogleAuthProvider.credential(idToken);
  return await signInWithCredential(auth, credential);
};

const WrapperForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const initLogin = async () => {
      setIsLoading(true);
      try {
        const session = await getSession();
        if (!session) {
          console.log("You must be signed in to add data");
          return;
        }
        if (session.idToken) {
          await loginToFirebaseWithGoogleCredential(session.idToken);
          router.push("/");
          router.refresh();
        }
      } catch (error) {
        setErrorMessage("Authentication failed. Please try again.");
        console.error("Error during authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initLogin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-white p-4 md:p-16 border-[1.5px] rounded-lg border-gray-300 flex flex-col items-center justify-center gap-y-6">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <LoginForm />
          <LoginGoogle />
        </>
      )}
    </div>
  );
};

export default WrapperForm;
