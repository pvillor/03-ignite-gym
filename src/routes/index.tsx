import { DefaultTheme, NavigationContainer } from "@react-navigation/native"

import { AuthRoutes } from "./auth"
import { Box, useTheme } from "@gluestack-ui/themed"
import { AppRoutes } from "./app"
import { useAuth } from "@hooks/use-auth"
import { Loading } from "@components/loading"

export function Routes() {
  const { colors } = useTheme()
  const { user, isLoadingUserStorageData } = useAuth()

  const theme = DefaultTheme
  theme.colors.background = colors.gray[700]

  if (isLoadingUserStorageData) {
    return <Loading />
  }

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        {!!user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}
