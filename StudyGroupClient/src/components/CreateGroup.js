import React, { Component } from 'react';
import { Text, View, ScrollView, SafeAreaView, Image, Button} from 'react-native';
import styles from '../styles/styles';
import MyHeader from './shared/MyHeader';
import { Container, Content } from "native-base";
class CreateGroupScreen extends Component {
    static navigationOptions = {
      title: 'Create Group',
      drawerLabel: 'Create Group',
      drawerIcon: ({ tintColor }) => (
        <Image
          source={require('../img/creategroup.png')}
          style={[styles.icon]}
        />
      ),
    };

    state = {
      groups : []
    }
  
    render() {
      return (
        <View style={{flex: 1}}>
          <View>
            <MyHeader title = 'Create Group' drawerOpen={() => this.props.navigation.openDrawer()}/>
          </View>
          <View style={{flex: 1, alignItems: "center"}}>
            <ScrollView style={{width:"90%"}}>
              <Container>
              </Container>
            </ScrollView>
          </View>
        </View>
      );
    }
  }

  export default CreateGroupScreen;