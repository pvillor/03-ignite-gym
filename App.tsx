import { Loading } from '@components/loading';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { config } from './config/gluestack-ui.config';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { useFonts } from 'expo-font';
import { StatusBar } from 'react-native';
import { Routes } from '@routes/index';
import { AuthContext, AuthContextProvider } from '@contexts/auth-context';

export function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <GluestackUIProvider config={config}>
        <StatusBar 
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading /> }
      </AuthContextProvider>
    </GluestackUIProvider>
  );
}
