const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();

// Load API key
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function sendVerificationEmail(to, verifyCode) {
  try {
    const emailData = {
      sender: {
        name: "Nexfolio",
        email: "rahulrp8677@gmail.com", // can be Gmail (Brevo allows it)
      },
      to: [{ email: to }],
      subject: "Verify your email address",
      htmlContent: `
  <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 30px;">
    <div style="max-width: 480px; margin: auto; background: #ffffff; padding: 25px 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
      
      <h2 style="color: #111827; text-align: center;">Verify Your Email</h2>

      <p style="font-size: 15px; color: #374151;">
        Hi <strong>${to}</strong>,
      </p>

      <p style="font-size: 15px; color: #374151;">
        Thank you for signing up! Please use the verification code below to complete your registration:
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <div style="display: inline-block; background: #eef2ff; color: #4f46e5; padding: 14px 24px; font-size: 28px; font-weight: bold; letter-spacing: 3px; border-radius: 8px;">
          ${verifyCode}
        </div>
      </div>

      <p style="font-size: 14px; color: #6b7280; text-align: center;">
        This code will expire in <strong>10 minutes</strong>.
      </p>

      <hr style="margin: 30px 0; border-top: 1px solid #e5e7eb;" />

      <p style="font-size: 13px; color: #6b7280;">
        If you didn't request this, you can safely ignore this email.
      </p>

      <p style="font-size: 13px; color: #6b7280; margin-top: 25px;">
        — <strong>Nexfolio</strong>
      </p>
    </div>
  </div>
`

    };

    const response = await apiInstance.sendTransacEmail(emailData);

    console.log("Verification email sent:", response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

module.exports = sendVerificationEmail;
