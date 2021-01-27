import jwt from 'jsonwebtoken';

export const generateToken = (name, email) => {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + (60 * 3600), // expires in 1 day
    name,
    email,
  };

  return jwt.sign(payload, 'shhhhh');
};
