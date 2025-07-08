// src/components/MessageItem.tsx
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface MessageProps {
  message: string;
  isSender: boolean;
}

const MessageItem: React.FC<MessageProps> = ({ message, isSender }) => {
  return (
    <View style={[styles.messageContainer, isSender ? styles.sent : styles.received]}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '70%',
  },
  sent: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  received: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
});

export default MessageItem;
