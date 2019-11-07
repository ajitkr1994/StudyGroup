import React, { Component } from 'react';
import { Text, View, Image, Button} from 'react-native';
import styles from '../styles/styles';

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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>MyGroupScreen</Text>
        <Button
          onPress={() => this.props.navigation.navigate('Home')}
          title="Go back home"
        />
        <Text>{this.state.className}</Text>
        </View>
      );
    }
  }

  export default MyGroupScreen;