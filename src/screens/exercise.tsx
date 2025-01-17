import { Box, Heading, HStack, Icon, Image, ScrollView, Text, useToast, VStack } from "@gluestack-ui/themed"
import { useNavigation, useRoute } from "@react-navigation/native"
import { AppNavigatorRoutesProps } from "@routes/app"
import { ArrowLeft } from "lucide-react-native"
import { TouchableOpacity } from "react-native"

import BodySvg from "@assets/body.svg"
import SeriesSvg from "@assets/series.svg"
import RepetitionsSvg from "@assets/repetitions.svg"
import { Button } from "@components/button"
import { AppError } from "@utils/app-error"
import { api } from "@services/api"
import { useEffect, useState } from "react"
import { ExerciseDTO } from "@dtos/exercise-dto"
import { Loading } from "@components/loading"
import { ToastMessage } from "@components/toast-message"

interface ExerciseParams {
  exerciseId: string
}

export function Exercise() {
  const [sendingRegister, setSendingRegister] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const toast = useToast()
  const route = useRoute()

  const { exerciseId } = route.params as ExerciseParams

  function handleGoBack() {
    navigation.goBack()
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)

      const { data } = await api.get(`exercises/${exerciseId}`)
      setExercise(data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos.'

      toast.show({
        render: () => (
          <ToastMessage
            id="get-exercise-error"
            title={title}
            action="success"
            onClose={() => {}}
          />
        ),
        placement: 'top'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true)

      await api.post('/history', { exercise_id: exerciseId })

      toast.show({
        render: () => (
          <ToastMessage
            id="register-history-success"
            title="Parabéns! Exercício registrado no seu histórico."
            action="success"
            onClose={() => {}}
          />
        ),
        placement: 'top'
      })

      navigation.navigate('history')
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível registrar o exercício.'

      toast.show({
        render: () => (
          <ToastMessage
            id="register-history-error"
            title={title}
            action="error"
            onClose={() => {}}
          />
        ),
        placement: 'top'
      })
    } finally {
      setIsLoading(true)
    }
  }

  useEffect(() => {
    fetchExerciseDetails()
  }, [exerciseId])

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          pb="$8"
        >
          <Heading
            color="$gray100"
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />

            <Text color="$gray200" ml="$1" textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      { isLoading ? <Loading /> : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <VStack p="$8">
            <Box rounded="$lg" mb={3}overflow="hidden">
              <Image
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`
                }}
                alt="Exercício"
                mb="$3"
                resizeMode="cover"
                rounded="$lg"
                w="$full"
                h="$80"
              />
            </Box>

            <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
              <HStack alignItems="center" justifyContent="space-around" mb="$6" mt="$5">
                <HStack alignItems="center">
                  <SeriesSvg />
                  <Text color="$gray200" ml="$2">{exercise.series} séries</Text>
                </HStack>

                <HStack alignItems="center">
                  <RepetitionsSvg />
                  <Text color="$gray200" ml="$2">{exercise.repetitions} repetições</Text>
                </HStack>
              </HStack>

              <Button
                title="Marcar como realizado" 
                isLoading={sendingRegister}
                onPress={handleExerciseHistoryRegister}
              />
            </Box>
          </VStack>
        </ScrollView>
      ) }
    </VStack>
  )
}
