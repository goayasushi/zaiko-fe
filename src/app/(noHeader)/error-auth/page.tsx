"use client";

import { Alert } from "@/components/ui/alert";
import { Box, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { LuExternalLink } from "react-icons/lu";

export default function ErrorAuthPage() {
  return (
    <Box p="6">
      <Alert status="error" title="認証エラーが発生しました">
        <Text py="2">
          ログインしていないか、セッションが切れている可能性があります。
          下のリンクからログインしてください。
        </Text>
        <Link as={NextLink} href={"/login"} variant="underline">
          ログインページへ <LuExternalLink />
        </Link>
      </Alert>
    </Box>
  );
}
