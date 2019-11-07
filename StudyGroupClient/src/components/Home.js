import React, { Component } from 'react';
import { Text, View, Image} from 'react-native';

class HomeScreen extends Component {
    static navigationOptions = {
      title: 'Home',
    };
    render() {
      return (      
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>HomeScreen</Text>
      </View>)
    }
}

export default HomeScreen;