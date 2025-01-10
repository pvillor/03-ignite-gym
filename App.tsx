import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { config } from '@gluestack-ui/config';
import { Center, GluestackUIProvider } from '@gluestack-ui/themed';
import { useFonts } from 'expo-font';
import { StatusBar, Text, View } from 'react-native';

export function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <GluestackUIProvider config={config}>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#202024' }}>
        <StatusBar 
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {fontsLoaded ? (
          <Center flex={1} bg='$'>
            <Text>Home</Text>
          </Center>
      ) : <View />}
      </View>
    </GluestackUIProvider>
  );
}
