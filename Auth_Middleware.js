const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
const SECRET_KEY = 'my_super_secret_key';

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    // 1. Extract token from header (Format: "Bearer TOKEN_STRING")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    // 2. Verify token
    jwt.verify(token, SECRET_KEY, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or Expired Token!' });
        }

        // 3. Attach user payload to the req object
        req.user = decodedUser;
        next(); // Move to the next route handler
    });
};

// --- ROUTES ---

// Public Route: Login to get a token
app.post('/login', (req, res) => {
    // (In reality, you validate user credentials against a database here)
    const user = { userId: 99, username: 'Alex' };
    
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '15m' });
    res.json({ accessToken: token });
});

// Protected Route: Uses the middleware
app.get('/dashboard', authenticateToken, (req, res) => {
    // Access the attached user data from the middleware
    res.json({ 
        message: `Welcome to your dashboard, ${req.user.username}!`,
        secretData: "This data is highly classified."
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
