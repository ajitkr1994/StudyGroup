import React, { Component } from 'react';
import { Text, View, ScrollView, SafeAreaView, Image, Button, AsyncStorage} from 'react-native';
import styles from '../styles/styles';
import GroupCard from './shared/GroupCard';
import MyHeader from './shared/MyHeader'
import { Container, Content } from "native-base";
import {STORAGE_KEY, USER_EMAIL} from './LogInPage';
import SearchBar from 'react-native-search-bar';
import {STORAGE_KEY, USER_EMAIL} from './LogInPage';

class FindGroupScreen extends Component {
    static navigationOptions = {
      title:'Find Group',
      drawerLabel: 'Find Group',
      drawerIcon: () => (
        <Image
          source={require('../img/findgroup.png')}
          style={[styles.icon]}
        />
      ),
    };
  
    state = {
      myGroups: [],
      searchGroups: [],
      groups: [],
      search: ''
    }

    componentDidMount = async() => {
      var DEMO_TOKEN = await AsyncStorage.getItem(STORAGE_KEY);
      var user_email = await AsyncStorage.getItem(USER_EMAIL);
      this.setState({
        DEMO_TOKEN: DEMO_TOKEN,
        user_email: user_email
      })

      this.refresh();
    }

  refresh() {
    console.log("refresh");
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
        myGroups : [...responseJson]
      });
      console.log(this.state.myGroups);
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

      if (hour <12)
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
      content += this.findTime(startTime) + "\n";

      content += "Location: " + location + "\n";

      content += "Members:"
      

      for (let i=0; i< members.length; i++) {
        content += "\n" + members[i].name||""
      }
      console.log(content)
      return content;
    }

    joinGroup(id) {
      console.log("JOIN");
      fetch('http://13.58.215.99:3000/api/joinGroup?groupId='+id, {
        method: 'POST',
        body: JSON.stringify({
          groupId: id
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

        return Promise.all([statusCode, data]);
      }).then(([status, responseData]) => {

        if (status === 200)
        {
          console.log('Response status Baka:', status);
          this.refresh();
          this.fetchData(this.state.search);
        }
      }).done();
    }

  refreshGroupCards() {
    const cards = [];
    var today = new Date();
    var date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate() + 'T' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    for (let i = 0; i < this.state.groups.length; i++) {
      if (date <= this.state.groups[i].startTime) {
        cards.push(
          <GroupCard key={this.state.groups[i]._id} className={this.state.groups[i].className} content={this.formatContent(this.state.groups[i].startTime, this.state.groups[i].endTime, this.state.groups[i].members, this.state.groups[i].location)} title="Join" func={() => this.joinGroup(this.state.groups[i]._id)}/>
        ); 
    }
    return cards;
  }

  updateSearch = search=> {
    this.setState({ search });
  };

  // Use the URL for showing the groups according to the class name that was searched (e.g. submit 'CSE210' in search bar)
  async fetchData(search) {

    this.setState({
      search : search
    });

    const url = 'http://13.58.215.99:3000/api/findGroupsWithClassName?className=';
    fetch(url + search, {
      method: 'GET',
      headers: {
            'Authorization': 'Bearer ' + this.state.DEMO_TOKEN
    }

    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      let groups = [...responseJson]
      var filteredGroups = [];
      for (let i=0; i < groups.length; i++) {
        var check = true;
        for (let j=0; j < this.state.myGroups.length; j++) {
          if (groups[i]._id == this.state.myGroups[j]._id) {
            check = false;
          }
        }

        if (check == true) {
          filteredGroups.push(groups[i]);
        }

      }

      this.setState({
        groups: filteredGroups
      });
      this.refreshGroupCards();
    })
    .catch((error) => {
      console.error(error);
    });

    var filteredGroups = [];

    this.setState({
      groups: filteredGroups
    });
  }


    render() {
      const { search } = this.state;

      return (
        <View style={{flex: 1}}>
          <View>
            <MyHeader title = 'Find Group' drawerOpen={() => this.props.navigation.openDrawer()}/>
          </View>
          <View>
            <SearchBar ref="searchBar" placeholder="Search" onSearchButtonPress={(search) => {this.fetchData(search);}} value={search} />
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

  export default FindGroupScreen;
