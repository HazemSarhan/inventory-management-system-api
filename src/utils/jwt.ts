import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response } from 'express';

export const createJWT = ({ payload }: { payload: Payload }): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export const isTokenValid = ({ token }: { token: string }): JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
};

interface Payload {
  name?: string;
  userId?: string;
  email?: string;
  role?: string;
  bio?: string | null;
  image?: string | null;
}

export const attachCookiesToResponse = ({
  res,
  user,
}: {
  res: Response;
  user: Payload;
}) => {
  const token = createJWT({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};
