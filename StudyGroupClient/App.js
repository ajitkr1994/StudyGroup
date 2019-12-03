import MainPage from './src/components/MainPage'
import LogInPage from './src/components/LogInPage'
import RegisterPage from './src/components/RegisterPage'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AppNavigator = createStackNavigator({
  LogIn: {
    screen: LogInPage,
  },
  Register: {
    screen:RegisterPage,
  },
  Main:{
    screen: MainPage,
    navigationOptions: {
      header: null,
  },
  }
});

export default createAppContainer(AppNavigator);