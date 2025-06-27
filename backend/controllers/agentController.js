import supportAgent from '../services/agents/supportAgent.js';
import dashboardAgent from '../services/agents/dashboardAgent.js';

export const handleSupportQuery = async (req, res) => {
  try {
    const { query } = req.body;
    const response = await supportAgent(query);
    res.json({ response });
  } catch (error) {
    console.error('Error in handleSupportQuery:', error);
    res.status(500).json({ error: 'Failed to process support query' });
  }
};

export const handleDashboardQuery = async (req, res) => {
  try {
    const { query } = req.body;
    const response = await dashboardAgent(query);
    res.json({ response });
  } catch (error) {
    console.error('Error in handleDashboardQuery:', error);
    res.status(500).json({ error: 'Failed to process dashboard query' });
  }
};