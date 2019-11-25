import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer'
import HomeScreen from './src/components/Home'
import FindGroupScreen from './src/components/FindGroup'
import MyGroupScreen from './src/components/MyGroup'
import CreateGroupScreen from './src/components/CreateGroup'
import DrawerHeader from './src/components/DrawerHeader'

const MyDrawerNavigator = createDrawerNavigator({
    Home: {screen: HomeScreen},
    FindGroup: {screen: FindGroupScreen},
    MyGroup: {screen: MyGroupScreen},
    CreateGroup:{screen:CreateGroupScreen},
  },{
    contentComponent: DrawerHeader
  });
  
const App = createAppContainer(MyDrawerNavigator);

export default App;