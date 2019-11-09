import React, { Component } from 'react';
import { Text, View, ScrollView, SafeAreaView, Image, Button} from 'react-native';
import styles from '../styles/styles';
import GroupCard from './shared/GroupCard';
import MyHeader from './shared/MyHeader'
import { Container, Content } from "native-base";
import SearchBar from 'react-native-search-bar';

class FindGroupScreen extends Component {
    static navigationOptions = {
      drawerLabel: 'FindGroupScreen',
      drawerIcon: () => (
        <Image
          source={require('../img/findgroup.png')}
          style={[styles.icon]}
        />
      ),
    };
  
    state = {
      groups: [],
      search: ''
    }

  formatContent(startTime, endTime, members) {
    let content = "";
    content += "Time: "+startTime+"-"+endTime;
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

  updateSearch = search=> {
    this.setState({ search });
  };

  // Use the URL for showing the groups according to the class name that was searched (e.g. submit 'CSE210' in search bar)
  fetchData(search) {
    const url = 'http://ec2-52-53-241-171.us-west-1.compute.amazonaws.com:3000/api/findGroupsWithClassName?className=';
    fetch(url + search, {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
        groups: [...responseJson]
      });
      this.refreshGroupCards();
    })
    .catch((error) => {
      console.error(error);
    });
  }


    render() {
      const { search } = this.state;

      return (
        <View style={{flex: 1}}>
          <View>
            <MyHeader title = 'Find Group' drawerOpen={() => this.props.navigation.openDrawer()}/>
          </View>
          <View style={{flex: 1}}>
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