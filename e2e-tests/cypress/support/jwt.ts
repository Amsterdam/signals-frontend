// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
/* eslint-disable @typescript-eslint/no-extra-parens */
import jwt from 'jsonwebtoken';

export const generateToken = (name: string, email: string) => {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + (60 * 3600), // expires in 1 day
    name,
    email,
  };

  return jwt.sign(payload, 'shhhhh') as string;
};
