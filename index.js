const express = require('express');
const bodyParser = require('body-parser');
const { isPrime } = require('./utils/prime-check');
const { processFile } = require('./utils/file-utils');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

/**
 * Default Route
 * Redirects to /bfhl for ease of use.
 */
app.get('/', (req, res) => {
    res.redirect('/bfhl');
});

/**
 * GET /bfhl
 * Returns a hardcoded operation code.
 */
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

/**
 * POST /bfhl
 * Processes input data and returns a detailed response.
 */
app.post('/bfhl', (req, res) => {
    try {
        const { data, file_b64 } = req.body;

        // Validate input
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                status: 'error',
                message: '"data" must be a non-empty array.',
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

        // Check if any prime number exists
        const isPrimeFound = numbers.some((num) => isPrime(Number(num)));

        // Process file data (if provided)
        const fileData = file_b64
            ? processFile(file_b64)
            : { file_valid: false, file_mime_type: null, file_size_kb: null };

        // Send success response
        res.status(200).json({
            status: 'success',
            data: {
                user_id: 'john_doe_17091999',
                email: 'john@xyz.com',
                roll_number: 'ABCD123',
                numbers,
                alphabets,
                highest_lowercase_alphabet: highestLowercase,
                is_prime_found: isPrimeFound,
                ...fileData,
            },
        });
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({
            status: 'error',
            message: `Internal server error: ${error.message}`,
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
