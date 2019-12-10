import React, { Component } from 'react';
import { Text, View, ScrollView, SafeAreaView, Image, Button, TextInput, StyleSheet, KeyboardAvoidingView, AsyncStorage} from 'react-native';
import styles from '../styles/styles';
import MyHeader from './shared/MyHeader';
import t from 'tcomb-form-native'; // 0.6.9
//import DateTimePicker from '@react-native-community/datetimepicker';
import {STORAGE_KEY, USER_EMAIL} from './LogInPage';


const Form = t.form.Form;

const CourseInfo = t.struct({
  courseNumber: t.String,
  location: t.maybe(t.String),
  date: t.String,
  time: t.String
});

var options = {
  fields: {
    courseNumber: {
      label: 'Course Number',
      placeholder: 'Example: CSE210',
    },
    location: {
      placeholder: 'Geisel Library',
    },
    date: {
      placeholder: 'YYYY-MM-DD',
    },
    time: {
      placeholder: 'HH:MM',
    }
  }
};

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


    // Send this value to backend for creating the group.   
    handleSubmit = async() => {
    var DEMO_TOKEN = await AsyncStorage.getItem(STORAGE_KEY);
    var user_email = await AsyncStorage.getItem(USER_EMAIL);

    const value = this._form.getValue(); // Send this value to backend.
    //console.log('value: ', value);

    if (value) { // if validation fails, value will be null

        var startTime1 = value.date+"T"+value.time+":00Z";
        console.log('startTime', startTime1);

        var endTime1 = startTime1;
        console.log('endTime', endTime1);
        console.log('className', value.courseNumber);
        console.log('---------------------');

        if (!value.courseNumber || !startTime1 || !endTime1) {
            console.log('Invalid Form');
        }

        // console.log('startTime = ', startTime);

         fetch("http://13.58.215.99:3000/api/createGroup", {
        method: "POST", 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + DEMO_TOKEN
        },
        body: JSON.stringify({
          startTime: startTime1,
          endTime: startTime1, 
          className: value.courseNumber,
          location: value.location, 
        })
      }).then((response) => {
        console.log('CreateGroup responseCode=',response.status);
        if (response.status === 200)
        {
          // If creation is successful, empty the cells.
          this.setState({value: null});
        }
        else
        {
          // Do nothing.
        }
        return response.text()
      })
         .then((responseData) => {
      })
      .done();
    }

  }
  
    render() {
      return (
        <View style={{flex: 1}}>
          <View>
            <MyHeader title = 'Create Group' drawerOpen={() => this.props.navigation.openDrawer()}/>
          </View>
        <KeyboardAvoidingView style={styles1.container} behavior="padding">
        <ScrollView>
        <Form 
          ref={c => this._form = c}
          type={CourseInfo}
          options={options}
        />
        <Button
          title="Create Group!"
          onPress={this.handleSubmit}
        />
        </ScrollView>
        </KeyboardAvoidingView>
      </View>
      );
    }
  }

const styles1 = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 0,
    padding: 20,
    backgroundColor: '#ffffff',
  },
});

  export default CreateGroupScreen;