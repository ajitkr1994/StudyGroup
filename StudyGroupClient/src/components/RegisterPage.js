import React, { Component } from 'react';
import { View, Button, StyleSheet} from 'react-native';
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
      this.setState({value: null}); // <-- Clear form after 'Create Group' has been clicked.
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