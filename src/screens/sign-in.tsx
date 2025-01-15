import { Center, Heading, Image, ScrollView, Text, useToast, VStack } from "@gluestack-ui/themed";

import backgroundImage from "@assets/background.png"
import Logo from "@assets/logo.svg"
import { Input } from "@components/input";
import { Button } from "@components/button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'
import { api } from "@services/api";
import { AppError } from "@utils/app-error";
import { useAuth } from "@hooks/use-auth";
import { UserDTO } from "@dtos/user-dto";

interface SignInSchema {
  email: string
  password: string
} 

const signInSchema = yup.object({
  email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
  password: yup
    .string()
    .required('Informe a senha.')
})

export function SignIn() {
  const { signIn } = useAuth()

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  const toast = useToast()

  const { control, handleSubmit, formState: { errors } } = useForm<SignInSchema>({
    resolver: yupResolver(signInSchema)
  })

  async function handleSignIn({ email, password }: SignInSchema) {
    try {
      signIn(email, password)
     } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'

      toast.show({
        render: () => title,
        placement: 'top',
        containerStyle: {
          bgColor: 'red.500'
        }
      })
     }
  }

  function handleNavigateToSignUp() {
    navigation.navigate('sign-up')
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <VStack flex={1}>
        <Image
          w="$full"
          h={624}
          source={backgroundImage}
          defaultSource={backgroundImage}
          alt="Pessoas treinando"
          position="absolute"
        />

        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />

            <Text color="$gray100" fontSize="$sm">Treine sua mente e o seu corpo</Text>
          </Center>

          <Center gap="$2">
            <Heading color="$gray100">Acesse a conta</Heading>

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="E-mail" 
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  secureTextEntry
                  placeholder="Senha" 
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(handleSignIn)}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Button title="Acessar" onPress={handleSubmit(handleSignIn)} />
          </Center>

          <Center flex={1} justifyContent="flex-end" mt="$4">
            <Text color="$gray100" fontSize="$sm" mb="$3" fontFamily="$body">Ainda não tem acesso?</Text>

            <Button title="Criar conta" variant="outline" onPress={handleNavigateToSignUp} />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  )
}
