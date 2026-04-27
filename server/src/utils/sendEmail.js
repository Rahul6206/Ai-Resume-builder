const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

function getTemplate(mode, to, code) {
  const isReset = mode === "reset";
  return {
    subject: isReset ? "Your password reset code" : "Verify your email address",
    title: isReset ? "Reset Your Password" : "Verify Your Email",
    intro: isReset
      ? "Use the code below to reset your password."
      : "Thank you for signing up! Use this code to verify your email.",
    code,
    to,
  };
}

async function sendVerificationEmail(to, code, mode = "verify") {
  try {
    const template = getTemplate(mode, to, code);

    const emailData = {
      sender: { name: "CVPilot", email: process.env.MAIL_SENDER || "noreply@cvpilot.ai" },
      to: [{ email: to }],
      subject: template.subject,
      htmlContent: `
      <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 30px;">
        <div style="max-width: 480px; margin: auto; background: #ffffff; padding: 25px 30px; border-radius: 10px;">
          <h2 style="color: #111827; text-align: center;">${template.title}</h2>
          <p style="font-size: 15px; color: #374151;">Hi <strong>${template.to}</strong>,</p>
          <p style="font-size: 15px; color: #374151;">${template.intro}</p>
          <div style="text-align: center; margin: 25px 0;">
            <div style="display: inline-block; background: #eef2ff; color: #4f46e5; padding: 14px 24px; font-size: 28px; font-weight: bold; letter-spacing: 3px; border-radius: 8px;">
              ${template.code}
            </div>
          </div>
          <p style="font-size: 14px; color: #6b7280; text-align: center;">This code will expire in <strong>10 minutes</strong>.</p>
        </div>
      </div>
      `,
    };

    await apiInstance.sendTransacEmail(emailData);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

module.exports = sendVerificationEmail;
