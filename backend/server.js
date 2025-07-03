// 1. Setup
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MINTSOFT_API_KEY = process.env.MINTSOFT_API_KEY;

app.use(cors({ origin: 'http://localhost:3000' }));

// 2. Route
app.get('/api/order', async (req, res) => {
  const { ordernumber } = req.query;
  if (!ordernumber) {
    return res.status(400).json({ error: 'Order number is required' });
  }

  try {
    const url = `https://api.mintsoft.co.uk/api/order/search?ordernumber=${encodeURIComponent(ordernumber)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'ms-apikey': MINTSOFT_API_KEY
      }
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response from Mintsoft:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching from Mintsoft:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 3. Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
