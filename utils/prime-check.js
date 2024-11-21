/**
 * Check if a given number is a prime number.
 * @param {number} num - The number to check.
 * @returns {boolean} - True if the number is prime, false otherwise.
 */
const isPrime = (num) => {
    if (num <= 1) return false; // Numbers less than or equal to 1 are not prime.
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false; // Divisible by any number other than 1 and itself.
    }
    return true;
};

module.exports = { isPrime };
