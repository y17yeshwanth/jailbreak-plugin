import React from 'react';
import { Typography } from '@mui/material';

const ChatMessage = ({ message }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: message.isUserMessage ? 'flex-end' : 'flex-start',
        marginBottom: 10,
      }}
    >
      <div
        style={{
          backgroundColor: message.isUserMessage ? '#e0f7fa' : '#f1f8e9',
          padding: 10,
          borderRadius: 10,
          maxWidth: '70%',
        }}
      >
        <Typography variant="body2">{message.text}</Typography>

        {/* Show status for user messages */}
        {message.isUserMessage && (
          <Typography
          variant="caption"
          style={{
          textAlign: 'right',
          display: 'none', // Hide the status
        }}
  >
    {message.status}
  </Typography>
)}
      </div>
    </div>
  );
};

export default ChatMessage;
