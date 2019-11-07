import React, { Component } from 'react';
import { Text, View, Image, Button} from 'react-native';
import styles from '../styles/styles';
import MyHeader from './shared/MyHeader'

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
      group1_start_time: ''
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
            group1_start_time: responseJson[0].startTime

         })
         console.log(this.state.group1_start_time);
      })
      .catch((error) => {
         console.error(error);
      });
   }
      render() {
      return (
        <View>
          <MyHeader drawerOpen={() => this.props.navigation.openDrawer()}/>
        <Text>Start Time = {this.state.group1_start_time}</Text>
        </View>
      );
    }
  }

  export default FindGroupScreen;