import { DefaultTheme, NavigationContainer } from "@react-navigation/native"

import { AuthRoutes } from "./auth"
import { gluestackUIConfig } from "../../config/gluestack-ui.config"
import { Box } from "@gluestack-ui/themed"
import { AppRoutes } from "./app"
import { useAuth } from "@hooks/use-auth"

export function Routes() {
  const { user } = useAuth()

  const theme = DefaultTheme
  theme.colors.background = gluestackUIConfig.tokens.colors['gray700']

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        {!!user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}
