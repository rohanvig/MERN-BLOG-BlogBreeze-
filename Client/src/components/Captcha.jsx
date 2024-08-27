import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

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
      const response = await axios.post('/api/submit', { captchaValue });
      // Handle successful response
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields here */}
      <ReCAPTCHA
        sitekey="YOUR_SITE_KEY"
        onChange={handleCaptchaChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Captcha;
