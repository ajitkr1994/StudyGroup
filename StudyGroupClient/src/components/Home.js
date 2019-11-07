import React, { Component } from 'react';
import { Text, View } from 'react-native';
import MyHeader from './shared/MyHeader'

class HomeScreen extends Component {
    static navigationOptions = {
      title: 'Home',
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
      <View>
        <MyHeader drawerOpen={() => this.props.navigation.openDrawer()}/>
        <Text>HomeScreen</Text>
      </View>
      )
    }

}

export default HomeScreen;
