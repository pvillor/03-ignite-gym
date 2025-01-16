import { ExerciseCard } from "@components/exercise-card"
import { Group } from "@components/group"
import { HomeHeader } from "@components/home-header"
import { Loading } from "@components/loading"
import { ExerciseDTO } from "@dtos/exercise-dto"
import { FlatList, Heading, HStack, Text, useToast, VStack } from "@gluestack-ui/themed"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { AppNavigatorRoutesProps } from "@routes/app"
import { api } from "@services/api"
import { AppError } from "@utils/app-error"
import { useCallback, useEffect, useState } from "react"

export function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const [groups, setGroups] = useState<string[]>([])
  const [groupSelected, setGroupSelected] = useState("Antebraço")

  const toast = useToast()
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate('exercise', { exerciseId })
  }

  async function fetchGroups() {
    try {      
      const { data } = await api.get('groups')
      setGroups(data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos.'

      toast.show({
        render: () => <Text>{title}</Text>,
        placement: 'top'
      })
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true)

      const { data } = await api.get(`exercises/bygroup/${groupSelected}`)
      setExercises(data)
      console.log(data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos.'

      toast.show({
        render: () => <Text>{title}</Text>,
        placement: 'top'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  useFocusEffect(useCallback(() => {
    fetchExercisesByGroup()
  }, [groupSelected]))

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      {
        isLoading ? <Loading /> : (
          <VStack px="$8" flex={1}>
            <HStack justifyContent="space-between" mb="$5" alignItems="center">
              <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
                Exercícios
              </Heading>

              <Text color="$gray200" fontSize="$sm" fontFamily="$body">
                {exercises.length}
              </Text>
            </HStack>

            <FlatList
              data={exercises}
              keyExtractor={(item: ExerciseDTO) => item.id}
              renderItem={({ item }) => (
                <ExerciseCard
                  data={item} 
                  onPress={() => handleOpenExerciseDetails(item.id)} 
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </VStack>
        )
      }
    </VStack>
  )
}
