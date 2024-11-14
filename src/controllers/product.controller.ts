import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors';

export const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    discount,
    quantity,
    categoryId,
    warehouseId,
  } = req.body;
  if (!name || !price || !quantity || !categoryId || !warehouseId) {
    throw new BadRequestError('Please provide all required fields');
  }
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      quantity,
      categoryId,
      warehouseId,
      discount,
    },
  });
  res.status(StatusCodes.CREATED).json({ product });
};

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      quantity: true,
      discount: true,
      category: { select: { id: true, name: true } },
      warehouse: {
        select: { id: true, name: true, location: true, capacity: true },
      },
    },
  });
  res.status(StatusCodes.OK).json({ products });
};

export const getProductById = async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(productId, 10),
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      quantity: true,
      discount: true,
      category: { select: { id: true, name: true } },
      warehouse: {
        select: { id: true, name: true, location: true, capacity: true },
      },
    },
  });
  if (!product) {
    throw new BadRequestError(`No products found with id ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const {
    name,
    description,
    price,
    discount,
    quantity,
    categoryId,
    warehouseId,
  } = req.body;
  const product = await prisma.product.update({
    where: {
      id: parseInt(productId, 10),
    },
    data: {
      name,
      description,
      price,
      quantity,
      categoryId,
      warehouseId,
      discount,
    },
  });
  if (!product) {
    throw new BadRequestError(`No products found with id ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(productId, 10),
    },
  });
  if (!product) {
    throw new BadRequestError(`No products found with id ${productId}`);
  }
  const deleteProduct = await prisma.product.delete({
    where: { id: parseInt(productId, 10) },
  });
  res.status(StatusCodes.OK).json({ msg: 'product has been deleted!' });
};
