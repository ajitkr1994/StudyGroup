import React, { Component } from 'react';
import { Text, View, ScrollView, SafeAreaView, Image, Button, AsyncStorage} from 'react-native';
import styles from '../styles/styles';
import GroupCard from './shared/GroupCard';
import MyHeader from './shared/MyHeader'
import { Container, Content } from "native-base";
import {STORAGE_KEY, USER_EMAIL} from './LogInPage';


class MyGroupScreen extends Component {
    static navigationOptions = {
      title: 'My Group',
      drawerLabel: 'My Group',
      drawerIcon: ({ tintColor }) => (
        <Image
          source={require('../img/mygroup.png')}
          style={[styles.icon]}
        />
      ),
    };

    state = {
      groups : []
    }

    // Use the URL for showing the current groups of this user.
    componentDidMount = async() => {
    	var DEMO_TOKEN = await AsyncStorage.getItem(STORAGE_KEY);
      	var user_email = await AsyncStorage.getItem(USER_EMAIL);

        fetch('http://13.58.215.99:3000/api/userJoinedGroups?email='+user_email, {
          method: 'GET',
          headers: {
      			'Authorization': 'Bearer ' + DEMO_TOKEN
    		}
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
              groups : [...responseJson]
          });
          console.log(this.state.groups)
          console.log(this.state.groups[0].members)
          this.refreshGroupCards();
        })
        .catch((error) => {
          console.error(error);
        });
    }

    findDate(dateTime)
    {
      var date = String(dateTime).split('T');
      return date[0];
    }

    findTime(dateTime)
    {
      var time = String(dateTime).split('T');
      var hour = parseInt(time[1].split(':')[0]);

      var res = "";

      if (hour <11)
        res = String(hour) + "AM";
      else if (hour == 12)
        res = String(hour) + "PM";
      else
        res = String(hour-12) + "PM";

      return res;
    }

    formatContent(startTime, endTime, members) {
      let content = "";

      content += "Date: " + this.findDate(startTime) + "\n";
      
      content += "Time: "; //+startTime+"-"+endTime;

      content += this.findTime(startTime) + "-" + this.findTime(endTime) + "\n";
      content += "Members:"
      

      for (let i=0; i< members.length; i++) {
        content += "\n" + members[i].name||""
      }
      console.log(content)
      return content;
    }

    refreshGroupCards() {
      const cards = [];
      for (let i=0; i < this.state.groups.length; i++) {
          cards.push(
            <GroupCard key={this.state.groups[i]._id} className={this.state.groups[i].class} content={this.formatContent(this.state.groups[i].startTime, this.state.groups[i].endTime, this.state.groups[i].members)}/>
          ); 
          // todo key
      }
      return cards;
    }
  
    render() {
      return (
        <View style={{flex: 1}}>
          <View>
            <MyHeader title = 'My Group' drawerOpen={() => this.props.navigation.openDrawer()}/>
          </View>
          <View style={{flex: 1, alignItems: "center"}}>
            <ScrollView style={{width:"90%"}}>
              <Container>
                <Content padder>
                  {this.refreshGroupCards()}
                </Content>
              </Container>
            </ScrollView>
          </View>
        </View>
      );
    }
  }

  export default MyGroupScreen;