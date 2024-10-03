const express = require('express');
const connectDB = require('./config/db');
const morgan = require('morgan');
const adminRoutes = require('./routes/adminRoute');
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
apiRoutes.use('/admin', adminRoutes);
apiRoutes.use(userRoutes);
apiRoutes.use(postRoutes);
app.use('/api', apiRoutes);


const PORT = process.env.PORT;
// const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
