import { VStack } from "@gluestack-ui/themed";
import { ScreenHeader } from "./screen-header";
import { HistoryCard } from "@components/history-card";

export function History() {
  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico" />

      <HistoryCard />
    </VStack>
  )
}