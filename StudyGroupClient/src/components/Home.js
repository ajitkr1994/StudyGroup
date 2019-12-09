import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import MyHeader from './shared/MyHeader';

styles = StyleSheet.create({
      bigBlue: {
      color: 'pink',
      fontWeight: 'bold',
      fontSize: 30,
      },
    });

class HomeScreen extends Component {
    static navigationOptions = {
      title: 'Home',
    };


    render() {
      return (
      <View>
        <MyHeader title = 'Study Group' drawerOpen={() => this.props.navigation.openDrawer()}/>
        <Text style={styles.bigBlue}>Welcome!</Text>
      </View>
      )
    }

}

export default HomeScreen;
