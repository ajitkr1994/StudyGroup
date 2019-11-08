import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import HomeScreen from './src/components/Home'
import FindGroupScreen from './src/components/FindGroup'
import MyGroupScreen from './src/components/MyGroup'
import { Container, Content, Header, Body } from 'native-base'
import React, {Component} from 'react'
import {StyleSheet, Image} from 'react-native'

const DrawerHeader = (props) => (
  <Container>
    <Header style={styles.drawerHeader}>
      <Body>
        <Image
          style={styles.drawerImage}
          source={require('./src/img/UCSD_logo.png')} />
      </Body>
    </Header>
    <Content>
      <DrawerItems {...props} />
    </Content>

  </Container>

);

const MyDrawerNavigator = createDrawerNavigator({
    Home: {screen: HomeScreen},
    FindGroup: {screen: FindGroupScreen},
    MyGroup: {screen: MyGroupScreen},
  },{
    contentComponent: DrawerHeader
  });
  
const App = createAppContainer(MyDrawerNavigator);

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerHeader: {
    height: 200,
    backgroundColor: 'white'
  },
  drawerImage: {
    height: 150,
    width: 150,
    borderRadius: 75
  }

})

export default App;