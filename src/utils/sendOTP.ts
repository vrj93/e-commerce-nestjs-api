import * as twilio from 'twilio';

const sendOTP = async () => {
  const accountSid: string = process.env.TWILIO_ACCOUNT_SID;
  const authToken: string = process.env.TWILIO_AUTH_TOKEN;

  const client: twilio.Twilio = twilio(accountSid, authToken);

  // Random Six digit code for OTP
  const randomNum: number = Math.floor(Math.random() * 1000000);

  // Ensure the number always has 6 digits
  const code: string = randomNum.toString().padStart(6, '0');

  const message = await client.messages.create({
    body: `OTP for verifying the phone is ${code}`,
    from: process.env.TWILIO_PHONE_FROM,
    to: process.env.TWILIO_PHONE_TO,
  });

  return {
    message,
    code,
  };
};

export default sendOTP;
