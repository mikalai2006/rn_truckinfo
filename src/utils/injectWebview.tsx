import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'nativewind';

const setDarkTheme = async (value: string) => {
  try {
    await AsyncStorage.setItem('dark', value);
  } catch (error) {
    console.log(error);
  }
};
const getDark = async () => {
  try {
    const dark = await AsyncStorage.getItem('dark');
    setDark(dark?.toLowerCase() === 'true');
  } catch (error) {
    console.log(error);
  }
};

const setJWT = async value => {
  try {
    await AsyncStorage.setItem('jwt', value);

    console.log('jwt=', value);
  } catch (error) {
    console.log(error);
  }
};

const useToggleDark = () => {
  toggleColorScheme();
  setDarkTheme((colorScheme === 'dark').toString());
  getDark();
};

export default function InjectWebview(event) {
  console.log('event', event);

  const data = JSON.parse(event.nativeEvent.data);

  if (data.event === 'jwt') {
    setJWT(data.data);
  } else if (data.event === 'dark') {
    useToggleDark();
  }
}
