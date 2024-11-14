import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import cloudinary from '../configs/cloudinary.config';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';
import {
  attachCookiesToResponse,
  checkPermission,
  createTokenUser,
} from '../utils';
import { UserRole } from '../utils/checkPermissions';
import bcrypt from 'bcryptjs';
import { UpdateData } from '../interfaces/user';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      profile_picture: true,
      created_at: true,
      updated_at: true,
    },
  });
  res.status(StatusCodes.OK).json({ users });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id: userId } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      profile_picture: true,
      created_at: true,
      updated_at: true,
    },
  });
  if (!user) {
    throw new NotFoundError(`No users with id ${userId} found!`);
  }
  res.status(StatusCodes.OK).json({ user });
};

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

export const updateUserData = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id: userId } = req.params;
  const { name, email, bio } = req.body;

  // Check Permission
  const requestUser = req.user;
  if (!requestUser) {
    throw new UnauthorizedError('User not authenticated');
  }
  checkPermission(requestUser, userId);

  // Check if the user exist
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError(`User not found with thid id ${userId}`);
  }

  // Update image and upload to cloud if only uploaded!
  let profile_picture: string | undefined;
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

  if (!name && !email && !bio && !profile_picture) {
    throw new BadRequestError('Please provide any changes to the data.');
  }

  const updateData: UpdateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (bio) updateData.bio = bio;
  if (profile_picture) updateData.profile_picture = profile_picture;

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      profile_picture: true,
      created_at: true,
      updated_at: true,
    },
  });

  const tokenUser = createTokenUser(updateUser);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ updateUser });
};

export const updateUserPassword = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id: userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  // Check Permission
  const requestUser = req.user;
  if (!requestUser) {
    throw new UnauthorizedError('User not authenticated');
  }
  checkPermission(requestUser, userId);

  // Check if the user exist
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new NotFoundError(`No users found with this id ${userId}`);
  }

  // Comparing Password
  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordCorrect) {
    throw new BadRequestError(`Old password is not correct!`);
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const updateUserPassword = await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: `Password has been changed succesfully!` });
};

const VALID_ROLES = ['ADMIN', 'USER'];

export const updateUserRole = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id: userId } = req.params;
  const { role } = req.body;
  if (!role || !VALID_ROLES.includes(role)) {
    throw new BadRequestError('Please provide a valid role (ADMIN or USER)');
  }

  const requestUser = req.user;
  if (!requestUser || requestUser.role !== 'ADMIN') {
    throw new UnauthorizedError('Not authorized to update roles');
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  res.status(StatusCodes.OK).json({
    msg: `Role for user ${user.email} has been changed to ${user.role}`,
    user,
  });
};
