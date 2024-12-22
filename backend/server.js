require('dotenv').config();

const express = require('express');
const cors = require('cors');
const stripeRoutes = require('./routes/stripe');

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());

app.use('/api/stripe', stripeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));