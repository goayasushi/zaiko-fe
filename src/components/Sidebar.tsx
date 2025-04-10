"use client";

/**
 * サイドバーコンポーネント
 *
 * アプリケーションのメインナビゲーションを提供するサイドバー。
 * 通常のナビゲーションリンクとアコーディオン形式の展開可能なサブメニューを含む。
 */

import { Box, Flex, Icon, Link, Accordion, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { HiOutlineShoppingCart, HiOutlineUsers } from "react-icons/hi";

// ========== 型定義 ==========

interface NavItemProps {
  icon: IconType;
  children: React.ReactNode;
  href: string;
  active?: boolean;
}

interface SubMenuItemProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

// ========== 子コンポーネント ==========

/**
 * ナビゲーションリンク
 *
 * サイドバー内の個々のナビゲーションリンクを表示するコンポーネント。
 * アイコンとテキストを含み、アクティブ状態に応じて視覚的にハイライトされる。
 */
const NavItem = ({ icon, children, href, active }: NavItemProps) => {
  return (
    <Link
      as={NextLink}
      href={href}
      style={{ textDecoration: "none" }}
      css={{
        "&:focus": {
          outline: "none",
          boxShadow: "none",
        },
      }}
    >
      <Flex
        align="center"
        p="3"
        mx="4"
        h="45px"
        width="100%"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        fontWeight={active ? "bold" : "normal"}
        bg={active ? "blue.50" : "transparent"}
        color={active ? "blue.600" : "inherit"}
        _hover={{
          bg: "blue.50",
          color: "blue.600",
        }}
        fontSize="sm"
      >
        {icon && <Icon mr="4" fontSize="20" as={icon} />}
        <Text fontSize="sm" fontWeight={active ? "bold" : "normal"}>
          {children}
        </Text>
      </Flex>
    </Link>
  );
};

/**
 * サブメニューアイテム
 *
 * アコーディオン内のサブメニュー項目を表示するコンポーネント。
 * 親メニューの内側にインデントされ、アクティブ状態に応じてハイライトされる。
 */
const SubMenuItem = ({ href, active, children }: SubMenuItemProps) => {
  return (
    <Link
      as={NextLink}
      href={href}
      py={2}
      pl={2}
      pr={4}
      borderRadius="md"
      display="block"
      color={active ? "blue.600" : "gray.700"}
      bg={active ? "blue.50" : "transparent"}
      fontWeight={active ? "bold" : "normal"}
      _hover={{ textDecoration: "none", bg: "blue.50", color: "blue.600" }}
      css={{
        "&:focus": {
          outline: "none",
          boxShadow: "none",
        },
      }}
    >
      <Flex align="center">
        <Text fontSize="sm" fontWeight={active ? "bold" : "normal"}>
          {children}
        </Text>
      </Flex>
    </Link>
  );
};

// ========== メインコンポーネント ==========

/**
 * サイドバーのメインコンポーネント
 *
 * 現在のパスに基づいてアクティブなリンクをハイライトし、
 * 通常のリンクとアコーディオン形式のサブメニューを含む。
 */
export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <Box
      as="nav"
      pos="fixed"
      top="61px"
      left="0"
      h="calc(100vh - 61px)"
      w="220px"
      bg="gray.50"
      borderRight="1px"
      borderRightColor="gray.200"
      overflowY="auto"
      display={{ base: "none", md: "block" }}
      pt={5}
      zIndex="1"
    >
      <Flex direction="column" as="nav" fontSize="sm">
        {/* 通常のナビゲーションリンク */}
        <NavItem
          icon={HiOutlineShoppingCart}
          href="/order"
          active={pathname.includes("/order")}
        >
          発注
        </NavItem>

        {/* アコーディオンメニュー: 取引先 */}
        <Accordion.Root collapsible variant="plain" width="100%">
          <Accordion.Item value="partner" borderBottom="none" borderTop="none">
            <Accordion.ItemTrigger>
              <Flex
                align="center"
                p="3"
                mx="4"
                h="45px"
                width="100%"
                borderRadius="lg"
                cursor="pointer"
                fontSize="sm"
                fontWeight="normal"
                _hover={{ bg: "blue.50", color: "blue.600" }}
                _focus={{ outline: "none", boxShadow: "none" }}
                _active={{ outline: "none", boxShadow: "none" }}
              >
                <Icon as={HiOutlineUsers} mr="4" fontSize="20" />
                <Text fontSize="sm" fontWeight="normal">
                  取引先
                </Text>
                <Accordion.ItemIndicator ml="auto" />
              </Flex>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody pl={8} pr={4}>
                <Flex direction="column" gap={2} pb={2}>
                  {/* サブメニュー: 仕入先 */}
                  <SubMenuItem
                    href="/partner/supplier"
                    active={pathname.includes("/partner/supplier")}
                  >
                    仕入先
                  </SubMenuItem>
                </Flex>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </Flex>
    </Box>
  );
};

export default Sidebar;
