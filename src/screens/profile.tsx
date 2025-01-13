import { Center, Heading, Text, VStack } from "@gluestack-ui/themed"
import { ScreenHeader } from "./screen-header"
import { ScrollView, TouchableOpacity } from "react-native"
import { UserPhoto } from "@components/user-photo"
import { Input } from "@components/input"
import { Button } from "@components/button"

export function Profile() {
  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={{ uri: "https://github.com/pvillor.png" }}
            alt="Foto do usuário"
            size="xl"
          />

          <TouchableOpacity>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Input placeholder="Nome" bg="$gray600" />
            <Input value="pvillor@gmail.com" bg="$gray600" isReadOnly />
          </Center>

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray700"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Heading>

          <Center w="$full" gap="$4">
            <Input placeholder="Senha antiga" bg="$gray600" secureTextEntry />
            
            <Input placeholder="Nova senha" bg="$gray600" secureTextEntry />
            
            <Input placeholder="Confirme a nova senha" bg="$gray600" secureTextEntry />

            <Button title="Atualizar" />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  )
}
