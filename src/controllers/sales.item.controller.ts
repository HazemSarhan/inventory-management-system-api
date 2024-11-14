import { Request, Response } from 'express';
import Decimal from 'decimal.js';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';

export const addSalesOrderItem = async (req: Request, res: Response) => {
  const { id: salesOrderId } = req.params;
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    throw new BadRequestError(
      'Please provide sales order id, product id and quantity',
    );
  }

  const salesOrder = await prisma.salesOrder.findUnique({
    where: {
      id: parseInt(salesOrderId, 10),
    },
  });
  if (!salesOrder) {
    throw new NotFoundError(`No sales order found with id ${salesOrderId}`);
  }
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(productId, 10),
    },
  });
  if (!product) {
    throw new NotFoundError(`No product found with id ${productId}`);
  }
  if (product.quantity < quantity) {
    throw new BadRequestError(
      `Insufficient stock for product ${product.name}. Available: ${product.quantity}`,
    );
  }

  // Calculate total price for this item
  const unitPrice = product.price;
  const totalPrice = unitPrice.mul(new Decimal(quantity));

  const salesOrderItem = await prisma.salesOrderItem.create({
    data: {
      salesOrderId: parseInt(salesOrderId, 10),
      productId,
      quantity,
      totalPrice,
    },
  });

  // Update the total cost of the sales order
  await prisma.salesOrder.update({
    where: { id: parseInt(salesOrderId, 10) },
    data: { totalCost: { increment: totalPrice } },
  });

  // Decrement the product stock
  await prisma.product.update({
    where: { id: productId },
    data: { quantity: { decrement: quantity } },
  });

  res.status(StatusCodes.CREATED).json({ salesOrderItem });
};

export const receiveSalesOrderItem = async (req: Request, res: Response) => {
  const { id: salesOrderId } = req.params;
  const updatedSalesOrder = await prisma.salesOrder.update({
    where: { id: Number(salesOrderId) },
    data: {
      status: 'SHIPPED',
    },
    include: {
      items: true,
    },
  });
  res.status(StatusCodes.OK).json({ updatedSalesOrder });
};

export const getAllSalesOrderItems = async (req: Request, res: Response) => {
  const salesOrderItems = await prisma.salesOrderItem.findMany();
  res.status(StatusCodes.OK).json({ salesOrderItems });
};

export const getSalesOrderItemById = async (req: Request, res: Response) => {
  const { id: salesOrderItemId } = req.params;
  const salesOrderItem = await prisma.salesOrderItem.findUnique({
    where: {
      id: parseInt(salesOrderItemId, 10),
    },
  });
  if (!salesOrderItem) {
    throw new NotFoundError(
      `No sales order item found with id ${salesOrderItemId}`,
    );
  }
  res.status(StatusCodes.OK).json({ salesOrderItem });
};

export const deleteSalesOrderItem = async (req: Request, res: Response) => {
  const { id: salesOrderItemId } = req.params;
  const salesOrderItem = await prisma.salesOrderItem.findUnique({
    where: {
      id: parseInt(salesOrderItemId, 10),
    },
  });
  if (!salesOrderItem) {
    throw new NotFoundError(
      `No sales order item found with id ${salesOrderItemId}`,
    );
  }
  const deleteSalesOrderItem = await prisma.salesOrderItem.delete({
    where: { id: parseInt(salesOrderItemId, 10) },
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: 'sales order item has been deleted!' });
};
