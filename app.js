const express = require('express');
const connectDB = require('./config/db');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const postRoutes = require('./routes/postRoute');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); 

const apiRoutes = express.Router();
apiRoutes.use('/auth', authRoutes);
apiRoutes.use(userRoutes);
apiRoutes.use(postRoutes);
app.use('/api', apiRoutes);


// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
