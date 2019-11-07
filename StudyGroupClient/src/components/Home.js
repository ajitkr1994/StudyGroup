import React, { Component } from 'react';
import { Text, View, Button} from 'react-native';

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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => this.props.navigation.openDrawer()}
        title="humberger"/>
      <Text>{this.state.className}</Text>
      </View>
      
      )
    }

}

export default HomeScreen;