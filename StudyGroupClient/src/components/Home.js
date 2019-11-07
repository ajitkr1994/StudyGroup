import React, { Component } from 'react';
import { Text, View, Button} from 'react-native';

class HomeScreen extends Component {
    static navigationOptions = {
      title: 'Home',
    };

    state = {
      data: ''
   }
   // Use the URL for this user's group.
   componentDidMount = () => {
      fetch('https://jsonplaceholder.typicode.com/posts/1', {
         method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         console.log(responseJson);
         this.setState({
            data: responseJson
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
      <Text>Hey!</Text>
      <Text>{this.state.data.body}</Text>

      </View>
      
      )
    }

}

export default HomeScreen;