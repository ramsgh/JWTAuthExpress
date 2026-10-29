const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const ACCESS_SECRET = 'access_secret_key';
const REFRESH_SECRET = 'refresh_secret_key';

// Mock database to store active refresh tokens
let refreshTokensDb = []; 

// Login Route: Returns BOTH tokens
app.post('/login', (req, res) => {
    const user = { userId: 55 };

    const accessToken = jwt.sign(user, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(user, REFRESH_SECRET, { expiresIn: '7d' });

    refreshTokensDb.push(refreshToken); // Save refresh token to "database"

    res.json({ accessToken, refreshToken });
});

// Refresh Route: Swaps a valid Refresh Token for a brand new Access Token
app.post('/token', (req, res) => {
    const { token } = req.body; // Expecting the refresh token

    if (!token) return res.sendStatus(401);
    if (!refreshTokensDb.includes(token)) return res.sendStatus(403); // Token not in DB

    jwt.verify(token, REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        // Generate a fresh new access token
        const newAccessToken = jwt.sign({ userId: user.userId }, ACCESS_SECRET, { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    });
});

// Logout Route: Invalidates the refresh token
app.delete('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokensDb = refreshTokensDb.filter(t => t !== token); // Remove from DB
    res.json({ message: "Logged out successfully." });
});

app.listen(3000, () => console.log('Auth Server running on port 3000'));
