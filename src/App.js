import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import ChatWindow from './components/ChatWindow';
import axios from 'axios';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Typing indicator state

  const handleSendMessage = async (message) => {
    const userMessage = { text: message, isUserMessage: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]); // Add user message to UI
  
    try {
      setIsTyping(true); // Show typing indicator
      const response = await axios.post('http://localhost:8000/api/chatbot/assess', { input_text: message });
      const responseData = response.data;
      const systemResponse = { text: responseData.response, isUserMessage: false }; // Chatbot response
      setMessages((prevMessages) => [...prevMessages, systemResponse]); // Add response to UI
      setIsTyping(false); // Remove typing indicator
  
      if (responseData.jailbreak_detected) {
        setInputDisabled(true); // Disable input
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false); // Remove typing indicator even on error
    }
  };
  

  return (
    <div className="wrapper">
      {/* Background circles */}
      <div className="circle xxlarge shade1"></div>
      <div className="circle xlarge shade2"></div>
      <div className="circle large shade3"></div>
      <div className="circle medium shade4"></div>
      <div className="circle small shade5"></div>

      {/* Main content */}
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} md={8} className="chat-container">
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              inputDisabled={inputDisabled}
              isTyping={isTyping} // Pass typing indicator
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default App;
