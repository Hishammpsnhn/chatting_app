import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

function ChatLoading() {
  return (
    <Stack>
      <Skeleton height="44px" />
      <Skeleton height="44px" />
      <Skeleton height="44px" />
      <Skeleton height="44px" />
      <Skeleton height="44px" />
      <Skeleton height="44px" />
      <Skeleton height="44px" />
      <Skeleton height="44px" />
      <Skeleton height="44px" />
      <Skeleton height="44px" />
      <Skeleton height="44px" />
      <Skeleton height="44px" />
    </Stack>
  );
}

export default ChatLoading;
