import process from 'node:process';

/**
 * Removes invalid filesystem characters from a given string.
 * @param {string} str - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
const sanitize = (str) => str.replace(/[/\\?%*:|'<>]/g, '');

/**
 * Retrieves an environment variable from a GitHub Actions workflow or returns a default value.
 * @param {string} name - The input name (used to construct the environment variable key).
 * @param {string} [defaultVal] - The default value if the environment variable is not found.
 * @returns {string} - The trimmed input value from the environment variable or default value.
 * @throws {Error} - Throws an error if the input is required but not provided.
 */
const getInput = (name, defaultVal) => {
  const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';

  if (!val && !defaultVal) {
    throw new Error(`Input required and not supplied: ${name}`);
  }

  return (val || defaultVal).trim();
};

export {sanitize, getInput};
