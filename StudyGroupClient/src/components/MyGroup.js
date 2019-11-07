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
      groups : []
    }

    // Use the URL for showing the current groups of this user.
    componentDidMount = () => {
        fetch('http://ec2-52-53-241-171.us-west-1.compute.amazonaws.com:3000/api/userJoinedGroups?email=bill@ucsd.edu', {
          method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
              groups : [...responseJson]
          });
          this.refreshGroupCards();
        })
        .catch((error) => {
          console.error(error);
        });
    }

    refreshGroupCards() {
      const cards = [];
      for (let i=0; i < this.state.groups.length; i++) {
          cards.push(<Text>{this.state.groups[i].class}</Text>) 
          // todo key
      }
      return cards;
    }
  
    render() {
      return (
        <View style={{flex: 1}}>
            <MyHeader title = 'My Group' drawerOpen={() => this.props.navigation.openDrawer()}/>
          <View style={{width:"100%", height: "100%", alignItems: "center"}}>
            {this.refreshGroupCards()}
            {/* //style={{alignItems: "center"}}> */}
            <GroupCard className="hi" content={["hello"]}></GroupCard>
            <Text>{this.state.className}</Text>
          </View>
        </View>
      );
    }
  }

  export default MyGroupScreen;