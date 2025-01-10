import { Loading } from '@components/loading';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { config } from './config/gluestack-ui.config';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { SignIn } from '@screens/sign-in';
import { useFonts } from 'expo-font';
import { StatusBar } from 'react-native';
import { SignUp } from '@screens/sign-up';

export function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <GluestackUIProvider config={config}>
        <StatusBar 
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {fontsLoaded ? <SignUp /> : <Loading /> }
    </GluestackUIProvider>
  );
}
