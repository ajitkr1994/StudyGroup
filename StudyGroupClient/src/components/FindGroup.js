import React, { Component } from 'react';
import { Text, View, Image, Button} from 'react-native';
import styles from '../styles/styles';

class FindGroupScreen extends Component {
    static navigationOptions = {
      drawerLabel: 'FindGroupScreen',
      drawerIcon: ({ tintColor }) => (
        <Image
          // source={require('./notif-icon.png')}
          style={[styles.icon, { tintColor: tintColor }]}
        />
      ),
    };
  
      state = {
      group1_id: ''
   }
   // Use the URL for showing the groups according to this class Name.
   componentDidMount = () => {
      fetch('http://ec2-52-53-241-171.us-west-1.compute.amazonaws.com:3000/api/findGroupsWithClassName?className=CSE210', {
         method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         console.log(responseJson);
         this.setState({
            group1_id: responseJson[0]._id
         })
      })
      .catch((error) => {
         console.error(error);
      });
   }

    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>FindGroupScreen</Text>
        <Button
          onPress={() => this.props.navigation.navigate('Home')}
          title="Go back home"
        />
        // Show the current groups already formed for the current class
        //<Text>{this.state.group1_id}</Text>
        </View>
      );
    }
  }

  export default FindGroupScreen;