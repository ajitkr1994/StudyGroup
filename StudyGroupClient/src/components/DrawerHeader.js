import {DrawerItems} from 'react-navigation-drawer';
import { Container, Content, Header, Body } from 'native-base';
import React, {Component} from 'react';
import {StyleSheet,Image} from 'react-native';

const DrawerHeader = (props) => (
    <Container>
      <Header style={styles.drawerHeader}>
        <Body>
          <Image
            style={styles.drawerImage}
            source={require('../img/UCSD_logo.png')} />
        </Body>
      </Header>
      <Content>
        <DrawerItems {...props} />
      </Content>
  
    </Container>
  )

  const styles = StyleSheet.create({

    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    drawerHeader: {
      height: 200,
      backgroundColor: 'white'
    },
    drawerImage: {
      height: 100,
      width: 150,
      resizeMode: 'contain'
    }
  
  })

  export default DrawerHeader;