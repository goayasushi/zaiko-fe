"use client";
import { Header } from "@/components/Header";
import { UserProvider } from "@/context/UserContext";

export default function HeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <Header />
      {children}
    </UserProvider>
  );
}
