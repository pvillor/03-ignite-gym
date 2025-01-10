import { ParamListBase } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack"
import { SignIn } from "@screens/sign-in"
import { SignUp } from "@screens/sign-up"

type AuthRoutesParams = {
  'sign-in': undefined
  'sign-up': undefined
}

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutesParams> 

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutesParams>()

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="sign-in" component={SignIn} />
      <Screen name="sign-up" component={SignUp} />
    </Navigator>
  )
}
