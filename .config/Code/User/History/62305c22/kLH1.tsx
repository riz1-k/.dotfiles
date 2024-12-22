"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";

const RegisterForm = () => {
  return (
    <>
      <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-green-50/50">
        <div className="w-full max-w-md space-y-8 px-4">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Създай своя акаунт
            </h2>
            <p className="text-gray-500">
              Въведете Вашите данни, за да се регистрирате
            </p>
          </div>

          <div className="space-y-6">
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
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Sign up
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">Google</Button>
                <Button variant="outline">Apple</Button>
              </div>
              <p className="text-center text-xs text-gray-500">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-gray-700">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-gray-700">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-green-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default RegisterForm;
