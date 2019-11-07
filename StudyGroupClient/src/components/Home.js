import React, { Component } from 'react';
import { Text, View, Button} from 'react-native';
import { Header, Body, Title, Left, Icon, Right } from 'native-base'

class HomeScreen extends Component {
    static navigationOptions = {
      title: 'Home',
    };
    render() {
      return (
      <View>
        <Header>
          <Left>
            <Icon name="ios-menu" onPress={() => this.props.navigation.openDrawer()} />
          </Left>
          <Body>
            <Title>Study Group</Title>
          </Body>
          <Right/>
        </Header>
        <Text>HomeScreen</Text>
      </View>
      )
    }
}

export default HomeScreen;
