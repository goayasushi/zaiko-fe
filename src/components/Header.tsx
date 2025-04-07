"use client";

import {
  CloseButton,
  Drawer,
  Flex,
  Link,
  Portal,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

import { useUser } from "@/context/UserContext";
import { useLogout } from "@/hooks/useLogout";

export const Header = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const { logout } = useLogout();

  if (loading) {
    return (
      <Flex align="center" justify="center" height="60px">
        <Spinner size="sm" />
      </Flex>
    );
  }

  return (
    <Flex
      as="header"
      width="100%"
      height="60px"
      align="center"
      justify="space-between"
      px="6"
      boxShadow="none"
      borderBottom="1px solid"
      borderColor="gray.200"
      bg="white"
      gap="4"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="2"
    >
      <Text
        fontSize="xl"
        fontWeight="bold"
        marginEnd="auto"
        cursor="pointer"
        onClick={() => {
          router.push("/snippets/");
        }}
      >
        zaiko
      </Text>

      <Drawer.Root>
        <Drawer.Trigger asChild>
          <Avatar
            variant="solid"
            name={`${user?.first_name} ${user?.last_name}`}
            cursor="pointer"
          />
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>
                  {user && `${user.first_name} ${user.last_name}`}
                </Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Text mb={4}>アカウント情報</Text>
                <Text mb={4}>メールアドレス: {user?.email}</Text>
                <Link onClick={logout} cursor="pointer">
                  ログアウト
                </Link>
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Flex>
  );
};
