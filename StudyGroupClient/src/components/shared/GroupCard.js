import React, { Component } from "react";
import { StyleSheet } from 'react-native'
import { Container, Header, Content, Card, CardItem, Text, Body } from "native-base";
export default class GroupCard extends Component {
  render() {
    return (
      <Container style={styles.container}>
        <Content padder>
          <Card>
            <CardItem header bordered style={styles.header}>
              <Text style={styles.title}>NativeBase</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  NativeBase is a free and open source framework that enable
                  developers to build
                  high-quality mobile apps using React Native iOS and Android
                  apps
                  with a fusion of ES6.
                </Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flexShrink: 0,
      flexGrow: 1,
      width: "90%",
      marginTop: 10
    },
    // item: {
    //   backgroundColor: '#f9c2ff',
    //   padding: 20,
    //   marginVertical: 8,
    //   marginHorizontal: 16,
    // },
    title: {
      color: "white",
      fontSize: 20
    },
    header: {
      backgroundColor: "#007aff",
    }
  });