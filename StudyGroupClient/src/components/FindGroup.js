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
  
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>FindGroupScreen</Text>
        <Button
          onPress={() => this.props.navigation.navigate('Home')}
          title="Go back home"
        />
        </View>
      );
    }
  }

  export default FindGroupScreen;