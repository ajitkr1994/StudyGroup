import React, { Component } from 'react';
import { Text, View, Button} from 'react-native';

class HomeScreen extends Component {
    static navigationOptions = {
      title: 'Home',
    };
    render() {
      return (      
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => this.props.navigation.openDrawer()}
        title="humberger"/>
      <Text>HomeScreen</Text>
      </View>)
    }
}

export default HomeScreen;