import { Request, Response } from 'express';
import Decimal from 'decimal.js';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';

export const addPurchaseOrderItem = async (req: Request, res: Response) => {
  const { id: orderId } = req.params;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    throw new BadRequestError('Please provide product ID and quantity');
  }

  // Fetch product details, including price
  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId, 10) },
  });

  if (!product) {
    throw new NotFoundError(`No product found with id ${productId}`);
  }

  if (product.quantity < quantity) {
    throw new BadRequestError(
      `Insufficient stock for product ${product.name}. Available: ${product.quantity}`,
    );
  }

  // Use the product's current price as the unit price
  const unitPrice = new Decimal(product.price.toString());
  const totalPrice = unitPrice.mul(quantity);

  // Begin transaction to ensure atomicity
  const purchaseOrderItem = await prisma.$transaction(async (prisma) => {
    // Create the purchase order item
    const createdItem = await prisma.purchaseOrderItem.create({
      data: {
        purchaseOrderId: parseInt(orderId, 10),
        productId: parseInt(productId, 10),
        quantity,
        unitPrice: unitPrice.toNumber(),
        totalPrice,
      },
    });

    // Update the total cost of the purchase order
    await prisma.purchaseOrder.update({
      where: { id: parseInt(orderId, 10) },
      data: { totalCost: { increment: totalPrice } },
    });

    // Decrement the product stock
    await prisma.product.update({
      where: { id: parseInt(productId, 10) },
      data: { quantity: { decrement: quantity } },
    });

    return createdItem;
  });

  res.status(StatusCodes.CREATED).json({ purchaseOrderItem });
};

export const receivePurchaseOrder = async (req: Request, res: Response) => {
  const { id: orderId } = req.params;
  const updatedOrder = await prisma.purchaseOrder.update({
    where: { id: Number(orderId) },
    data: {
      status: 'COMPLETED',
    },
    include: {
      items: true,
    },
  });

  // Update stock quantities for each item in the purchase order
  for (const item of updatedOrder.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        quantity: {
          increment: item.quantity,
        },
      },
    });
  }

  res.status(StatusCodes.OK).json({ updatedOrder });
};

export const getAllPurchaseOrderItems = async (req: Request, res: Response) => {
  const purchaseOrderItems = await prisma.purchaseOrderItem.findMany();
  res.status(StatusCodes.OK).json({ purchaseOrderItems });
};

export const getPurchaseOrderItemById = async (req: Request, res: Response) => {
  const { id: purchaseOrderItemId } = req.params;
  const purchaseOrderItem = await prisma.purchaseOrderItem.findUnique({
    where: {
      id: parseInt(purchaseOrderItemId, 10),
    },
  });
  if (!purchaseOrderItem) {
    throw new NotFoundError(
      `No purchase order item found with id ${purchaseOrderItemId}`,
    );
  }
  res.status(StatusCodes.OK).json({ purchaseOrderItem });
};
