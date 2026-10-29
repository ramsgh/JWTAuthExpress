const jwt = require('jsonwebtoken');

const SECRET_KEY = 'my_super_secret_key'; // Keep this safe in environment variables!
const userPayload = { userId: 123, role: 'admin' };

// 1. jwt.sign() with Token Expiration (expires in 1 hour)
const token = jwt.sign(userPayload, SECRET_KEY, { expiresIn: '1h' });
console.log("--- Generated JWT Token ---");
console.log(token); 
// Output will look like: xxxxx.yyyyy.zzzzz (header.payload.signature)

// 2. jwt.verify() - Successful Verification
try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("\n--- Verified Payload ---");
    console.log(decoded); // Outputs: { userId: 123, role: 'admin', iat: 17123456, exp: 17123492 }
} catch (error) {
    console.log("Verification failed:", error.message);
}

// 3. Simulating an Expired Token or Invalid Token
try {
    const badSecret = 'wrong_secret';
    jwt.verify(token, badSecret);
} catch (error) {
    console.log("\n--- Verification Failure Demo ---");
    console.log("Error:", error.message); // Outputs: JsonWebTokenError: invalid signature
}
