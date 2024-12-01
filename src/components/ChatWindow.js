import React, { useState, useEffect, useRef } from 'react';
import { Typography, TextField, Button, Paper, Chip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Fade from '@mui/material/Fade';
import Badge from '@mui/material/Badge';
import ChatMessage from './ChatMessage'; // Ensure you import ChatMessage

const ChatWindow = ({ messages, onSendMessage, inputDisabled }) => {
  const [messageInput, setMessageInput] = useState('');
  const [clickedChips, setClickedChips] = useState([]);
  const chatContainerRef = useRef(null);

  const handleChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  // Function to handle click on intent chips
  const handleIntentClick = (intent) => {
    onSendMessage(intent); // Send the intent as a message
    setClickedChips([...clickedChips, intent]); // Add the clicked chip to the state
  };

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Paper
      style={{
        elevation: 6,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        padding: 20,
        borderRadius: 20,
        width: '30%',
        height: '70%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="h5" gutterBottom>
        E-Commerce Support Bot
      </Typography>
      <div
        ref={chatContainerRef}
        style={{
          marginBottom: 20,
          overflowY: 'auto',
          flexGrow: 1,
          marginRight: -20,
          paddingRight: 20,
        }}
      >
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
      <div style={{ marginBottom: 10 }}>
        {/* Render intent chips that haven't been clicked */}
        {['Greeting', 'Query'].map(
          (intent) =>
            !clickedChips.includes(intent) && (
              <Chip
                key={intent}
                label={intent}
                onClick={() => handleIntentClick(intent)}
                style={{ marginRight: 5, cursor: 'pointer' }}
              />
            )
        )}
        {/* Add more intent chips as needed */}
      </div>

      {/* Optional message when input is disabled */}
      {inputDisabled && (
        <Typography variant="body2" color="error" style={{ marginBottom: 10 }}>
          Input has been disabled due to a detected jailbreak attempt.
        </Typography>
      )}

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Type a message"
          variant="outlined"
          value={messageInput}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          style={{ marginRight: 10, flex: 1 }}
          disabled={inputDisabled} // Disable input if necessary
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          disabled={inputDisabled} // Disable button if necessary
        >
          Send
        </Button>
      </div>
    </Paper>
  );
};

export default ChatWindow;
