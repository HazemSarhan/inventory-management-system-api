import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors';
import Decimal from 'decimal.js';

export const createSalesOrder = async (req: Request, res: Response) => {
  const { customerId } = req.body;
  const customer = await prisma.customer.findUnique({
    where: {
      id: parseInt(customerId, 10),
    },
  });
  if (!customer) {
    throw new NotFoundError(`No customer found with id ${customerId}`);
  }

  const salesOrder = await prisma.salesOrder.create({
    data: {
      customerId: parseInt(customerId, 10),
      status: 'PENDING',
      totalCost: new Decimal(0),
    },
  });
  res.status(StatusCodes.CREATED).json({ salesOrder });
};

export const getAllSalesOrders = async (req: Request, res: Response) => {
  const salesOrders = await prisma.salesOrder.findMany();
  res.status(StatusCodes.OK).json({ salesOrders });
};

export const getSalesOrderById = async (req: Request, res: Response) => {
  const { id: salesOrderId } = req.params;
  const salesOrder = await prisma.salesOrder.findUnique({
    where: {
      id: parseInt(salesOrderId, 10),
    },
  });
  if (!salesOrder) {
    throw new NotFoundError(`No sales order found with id ${salesOrderId}`);
  }
  res.status(StatusCodes.OK).json({ salesOrder });
};

export const updateSalesOrderStatus = async (req: Request, res: Response) => {
  const { id: salesOrderId } = req.params;
  const { status } = req.body;
  const updatedSalesOrder = await prisma.salesOrder.update({
    where: {
      id: parseInt(salesOrderId, 10),
    },
    data: {
      status,
    },
  });
  res.status(StatusCodes.OK).json({ updatedSalesOrder });
};

export const deleteSalesOrder = async (req: Request, res: Response) => {
  const { id: salesOrderId } = req.params;
  const salesOrder = await prisma.salesOrder.findUnique({
    where: {
      id: parseInt(salesOrderId, 10),
    },
  });
  if (!salesOrder) {
    throw new NotFoundError(`No sales order found with id ${salesOrderId}`);
  }
  const deleteSalesOrder = await prisma.salesOrder.delete({
    where: { id: parseInt(salesOrderId, 10) },
  });
  res.status(StatusCodes.OK).json({ msg: 'sales order has been deleted!' });
};
