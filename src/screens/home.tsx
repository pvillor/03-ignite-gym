import { Group } from "@components/group";
import { HomeHeader } from "@components/home-header";
import { HStack, VStack } from "@gluestack-ui/themed";
import { useState } from "react";

export function Home() {
  const [groupSelected, setGroupSelected] = useState('dorsal')

  return (
    <VStack flex={1}>
      <HomeHeader />

      <HStack>
        <Group
          name="Dorsal" 
          isActive={groupSelected === 'dorsal'} 
          onPress={() => setGroupSelected('dorsal')} 
        />

        <Group
          name="Ombro" 
          isActive={groupSelected === 'ombro'} 
          onPress={() => setGroupSelected('ombro')} 
        />
      </HStack>
    </VStack>
  )
}