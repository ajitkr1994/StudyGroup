import MainPage from './src/components/MainPage'
import LogInPage from './src/components/LogInPage'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AppNavigator = createStackNavigator({
  LogIn: {
    screen: LogInPage,
  },
  Main:{
    screen: MainPage,
    navigationOptions: {
      header: null,
  },
  }
});

export default createAppContainer(AppNavigator);

// import {createAppContainer} from 'react-navigation';
// import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer'
// import HomeScreen from './src/components/Home'
// import FindGroupScreen from './src/components/FindGroup'
// import MyGroupScreen from './src/components/MyGroup'
// import CreateGroupScreen from './src/components/CreateGroup'
// import DrawerHeader from './src/components/DrawerHeader'

// const MyDrawerNavigator = createDrawerNavigator({
//     Home: {screen: HomeScreen},
//     FindGroup: {screen: FindGroupScreen},
//     MyGroup: {screen: MyGroupScreen},
//     CreateGroup:{screen:CreateGroupScreen},
//   },{
//     contentComponent: DrawerHeader
//   });
  
// const MainPage = createAppContainer(MyDrawerNavigator);

// export default MainPage;