import React, { Component } from 'react';
import { Text, View, ScrollView, SafeAreaView, Image, Button, AsyncStorage} from 'react-native';
import styles from '../styles/styles';
import GroupCard from './shared/GroupCard';
import MyHeader from './shared/MyHeader'
import { Container, Content } from "native-base";
import {STORAGE_KEY, USER_EMAIL} from './LogInPage';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { NavigationEvents } from 'react-navigation';

class UpComing extends Component {
    static navigationOptions = {
      title: 'Up Coming',
    };

    state = {
      groups : [],
      DEMO_TOKEN: '',
      user_email: ''
    }

    // Use the URL for showing the current groups of this user.
    componentDidMount = async() => {
    	var DEMO_TOKEN = await AsyncStorage.getItem(STORAGE_KEY);
      var user_email = await AsyncStorage.getItem(USER_EMAIL);
      this.setState({
        DEMO_TOKEN: DEMO_TOKEN,
        user_email: user_email
      })
      this.refresh()
    }

    refresh() {
      console.log('refresh')
      if (this.state.user_email != '') {
        fetch('http://13.58.215.99:3000/api/userJoinedGroups?email='+this.state.user_email, {
          method: 'GET',
          headers: {
      			'Authorization': 'Bearer ' + this.state.DEMO_TOKEN
    		}
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
              groups : [...responseJson]
          });
          console.log(this.state.groups)
          console.log('Class Name should be:', this.state.groups[0].className);
          this.refreshGroupCards();
        })
        .catch((error) => {
          console.error(error);
        });
    }
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

    formatContent(startTime, endTime, members, location) {
      let content = "";

      content += "Date: " + this.findDate(startTime) + "\n";
      
      content += "Time: "; //+startTime+"-"+endTime;
      content += this.findTime(startTime) + "-" + this.findTime(endTime) + "\n";

      content += "Location: " + location + "\n";

      content += "Members:"

      for (let i=0; i< members.length; i++) {
        content += "\n" + members[i].name||""
      }
      console.log(content)
      return content;
    }

    leaveGroup(id) {
      console.log('ID = ',id);
      console.log("Token = ", this.state.DEMO_TOKEN);
      fetch('http://13.58.215.99:3000/api/leaveGroup', {
        method: 'GET',
        query: JSON.stringify({
          groupId: id,
        }),
        headers: {
          'Authorization': 'Bearer ' + this.state.DEMO_TOKEN,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
      })
      .then((response) => {
        const statusCode = response.status;
        const data = response.text();
        console.log('Status:',statusCode);

        return Promise.all([statusCode, data]);
      }).then(([status, responseData]) => {

        if (status === 200)
        {
          console.log('Response status Baka:', status);
        }
      }).done();
      
      this.refresh();
    }

    refreshGroupCards() {
      const cards = [];
      for (let i=0; i < this.state.groups.length; i++) {
        var today = new Date();
        date = today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate()+'T'+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        if(date <= this.state.groups[i].startTime){
          cards.push(
            <GroupCard key={this.state.groups[i]._id} className={this.state.groups[i].className} content={this.formatContent(this.state.groups[i].startTime, this.state.groups[i].endTime, this.state.groups[i].members, this.state.groups[i].location)} title="Leave" func={()=> this.leaveGroup(this.state.groups[i]._id)} />
          ); 
        }
      }
      return cards;
    }
  
    render() {
      return (
        <View style={{flex: 1}}>
          <NavigationEvents onDidFocus={() => this.refresh()}/>
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

class Past extends Component {
    static navigationOptions = {
      title: 'Past',
    };

    state = {
      groups : [],
      DEMO_TOKEN: '',
      user_email: ''
    }

    // Use the URL for showing the current groups of this user.
    componentDidMount = async() => {
      var DEMO_TOKEN = await AsyncStorage.getItem(STORAGE_KEY);
      this.token = DEMO_TOKEN
      var user_email = await AsyncStorage.getItem(USER_EMAIL);
      this.setState({
        DEMO_TOKEN: DEMO_TOKEN,
        user_email: user_email
      })
      this.refresh()
    }

    refresh() {
      console.log('refresh')
      if (this.state.user_email != '') {
        fetch('http://13.58.215.99:3000/api/userJoinedGroups?email='+this.state.user_email, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + this.state.DEMO_TOKEN
        }
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
              groups : [...responseJson]
          });
          console.log(this.state.groups)
          console.log('Class Name should be:', this.state.groups[0].className);
          this.refreshGroupCards();
        })
        .catch((error) => {
          console.error(error);
        });
    }
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

    formatContent(startTime, endTime, members, location) {
      let content = "";

      content += "Date: " + this.findDate(startTime) + "\n";
      
      content += "Time: "; //+startTime+"-"+endTime;
      content += this.findTime(startTime) + "-" + this.findTime(endTime) + "\n";

      content += "Location: " + location + "\n";

      content += "Members:"

      for (let i=0; i< members.length; i++) {
        content += "\n" + members[i].name||""
      }
      console.log(content)
      return content;
    }

    leaveGroup(id) {
      fetch('http://13.58.215.99:3000/api/leaveGroup?groupId=' + id), {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + this.token
        }
      };
    }

    refreshGroupCards() {
      const cards = [];
      for (let i=0; i < this.state.groups.length; i++) {
        var today = new Date();
        date = today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate()+'T'+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        if(date > this.state.groups[i].startTime){
          cards.push(
            <GroupCard key={this.state.groups[i]._id} className={this.state.groups[i].className} content={this.formatContent(this.state.groups[i].startTime, this.state.groups[i].endTime, this.state.groups[i].members, this.state.groups[i].location)} title="Leave" func={() => this.leaveGroup(this.state.groups[i]._id)} />
          ); 
        }
      }
      return cards;
    }
  
    render() {
      return (
        <View style={{flex: 1}}>
          <NavigationEvents onDidFocus={() => this.refresh()}/>
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

  const TabNavigator = createBottomTabNavigator({
    UpComing:UpComing,
    Past:Past,
  })
  
  export default TabNavigator;