const express = require('express');
const path = require('path');
const app = express();
const videoRoutes = require('./routes/videoRoutes');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Middleware to parse JSON
app.use(express.json());

// API routes
app.use('/api/videos', videoRoutes);

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
