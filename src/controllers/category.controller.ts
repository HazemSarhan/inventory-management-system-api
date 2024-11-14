import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';

export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!name) {
    throw new BadRequestError('Please provide a valid category name!');
  }
  const category = await prisma.category.create({
    data: {
      name,
      description,
    },
  });
  res.status(StatusCodes.CREATED).json({ category });
};

export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.status(StatusCodes.OK).json({ categories });
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id: categoryId } = req.params;
  const category = await prisma.category.findUnique({
    where: {
      id: parseInt(categoryId, 10),
    },
  });
  if (!category) {
    throw new NotFoundError(`No categories found with id ${categoryId}`);
  }
  res.status(StatusCodes.OK).json({ category });
};

export const updateCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const { id: categoryId } = req.params;
  const category = await prisma.category.update({
    where: {
      id: parseInt(categoryId, 10),
    },
    data: {
      name: name,
      description: description,
    },
  });
  if (!category) {
    throw new NotFoundError(`No categories found with id ${categoryId}`);
  }
  res.status(StatusCodes.OK).json({ category });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id: categoryId } = req.params;
  const category = await prisma.category.findUnique({
    where: {
      id: parseInt(categoryId, 10),
    },
  });
  if (!category) {
    throw new NotFoundError(`No categories found with id ${categoryId}`);
  }
  const deleteCategory = await prisma.category.delete({
    where: { id: parseInt(categoryId, 10) },
  });
  res.status(StatusCodes.OK).json({ msg: 'category has been deleted!' });
};
