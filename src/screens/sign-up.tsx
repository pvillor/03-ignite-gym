import { Center, Heading, Image, ScrollView, Text, useToast, VStack } from "@gluestack-ui/themed"

import backgroundImage from "@assets/background.png"
import Logo from "@assets/logo.svg"
import { Input } from "@components/input"
import { Button } from "@components/button"
import { useNavigation } from "@react-navigation/native"
import { AuthNavigatorRoutesProps } from "@routes/auth"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'

import * as yup from 'yup'
import { api } from "@services/api"
import { AppError } from "@utils/app-error"

interface CreateAccountSchema {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Informe a senha.')
    .min(6, 'A senha deve ter mais de 5 carateres.'),
  passwordConfirm: yup
    .string()
    .required('Confirme sua senha')
    .oneOf([yup.ref('password'), ''], 'A confirmação da senha não confere.'),
})

export function SignUp() {
  const toast = useToast()

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  const { control, handleSubmit, formState: { errors } } = useForm<CreateAccountSchema>({
    resolver: yupResolver(signUpSchema)
  })

  function handleNavigateToSignIn() {
    navigation.navigate('sign-in')
  }

  async function handleSignUp({ name, email, password }: CreateAccountSchema) {
     try {
      const { data } = await api.post('users', {
        name,
        email,
        password
     })

     console.log(data)
     } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde.'

      toast.show({
        render: () => title,
        placement: 'top',
        containerStyle: {
          bgColor: 'red.500'
        }
      })
     }
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

          <Center gap="$2" flex={1}>
            <Heading color="$gray100">Crie sua conta</Heading>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nome" 
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                />
              )}
            />
            
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
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
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="passwordConfirm"
              render={({ field: { onChange, value } }) => (
                <Input
                  secureTextEntry
                  placeholder="Confirme sua senha" 
                  value={value}
                  onChangeText={onChange}
                  onSubmitEditing={handleSubmit(handleSignUp)}
                  returnKeyType="send"
                  errorMessage={errors.passwordConfirm?.message}
                />
              )}
            />
            
            <Button title="Criar e acessar" onPress={handleSubmit(handleSignUp)} />
          </Center>

          <Center flex={1} justifyContent="flex-end" mt="$4">
            <Button title="Voltar para o login" variant="outline" onPress={handleNavigateToSignIn} />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  )
}
