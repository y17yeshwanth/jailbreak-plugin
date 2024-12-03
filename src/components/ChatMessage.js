

import React from 'react';
import { Typography, Avatar } from '@mui/material';

const ChatMessage = ({ message }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: message.isUserMessage ? 'flex-end' : 'flex-start',
        marginBottom: 10,
      }}
    >
      {/* Display Avatar for Bot Messages */}
      {!message.isUserMessage && (
        <Avatar
          style={{
            backgroundColor: '#00695c',
            marginRight: 10,
            width: 30,
            height: 30,
          }}
        >
          B
        </Avatar>
      )}

      <div
        style={{
          backgroundColor: message.isUserMessage ? '#e0f7fa' : '#f1f8e9',
          padding: 10,
          borderRadius: 10,
          maxWidth: '70%',
          position: 'relative',
        }}
      >
        <Typography variant="body2">{message.text}</Typography>
      </div>

      {/* Display Avatar for User Messages */}
      {message.isUserMessage && (
        <Avatar
          style={{
            backgroundColor: '#00695c',
            marginLeft: 10,
            width: 30,
            height: 30,
          }}
        >
          U
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
