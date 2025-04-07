"use client";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { UserProvider } from "@/context/UserContext";
import { Box, Flex } from "@chakra-ui/react";

export default function HeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <Header />
      <Flex>
        <Sidebar />
        <Box
          ml={{ base: 0, md: "220px" }}
          mt="60px"
          pt={6}
          px={5}
          pb={5}
          width="100%"
        >
          {children}
        </Box>
      </Flex>
    </UserProvider>
  );
}
