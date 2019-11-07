import React, { Component } from 'react';
import { Text, View, Image, Button} from 'react-native';
import styles from '../styles/styles';
import GroupCard from './shared/GroupCard';
import MyHeader from './shared/MyHeader'

class MyGroupScreen extends Component {
    static navigationOptions = {
      drawerLabel: 'MyGroupScreen',
      drawerIcon: ({ tintColor }) => (
        <Image
          // source={require('./notif-icon.png')}
          style={[styles.icon, { tintColor: tintColor }]}
        />
      ),
    };

    state = {
      className : ''
   }
    // Use the URL for showing the current groups of this user.
   componentDidMount = () => {
      fetch('http://ec2-52-53-241-171.us-west-1.compute.amazonaws.com:3000/api/userJoinedGroups?email=bill@ucsd.edu', {
         method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         this.setState({
            className : responseJson[0].class
         })
      })
      .catch((error) => {
         console.error(error);
      });
   }
  
    render() {
      return (
        <View style={{flex: 1}}>
            <MyHeader title = 'My Group' drawerOpen={() => this.props.navigation.openDrawer()}/>
          <View style={{width:"100%", height: "100%", alignItems: "center"}}>
            {/* //style={{alignItems: "center"}}> */}
            <GroupCard></GroupCard>
            <Text>{this.state.className}</Text>
          </View>
        </View>
      );
    }
  }

  export default MyGroupScreen;