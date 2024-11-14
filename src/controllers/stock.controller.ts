import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';

export const addStockMovement = async (req: Request, res: Response) => {
  const { productId, warehouseId, type, quantity } = req.body;
  if (!productId || !warehouseId || !type || !quantity) {
    throw new BadRequestError('Please provide all required fields');
  }

  // Product Validation
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    throw new NotFoundError(`No product found with id ${productId}`);
  }

  // Calculate the new quality
  let updatedQuantity = product.quantity;
  if (type === 'IN') {
    updatedQuantity += quantity;
  } else if (type === 'OUT') {
    if (product.quantity < quantity) {
      throw new BadRequestError(
        `Insufficient stock for product ${product.name}. Available: ${product.quantity}`,
      );
    }
    updatedQuantity -= quantity;
  }

  const stockMovement = await prisma.stockMovement.create({
    data: {
      productId,
      warehouseId,
      type,
      quantity,
    },
  });
  await prisma.product.update({
    where: { id: productId },
    data: {
      quantity: updatedQuantity,
    },
  });
  res.status(StatusCodes.CREATED).json({ stockMovement });
};

export const getAllStockMovements = async (req: Request, res: Response) => {
  const stockMovements = await prisma.stockMovement.findMany();
  res.status(StatusCodes.OK).json({ stockMovements });
};

export const getStockMovementById = async (req: Request, res: Response) => {
  const { id: stockMovementId } = req.params;
  const stockMovement = await prisma.stockMovement.findUnique({
    where: { id: Number(stockMovementId) },
  });
  if (!stockMovement) {
    throw new NotFoundError(
      `No stock movement found with id ${stockMovementId}`,
    );
  }
  res.status(StatusCodes.OK).json({ stockMovement });
};
