import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import scraperRoutes from './routes/scraper.routes.js';
import { connectDatabase } from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDatabase();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files for dashboard
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', scraperRoutes);

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Profile Scraper API',
    endpoints: {
      dashboard: '/dashboard',
      health: '/health',
      scrapeProfile: 'POST /api/scrape-profile',
      getAllProfiles: 'GET /api/profiles',
      getProfile: 'GET /api/profiles/:id',
      deleteProfile: 'DELETE /api/profiles/:id'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Catch-all for undefined routes (helps with debugging)
app.use('*', (req, res) => {
  console.log('⚠️ Unmatched route:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    availableRoutes: {
      dashboard: '/dashboard',
      health: '/health',
      api: '/api/profiles'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    error: err.message || 'Internal server error',
    platform: null,
    data: null
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Server running on http://localhost:' + PORT);
  console.log('📊 Dashboard: http://localhost:' + PORT + '/dashboard');
  console.log('🔍 API Profiles: http://localhost:' + PORT + '/api/profiles');
  console.log('❤️  Health Check: http://localhost:' + PORT + '/health');
  console.log('='.repeat(50));
});

export default app;
