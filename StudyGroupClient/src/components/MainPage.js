import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer'
import HomeScreen from './Home'
import FindGroupScreen from './FindGroup'
import MyGroupScreen from './MyGroup'
import CreateGroupScreen from './CreateGroup'
import {DrawerItems} from 'react-navigation-drawer';
import { Container, Content, Header, Body, Left } from 'native-base';
import React, {Component} from 'react';
import {StyleSheet,Image,Text, AsyncStorage} from 'react-native';


const DrawerHeader = (props) => (
    <Container>
      <Header style={styles.drawerHeader}>
          <Image
            style={styles.drawerImage}
            source={require('../img/UCSD_logo.png')} />
            <Text style = {styles.username}>Hi, User</Text>
            <Text style = {styles.email}>Email</Text>
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

    drawerHeader: {
      height: 200,
      backgroundColor: 'white',
      flexDirection:'column',
    },
    drawerImage: {
      height: 100,
      width: 150,
      resizeMode: 'contain',
      left:10
    },
    username:{
        fontSize: 22,
        left:10,
        top:0
    },
    email:{
        left:10,        
    }
  
  })

export default MainPage;