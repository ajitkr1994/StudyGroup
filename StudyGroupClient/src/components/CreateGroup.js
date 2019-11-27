import React, { Component } from 'react';
import { Text, View, ScrollView, SafeAreaView, Image, Button, TextInput, StyleSheet, KeyboardAvoidingView} from 'react-native';
import styles from '../styles/styles';
import MyHeader from './shared/MyHeader';
import { Container, Content } from "native-base";
import t from 'tcomb-form-native'; // 0.6.9
//import DateTimePicker from '@react-native-community/datetimepicker';


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
      placeholder: 'MM/DD/YY',
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
    handleSubmit = () => {
    // do the things  
    const value = this._form.getValue(); // Send this value to backend.
    console.log('value: ', value);
    this.setState({value: null}); // <-- Clear form after 'Create Group' has been clicked.
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