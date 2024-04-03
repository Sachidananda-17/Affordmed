const express = require('express');
const axios = require('axios');

const app = express();

// Configuration
const WINDOW_SIZE = 10;
const TEST_SERVER_BASE_URL = 'http://20.244.56.144/test/';

// Store for keeping track of numbers
let storedNumbers = [];

// Function to fetch prime numbers from the test server
async function fetchPrimes() {
    try {
        const response = await axios.get(TEST_SERVER_BASE_URL + 'primes');
        return response.data.numbers;
    } catch (error) {
        console.error('Error fetching prime numbers:', error);
        return [];
    }
}

// Function to fetch Fibonacci numbers from the test server
async function fetchFibonacci() {
    try {
        const response = await axios.get(TEST_SERVER_BASE_URL + 'fibo');
        return response.data.numbers;
    } catch (error) {
        console.error('Error fetching Fibonacci numbers:', error);
        return [];
    }
}

// Function to fetch even numbers from the test server
async function fetchEven() {
    try {
        const response = await axios.get(TEST_SERVER_BASE_URL + 'even');
        return response.data.numbers;
    } catch (error) {
        console.error('Error fetching even numbers:', error);
        return [];
    }
}

// Function to fetch random numbers from the test server
async function fetchRandom() {
    try {
        const response = await axios.get(TEST_SERVER_BASE_URL + 'rand');
        return response.data.numbers;
    } catch (error) {
        console.error('Error fetching random numbers:', error);
        return [];
    }
}

// Function to calculate the average of numbers
function calculateAverage(numbers) {
    if (numbers.length === 0) {
        return 0;
    }
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

// Function to handle requests to /numbers/:numberid
app.get('/numbers/:numberid', async (req, res) => {
    const numberId = req.params.numberid.toLowerCase();

    // Fetch numbers based on the numberId
    let fetchedNumbers;
    switch (numberId) {
        case 'p':
            fetchedNumbers = await fetchPrimes();
            break;
        case 'f':
            fetchedNumbers = await fetchFibonacci();
            break;
        case 'e':
            fetchedNumbers = await fetchEven();
            break;
        case 'r':
            fetchedNumbers = await fetchRandom();
            break;
        default:
            return res.status(400).json({ error: 'Invalid number ID' });
    }

    // Filter out duplicate numbers and limit to the WINDOW_SIZE
    storedNumbers = [...new Set([...storedNumbers, ...fetchedNumbers])].slice(-WINDOW_SIZE);

    // Calculate average of stored numbers
    const avg = calculateAverage(storedNumbers);

    // Prepare response
    const response = {
        windowPrevState: storedNumbers.slice(0, -fetchedNumbers.length),
        windowCurrState: storedNumbers,
        numbers: fetchedNumbers,
        avg: avg.toFixed(2)
    };

    // Send response
    res.json(response);
});

// Start server
const PORT = process.env.PORT || 9876;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
