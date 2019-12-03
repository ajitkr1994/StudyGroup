import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer'
import HomeScreen from './Home'
import FindGroupScreen from './FindGroup'
import MyGroupScreen from './MyGroup'
import CreateGroupScreen from './CreateGroup'
// import DrawerHeader from './DrawerHeader'


import {DrawerItems} from 'react-navigation-drawer';
import { Container, Content, Header, Body } from 'native-base';
import React, {Component} from 'react';
import {StyleSheet,Image,Text,Button} from 'react-native';

handleSignOut = () => {
  // do the things  
//   this.setState({value: null}); // <-- Clear form after 'Create Group' has been clicked.
//   this.props.navigation.navigate('LogIn')
}

const DrawerHeader = (props) => (
    <Container>
      <Header style={styles.drawerHeader}>
        <Body>
          <Image
            style={styles.drawerImage}
            source={require('../img/UCSD_logo.png')} />
            <Text>Hi Alice</Text>
            <Text>alice@ucsd.edu</Text>
            <Button
            title="SignOut"
            onPress={this.handleSignOut}
            />
        </Body>
      </Header>
      <Content>
        <DrawerItems {...props} />
      </Content>
  
    </Container>
  )
const MyDrawerNavigator = createDrawerNavigator({
    Home: {screen: HomeScreen},
    FindGroup: {screen: FindGroupScreen},
    MyGroup: {screen: MyGroupScreen},
    CreateGroup:{screen:CreateGroupScreen},
  },{
    contentComponent: DrawerHeader
  });
  
const MainPage = createAppContainer(MyDrawerNavigator);

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
      height: 100,
      width: 150,
      resizeMode: 'contain'
    }
  
  })

export default MainPage;