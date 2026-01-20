import axios from "axios";

export const sendEmail = async ({ to, name, password }) => {
  const payload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    template_params: {
      email: to,
      name,
      password
    }
  };

  try {
    await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );
  } catch (error) {
    console.error(
      "Error enviando correo con EmailJS:",
      error.response?.data || error.message
    );
    throw error;
  }
};
