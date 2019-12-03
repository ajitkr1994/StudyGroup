import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer'
import HomeScreen from './Home'
import FindGroupScreen from './FindGroup'
import MyGroupScreen from './MyGroup'
import CreateGroupScreen from './CreateGroup'
import DrawerHeader from './DrawerHeader'

const MyDrawerNavigator = createDrawerNavigator({
    Home: {screen: HomeScreen},
    FindGroup: {screen: FindGroupScreen},
    MyGroup: {screen: MyGroupScreen},
    CreateGroup:{screen:CreateGroupScreen},
  },{
    contentComponent: DrawerHeader
  });
  
const MainPage = createAppContainer(MyDrawerNavigator);

export default MainPage;