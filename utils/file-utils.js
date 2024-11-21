const mime = require('mime-types');

/**
 * Processes a Base64-encoded file.
 * @param {string} base64String - The Base64-encoded string.
 * @returns {object} - File metadata including validity, MIME type, and size in KB.
 */
const processFile = (base64String) => {
    try {
        // Decode the Base64 string into a buffer
        const buffer = Buffer.from(base64String, 'base64');

        // Determine the MIME type
        const mimeType = mime.lookup(buffer) || null;

        // Calculate file size in KB
        const sizeInKB = (buffer.length / 1024).toFixed(2);

        // Check if the file is valid (MIME type exists)
        const isValid = mimeType ? true : false;

        return {
            file_valid: isValid,
            file_mime_type: mimeType,
            file_size_kb: sizeInKB,
        };
    } catch (error) {
        // Return invalid file metadata in case of an error
        return { file_valid: false, file_mime_type: null, file_size_kb: null };
    }
};

module.exports = { processFile };
