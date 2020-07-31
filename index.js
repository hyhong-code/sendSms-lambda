const {
  ACCOUNT_SID: accountSid,
  AUTH_TOKEN: authToken,
  TWILIO_NUMBER: twilioNumber,
} = process.env;

const client = require("twilio")(accountSid, authToken);

const { formatResponse, handleError } = require("./utils2");

// @desc    Upon request, sends a SMS to given number with given message.
// @route   POST
// @access  Public
exports.handler = async (event) => {
  try {
    // Handle missing request body
    if (!event.body) {
      throw { code: "MISSING_REQ_BODY" };
    }

    // Handle missing required body params
    const { message, number } = JSON.parse(event.body);
    if (!(message && number)) {
      throw { code: "MISSING_REQ_BODY" };
    }

    // Send the SMS with Twilio
    const sentMsg = await client.messages.create({
      body: message,
      to: number,
      from: twilioNumber,
    });

    // Success response
    return formatResponse(200, {
      status: "success",
      message: `SMS successfully sent to ${number}`,
      messageSid: sentMsg.sid,
    });
  } catch (err) {
    // Handle anticipated errors
    const errResponse = handleError(err.code);
    if (errResponse) {
      return errResponse;
    }

    // Handle all other errors
    return formatResponse(500, {
      status: "error",
      message: "Something went wrong, please try again later.",
    });
  }
};
