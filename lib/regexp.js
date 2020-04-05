/** Check if a value contain space(s) */
const spaces = new RegExp('\\s');

/** Check if a value contain 1 lowercase, 1 uppercase, and 1 number */
const strength = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])');

/** Check if a string start with http:// https:// */
const url = new RegExp('^(http://www.|https://www.|http://|https://)');

module.exports = { spaces, strength, url };
