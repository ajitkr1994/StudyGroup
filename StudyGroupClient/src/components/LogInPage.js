import React, { Component } from 'react';
import { View, Button, StyleSheet, Text, AsyncStorage} from 'react-native';
import t from 'tcomb-form-native'; // 0.6.9
//import DateTimePicker from '@react-native-community/datetimepicker';


const Form = t.form.Form;

const userInfo = t.struct({
  emailAddress: t.String,
  password: t.String,
});

var STORAGE_KEY = 'id_token';
var USER_EMAIL = 'user_email';

class LogInPage extends Component {

  async _onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

    // Send this value to backend for creating the group.   
    handleLogIn = () => {
      // do the things  
      const value = this._form.getValue(); // Send this value to backend.
      console.log('value: ', value);
      // this.setState({value: null}); // <-- Clear form after 'Create Group' has been clicked.

      if (value) { // if validation fails, value will be null
         fetch("http://13.58.215.99:3000/api/login", {
        method: "POST", 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: value.emailAddress, 
          password: value.password, 
        })
      }).then((response) => {
        if (response.status === 200)
        {
          // If login is successful, navigate to Main page.
          this.props.navigation.navigate('Main')
        }
        else
        {
          // this.props.navigation.navigate('Main')
              // this.setState({value: null}); // <-- Clear form after 'Create Group' has been clicked.

        }
        return response.text()
      })
         .then((responseData) => {
          this._onValueChange(STORAGE_KEY, responseData);
          this._onValueChange(USER_EMAIL, value.emailAddress);
        console.log('Response satus:', responseData);
        console.log('user email Baka:', value.emailAddress);
      })
      .done();
    }

    }



    handleRegister = () => {
      this.setState({value: null}); // <-- Clear form
      this.props.navigation.navigate('Register')
    }
  
    render() {
      return (
        <View style={styles1.container}>
        <Form 
          ref={c => this._form = c}
          type={userInfo}
        />
        <Button
          title="Log In"
          onPress={this.handleLogIn}
        />
        <Text></Text>
        <Text></Text>
        <Text></Text>
        
        <Button
          title="New User? Register here."
          onPress={this.handleRegister}
        />
      </View>
      );
    }
  }

const styles1 = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#ffffff',
  },
});

export default LogInPage;
export {STORAGE_KEY};
export {USER_EMAIL};