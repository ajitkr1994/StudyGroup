import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer'
import HomeScreen from './Home'
import FindGroupScreen from './FindGroup'
import MyGroupScreen from './MyGroup'
import CreateGroupScreen from './CreateGroup'
import {DrawerItems} from 'react-navigation-drawer';
import { Container, Content, Header, Body, Left, Button, View } from 'native-base';
import React, {Component} from 'react';
import {StyleSheet,Image,Text, AsyncStorage,Alert} from 'react-native';
import {STORAGE_KEY, USER_EMAIL} from './LogInPage';

const DrawerHeader = (props) => {
  const { navigate } = props.navigation;
  return (
    <Container>
      <Header style={styles.drawerHeader}>
          <Image
            style={styles.drawerImage}
            source={require('../img/UCSD_logo.png')} />
            <Text style = {styles.username}>Hi, Student</Text>
            <View style = {styles.email}>
            <Text>{props.screenProps.email}</Text><Text style={{color:'blue'}} onPress={()=>
              Alert.alert(
                'Log out',
                'Do you want to logout?',
                [
                  {text: 'Cancel', onPress: () => {return null}},
                  {text: 'Confirm', onPress: () => {
                    AsyncStorage.clear();
                    navigate('LogIn')
                  }},
                ],
                { cancelable: false }
              )  
            }>Sign Out</Text>
            </View>
      </Header>
      <Content>
        <DrawerItems {...props} />
      </Content>
    </Container>
  );
  }

const MyDrawerNavigator = createDrawerNavigator({
    Home: {screen: HomeScreen},
    FindGroup: {screen: FindGroupScreen},
    MyGroup: {screen: MyGroupScreen},
    CreateGroup:{screen:CreateGroupScreen},
  },{
    contentComponent: DrawerHeader
  });
  
const Main = createAppContainer(MyDrawerNavigator);
class MainPage extends React.Component {
  state = {
    email : ''
  }
  static router = MyDrawerNavigator.router;
  
  componentDidMount = async() => {
    var email = await AsyncStorage.getItem(USER_EMAIL);
    this.setState({
      email : email
  });
  }

  render() {
    return (
      <Main screenProps={{email: this.state.email}} navigation={this.props.navigation}/>
    );
  }
}
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
        fontSize: 20,
        left:10,
        top:0
    },
    email:{
      flexDirection:'row',
      fontSize: 18,
      left:10,
      justifyContent: 'space-between',     
      paddingRight:30
    }
  })

export default MainPage;