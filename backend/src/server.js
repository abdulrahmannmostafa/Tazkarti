const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));
app.use(express.json());

// Socket.io connection
io.on('connection', (socket) => {
  socket.on('joinMatch', (matchId) => {
    socket.join(`match_${matchId}`);
  });
  
  socket.on('disconnect', () => {
  });
});

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/stadiums', require('./routes/stadiums'));
app.use('/api/reservations', require('./routes/reservations'));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));