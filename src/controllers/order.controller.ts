import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';

export const createPurchaseOrder = async (req: Request, res: Response) => {
  const { supplierId } = req.body;
  if (!supplierId) {
    throw new BadRequestError('Please provide a valid supplier id!');
  }
  const purchaseOrder = await prisma.purchaseOrder.create({
    data: {
      supplierId,
      status: 'PENDING',
      totalCost: 0, // Will update after items added!
    },
  });
  res.status(StatusCodes.CREATED).json({ purchaseOrder });
};

export const updatePurchaseOrderStatus = async (
  req: Request,
  res: Response,
) => {
  const { id: orderId } = req.params;
  const { status } = req.body;
  const updatedOrder = await prisma.purchaseOrder.update({
    where: {
      id: parseInt(orderId, 10),
    },
    data: {
      status,
    },
  });
  res.status(StatusCodes.OK).json({ updatedOrder });
};

export const getAllPurchaseOrders = async (req: Request, res: Response) => {
  const purchaseOrders = await prisma.purchaseOrder.findMany();
  res.status(StatusCodes.OK).json({ purchaseOrders });
};

export const getPurchaseOrderById = async (req: Request, res: Response) => {
  const { id: orderId } = req.params;
  const purchaseOrder = await prisma.purchaseOrder.findUnique({
    where: {
      id: parseInt(orderId, 10),
    },
  });
  if (!purchaseOrder) {
    throw new NotFoundError(`No purchase order found with id ${orderId}`);
  }
  res.status(StatusCodes.OK).json({ purchaseOrder });
};
