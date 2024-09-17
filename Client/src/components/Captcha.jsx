import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

// Using the environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const Captcha = () => {
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      alert('Please complete the CAPTCHA');
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/submit`, { captchaValue });
      // Handle successful response
      console.log('Captcha verified:', response.data);
    } catch (error) {
      console.error('Captcha verification failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields here */}
      <ReCAPTCHA
        sitekey={recaptchaSiteKey} // Using the separated env variable for the site key
        onChange={handleCaptchaChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Captcha;
