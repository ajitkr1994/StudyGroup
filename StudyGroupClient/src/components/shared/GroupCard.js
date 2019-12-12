import React, { Component } from "react";
import { Button, StyleSheet, View } from 'react-native'
import { Card, CardItem, Text, Body } from "native-base";
export default class GroupCard extends Component {
  render() {
    return (
          <Card style={{marginTop:30}}>
            <CardItem header bordered style={styles.header}>
              <Text style={styles.title}>{this.props.className}</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                    {this.props.content}
                </Text>
              </Body>
            </CardItem>
            <Button title={this.props.title} onPress={this.props.func}/>
          </Card>
    );
  }
}

const styles = StyleSheet.create({
    title: {
      color: "white",
      fontSize: 20
    },
    header: {
      backgroundColor: "skyblue",
    }
  });