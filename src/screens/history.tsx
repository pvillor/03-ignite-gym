import { Heading, SectionList, Text, useToast, VStack } from "@gluestack-ui/themed"
import { ScreenHeader } from "./screen-header"
import { HistoryCard } from "@components/history-card"
import { useCallback, useState } from "react"
import { AppError } from "@utils/app-error"
import { api } from "@services/api"
import { useFocusEffect } from "@react-navigation/native"
import { HistoryByDayDTO } from "@dtos/history-by-day-dto"

export function History() {
  const [isLoading, setIsLoading] = useState(false)
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

  const toast = useToast()

  async function fetchHistory() {
    try {
      setIsLoading(true)

      const { data } = await api.get('history')
      setExercises(data)

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível registrar o exercício.'

      toast.show({
        render: () => <Text>{title}</Text>,
        placement: 'top'
      })
    } finally {
      setIsLoading(false)

    }
  }

  useFocusEffect(useCallback(() => {
    fetchHistory()
  }, []))

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryCard data={item} />}
        renderSectionHeader={({ section }) => (
          <Heading
            color="$gray200"
            fontSize="$md"
            mt="$10"
            mb="$3"
            fontFamily="$heading"
          >
            {section.title}
          </Heading>
        )}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        }
        ListEmptyComponent={() => (
          <Text color="$gray100" textAlign="center">
            Não há exercícios registrados ainda. {'\n'}
            Vamos fazer exercícios hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}
