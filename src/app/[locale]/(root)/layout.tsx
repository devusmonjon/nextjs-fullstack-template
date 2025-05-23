"use client";
import Header from "@/components/header";
import { useSession } from "next-auth/react";
import React, { FC } from "react";

interface PageProps {
  children: React.ReactNode;
}

const RootLayout: FC<PageProps> = ({ children }) => {
  const session = useSession({
    required: true,
  });

  console.log(session);
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default RootLayout;
