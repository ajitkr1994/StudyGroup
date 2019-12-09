import React, { Component } from 'react';
import { View, Button, StyleSheet, AsyncStorage} from 'react-native';
import t from 'tcomb-form-native'; // 0.6.9
//import DateTimePicker from '@react-native-community/datetimepicker';


const Form = t.form.Form;

const CourseInfo = t.struct({
    username:t.String,
    emailAddress: t.String,
    password: t.String,
    confirmPassword: t.String,
});

class RegisterPage extends Component {

    handleSubmit = () => {
      // do the things  
      const value = this._form.getValue(); // Send this value to backend.
      console.log('value: ', value);
      
      if (value) { // if validation fails, value will be null

      fetch("http://13.58.215.99:3000/api/user/signup", {
        method: "POST", 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: value.username,
          email: value.emailAddress, 
          password: value.password, 
        })
      })
      .then((response) => {
        console.log('Response status:', response.status);

        if (response.status === 200)
        {
          // If Signup is successful, then navigate back to Login page.
          this.props.navigation.navigate('LogIn')
        }
        else
        {
          // If not successful, then don't do anything.
        }

      })
      .done();
    }

      

    }
  
    render() {
      return (
        <View style={styles1.container}>
        <Form 
          ref={c => this._form = c}
          type={CourseInfo}
        />
        <Button
          title="Submit"
          onPress={this.handleSubmit}
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

export default RegisterPage;