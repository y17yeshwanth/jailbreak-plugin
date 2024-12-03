// export default ChatWindow;
import React, { useState, useRef, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  Card,
  CardContent,
  CardActions,
  Box,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ChatMessage from './ChatMessage'; // Import the updated ChatMessage component

const ChatWindow = ({ messages, onSendMessage, inputDisabled, isTyping }) => {
  const [messageInput, setMessageInput] = useState('');
  const [intents, setIntents] = useState([
    'FAQ',
    'Order Status',
    'Track My Order',
    'Cancel My Order',
    'Forgot Password',
    'Delivery Delay',
    'Start a Return',
    'Refund Status',
    'Return Policy',
    'Coupon Code',
    'Loyalty Points',
    'Leave Feedback',
    'Suggest Products',
  ]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const chatContainerRef = useRef(null);

  const [hardcodedOrders, setHardcodedOrders] = useState([
    {
      id: '12345',
      description: 'Nike Shoes - Size 10',
      status: 'In Transit',
      cancelled: false,
      progress: ['Order Placed', 'Processing', 'In Transit', 'Delivered'],
    },
    {
      id: '12346',
      description: 'Apple iPhone 14',
      status: 'Delivered',
      cancelled: false,
      progress: ['Order Placed', 'Processing', 'In Transit', 'Delivered'],
    },
    {
      id: '12347',
      description: 'Wireless Earbuds',
      status: 'Processing',
      cancelled: false,
      progress: ['Order Placed', 'Processing', 'In Transit', 'Delivered'],
    },
  ]);

  const [intentsClicked, setIntentsClicked] = useState(false); // Tracks if intents have been interacted with

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleIntentClick = (intent) => {
    if (intentsClicked) return; // Prevent further clicks on intents

    setIntentsClicked(true); // Set to true once an intent is clicked

    if (intent === 'Track My Order') {
      // Show orders excluding or marking canceled ones
      const newIntents = hardcodedOrders.map((order) => ({
        id: order.id,
        description: order.cancelled
          ? `${order.description} (Order Cancelled)`
          : order.description,
        cancelled: order.cancelled,
      }));
      setIntents(newIntents);
      setSelectedOrder(null);
    } else if (intent === 'Cancel My Order') {
      // Show orders available for cancellation
      const newIntents = hardcodedOrders.map((order) => ({
        id: order.id,
        description: order.description,
        cancelAction: true,
      }));
      setIntents(newIntents);
      setSelectedOrder(null);
    } else if (intent.id) {
      if (intent.cancelAction) {
        // Cancel the selected order
        setHardcodedOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === intent.id ? { ...order, cancelled: true } : order
          )
        );
        // Re-add "Track My Order" intent after canceling
        setIntents(['Track My Order', 'FAQ']);
        onSendMessage(`Order ${intent.id} has been cancelled.`);
      } else {
        // Show progress of a specific order
        const order = hardcodedOrders.find((o) => o.id === intent.id);
        setSelectedOrder(order);
        setIntents(['Track My Order']); // Show "Track My Order" option
      }
    } else {
      // For other intents, clear intents and reset
      setIntents(['Track My Order', 'FAQ']);
    }

    // Send the intent to the bot
    onSendMessage(intent.description || intent);
  };

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
        width: '35%',
        height: '80%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#f0f8ff',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#e0f7fa',
          color: '#00695c',
          padding: '10px 20px',
          borderRadius: '16px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center' }}>
          E-Commerce Support Bot
        </Typography>
      </div>

      <div
        ref={chatContainerRef}
        style={{
          marginBottom: 20,
          overflowY: 'auto',
          flexGrow: 1,
          paddingRight: 20,
        }}
      >
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        {isTyping && (
          <ChatMessage message={{ isUserMessage: false, text: 'Bot is typing...' }} />
        )}

        {selectedOrder && !selectedOrder.cancelled && (
          <div style={{ marginTop: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Progress for {selectedOrder.description}
            </Typography>
            <Stepper
              alternativeLabel
              activeStep={selectedOrder.progress.indexOf(selectedOrder.status)}
            >
              {selectedOrder.progress.map((step) => (
                <Step key={step}>
                  <StepLabel
                    StepIconComponent={({ active, completed }) => {
                      if (completed) return <CheckCircleIcon color="success" />;
                      if (active) return <LocalShippingIcon color="primary" />;
                      return <DoneAllIcon />;
                    }}
                  >
                    {step}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        )}

        {selectedOrder && selectedOrder.cancelled && (
          <Typography
            variant="h6"
            style={{ color: 'red', textAlign: 'center', marginTop: 20 }}
          >
            This order has been cancelled.
          </Typography>
        )}
      </div>

      {!intentsClicked && ( // Display intents only if they haven't been clicked
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 2,
            marginBottom: 2,
          }}
        >
          {intents.map((intent) =>
            typeof intent === 'string' ? (
              <Chip
                key={intent}
                label={intent}
                onClick={() => handleIntentClick(intent)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: '#e0f7fa',
                  color: '#00695c',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                }}
              />
            ) : (
              <Card
                key={intent.id}
                sx={{
                  width: '90%',
                  backgroundColor: '#ffffff',
                  padding: 1,
                  boxShadow: 3,
                  borderRadius: '12px',
                }}
              >
                <CardContent>
                  <Typography variant="h6">{intent.description}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order #{intent.id}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleIntentClick(intent)}
                    sx={{
                      color: intent.cancelAction ? 'red' : '#00695c',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                    }}
                  >
                    {intent.cancelAction ? 'Cancel Order' : 'View Progress'}
                  </Button>
                </CardActions>
              </Card>
            )
          )}
        </Box>
      )}

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
          onChange={(event) => setMessageInput(event.target.value)}
          onKeyPress={(event) => event.key === 'Enter' && onSendMessage(messageInput)}
          style={{ marginRight: 10, flex: 1 }}
          disabled={inputDisabled}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSendMessage(messageInput)}
          disabled={inputDisabled}
        >
          Send
        </Button>
      </div>
    </Paper>
  );
};

export default ChatWindow;
