const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const processFile = (base64String) => {
    try {
        const buffer = Buffer.from(base64String, 'base64');
        const mimeType = require('file-type').fromBuffer(buffer)?.mime || null;
        const sizeInKB = (buffer.length / 1024).toFixed(2);
        const isValid = mimeType ? true : false;

        return {
            file_valid: isValid,
            file_mime_type: mimeType,
            file_size_kb: sizeInKB,
        };
    } catch {
        return { file_valid: false, file_mime_type: null, file_size_kb: null };
    }
};

module.exports = { isPrime, processFile };
