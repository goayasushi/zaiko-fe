"use client";

import { Alert } from "@/components/ui/alert";
import { Box, Link, Text } from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";

import { useLogout } from "@/hooks/useLogout";

export default function ErrorAuthPage() {
  const { logout } = useLogout();

  return (
    <Box p="6">
      <Alert status="error" title="認証エラーが発生しました">
        <Text py="2">
          ログインしていないか、セッションが切れている可能性があります。
          下のリンクからログインしてください。
        </Text>
        <Link onClick={logout} variant="underline" cursor="pointer">
          ログインページへ <LuExternalLink />
        </Link>
      </Alert>
    </Box>
  );
}
