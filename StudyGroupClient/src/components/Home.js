import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MyHeader from './shared/MyHeader';

styles = StyleSheet.create({
      bigBlue: {
      color: 'orange',
      fontWeight: 'bold',
      fontSize: 30,
      },
    });

class HomeScreen extends Component {
    static navigationOptions = {
      title: 'Home',
    };

    state = {
      className : ''
   }
    // Use the URL for showing the current groups of this user.
   componentDidMount = () => {
      fetch('http://18.222.34.199:3000/api/userJoinedGroups?email=bill@ucsd.edu', {
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
        <MyHeader title = 'Study Group' drawerOpen={() => this.props.navigation.openDrawer()}/>
        <Text style={styles.bigBlue}>Welcome, Alice!</Text>
      </View>
      )
    }

}

export default HomeScreen;
