const { BrevoClient, BrevoError } = require('@getbrevo/brevo');
require("dotenv").config();

const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
}); 

async function sendVerificationEmail(to, code, mode = "verify") {
  try {
    const response = await client.transactionalEmails.sendTransacEmail({
      sender: {
        name: "CVPilot",
        email: process.env.MAIL_SENDER, // must be a verified sender in Brevo
      },
      to: [{ email: to }],
      subject: mode === "reset"
        ? "Your password reset code"
        : "Verify your email address",
      htmlContent: `<h2>Your OTP: ${code}</h2>`,
    });

    console.log("Email sent:", response.messageId);
    return true;

  } catch (err) {
    if (err instanceof BrevoError) {
      console.error(`API error ${err.statusCode}:`, err.message);
    } else {
      console.error("Unexpected error:", err);
    }
    return false;
  }
}

module.exports = sendVerificationEmail;
