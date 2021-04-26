// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
/* eslint-disable no-mixed-operators */
import jwt from 'jsonwebtoken';

export const generateToken = (name: string, email: string) => {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + 60 * 3600, // expires in 1 day
    name,
    email,
  };

  return jwt.sign(payload, 'shhhhh') as string;
};

export const generateTokenDate = (date: Date, name: string, email: string) => {
  const now = new Date(date).getTime();
  const payload = {
    exp: Math.floor(now / 1000) + 60 * 3600, // expires in 1 day
    name,
    email,
  };

  return jwt.sign(payload, 'shhhhh') as string;
};
