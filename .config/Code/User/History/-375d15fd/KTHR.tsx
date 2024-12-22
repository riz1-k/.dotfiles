"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import NextTopLoader from "nextjs-toploader";
export const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <>
      <Toaster position="bottom-right" />
      <NextTopLoader />
      <QueryClientProvider client={queryClient}>
        {/* header */}
        {children}
        {/* footer */}
        </QueryClientProvider>
    </>
  );
};
