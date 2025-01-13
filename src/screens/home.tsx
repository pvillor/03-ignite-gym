import { Group } from "@components/group"
import { HomeHeader } from "@components/home-header"
import { FlatList, Heading, HStack, Text, VStack } from "@gluestack-ui/themed"
import { useState } from "react"

export function Home() {
  const [groups, setGroups] = useState([
    "Dorsal",
    "Biceps",
    "Triceps",
    "Ombro",
  ])
  const [groupSelected, setGroupSelected] = useState("Dorsal")

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected === item}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      <VStack px="$8">
        <HStack justifyContent="space-between" mb="$5" alignItems="center">
          <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
            Exercícios
          </Heading>

          <Text color="$gray200" fontSize="$sm" fontFamily="$body">
            4
          </Text>
        </HStack>
      </VStack>
    </VStack>
  )
}
