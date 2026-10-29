// server.js
const express = require('express');
const mockAuthenticate = require('./middleware/auth');
const authorizeRoles = require('./middleware/rbac');

const app = express();
app.use(express.json());

// --- PUBLIC ROUTE ---
// Accessible by anyone (no authentication or authorization needed)
app.get('/api/public', (req, res) => {
  res.json({ message: "Welcome! This information is public." });
});

// --- USER ROUTE ---
// Accessible by user, moderator, and admin (Role Hierarchy/Inheritance)
app.get(
  '/api/profile', 
  mockAuthenticate('user'), // Simulating a logged-in standard 'user'
  authorizeRoles(['user', 'moderator', 'admin']), 
  (req, res) => {
    res.json({ message: `Access granted to profile for ${req.user.username}` });
  }
);

// --- MODERATOR ROUTE ---
// Accessible by moderator and admin
app.get(
  '/api/content/review', 
  mockAuthenticate('moderator'), // Simulating a logged-in 'moderator'
  authorizeRoles(['moderator', 'admin']), 
  (req, res) => {
    res.json({ message: "Access granted. Loading reported comments for moderation..." });
  }
);

// --- ADMIN ROUTE ---
// Strictly accessible only by admin
app.get(
  '/api/admin/settings', 
  mockAuthenticate('admin'), // Simulating a logged-in 'admin'
  authorizeRoles(['admin']), 
  (req, res) => {
    res.json({ message: "Access granted. Welcome to the Admin Control Panel." });
  }
);

// --- TEST FAIL ROUTE ---
// Demonstration: A standard 'user' trying to access an admin route
app.get(
  '/api/admin/hack-test',
  mockAuthenticate('admin'), // Logged in as 'user'
  authorizeRoles(['admin']), // Requires 'admin'
  (req, res) => {
    res.json({ message: "You should not be seeing this!" });
  } 
);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`RBAC Server running on http://localhost:${PORT}`);
});
