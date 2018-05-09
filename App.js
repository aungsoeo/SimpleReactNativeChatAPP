import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {GiftedChat, Actions, Bubble, SystemMessage} from 'react-native-gifted-chat';
// import CustomActions from './CustomActions';
// import CustomView from './CustomView';
import SocketIOClient from 'socket.io-client';
var $this;
export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.socket = SocketIOClient('http://192.168.211.174:3000');
    $this = this;
    this.socket.emit('online',{'id':2,"username":"HHA"});
    this.socket.on('update', function (data) {   
      $this.onReceive(data);
    });
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    // this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;
  }

  componentWillMount() {   //need to fetch real data with api
    this._isMounted = true;
    this.setState({
      messages: [
        {
          _id: Math.round(Math.random() * 1000000),
          text: 'Are you building a chat app?',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Admin',
          },
        },
      ],
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoadEarlier() {   // to load early msg from server, we need to fetch from api, show msg with limit
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, require('./data/old_messages.js')),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }

  onSend(messages = []) {  // send user text msg to server , need to save with api
    this.socket.emit('client', {'id':2,"name":"HHA", 'msg':messages[0].text});
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  onReceive(data) {  //receive txt msg from server , show typing... need to modify with new socket
    if(data.to_userID ==2){ 
        var msg = data.text;
        if (msg.length > 0) {
            this.setState((previousState) => {
              return {
                typingText: 'Server  is typing...'
              };
            });
        }
        setTimeout(() => {
          this.setState((previousState) => {
            return {
              messages: GiftedChat.append(previousState.messages,data),
              typingText: null,
              }
          });
        }, 1000);
      }
  } 

  // renderCustomActions(props) {
  //   if (Platform.OS === 'ios') {
  //     return (
  //       <CustomActions
  //         {...props}
  //       />
  //     );
  //   }
  //   const options = {
  //     'Action 1': (props) => {
  //       alert('option 1');
  //     },
  //     'Action 2': (props) => {
  //       alert('option 2');
  //     },
  //     'Cancel': () => {},
  //   };
  //   return (
  //     <Actions
  //       {...props}
  //       options={options}
  //     />
  //   );
  // }

  renderBubble(props) {  // show bubble user name
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderSystemMessage(props) {  // no need, just for show
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  }

  // renderCustomView(props) {  // for map
  //   return (
  //     <CustomView
  //       {...props}
  //     />
  //   );
  // }

  renderFooter(props) {  //for showing "Someone is typeing..."
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        loadEarlier={this.state.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier}

        user={{
          _id: 1, // sent messages should have same user._id
        }}

        // renderActions={this.renderCustomActions}
        renderBubble={this.renderBubble}
        renderSystemMessage={this.renderSystemMessage}
        // renderCustomView={this.renderCustomView}
        renderFooter={this.renderFooter}
      />
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});
