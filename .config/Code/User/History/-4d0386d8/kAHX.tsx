"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
const loginFormSchema = z.object({
  email: z.string().email({
    message: "Моля, въведете валиден имейл",
  }),
  password: z
    .string()
    .min(8, {
      message: "Паролата трябва да е минимум 6 символа",
    })
    .max(20, {
      message: "Паролата трябва да не е повече от 20 символа.",
    }),
});

type TLoginForm = z.infer<typeof loginFormSchema>;
const LoginForm: React.FC = () => {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: TLoginForm) => {
      const res = await fetch("some-path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await res.json();
    },
    onError: (err) => {
      toast.error(err.message, {
        icon: "❌",
      });
    },
    onSuccess: (res) => {
      // check with me function if the cookie is there
      // if there
      const cookie = true;
      if (cookie) {
        toast.success("Влизането е успешно. Приятно ползване!", {
          icon: "✅",
        });
        // Do we have to do that so we can see the toast or we can icnrease somehow the toast duration
        router.push("/home");
      }
    },
  });
  const form = useForm<TLoginForm>({
    resolver: zodResolver(loginFormSchema),
  });

  return (
    <section className="grid min-h-screen lg:grid-cols-2">
      <div className="flex w-screen items-center justify-center px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              Добре дошли отново!
            </h2>
            <p className="text-center text-gray-500">
              Въведете Вашите данни за достъп до акаунта си
            </p>
          </div>

          <form
            onSubmit={form.handleSubmit((data) => {
              mutate(data);
            })}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Имейл</Label>
                <Input
                  {...form.register("email")}
                  error={form.formState.errors.email?.message}
                  id="email"
                  placeholder="Въведете имейл"
                  type="email"
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Парола</Label>
                <Input
                  {...form.register("password")}
                  error={form.formState.errors.password?.message}
                  id="password"
                  type="password"
                  placeholder="Въведете парола"
                  required
                  className="w-full"
                />
              </div>
              <div className="text-right text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-green-600 hover:underline"
                >
                  Забравена парола?
                </Link>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Вход
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  ИЛИ ПРОДЪЛЖИ ПРЕЗ
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">Google</Button>
              <Button variant="outline">Apple</Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
