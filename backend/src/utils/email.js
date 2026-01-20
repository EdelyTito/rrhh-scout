import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const api = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async ({ to, subject, html }) => {
  return api.sendTransacEmail({
    sender: {
      email: process.env.EMAIL_FROM,
      name: "Sistema Scout RRAA"
    },
    to: [{ email: to }],
    subject,
    htmlContent: html
  });
};
