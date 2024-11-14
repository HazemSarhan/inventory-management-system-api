import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';
import { attachCookiesToResponse, createTokenUser } from '../utils';
import cloudinary from '../configs/cloudinary.config';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail } from '../utils/mailer';
import { UserData } from '../interfaces/auth';

export const register = async (
  req: Request<{}, {}, UserData>,
  res: Response,
) => {
  const { name, email, password, bio } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all required fields');
  }
  // Check if the email is already registered
  const isEmailExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (isEmailExist) {
    throw new BadRequestError('Email is already registered!');
  }

  // Set the first registered user as an admin
  const isFirstAccount = await prisma.user.count();
  const role = isFirstAccount === 0 ? 'ADMIN' : 'USER';

  // Hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Uploading image to Cloudinary
  let profile_picture = '/upload/default_profile.jpg';
  if (req.files && req.files.profile_picture) {
    const profilePicture = req.files.profile_picture as UploadedFile & {
      tempFilePath: string;
    };
    const result = await cloudinary.uploader.upload(
      profilePicture.tempFilePath,
      {
        use_filename: true,
        folder: 'lms-images',
      },
    );
    fs.unlinkSync(profilePicture.tempFilePath);
    profile_picture = result.secure_url;
  }

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      bio: bio ?? null,
      role: role,
      profile_picture: profile_picture,
    },
  });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });

  res.status(StatusCodes.CREATED).json({
    message: 'account has been created successfully!.',
    user: tokenUser,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide valid email & password');
  }

  // Check if the email is available
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credintials');
  }

  // Comparing Passwords
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credintials');
  }

  // Generate Token
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1 * 1000),
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: `User has been logged out successfully!` });
};
