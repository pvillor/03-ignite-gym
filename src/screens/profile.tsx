import { Center, Heading, Text, useToast, VStack } from "@gluestack-ui/themed"
import { ScreenHeader } from "./screen-header"
import { Alert, ScrollView, TouchableOpacity } from "react-native"
import { UserPhoto } from "@components/user-photo"
import { Input } from "@components/input"
import { Button } from "@components/button"
import { useState } from "react"
import { ToastMessage } from "@components/toast-message"
import { Controller, useForm } from "react-hook-form"
import { useAuth } from "@hooks/use-auth"


import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { api } from "@services/api"
import { AppError } from "@utils/app-error"

interface ProfileSchema {
  name: string
  email: string
  old_password: string
  password: string
  confirm_password: string
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => !!value ? value : null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), ''], 'A confirmação de senha não confere.')
    .when('password', {
      is: (Field: any) => Field,
      then: yup.string().nullable().required('Informe a confirmação da senha')
    }),
})

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isPhotoLoading, setIsPhotoLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState("https://github.com/pvillor.png")

  const toast = useToast()
  const { user, updateUserProfile } = useAuth()
  const { control, handleSubmit, formState: { errors } } = useForm<ProfileSchema>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema)
  })

  async function handleUserPhotoSelect() {
    setIsPhotoLoading(true)

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      const photoURI = photoSelected.assets[0].uri

      if (photoURI) {
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number
        }

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id} 
                action="error" 
                title="Essa imagem é muito grande. Escolha uma de até 5MB." 
                onClose={() => toast.close(id)} 
              />
            )
          })
        }

        setUserPhoto(photoURI)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsPhotoLoading(false)
    }
  }

  async function handleProfileUpdate(data: ProfileSchema) {
    try {
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await api.put('users', data)
      
      await updateUserProfile(userUpdated)

      toast.show({
        render: () => (
          <ToastMessage
            id="update-profile-success"
            title="Perfil atualizado com sucesso" 
            action="success" 
            onClose={() => {}} 
          />
        ),
        placement: 'top'
      })

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível atualizar os dados.'
      
      toast.show({
        render: () => (
          <ToastMessage
            id="update-profile-error"
            title={title} 
            action="error" 
            onClose={() => {}} 
          />
        ),
        placement: 'top'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={{ uri: userPhoto }}
            alt="Foto do usuário"
            size="xl"
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
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
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Nome" 
                  bg="$gray600"
                  value={value}
                  onChangeText={onChange} 
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { value } }) => (
                <Input
                  placeholder="pvillor@gmail.com" 
                  bg="$gray600"
                  isReadOnly
                  value={value}
                />
              )}
            />
          </Center>

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Heading>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="old_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Senha antiga" 
                  bg="$gray600" 
                  secureTextEntry 
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Nova senha" 
                  bg="$gray600" 
                  secureTextEntry 
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirm_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Confirme a nova senha"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.confirm_password?.message}
                />
              )}
            />

            <Button title="Atualizar" onPress={handleSubmit(handleProfileUpdate)} isLoading={isUpdating} />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  )
}
