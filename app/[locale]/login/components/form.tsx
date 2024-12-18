"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useAuth from "../hooks/useAuth";
import { useTranslations } from "next-intl";

const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const LoginForm = () => {
  const { isLoading, handleLogin, errorMessage } = useAuth();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: "", password: "" },
  });
  const t = useTranslations("LoginPage");

  const onSubmit = async (data: { email: string; password: string }) => {
    await handleLogin(data.email, data.password);

    form.reset();
  };

  return (
    <>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("provide_email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("provide_email")}
                    {...field}
                    type="text"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("provide_password")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("provide_password")}
                    {...field}
                    type="password"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
            disabled={isLoading}
          >
            {isLoading ? t("logging") : t("login")}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
