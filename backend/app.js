import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import seedData from './services/seedData.js';
import agentRoutes from './routes/agentRoutes.js';
import apiRoutes from './routes/apiRoutes.js';

const app = express();


app.use(cors());
app.use(bodyParser.json());


connectDB();

// Seed data (comment out in production after first run)
//seedData();


app.use('/api/agents', agentRoutes);
app.use('/api', apiRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});