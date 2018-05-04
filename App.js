/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity
} from 'react-native';

// import { GiftedChat } from 'react-native-gifted-chat';

import SocketIOClient from 'socket.io-client';
var $this;
export default class App extends Component {
  constructor(props) {
    super(props);
    this.socket = SocketIOClient('http://192.168.211.174:3000');
    $this = this;
    this.socket.on('update', function (data) {
      console.log(data);      
      $this.setState({
        "name":data.name,
        "datatext": data.msg
      });
    });
    this.state = {
      "name" : "UnKnown",
      "datatext": "No Message",
      messages: []
    }
  }
  componentDidMount(){
    
  }
  // _SendToServer(){
  //   alert("hi");
  //   this.socket.emit('client', {'id':2, 'name':Math.random().toString(36).substr(2, 5)+' come from client'});
  // }
  handleSubmit(event) {
    this.socket.emit('client', {'id':1,"name":"ASO", 'msg':event.nativeEvent.text});
  }
  render() {
    // var user = { _id: this.state.userId || -1 };

    return (
      <View style={styles.container}>
        <Text>{this.state.name}: {this.state.datatext}</Text>
        
          <TextInput
            ref='textInput'
            autoCapitalize='none'
            placeholder='Enter a chat message...'
            returnKeyType='send'
            style={{height: 40, borderColor: 'gray', borderWidth: 1, margin: 10}}
            onSubmitEditing={this.handleSubmit.bind(this)}
          />
          <ScrollView style={{height: 400}}>
            {
              this.state.messages.map(m => {
                return <Text style={{margin: 10}}>{m}</Text>
              })
            }
          </ScrollView>
      </View>
      // <GiftedChat
      //       messages={this.state.messages}
      //       onSend={this.onSend}
      //       user={user}
      // />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
