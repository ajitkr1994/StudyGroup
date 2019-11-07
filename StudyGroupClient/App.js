import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import HomeScreen from './src/components/Home'
import FindGroupScreen from './src/components/FindGroup'
import MyGroupScreen from './src/components/MyGroup'

const MyDrawerNavigator = createDrawerNavigator({
    Home: {screen: HomeScreen},
    FindGroup: {screen: FindGroupScreen},
    MyGroup: {screen: MyGroupScreen},
  });
  
const App = createAppContainer(MyDrawerNavigator);

export default App;