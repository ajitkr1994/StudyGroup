import React, { Component } from 'react';
import { View } from 'react-native';
import { Header, Body, Title, Left, Icon, Right } from 'native-base'

class MyHeader extends Component {
    render() {
      return (
      <View>
        <Header>
          <Left>
            <Icon name="ios-menu" onPress={() => this.props.drawerOpen()} />
          </Left>
          <Body>
            <Title>{this.props.title}</Title>
          </Body>
          <Right/>
        </Header>
      </View>
      )
    }

}

export default MyHeader;
