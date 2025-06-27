import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  TextField, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const samplePrompts = [
  "How much revenue did we generate this month?",
  "Which course has the highest enrollment?",
  "What is the attendance percentage for Pilates?",
  "How many inactive clients do we have?",
  "What are our top 3 services by revenue?"
];

function Dashboard() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [conversation, setConversation] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    try {
      const userMessage = { sender: 'user', text: query };
      setConversation(prev => [...prev, userMessage]);
      
      const res = await axios.post('https://supportdashagent-backend.onrender.com/api/agents/dashboard', { query });
      
      const botMessage = { sender: 'bot', text: res.data.response };
      setConversation(prev => [...prev, botMessage]);
      setResponse(res.data.response);
      setQuery('');
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error processing your request. Please try again.');
    }
  };

  const handlePromptClick = (prompt) => {
    setQuery(prompt);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Dashboard Agent</Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sample Prompts
        </Typography>
        <List dense>
          {samplePrompts.map((prompt, index) => (
            <React.Fragment key={index}>
              <ListItem button onClick={() => handlePromptClick(prompt)}>
                <ListItemText primary={prompt} />
              </ListItem>
              {index < samplePrompts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3, minHeight: '300px', maxHeight: '400px', overflow: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Conversation
        </Typography>
        {conversation.length === 0 ? (
          <Typography color="text.secondary">Ask the dashboard agent for business insights...</Typography>
        ) : (
          <Box>
            {conversation.map((msg, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 2,
                  p: 2,
                  backgroundColor: msg.sender === 'user' ? '#f5f5f5' : '#e8f5e9',
                  borderRadius: 1,
                  textAlign: msg.sender === 'user' ? 'right' : 'left'
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
      
      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Ask the dashboard agent..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Send
        </Button>
      </Paper>
    </Container>
  );
}

export default Dashboard;
