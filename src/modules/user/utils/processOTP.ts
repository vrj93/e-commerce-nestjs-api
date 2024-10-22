import { SNS } from 'aws-sdk';

export const generateOTP = () => {
  const randomNum: number = Math.floor(Math.random() * 1000000);
  // Ensure the number always has 6 digits
  return Number(randomNum.toString().padStart(6, '0'));
};

export const sendPhoneOTP = async (phone: number, otp: number) => {
  const sns = new SNS({
    region: process.env.AWS_REGION,
  });

  const params = {
    Message: `OTP: ${otp} for Mobile number verification`,
    PhoneNumber: `+91${phone}`,
  };

  try {
    return await sns.publish(params).promise();
  } catch (err) {
    console.error(err);
  }
};
