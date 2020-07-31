/**
 * @function formatResponse - Helper
 * Helper function that returns a response object with HTTP status code and stringified body.
 * @param {number} statusCode - HTTP status code to send back with response
 * @param {object} body - Data to send back with response
 * @returns {object} response - Response object ready to send back to client
 */
const formatResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
});

/**
 * @function handleError - Helper
 * Returns formatted error response object if error is anticipated, undefined otherwise.
 * @param {number} errorCode - Error code of the error
 * @returns {object | undefined} - Either the formatted error response or undefined.
 */
const handleError = (errorCode) => {
  switch (errorCode) {
    // Handle manually thrown error
    case "MISSING_REQ_BODY":
      return formatResponse(400, {
        status: "failed",
        message: "A Number and a message are required.",
      });

    // Handle Twilio specific errors
    case 21211:
    case 21212:
    case 21217:
    case 21219:
      return formatResponse(400, {
        status: "failed",
        message: "The number provided is invalid or unverified.",
      });
    case 21214:
    case 21215:
    case 21216:
    case 20220:
      return formatResponse(400, {
        status: "failed",
        message: "The number provided is unreachable.",
      });
    default:
      break;
  }
};

module.exports = {
  formatResponse,
  handleError,
};
