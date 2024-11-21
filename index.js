// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { isPrime } = require('./utils/prime-check');
const { processFile } = require('./utils/file-utils');
const cors = require('cors');
require('dotenv').config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 3000; // Use PORT from .env, fallback to 3000

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

// Default route
app.get('/', (req, res) => {
    res.redirect('/bfhl');
});

// GET /bfhl
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// POST /bfhl
app.post('/bfhl', (req, res) => {
    try {
        const { data, file_b64 } = req.body;

        // Validate input: `data` must be an array
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                message: 'Invalid input: "data" must be an array.',
            });
        }

        // Extract numbers and alphabets
        const numbers = data.filter((el) => !isNaN(el) && el !== '' && el !== null);
        const alphabets = data.filter((el) => /^[a-zA-Z]$/.test(el));

        // Get the highest lowercase alphabet
        const highestLowercase = alphabets
            .filter((char) => char === char.toLowerCase())
            .sort()
            .slice(-1);

        // Check if any prime number exists in the `numbers` array
        const isPrimeFound = numbers.some((num) => isPrime(Number(num)));

        // Process file data (if provided)
        const fileData = file_b64
            ? processFile(file_b64)
            : { file_valid: false, file_mime_type: null, file_size_kb: null };

        // Prepare the response payload using environment variables
        const response = {
            is_success: true,
            user_id: process.env.USER_ID,
            email: process.env.EMAIL,
            roll_number: process.env.ROLL_NUMBER,
            numbers,
            alphabets,
            highest_lowercase_alphabet: highestLowercase,
            is_prime_found: isPrimeFound,
            ...fileData,
        };

        // Send response
        res.status(200).json(response);
    } catch (error) {
        // Catch and respond to unexpected errors
        res.status(500).json({
            is_success: false,
            message: `Internal server error: ${error.message}`,
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
