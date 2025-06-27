import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DashboardIcon from '@mui/icons-material/Dashboard';

function AgentInterface() {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Service Management System
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ mb: 4 }}>
          Choose an agent to interact with
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SupportAgentIcon />}
            component={Link}
            to="/support"
            sx={{ px: 4, py: 2 }}
          >
            Support Agent
          </Button>
          
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<DashboardIcon />}
            component={Link}
            to="/dashboard"
            sx={{ px: 4, py: 2 }}
          >
            Dashboard Agent
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AgentInterface;